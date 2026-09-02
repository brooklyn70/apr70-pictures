import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * LayeredParallaxIsland — the one controller for the layered-cinema fold
 * (POC, 2026-09-02). One gsap.timeline bound to one ScrollTrigger with
 * scrub: true drives the five data-layer targets by transform and opacity
 * only. SSR emits every layer complete; this island only adds the offsets.
 *
 * Mount guard (the cursor.ts pattern): refuse unless html[data-design] is
 * "layered"; refuse under prefers-reduced-motion: reduce; refuse on a coarse
 * pointer unless the device budget allows. On / the LogoReveal splash runs
 * once per session and this must not fight it: wait for its overlay
 * (.v9-reveal) to remove itself before the timeline is built and refreshed.
 *
 * Depth ratios (fraction of the fold's scroll distance, all small on
 * purpose): title 0.05, beam 0.08, gate 0.12 with the picture inside at
 * 0.06 net (the gate-vs-negative offset), rail 0.16. Grain is pinned.
 */

const RATIO = { title: 0.05, beam: 0.08, gate: 0.12, picture: 0.06, rail: 0.16 } as const
const KEY_STEPS = 5

type NavBudget = Navigator & {
  connection?: { saveData?: boolean }
  deviceMemory?: number
}

function budgetAllows(): boolean {
  const nav = navigator as NavBudget
  if (nav.connection?.saveData) return false
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory < 4) return false
  if (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency < 4) return false
  return true
}

/** Resolve once the splash overlay is gone (or was never going to run). */
function whenSplashGone(cb: () => void): () => void {
  let timer = 0
  let tries = 0
  const tick = () => {
    if (!document.querySelector('.v9-reveal') || tries++ > 60) cb()
    else timer = window.setTimeout(tick, 100)
  }
  tick()
  return () => window.clearTimeout(timer)
}

export default function LayeredParallaxIsland() {
  useEffect(() => {
    const doc = document.documentElement
    if (doc.getAttribute('data-design') !== 'layered') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(pointer: coarse)').matches && !budgetAllows()) return

    const host = document.querySelector<HTMLElement>('[data-layered-host]')
    if (!host) return
    const layer = (name: string) => host.querySelector<HTMLElement>(`[data-layer="${name}"]`)
    const title = layer('title')
    const beam = layer('beam')
    const gate = layer('gate')
    const rail = layer('rail')
    const keys = layer('keycodes')
    const picture = gate?.querySelector<HTMLElement>('.v9-photofold__frame img') ?? null

    gsap.registerPlugin(ScrollTrigger)

    let tl: gsap.core.Timeline | null = null
    let cancelled = false

    const cancelWait = whenSplashGone(() => {
      if (cancelled) return
      const dist = () => host.offsetHeight
      const pitch = () => {
        const v = getComputedStyle(host).getPropertyValue('--v9lg-pitch')
        const n = parseFloat(v)
        return Number.isFinite(n) && n > 0 ? n : 30.4
      }

      tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: host,
          start: () => `top ${Math.round(host.getBoundingClientRect().top + window.scrollY)}px`,
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      if (title) tl.to(title, { y: () => -RATIO.title * dist(), opacity: 0.6 }, 0)
      if (beam) tl.to(beam, { x: () => RATIO.beam * dist(), scale: 1.08 }, 0)
      if (gate) tl.to(gate, { y: () => -RATIO.gate * dist(), opacity: 0.72 }, 0)
      if (picture) tl.to(picture, { y: () => (RATIO.gate - RATIO.picture) * dist() }, 0)
      if (rail) tl.to(rail, { y: () => -RATIO.rail * dist() }, 0)
      if (keys) tl.to(keys, { y: () => -KEY_STEPS * pitch(), snap: { y: pitch() } }, 0)

      ScrollTrigger.refresh()
    })

    return () => {
      cancelled = true
      cancelWait()
      tl?.scrollTrigger?.kill()
      tl?.kill()
    }
  }, [])

  /* A real box so client:visible has something to observe; sized by CSS. */
  return <span className="v9lg-controller" aria-hidden="true" />
}
