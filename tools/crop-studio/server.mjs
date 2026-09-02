/**
 * Crop Studio — a standalone ratio instrument.
 *
 * Open any folder. Every picture in it gets a locked-ratio frame you can drag, resize and zoom.
 * The machine seeds each frame with a saliency-aware guess so you are correcting, not composing.
 * Results are written back into a subfolder of wherever the pictures came from.
 *
 * Four verdicts per picture:
 *   CROP    — drag the rectangle. A pure crop at native resolution; nothing is resampled.
 *   REGEN   — the picture is too tight to crop, and it was generated in the first place,
 *             so there is no negative to protect. Re-make it wide instead of inventing its
 *             margins: one native 21:9 4K pass composes FOR the frame. This is the answer
 *             almost every time. Comment on what was wrong and shoot it again.
 *   VIDEO   — drive a clip from an approved still; it becomes the first frame.
 *   EXTEND  — outpaint the margins. Kept only for a picture that genuinely cannot be
 *             re-made. It is slow enough to be a last resort: a 12B model spent ~3 hours
 *             inventing side-bars for nine stills, and they still only guessed at what the
 *             edge pixels implied. Extend if you have a weekend to wait.
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

/** The two house ratios have names in Payload. Anything else is just a number. */
const frameRatioOf = (r) => (r === 2.39 ? 'hero' : r === 2 ? 'standard' : `custom-${r}`)

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

// ── KIE ───────────────────────────────────────────────────────────────────────
//
// Regenerating beats extending. These stills are generated: there is no negative
// to preserve, so widening one by outpainting is repair work on material we can
// simply re-make -- and it shows. A native 21:9 pass *composes* for the wide
// frame; an outpaint can only guess at its margins from the edge pixels.
//
// The 6336x2688 master is a superset: 2.39, 2.00 and 16:9 are all crops of it.

const KIE_UPLOAD = 'https://kieai.redpandaai.co/api/file-stream-upload' // NB: different host to the API
const KIE_CREATE = 'https://api.kie.ai/api/v1/jobs/createTask'
const KIE_STATUS = 'https://api.kie.ai/api/v1/jobs/recordInfo?taskId='
const IMAGE_MODEL = 'nano-banana-pro'
const VIDEO_MODEL = 'bytedance/seedance-2'
const LEDGER = path.join(
  process.env.HOME,
  'vault/11 Active/apr70-still-prompts/prompts.jsonl',
)

let _key = null
const kieKey = () =>
  (_key ??= new Promise((resolve) => {
    execFile(
      'op',
      ['item', 'get', 'Kie.ai API-key', '--vault', 'API', '--fields', 'token', '--reveal'],
      (err, stdout) => resolve(err ? null : stdout.trim()),
    )
  }))

/** Append-only. The original stills' prompts are gone because an agent called the
 *  API directly and never wrote them down; that must not happen twice. Logged
 *  BEFORE the download, because by then the credit is spent and the image exists. */
const logPrompt = (entry) => {
  try {
    fs.mkdirSync(path.dirname(LEDGER), { recursive: true })
    fs.appendFileSync(LEDGER, JSON.stringify({ ts: new Date().toISOString(), ...entry }) + '\n')
  } catch (e) {
    console.error('  ! ledger write failed:', e.message)
  }
}

const kieUpload = (file, token) =>
  new Promise((resolve, reject) => {
    // curl, not fetch: KIE's upload endpoint 403s on a hand-rolled multipart body.
    execFile(
      'curl',
      ['-sS', '-X', 'POST', KIE_UPLOAD, '-H', `Authorization: Bearer ${token}`,
       '-F', `file=@${file}`, '-F', 'uploadPath=apr70/studio',
       '-F', `fileName=${path.basename(file).replace(/\s+/g, '_')}`],
      { maxBuffer: 1e7 },
      (err, stdout) => {
        if (err) return reject(err)
        try {
          const r = JSON.parse(stdout)
          r.success ? resolve(r.data.downloadUrl) : reject(new Error(r.msg || 'upload failed'))
        } catch (e) {
          reject(e)
        }
      },
    )
  })

async function kieRun(model, input, token) {
  const res = await fetch(KIE_CREATE, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify({ model, input }),
  }).then((r) => r.json())
  if (res.code !== 200) throw new Error(res.msg || 'createTask failed')

  const taskId = res.data.taskId
  for (let i = 0; i < 200; i++) {
    await new Promise((r) => setTimeout(r, 6000))
    const d = await fetch(KIE_STATUS + taskId, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((r) => r.data)
    if (d.state === 'success') {
      const urls = JSON.parse(d.resultJson).resultUrls || []
      return { taskId, url: urls[0] }
    }
    if (d.state === 'fail') throw new Error(d.failMsg || 'generation failed')
  }
  throw new Error('timed out')
}

const download = (url, dest) =>
  new Promise((resolve, reject) =>
    // curl again: the result CDN 403s a default user-agent.
    execFile('curl', ['-sS', '-fL', '-o', dest, url], (err) => (err ? reject(err) : resolve(dest))),
  )

// ── provenance ────────────────────────────────────────────────────────────────
//
// "Which AI made it" is answerable for real, not guessed: every generation this
// studio (or regen.py) ever ran is a line in the ledger with its model and
// prompt, and the consolidated folder's _manifest.csv maps each renamed file
// back to the original path the ledger knew it by. Chain the two and most
// pictures carry their birth certificate. Files from outside the pipeline fall
// back to sniffing the metadata bytes and the original filename's dialect.

let _ledgerCache = { mtime: -1, byPath: new Map() }
function ledgerByPath() {
  let st
  try { st = fs.statSync(LEDGER) } catch { return _ledgerCache.byPath }
  if (st.mtimeMs !== _ledgerCache.mtime) {
    const byPath = new Map()
    try {
      for (const line of fs.readFileSync(LEDGER, 'utf8').split('\n')) {
        if (!line.trim()) continue
        try {
          const e = JSON.parse(line)
          if (e.output) byPath.set(e.output, e) // later lines win: latest word on a re-run
        } catch {}
      }
    } catch {}
    _ledgerCache = { mtime: st.mtimeMs, byPath }
  }
  return _ledgerCache.byPath
}

const _manifestCache = new Map() // dir -> { mtime, byName }
function manifestOf(dir) {
  const file = path.join(dir, '_manifest.csv')
  let st
  try { st = fs.statSync(file) } catch { return null }
  const hit = _manifestCache.get(dir)
  if (hit?.mtime === st.mtimeMs) return hit.byName
  const byName = new Map()
  try {
    const lines = fs.readFileSync(file, 'utf8').split('\n').slice(1)
    for (const line of lines) {
      // two plain paths, no quoting needed — the move planner never emits commas in paths
      const c = line.indexOf(',')
      if (c > 0) byName.set(path.basename(line.slice(0, c)), line.slice(c + 1).trim())
    }
  } catch {}
  _manifestCache.set(dir, { mtime: st.mtimeMs, byName })
  return byName
}

/** What the original filename's dialect says about its maker. */
function nameDialect(orig) {
  const b = path.basename(orig ?? '')
  if (/^caruso1970_/.test(b) || /_[0-9a-f]{8}-[0-9a-f]{4}-/.test(b)) return 'Midjourney (filename dialect)'
  if (/_0\d{4}_\./.test(b)) return 'ComfyUI (frame-counter dialect)'
  if (orig?.includes('/_light-law/') || orig?.includes('/_regen/')) return 'nano-banana-pro (KIE campaign folder)'
  return null
}

const SNIFF_MARKS = [
  ['c2pa', 'C2PA content credentials'], ['Midjourney', 'Midjourney'],
  ['DALL', 'OpenAI DALL·E'], ['openai', 'OpenAI'], ['GPT-4o', 'OpenAI'],
  ['Stable Diffusion', 'Stable Diffusion'], ['ComfyUI', 'ComfyUI'],
  ['invokeai', 'InvokeAI'], ['Adobe Firefly', 'Adobe Firefly'],
  ['Google', 'Google'], ['parameters', 'SD-style parameters chunk'],
  ['"prompt"', 'embedded prompt json'],
]

/** Scan the first 64KB raw (PNG text chunks sit right after the header) plus any
 *  exif/xmp sharp hands back, for generator fingerprints. */
function sniffBytes(file, meta) {
  const marks = new Set()
  try {
    const fd = fs.openSync(file, 'r')
    const buf = Buffer.alloc(65536)
    const n = fs.readSync(fd, buf, 0, buf.length, 0)
    fs.closeSync(fd)
    const hay = [buf.subarray(0, n).toString('latin1'),
                 meta.exif?.toString('latin1') ?? '', meta.xmp?.toString('latin1') ?? ''].join('\n')
    for (const [needle, label] of SNIFF_MARKS) if (hay.includes(needle)) marks.add(label)
  } catch {}
  return [...marks]
}

// ── the slate ─────────────────────────────────────────────────────────────────
//
// The Prompt tab does not browse folders: the ten properties are known. Their
// shot lists live in still-regen/specs/<property>.json — the same files the
// regen.py CLI runs — so the tab and the CLI are two hands on one instrument.

const SHARED = '/Volumes/SharedData'
const SPECS = path.join(__dir, '..', 'still-regen', 'specs')
// On SharedData but not on the slate: the universe folder is a setting, not a
// property, and holding is a parking lot. 11-07 is retired — Falcon is Da
// Hook's source text (docs/decisions/2026-07-14-property-identities-*) — and
// listed here so a restore-from-backup can't put it back on the slate.
const NOT_PROPERTIES = new Set([
  '11-06-la-dolce-vita-universe',
  '11-07-maltese-falcon',
  '11-99-holding',
])

const validProp = (prop) => {
  if (!/^11-\d{2}-[a-z0-9-]+$/.test(prop)) throw new Error(`not a property id: ${prop}`)
  return prop
}

const stillsDirOf = (prop) => path.join(SHARED, validProp(prop), '02-stills')

const listImages = (dir) => {
  try {
    return fs.readdirSync(dir).filter((f) => IMG.test(f) && !f.startsWith('.') && !f.startsWith('._')).sort()
  } catch {
    return []
  }
}

const specPathOf = (prop) => path.join(SPECS, `${validProp(prop)}.json`)

const readSpec = (prop) => {
  try {
    return JSON.parse(fs.readFileSync(specPathOf(prop), 'utf8'))
  } catch {
    return null
  }
}

/** One wide master, start to finish: compose the prompt, upload the refs, run
 *  the model, ledger, download. Shared by /api/regen (Frames tab) and
 *  /api/shot-generate (Prompts tab) so prompt assembly and the ledger can
 *  never drift between the two.
 *
 *  The output name is reserved on disk BEFORE the model runs: picking the
 *  v-number at download time let two concurrent generations of the same shot
 *  choose the same name and silently overwrite each other. A missing ref is an
 *  error, not a shrug — generating without it would spend the credits and lose
 *  the cast/wardrobe continuity the ref exists to carry. */
async function makeWideMaster({ token, prompt, notes, refFiles, outDir, base, ratio = '21:9', resolution = '4K', ledger }) {
  const full = notes?.trim() ? `${prompt.trim()}\n\nCorrections that matter: ${notes.trim()}` : prompt.trim()
  const refs = []
  for (const p of refFiles) {
    if (!fs.existsSync(p)) throw new Error(`reference not found: ${p}`)
    refs.push(await kieUpload(p, token))
  }

  fs.mkdirSync(outDir, { recursive: true })
  let n = 1
  while (fs.existsSync(path.join(outDir, `${base}-v${n}.png`))) n++
  const out = path.join(outDir, `${base}-v${n}.png`)
  fs.writeFileSync(out, '') // reserve the name now

  try {
    const { taskId, url } = await kieRun(
      IMAGE_MODEL,
      { prompt: full, image_input: refs, aspect_ratio: ratio, resolution },
      token,
    )
    logPrompt({ kind: 'image', model: IMAGE_MODEL, aspect_ratio: ratio, resolution,
                prompt: full, notes: notes?.trim() || null, refs, taskId, url, output: out, ...ledger })
    await download(url, out)
  } catch (e) {
    // failed before a picture landed — release the reserved name, keep the ledger line
    try { if (fs.existsSync(out) && fs.statSync(out).size === 0) fs.unlinkSync(out) } catch {}
    throw e
  }

  const m = await sharp(out).metadata()
  return { out, name: path.basename(out), w: m.width, h: m.height }
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

    // Opening the consolidated 929-picture folder over SMB cost ~2.5 minutes in sequential
    // sharp reads. Two fixes: dimensions cache keyed on size+mtime (a reopen touches no
    // pixels), and a 16-wide pool for whatever the cache misses.
    const META_CACHE = path.join(dir, '.crop-studio-meta.json')
    const cache = (() => {
      try { return JSON.parse(fs.readFileSync(META_CACHE, 'utf8')) } catch { return {} }
    })()
    const stats = new Map(names.map((n) => {
      try { return [n, fs.statSync(path.join(dir, n))] } catch { return [n, null] }
    }))
    const fresh = (n) => {
      const st = stats.get(n), c = cache[n]
      return st && c && c.size === st.size && c.mtimeMs === st.mtimeMs ? c : null
    }

    const metas = new Array(names.length)
    let next = 0
    let cacheDirty = false
    await Promise.all(Array.from({ length: 16 }, async () => {
      while (next < names.length) {
        const i = next++
        const name = names[i]
        const hit = fresh(name)
        if (hit) { metas[i] = hit; continue }
        try {
          const m = await sharp(path.join(dir, name)).metadata()
          const st = stats.get(name)
          metas[i] = { width: m.width, height: m.height, format: m.format,
                       size: st?.size ?? 0, mtimeMs: st?.mtimeMs ?? 0 }
          cache[name] = metas[i]
          cacheDirty = true
        } catch {
          metas[i] = null
        }
      }
    }))
    if (cacheDirty) {
      try { fs.writeFileSync(META_CACHE, JSON.stringify(cache)) } catch {}
    }

    const items = []
    for (const [idx, name] of names.entries()) {
      const file = path.join(dir, name)
      const meta = metas[idx]
      if (!meta?.width || !meta?.height) continue

      const prev = saved.items?.[name]
      const r = meta.width / meta.height
      const archival = looksArchival(name)

      // The target ratio is PER PICTURE, not per pass. A folder holds heroes and standards
      // together — sometimes the same shot as both a jpeg and a png — and forcing one ratio
      // on the whole folder meant running it twice and picking one output or the other.
      const target = prev?.target ?? ratio

      // Saliency at scan time was fine for a 60-still folder and unusable for the 929-file
      // consolidated one (one attention pass per picture ≈ minutes of wall clock). New
      // pictures open with a centred rect and `seedPending`; the client runs the real
      // saliency pass the first time a picture is actually shown.
      const [cw, ch] = meta.width / meta.height > target
        ? [Math.round(meta.height * target), meta.height]
        : [meta.width, Math.round(meta.width / target)]
      const centred = {
        x: Math.max(0, Math.round((meta.width - cw) / 2)),
        y: Math.max(0, Math.round((meta.height - ch) / 2)),
        w: Math.min(cw, meta.width),
        h: Math.min(ch, meta.height),
      }

      items.push({
        name,
        w: meta.width,
        h: meta.height,
        ratio: +r.toFixed(3),
        target,
        format: meta.format,
        bytes: stats.get(name)?.size ?? fs.statSync(file).size,
        archival,
        // A picture already wider than the target, or a strip, or a portrait, is a warning —
        // not a rule. The editor overrules any of it.
        verdict: prev?.verdict ?? (archival || r < 0.95 || r > 3.0 ? 'native' : 'crop'),
        rect: prev?.rect ?? centred,
        seedPending: !prev?.rect,
        prompt: prev?.prompt ?? null,
        notes: prev?.notes ?? null,
        motion: prev?.motion ?? null,
        regens: fs.existsSync(path.join(dir, '_regen'))
          ? fs.readdirSync(path.join(dir, '_regen')).filter((f) => f.startsWith(name.replace(IMG, '') + '-v'))
          : [],
        video: fs.existsSync(path.join(dir, '_video', `${name.replace(IMG, '')}.mp4`))
          ? `${name.replace(IMG, '')}.mp4`
          : null,
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

  /** Is the KIE key reachable? The UI hides regen/video rather than offering dead buttons. */
  async 'POST /api/kie-status'() {
    const token = await kieKey()
    if (!token) return { ready: false, reason: '1Password: `op` could not read Kie.ai API-key' }
    const r = await fetch('https://api.kie.ai/api/v1/chat/credit', {
      headers: { authorization: `Bearer ${token}` },
    }).then((x) => x.json())
    return { ready: true, credits: r.data, imageModel: IMAGE_MODEL, videoModel: VIDEO_MODEL }
  },

  /** Regenerate a still natively at the wide master ratio.
   *
   *  `notes` is the whole point: the old frame is a starting point to learn from, not a
   *  thing to reproduce. Say what was wrong with it ("the club is a NIGHT club -- the
   *  stained glass should be dark") and the next pass fixes it. The reference image is
   *  passed only to carry cast and wardrobe, never to pin the composition. */
  async 'POST /api/regen'(body) {
    const { dir, name, prompt, notes, useRef = true, ratio = '21:9', resolution = '4K' } = body
    const token = await kieKey()
    if (!token) throw new Error('no KIE key')
    if (!prompt) throw new Error('prompt required')

    const src = path.join(dir, name)
    return makeWideMaster({
      token, prompt, notes, ratio, resolution,
      refFiles: useRef && fs.existsSync(src) ? [src] : [],
      outDir: path.join(dir, '_regen'),
      base: name.replace(IMG, ''),
      ledger: { dir, source: name },
    })
  },

  /** Drive a video from a chosen still. Seedance takes the still as its first frame, so the
   *  video *starts* exactly on the picture Marco approved and moves from there. 21:9 matches
   *  the master, so the hero and its video are the same frame. Audio off: this plays muted
   *  behind a poster on the property page. */
  async 'POST /api/video'(body) {
    const { dir, name, motion, duration = 6, resolution = '1080p' } = body
    const token = await kieKey()
    if (!token) throw new Error('no KIE key')
    if (!motion) throw new Error('describe what happens in the video')

    const src = path.join(dir, name)
    if (!fs.existsSync(src)) throw new Error(`no such picture: ${name}`)
    const outDir = path.join(dir, '_video')
    fs.mkdirSync(outDir, { recursive: true })

    const first = await kieUpload(src, token)
    const { taskId, url } = await kieRun(
      VIDEO_MODEL,
      { prompt: motion, first_frame_url: first, duration: Number(duration),
        resolution, aspect_ratio: '21:9', generate_audio: false },
      token,
    )

    const out = path.join(outDir, `${name.replace(IMG, '')}.mp4`)
    logPrompt({ kind: 'video', dir, source: name, model: VIDEO_MODEL, duration, resolution,
                aspect_ratio: '21:9', prompt: motion, taskId, url, output: out })
    await download(url, out)
    return { out, name: path.basename(out), bytes: fs.statSync(out).size }
  },

  // ── Prompt tab ──────────────────────────────────────────────────────────────

  /** The slate, with enough numbers to see coverage at a glance. */
  async 'POST /api/props'() {
    const props = fs
      .readdirSync(SHARED)
      .filter((f) => /^11-\d{2}-/.test(f) && !NOT_PROPERTIES.has(f))
      .sort()
    return {
      props: props.map((id) => {
        const spec = readSpec(id)
        return {
          id,
          title: spec?.title ?? null,
          shots: spec?.stills?.length ?? 0,
          stills: listImages(stillsDirOf(id)).length,
          generated: listImages(path.join(stillsDirOf(id), '_regen')).length,
        }
      }),
    }
  },

  /** One property's spec, plus what is on disk: the existing stills (candidates
   *  for a shot's reference image) and everything already generated. */
  async 'POST /api/spec'(body) {
    const { prop } = body
    const spec = readSpec(prop)
    const dir = stillsDirOf(prop)
    return {
      prop,
      dir,
      spec,
      stills: listImages(dir),
      regen: listImages(path.join(dir, '_regen')),
    }
  },

  /** The tab autosaves the whole spec — it is the same file regen.py reads, so
   *  an edit in the browser is an edit to the CLI's plan too. */
  async 'POST /api/spec-save'(body) {
    const { prop, spec } = body
    if (!spec || !Array.isArray(spec.stills)) throw new Error('spec needs a stills array')
    const bad = spec.stills.find((s) => !s.slug || !/^[a-z0-9][a-z0-9-]*$/.test(s.slug))
    if (bad) throw new Error(`bad slug: "${bad.slug ?? ''}" — lowercase letters, digits and dashes`)
    const dupe = spec.stills.map((s) => s.slug).find((s, i, a) => a.indexOf(s) !== i)
    if (dupe) throw new Error(`two shots share the slug "${dupe}"`)
    fs.mkdirSync(SPECS, { recursive: true })
    fs.writeFileSync(specPathOf(prop), JSON.stringify(spec, null, 2) + '\n')
    return { ok: true }
  },

  /** Native file chooser for a reference image that is not one of the stills. */
  async 'POST /api/pick-file'() {
    return new Promise((resolve) => {
      execFile(
        'osascript',
        ['-e', 'POSIX path of (choose file with prompt "Choose a reference image" of type {"public.image"})'],
        (err, stdout) => resolve(err ? { cancelled: true } : { file: stdout.trim() }),
      )
    })
  },

  /** Generate ONE variant of one shot. The client loops for more — each call is
   *  one credit spend, one ledger line, one picture on disk.
   *
   *  The client sends the shot as currently edited; the spec on disk may be a
   *  500ms debounce behind the textarea, and generating from the stale file
   *  would spend 24 credits on a prompt Marco already rewrote. The disk spec is
   *  only the fallback. Refs are named relative to the property's stills
   *  folder, or absolute for a file picked from elsewhere; they carry cast and
   *  wardrobe only — the prompt owns the composition. */
  async 'POST /api/shot-generate'(body) {
    const { prop, slug, shot: sent } = body
    const token = await kieKey()
    if (!token) throw new Error('no KIE key')
    if (!/^[a-z0-9][a-z0-9-]*$/.test(slug ?? '')) throw new Error(`bad slug: "${slug}"`)
    const shot = sent ?? readSpec(prop)?.stills?.find((s) => s.slug === slug)
    if (!shot) throw new Error(`no shot "${slug}" in ${prop}`)
    if (!shot.prompt?.trim()) throw new Error(`"${slug}" has no prompt yet`)

    const dir = stillsDirOf(prop)
    return makeWideMaster({
      token, prompt: shot.prompt, notes: shot.notes,
      refFiles: (shot.refs ?? []).map((r) => (path.isAbsolute(r) ? r : path.join(dir, r))),
      outDir: path.join(dir, '_regen'),
      base: slug,
      ledger: { property: prop, slug, dir },
    })
  },

  /** Everything knowable about one picture: dimensions and bytes, where it lived
   *  before the consolidation, and which model made it — ledger first (certain),
   *  metadata/filename sniff second (best guess, labelled as such). */
  async 'POST /api/meta'(body) {
    const { dir, name } = body
    if (name?.includes('/') || name?.includes('..')) throw new Error('bad name')
    const file = path.join(dir, name)
    if (!dir || !name || !fs.existsSync(file)) throw new Error(`no such picture: ${name}`)

    const st = fs.statSync(file)
    const meta = await sharp(file).metadata()
    const original = manifestOf(dir)?.get(name) ?? null
    const originalAbs = original ? path.join('/Volumes/SharedData', original) : null

    const ledger = ledgerByPath()
    const entry = ledger.get(file) ?? (originalAbs && ledger.get(originalAbs)) ?? null
    const sniffed = sniffBytes(file, meta)
    const dialect = nameDialect(original ?? name)

    return {
      name,
      w: meta.width, h: meta.height, format: meta.format,
      bytes: st.size, modified: st.mtime,
      space: meta.space, hasAlpha: !!meta.hasAlpha, density: meta.density ?? null,
      original,
      maker: entry
        ? { certainty: 'ledger', model: entry.model, ts: entry.ts,
            aspect_ratio: entry.aspect_ratio ?? null, resolution: entry.resolution ?? null,
            prompt: entry.prompt ?? null, notes: entry.notes ?? null }
        : dialect || sniffed.length
          ? { certainty: 'guess', model: dialect, sniffed }
          : null,
    }
  },

  /** Cull the marked pictures. Nothing is ever rm'd: files move to _trash/ inside the
   *  folder, so a wrong checkbox is a drag back in Finder, not a loss. Name collisions
   *  in _trash get a numeric suffix — a cull must never overwrite an earlier cull. */
  async 'POST /api/delete'(body) {
    const { dir, names, mode = 'trash' } = body
    if (!dir || !fs.existsSync(dir)) throw new Error(`no such folder: ${dir}`)
    if (!Array.isArray(names) || !names.length) throw new Error('nothing marked')
    // mode 'archive' (2026-09-02): the NAS archive share instead of _trash. Files land in
    // 90-archive/<this folder's name>/ so a cull from 11-00-property-images is findable
    // later. ARCHIVE_ROOT overrides the share path (e.g. a Windows drive letter).
    let trash
    if (mode === 'archive') {
      const root = process.env.ARCHIVE_ROOT || '/Volumes/SharedData/90-archive'
      if (!fs.existsSync(root)) throw new Error(`archive share not mounted: ${root}`)
      trash = path.join(root, path.basename(dir))
    } else {
      trash = path.join(dir, '_trash')
    }
    fs.mkdirSync(trash, { recursive: true })

    const moved = []
    const failed = []
    for (const name of names) {
      // names come from the client's item list, but never trust a path segment
      if (name.includes('/') || name.includes('..')) { failed.push({ name, error: 'bad name' }); continue }
      const src = path.join(dir, name)
      if (!fs.existsSync(src)) { failed.push({ name, error: 'not found' }); continue }
      let dest = path.join(trash, name)
      let n = 1
      while (fs.existsSync(dest)) dest = path.join(trash, name.replace(IMG, '') + `.${++n}` + path.extname(name))
      try {
        try {
          fs.renameSync(src, dest)
        } catch (e) {
          // Cross-device (SharedData share to another share, or Windows drive letters):
          // rename fails with EXDEV, so copy then remove, never leaving two copies behind.
          if (e.code !== 'EXDEV') throw e
          fs.copyFileSync(src, dest)
          fs.unlinkSync(src)
        }
        moved.push(name)
      } catch (e) {
        failed.push({ name, error: String(e.message).slice(0, 120) })
      }
    }
    return { trash, moved, failed }
  },

  async 'POST /api/save-state'(body) {
    const { dir, ratio, items } = body
    fs.writeFileSync(
      path.join(dir, STATE_FILE),
      JSON.stringify(
        {
          defaultRatio: ratio,
          savedAt: new Date().toISOString(),
          items: Object.fromEntries(
            items.map((i) => [
              i.name,
              // prompt + notes persist: the notes are what you learned from looking at the
              // last generation, and they are worth more than the picture they replaced.
              { verdict: i.verdict, target: i.target, rect: i.rect,
                prompt: i.prompt ?? null, notes: i.notes ?? null, motion: i.motion ?? null },
            ]),
          ),
        },
        null,
        2,
      ),
    )
    return { ok: true }
  },

  /** Write the results. Crops are pure extracts at native resolution — no resampling, no upscale. */
  async 'POST /api/apply'(body) {
    const { dir, outName, items } = body
    const outDir = path.join(dir, outName || '_frames')
    fs.mkdirSync(outDir, { recursive: true })

    const done = []
    const extendQueue = []
    const manifest = []

    for (const it of items) {
      const src = path.join(dir, it.name)
      const out = path.join(outDir, it.name)
      const ratio = it.target // per picture, not per pass

      try {
        if (it.verdict === 'skip' || it.verdict === 'delete') {
          // delete is handled by /api/delete before processing — but if a marked picture
          // is still here, refusing to crop it beats guessing.
          done.push({ name: it.name, action: 'SKIP' })
          continue
        }

        if (it.verdict === 'native') {
          fs.copyFileSync(src, out)
          manifest.push({ file: it.name, frameRatio: 'native', ratio: null, out: `${it.w}x${it.h}` })
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
          manifest.push({ file: it.name, frameRatio: frameRatioOf(ratio), ratio, out: `${cw}x${ch}`, pending: 'outpaint' })
          done.push({ name: it.name, action: 'EXTEND', out: `${cw}x${ch}`, ratio })
          continue
        }

        // CROP — a pure extract. Clamp defensively; a bad rect must never throw mid-batch.
        const x = Math.max(0, Math.min(Math.round(it.rect.x), it.w - 1))
        const y = Math.max(0, Math.min(Math.round(it.rect.y), it.h - 1))
        const w = Math.max(1, Math.min(Math.round(it.rect.w), it.w - x))
        const h = Math.max(1, Math.min(Math.round(it.rect.h), it.h - y))

        await sharp(src).extract({ left: x, top: y, width: w, height: h }).toFile(out)
        manifest.push({ file: it.name, frameRatio: frameRatioOf(ratio), ratio, out: `${w}x${h}` })
        done.push({ name: it.name, action: 'CROP', out: `${w}x${h}`, ratio, kept: +(((w * h) / (it.w * it.h)) * 100).toFixed(1) })
      } catch (e) {
        done.push({ name: it.name, action: 'ERROR', error: String(e.message).slice(0, 120) })
      }
    }

    if (extendQueue.length) {
      fs.writeFileSync(
        path.join(outDir, 'extend-queue.json'),
        JSON.stringify({ note: 'Feed canvas + mask to KIE / Comfy / generative fill. White in the mask is the region to paint.', jobs: extendQueue }, null, 2),
      )
    }
    // Maps 1:1 onto Payload's Media.frameRatio, so an importer never has to guess.
    fs.writeFileSync(
      path.join(outDir, 'frames.json'),
      JSON.stringify({ note: 'frameRatio maps to Payload Media.frameRatio (hero 2.39 / standard 2.00 / native).', frames: manifest }, null, 2),
    )
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
      // Thumbnails cache for a day: with 900+ pictures in the consolidated folder, re-reading
      // every original off the NAS on each roll redraw made scrolling unusable. Originals
      // (no max) stay uncached — they are what you inspect after a regen.
      res.writeHead(200, { 'content-type': max ? 'image/jpeg' : 'image/png', 'cache-control': max ? 'max-age=86400' : 'no-cache' })
      return res.end(buf)
    } catch {
      res.writeHead(500)
      return res.end()
    }
  }

  // Stream a generated video back to the sheet.
  if (url.pathname === '/api/vid') {
    const p = url.searchParams.get('p')
    if (!p || !fs.existsSync(p)) {
      res.writeHead(404)
      return res.end()
    }
    res.writeHead(200, { 'content-type': 'video/mp4', 'content-length': fs.statSync(p).size })
    return fs.createReadStream(p).pipe(res)
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
