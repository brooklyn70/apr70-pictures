import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

/**
 * LogoRevealIsland (v9) — the sprocket-hole elevator, ported from the v1
 * APR_70 front door (LogoReveal.tsx): dissolve in, five hole pairs light
 * bottom-to-top in the division colors, cinematic blur-out.
 *
 * v9 rules:
 * - home page only, once per browser session (sessionStorage apr70:v9-reveal)
 * - total run ~2.5s, hard safety timeout, removes itself from the DOM after
 * - skipped entirely under prefers-reduced-motion or when the flag exists
 * - content renders beneath it from the start: SSR emits NOTHING here; the
 *   overlay only exists after hydration decides to play. If JS never runs
 *   the page is simply the page.
 */

const SESSION_KEY = 'apr70:v9-reveal'

// 5 pairs of holes, bottom to top (left + right at the same y level).
const HOLE_PAIRS: [string, string][] = [
  ['pnr10', 'pnr11'],
  ['pnr8', 'pnr9'],
  ['pnr6', 'pnr7'],
  ['pnr4', 'pnr5'],
  ['pnr2', 'pnr3'],
]

const PAIR_COLORS = ['#E85D04', '#0077B6', '#077082', '#824B07', '#ffffff']

const HOLE_YS = [61.6, 50.2, 38.8, 27.4, 16.0]

export default function LogoRevealIsland() {
  const [play, setPlay] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const startedRef = useRef(false)

  /* Decide AFTER mount — SSR renders nothing, so content is never blocked. */
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        sessionStorage.setItem(SESSION_KEY, '1')
        return
      }
      sessionStorage.setItem(SESSION_KEY, '1')
      setPlay(true)
    } catch {
      /* storage unavailable — skip the splash rather than loop it */
    }
  }, [])

  useEffect(() => {
    if (!play || startedRef.current) return
    startedRef.current = true

    const done = () => setPlay(false) // unmounts + removes overlay from DOM
    const safetyTimer = window.setTimeout(done, 4000) // hard stop

    const wrapper = wrapperRef.current
    const svg = svgRef.current
    if (!wrapper || !svg) {
      window.clearTimeout(safetyTimer)
      done()
      return
    }

    HOLE_PAIRS.forEach(([a, b]) => {
      svg.getElementById(a)?.setAttribute('fill', 'transparent')
      svg.getElementById(b)?.setAttribute('fill', 'transparent')
    })

    gsap.set(wrapper, { opacity: 0, filter: 'blur(0px)' })

    const tl = gsap.timeline({
      onComplete: () => {
        window.clearTimeout(safetyTimer)
        done()
      },
    })

    // Phase 1: dissolve in (~0.6s)
    tl.to(wrapper, { opacity: 1, duration: 0.6, ease: 'power2.out' })
    tl.to({}, { duration: 0.15 })

    // Phase 2: sprocket elevator, bottom to top (~0.75s)
    HOLE_PAIRS.forEach(([a, b], i) => {
      const elA = svg.getElementById(a)
      const elB = svg.getElementById(b)
      const color = PAIR_COLORS[i]
      tl.to(
        {},
        {
          duration: 0.08,
          onStart: () => {
            elA?.setAttribute('fill', color)
            elB?.setAttribute('fill', color)
          },
        },
        '+=0.07',
      )
    })

    tl.to({}, { duration: 0.15 })

    // Phase 3: cinematic blur out (~0.7s) — total ~2.5s
    tl.to(wrapper, {
      filter: 'blur(12px)',
      opacity: 0,
      duration: 0.7,
      ease: 'power3.in',
    })

    return () => {
      window.clearTimeout(safetyTimer)
      tl.kill()
    }
  }, [play])

  if (!play) return null

  return (
    <div className="v9-reveal" aria-hidden="true">
      <div ref={wrapperRef} className="v9-reveal__stage">
        <svg
          ref={svgRef}
          viewBox="0 0 320 100"
          style={{ width: '85%', height: 'auto' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {HOLE_YS.map((y, i) => {
            /* HOLE_PAIRS[0] IS the bottom pair (y=61.6) — same order as HOLE_YS. */
            const [leftId, rightId] = HOLE_PAIRS[i] ?? ['', '']
            return (
              <g key={y}>
                <rect x="12" y={y} width="6.72" height="4.752" rx="1.2" fill="transparent" id={leftId} />
                <rect x="300" y={y} width="6.72" height="4.752" rx="1.2" fill="transparent" id={rightId} />
              </g>
            )
          })}
          <text
            x="160"
            y="58"
            fontFamily="'Fraunces', Georgia, serif"
            fontSize="38"
            fontWeight="600"
            fill="#FFFFFF"
            textAnchor="middle"
            letterSpacing="0.18em"
          >
            APR 70
          </text>
        </svg>
      </div>
    </div>
  )
}
