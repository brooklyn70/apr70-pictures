/**
 * Motion dispatcher — the single entry point booted from Layout.astro.
 *
 * Responsibilities:
 *  - boot the site-wide trailing-dot cursor (own gating) and the one-time
 *    logo splash (front-door / once-per-session / reduced-motion gated);
 *  - resolve the active theme's motion module (`./<slug>.ts`) and run it under
 *    a `gsap.matchMedia('(prefers-reduced-motion: no-preference)')` gate, so
 *    reduced-motion collapses everything to the static SSR default (SPEC §3.5);
 *  - kill prior ScrollTriggers + revert the previous theme's matchMedia when
 *    the visitor switches theme (data-design flip), then re-init.
 *
 * Per-theme modules (`screening-room.ts`, and later photoplay/trade-paper/
 * cutting-room/picture-palace from Wave C) default-export a `ThemeMotion`.
 */
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { initCursor } from './cursor'
import { maybeRunSplash } from './splash'

gsap.registerPlugin(ScrollTrigger, SplitText)

export type MotionApi = {
  gsap: typeof gsap
  ScrollTrigger: typeof ScrollTrigger
  SplitText: typeof SplitText
}

/** A theme motion module: register animations, optionally return a cleanup. */
export type ThemeMotion = (api: MotionApi) => (() => void) | void

const api: MotionApi = { gsap, ScrollTrigger, SplitText }

/* Per-theme modules (`<slug>.ts`) present at build time. Infra modules are
   excluded so they are not both static + dynamic imports. Missing themes (not
   yet authored by Wave C) resolve to `undefined` and are skipped — never a
   build break; Wave C's files are picked up automatically on the next build. */
const themeModules = import.meta.glob(['./*.ts', '!./index.ts', '!./cursor.ts', '!./splash.ts'])

let currentMM: ReturnType<typeof gsap.matchMedia> | null = null

async function loadThemeMotion(design: string): Promise<ThemeMotion | null> {
  const loader = themeModules[`./${design}.ts`]
  if (!loader) return null
  try {
    const mod = (await loader()) as { default?: ThemeMotion }
    return mod.default ?? null
  } catch {
    return null
  }
}

/** (Re)initialise per-theme motion. Kills prior triggers + reverts prior mm. */
export async function initThemeMotion(design: string): Promise<void> {
  currentMM?.revert()
  currentMM = null
  ScrollTrigger.getAll().forEach((t) => t.kill())

  const motion = await loadThemeMotion(design)
  if (!motion) return

  const mm = gsap.matchMedia()
  currentMM = mm
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const cleanup = motion(api)
    return () => {
      if (typeof cleanup === 'function') cleanup()
    }
  })
}

/** Booted once from Layout.astro. */
export function bootMotion(): void {
  if (typeof window === 'undefined') return

  // One-time entrance splash — as early as possible (still JS-only; SSR content
  // is never blocked). All its gates live inside maybeRunSplash.
  maybeRunSplash(api)

  const run = () => {
    initCursor(api)

    const design = document.documentElement.getAttribute('data-design') || 'screening-room'
    void initThemeMotion(design)

    // Re-init on theme switch (control panel flips data-design on <html>).
    let last = design
    const mo = new MutationObserver(() => {
      const next = document.documentElement.getAttribute('data-design') || 'screening-room'
      if (next !== last) {
        last = next
        void initThemeMotion(next)
      }
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-design'] })
  }

  if ('requestIdleCallback' in window) {
    ;(window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => void })
      .requestIdleCallback(run, { timeout: 600 })
  } else {
    setTimeout(run, 200)
  }
}
