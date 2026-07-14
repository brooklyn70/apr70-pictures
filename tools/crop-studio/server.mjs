/**
 * Crop Studio — a standalone ratio instrument.
 *
 * Open any folder. Every picture in it gets a locked-ratio frame you can drag, resize and zoom.
 * The machine seeds each frame with a saliency-aware guess so you are correcting, not composing.
 * Results are written back into a subfolder of wherever the pictures came from.
 *
 * Three verdicts per picture:
 *   CROP    — drag the rectangle. A pure crop at native resolution; nothing is resampled.
 *   EXTEND  — the picture is too tight to crop without gutting it, so widen it instead.
 *             Writes a padded canvas + an outpaint mask; feed those to KIE, Comfy, or
 *             Photoshop's generative fill. Nothing is invented here, and nothing is lost.
 *   NATIVE  — never touch it. Archival maps, engravings, period photographs: records, not frames.
 *
 *   node server.mjs           → http://localhost:5177
 */
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dir = path.dirname(fileURLToPath(import.meta.url))
const PORT = Number(process.env.PORT ?? 5177)
const IMG = /\.(jpe?g|png|webp|tiff?)$/i
const STATE_FILE = '.crop-studio.json'

// ── helpers ───────────────────────────────────────────────────────────────────

const json = (res, code, body) => {
  res.writeHead(code, { 'content-type': 'application/json' })
  res.end(JSON.stringify(body))
}

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let b = ''
    req.on('data', (c) => {
      b += c
      if (b.length > 5e6) reject(new Error('body too large'))
    })
    req.on('end', () => {
      try {
        resolve(b ? JSON.parse(b) : {})
      } catch (e) {
        reject(e)
      }
    })
  })

/** A four-digit pre-1936 token in the name means an archival document, not a film frame.
 *  The year must be delimited: "1970" in piers-1970-k2a is a *subject*, and in
 *  caruso1970_... it is a username. Both would misfire on a looser test. */
const looksArchival = (name) => {
  const m = name.match(/(?:^|[-_])(1[6-9]\d{2})(?:[-_.]|$)/)
  return m ? Number(m[1]) <= 1935 : false
}

/** Where sharp's saliency detector would put the frame — the seed the editor corrects. */
async function seedRect(file, w, h, ratio) {
  const [cw, ch] = w / h > ratio ? [Math.round(h * ratio), h] : [w, Math.round(w / ratio)]
  if (cw >= w && ch >= h) return { x: 0, y: 0, w, h }
  try {
    const { info } = await sharp(file)
      .resize(cw, ch, { fit: 'cover', position: sharp.strategy.attention })
      .toBuffer({ resolveWithObject: true })
    return {
      x: Math.abs(info.cropOffsetLeft ?? 0),
      y: Math.abs(info.cropOffsetTop ?? 0),
      w: cw,
      h: ch,
    }
  } catch {
    return { x: Math.round((w - cw) / 2), y: Math.round((h - ch) / 2), w: cw, h: ch }
  }
}

// ── routes ────────────────────────────────────────────────────────────────────

const routes = {
  /** Native macOS folder chooser, so the editor never has to paste a path. */
  async 'POST /api/pick-folder'() {
    return new Promise((resolve) => {
      execFile(
        'osascript',
        ['-e', 'POSIX path of (choose folder with prompt "Choose a folder of pictures")'],
        (err, stdout) => {
          if (err) return resolve({ cancelled: true })
          resolve({ dir: stdout.trim().replace(/\/$/, '') })
        },
      )
    })
  },

  async 'POST /api/scan'(body) {
    const { dir, ratio } = body
    if (!dir || !fs.existsSync(dir)) throw new Error(`no such folder: ${dir}`)

    const saved = (() => {
      try {
        return JSON.parse(fs.readFileSync(path.join(dir, STATE_FILE), 'utf8'))
      } catch {
        return {}
      }
    })()

    const names = fs
      .readdirSync(dir)
      .filter((f) => IMG.test(f) && !f.startsWith('.') && !f.startsWith('._'))
      .sort()

    const items = []
    for (const name of names) {
      const file = path.join(dir, name)
      let meta
      try {
        meta = await sharp(file).metadata()
      } catch {
        continue
      }
      if (!meta.width || !meta.height) continue

      const prev = saved.items?.[name]
      const r = meta.width / meta.height
      const archival = looksArchival(name)

      items.push({
        name,
        w: meta.width,
        h: meta.height,
        ratio: +r.toFixed(3),
        format: meta.format,
        bytes: fs.statSync(file).size,
        archival,
        // A picture already wider than the target, or a strip, or a portrait, is a warning —
        // not a rule. The editor overrules any of it.
        verdict: prev?.verdict ?? (archival || r < 0.95 || r > 3.0 ? 'native' : 'crop'),
        rect: prev?.rect ?? (await seedRect(file, meta.width, meta.height, ratio)),
        seeded: !prev,
      })
    }
    return { dir, items }
  },

  async 'POST /api/reseed'(body) {
    const { dir, name, ratio } = body
    const file = path.join(dir, name)
    const m = await sharp(file).metadata()
    return { rect: await seedRect(file, m.width, m.height, ratio) }
  },

  async 'POST /api/save-state'(body) {
    const { dir, ratio, items } = body
    fs.writeFileSync(
      path.join(dir, STATE_FILE),
      JSON.stringify(
        { ratio, savedAt: new Date().toISOString(), items: Object.fromEntries(items.map((i) => [i.name, { verdict: i.verdict, rect: i.rect }])) },
        null,
        2,
      ),
    )
    return { ok: true }
  },

  /** Write the results. Crops are pure extracts at native resolution — no resampling, no upscale. */
  async 'POST /api/apply'(body) {
    const { dir, outName, ratio, items } = body
    const outDir = path.join(dir, outName || `_ratio-${ratio}`)
    fs.mkdirSync(outDir, { recursive: true })

    const done = []
    const extendQueue = []

    for (const it of items) {
      const src = path.join(dir, it.name)
      const out = path.join(outDir, it.name)

      try {
        if (it.verdict === 'skip') {
          done.push({ name: it.name, action: 'SKIP' })
          continue
        }

        if (it.verdict === 'native') {
          fs.copyFileSync(src, out)
          done.push({ name: it.name, action: 'NATIVE', out: `${it.w}x${it.h}` })
          continue
        }

        if (it.verdict === 'extend') {
          // Widen rather than crop: place the picture on a target-ratio canvas and hand the
          // painter a mask of what to fill. The original pixels are never touched.
          const [cw, ch] =
            it.w / it.h > ratio
              ? [it.w, Math.round(it.w / ratio)] // too wide -> grow vertically
              : [Math.round(it.h * ratio), it.h] // too tall -> grow horizontally
          const left = Math.round((cw - it.w) / 2)
          const top = Math.round((ch - it.h) / 2)
          const base = it.name.replace(IMG, '')

          await sharp({
            create: { width: cw, height: ch, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
          })
            .composite([{ input: src, left, top }])
            .png()
            .toFile(path.join(outDir, `${base}-extend-canvas.png`))

          // white = paint here, black = keep. The convention every outpaint model expects.
          await sharp({
            create: { width: cw, height: ch, channels: 3, background: { r: 255, g: 255, b: 255 } },
          })
            .composite([
              {
                input: {
                  create: { width: it.w, height: it.h, channels: 3, background: { r: 0, g: 0, b: 0 } },
                },
                left,
                top,
              },
            ])
            .png()
            .toFile(path.join(outDir, `${base}-extend-mask.png`))

          const job = {
            name: it.name,
            source: `${it.w}x${it.h}`,
            target: `${cw}x${ch}`,
            ratio,
            padLeft: left,
            padTop: top,
            padRight: cw - it.w - left,
            padBottom: ch - it.h - top,
            canvas: `${base}-extend-canvas.png`,
            mask: `${base}-extend-mask.png`,
          }
          extendQueue.push(job)
          done.push({ name: it.name, action: 'EXTEND', out: `${cw}x${ch}` })
          continue
        }

        // CROP — a pure extract. Clamp defensively; a bad rect must never throw mid-batch.
        const x = Math.max(0, Math.min(Math.round(it.rect.x), it.w - 1))
        const y = Math.max(0, Math.min(Math.round(it.rect.y), it.h - 1))
        const w = Math.max(1, Math.min(Math.round(it.rect.w), it.w - x))
        const h = Math.max(1, Math.min(Math.round(it.rect.h), it.h - y))

        await sharp(src).extract({ left: x, top: y, width: w, height: h }).toFile(out)
        done.push({ name: it.name, action: 'CROP', out: `${w}x${h}`, kept: +(((w * h) / (it.w * it.h)) * 100).toFixed(1) })
      } catch (e) {
        done.push({ name: it.name, action: 'ERROR', error: String(e.message).slice(0, 120) })
      }
    }

    if (extendQueue.length) {
      fs.writeFileSync(
        path.join(outDir, 'extend-queue.json'),
        JSON.stringify({ ratio, note: 'Feed canvas + mask to KIE / Comfy / generative fill. White in the mask is the region to paint.', jobs: extendQueue }, null, 2),
      )
    }
    return { outDir, done }
  },
}

// ── server ────────────────────────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x')

  if (url.pathname === '/') {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
    return res.end(fs.readFileSync(path.join(__dir, 'index.html')))
  }

  // Serve a picture off disk, optionally downscaled for the viewport (originals are 11MB).
  if (url.pathname === '/api/img') {
    const p = url.searchParams.get('p')
    const max = Number(url.searchParams.get('max') ?? 0)
    if (!p || !fs.existsSync(p)) {
      res.writeHead(404)
      return res.end()
    }
    try {
      const pipe = max ? sharp(p).resize(max, max, { fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 88 }) : sharp(p)
      const buf = await pipe.toBuffer()
      res.writeHead(200, { 'content-type': max ? 'image/jpeg' : 'image/png', 'cache-control': 'no-cache' })
      return res.end(buf)
    } catch {
      res.writeHead(500)
      return res.end()
    }
  }

  const key = `${req.method} ${url.pathname}`
  if (routes[key]) {
    try {
      return json(res, 200, await routes[key](await readBody(req)))
    } catch (e) {
      return json(res, 400, { error: String(e.message) })
    }
  }

  res.writeHead(404)
  res.end()
})

server.listen(PORT, () => {
  console.log(`\n  Crop Studio  →  http://localhost:${PORT}\n`)
  execFile('open', [`http://localhost:${PORT}`], () => {})
})
