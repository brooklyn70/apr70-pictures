import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { CMS_URL } from './payload-rest.js'

type MediaKind = 'logo' | 'favicon' | 'wordmark' | 'watermark' | 'photo'
type DivisionTag = '212' | '310' | 'nrc' | 'corporate'

type BrandAsset = {
  relativePath: string
  alt: string
  mediaKind: MediaKind
  divisionTag: DivisionTag
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BRAND_ROOT = path.resolve(__dirname, '../../../web/public/brand/apr70-logos')

const CURATED_ASSETS: BrandAsset[] = [
  { relativePath: '212-pictures/212_hero.svg', alt: '212 Pictures hero lockup', mediaKind: 'logo', divisionTag: '212' },
  { relativePath: '212-pictures/212_footer.svg', alt: '212 Pictures footer mark', mediaKind: 'logo', divisionTag: '212' },
  { relativePath: '212-pictures/212_favicon.svg', alt: '212 Pictures favicon', mediaKind: 'favicon', divisionTag: '212' },
  { relativePath: '310-pictures/310_hero.svg', alt: '310 Pictures hero lockup', mediaKind: 'logo', divisionTag: '310' },
  { relativePath: '310-pictures/310_footer.svg', alt: '310 Pictures footer mark', mediaKind: 'logo', divisionTag: '310' },
  { relativePath: '310-pictures/310_favicon.svg', alt: '310 Pictures favicon', mediaKind: 'favicon', divisionTag: '310' },
  { relativePath: 'new-renaissance-cinema/nrc_v1.svg', alt: 'New Renaissance Cinema hero lockup', mediaKind: 'logo', divisionTag: 'nrc' },
  { relativePath: 'new-renaissance-cinema/nrc_footer.svg', alt: 'New Renaissance Cinema footer mark', mediaKind: 'logo', divisionTag: 'nrc' },
  { relativePath: 'new-renaissance-cinema/nrc_favicon.svg', alt: 'New Renaissance Cinema favicon', mediaKind: 'favicon', divisionTag: 'nrc' },
  { relativePath: 'apr70-apr70pictures/favicons/apr70_favicon_amber_bg_black_text_bold.svg', alt: 'APR 70 Pictures favicon', mediaKind: 'favicon', divisionTag: 'corporate' },
]

async function findMediaByFilename(filename: string, token: string): Promise<number | null> {
  const res = await fetch(
    `${CMS_URL}/api/media?where[filename][equals]=${encodeURIComponent(filename)}&depth=0&limit=1`,
    { headers: { Authorization: `JWT ${token}` } },
  )
  if (!res.ok) return null
  const data = (await res.json()) as { docs?: Array<{ id: number }> }
  return data.docs?.[0]?.id ?? null
}

async function uploadMedia(asset: BrandAsset, token: string): Promise<number> {
  const absPath = path.join(BRAND_ROOT, asset.relativePath)
  const fileBuffer = await readFile(absPath)
  const filename = path.basename(asset.relativePath)

  const formData = new FormData()
  formData.append('file', new Blob([fileBuffer], { type: 'image/svg+xml' }), filename)
  formData.append('_payload', JSON.stringify({
    alt: asset.alt,
    mediaKind: asset.mediaKind,
    divisionTag: asset.divisionTag,
  }))

  const res = await fetch(`${CMS_URL}/api/media`, {
    method: 'POST',
    headers: { Authorization: `JWT ${token}` },
    body: formData,
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Upload failed for ${filename}: ${res.status} ${body}`)
  }
  const doc = (await res.json()) as { doc?: { id: number } }
  const id = doc.doc?.id
  if (!id) throw new Error(`Upload returned no ID for ${filename}`)
  return id
}

async function updateGlobal(slug: string, data: Record<string, unknown>, token: string): Promise<void> {
  const res = await fetch(`${CMS_URL}/api/globals/${slug}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`updateGlobal(${slug}) failed: ${res.status} ${body}`)
  }
}

export type BrandSeedReport = {
  mediaUploaded: number
  mediaSkipped: number
  globalsUpdated: string[]
  errors: string[]
}

export async function runBrandSeed(token: string): Promise<BrandSeedReport> {
  const report: BrandSeedReport = {
    mediaUploaded: 0,
    mediaSkipped: 0,
    globalsUpdated: [],
    errors: [],
  }

  const idMap = new Map<string, number>()

  for (const asset of CURATED_ASSETS) {
    const filename = path.basename(asset.relativePath)
    try {
      const existingId = await findMediaByFilename(filename, token)
      if (existingId) {
        idMap.set(asset.relativePath, existingId)
        report.mediaSkipped++
      } else {
        const newId = await uploadMedia(asset, token)
        idMap.set(asset.relativePath, newId)
        report.mediaUploaded++
      }
    } catch (e) {
      report.errors.push(`${filename}: ${String(e)}`)
    }
  }

  const get = (rel: string) => idMap.get(rel) ?? null

  const corpFavId = get('apr70-apr70pictures/favicons/apr70_favicon_amber_bg_black_text_bold.svg')
  if (corpFavId) {
    try {
      await updateGlobal('site-settings', { favicon: corpFavId }, token)
      report.globalsUpdated.push('site-settings')
    } catch (e) {
      report.errors.push(`site-settings: ${String(e)}`)
    }
  }

  const d212 = {
    headerLogo: get('212-pictures/212_hero.svg'),
    footerLogo: get('212-pictures/212_footer.svg'),
    faviconOverride: get('212-pictures/212_favicon.svg'),
  }
  if (Object.values(d212).some(Boolean)) {
    try {
      await updateGlobal('212', d212, token)
      report.globalsUpdated.push('212')
    } catch (e) {
      report.errors.push(`212: ${String(e)}`)
    }
  }

  const d310 = {
    headerLogo: get('310-pictures/310_hero.svg'),
    footerLogo: get('310-pictures/310_footer.svg'),
    faviconOverride: get('310-pictures/310_favicon.svg'),
  }
  if (Object.values(d310).some(Boolean)) {
    try {
      await updateGlobal('310', d310, token)
      report.globalsUpdated.push('310')
    } catch (e) {
      report.errors.push(`310: ${String(e)}`)
    }
  }

  const dNrc = {
    headerLogo: get('new-renaissance-cinema/nrc_v1.svg'),
    footerLogo: get('new-renaissance-cinema/nrc_footer.svg'),
    faviconOverride: get('new-renaissance-cinema/nrc_favicon.svg'),
  }
  if (Object.values(dNrc).some(Boolean)) {
    try {
      await updateGlobal('nrc', dNrc, token)
      report.globalsUpdated.push('nrc')
    } catch (e) {
      report.errors.push(`nrc: ${String(e)}`)
    }
  }

  return report
}
