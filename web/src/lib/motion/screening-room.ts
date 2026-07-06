/**
 * Screening Room (T1) motion — CHROME layer (Wave A).
 *
 * Owns the one-time nav settle on load. The SSR default is the fully-visible,
 * static nav (no CSS pre-hide, no content hidden without JS); the entrance
 * offset is applied here from JS immediately before animating (SPEC §3.5, and
 * the FOUC flaw called out in the v2 interaction study §3).
 *
 * Content-level Screening Room motion (identity read scrub, cover gate-wipes,
 * door/slate settles per direction-a-screening-room.html) is Wave B's; it
 * layers onto this same module. Guarded so the nav settle plays ONCE — never
 * re-firing when the visitor toggles back to this theme.
 */
import type { MotionApi, ThemeMotion } from './index'

let navSettleDone = false

const screeningRoomMotion: ThemeMotion = ({ gsap }: MotionApi) => {
  if (!navSettleDone) {
    navSettleDone = true
    const nav = document.querySelector('.site-nav')
    if (nav) {
      gsap.from(nav, { opacity: 0, y: -10, duration: 0.6, ease: 'power3.out' })
      gsap.from('.site-nav__link', {
        opacity: 0,
        y: 6,
        duration: 0.45,
        delay: 0.1,
        stagger: 0.05,
        ease: 'power2.out',
      })
    }
  }

  return () => {
    /* nothing persistent to tear down at the chrome layer */
  }
}

export default screeningRoomMotion
