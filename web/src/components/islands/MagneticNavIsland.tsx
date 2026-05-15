import './magnetic-nav.css'

import { useRef, useMemo, useState, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

export type MagneticNavItem = {
  label: string
  href: string
  openInNewTab?: boolean | null
}

const pillBaseWidth = 100

function useChromeMode(): 'full' | 'simple' {
  const [mode, setMode] = useState<'full' | 'simple'>(() => {
    if (typeof window === 'undefined') return 'simple'
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    return coarse || reduce ? 'simple' : 'full'
  })

  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => {
      const next = coarse.matches || reduce.matches ? 'simple' : 'full'
      setMode(next)
    }
    sync()
    coarse.addEventListener('change', sync)
    reduce.addEventListener('change', sync)
    return () => {
      coarse.removeEventListener('change', sync)
      reduce.removeEventListener('change', sync)
    }
  }, [])

  return mode
}

function StaticNav({ items, logoSrc, logoAlt }: { items: MagneticNavItem[]; logoSrc?: string; logoAlt?: string }) {
  return (
    <nav className="magnetic-nav magnetic-nav--static" aria-label="Primary">
      <ul className="magnetic-nav__list">
        {logoSrc && (
          <li className="magnetic-nav__item magnetic-nav__logo-item">
            <a className="magnetic-nav__link" href="/">
              <img className="magnetic-nav__logo" src={logoSrc} alt={logoAlt ?? 'Home'} />
            </a>
          </li>
        )}
        {items.map((item) => (
          <li key={`${item.href}-${item.label}`} className="magnetic-nav__item">
            <a
              className="magnetic-nav__link"
              href={item.href}
              {...(item.openInNewTab
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default function MagneticNavIsland({ items, logoSrc, logoAlt }: { items: MagneticNavItem[]; logoSrc?: string; logoAlt?: string }) {
  const mode = useChromeMode()
  const navRef = useRef<HTMLElement>(null)
  const pillRef = useRef<HTMLDivElement>(null)
  const itemsKey = useMemo(() => items.map((i) => `${i.href}:${i.label}`).join('|'), [items])

  const moveToLink = useCallback(
    (link: HTMLAnchorElement) => {
      const nav = navRef.current
      const pill = pillRef.current
      if (!nav || !pill) return
      const navRect = nav.getBoundingClientRect()
      const linkRect = link.getBoundingClientRect()
      const x = linkRect.left - navRect.left + nav.scrollLeft
      const w = Math.max(12, linkRect.width)
      gsap.to(pill, {
        x,
        scaleX: w / pillBaseWidth,
        opacity: 0.35,
        duration: 0.32,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    },
    [],
  )

  useGSAP(
    () => {
      if (mode !== 'full' || items.length === 0) return
      const nav = navRef.current
      const pill = pillRef.current
      if (!nav || !pill) return

      gsap.set(pill, {
        transformOrigin: 'left center',
        width: pillBaseWidth,
        scaleX: 0.08,
        x: 0,
        opacity: 0,
      })

      const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>('.magnetic-nav__link'))

      const onEnter = (e: Event) => moveToLink(e.currentTarget as HTMLAnchorElement)
      const onFocus = (e: Event) => moveToLink(e.currentTarget as HTMLAnchorElement)

      links.forEach((a) => {
        a.addEventListener('pointerenter', onEnter)
        a.addEventListener('focus', onFocus)
      })

      const hide = () => {
        gsap.to(pill, { opacity: 0, duration: 0.22, ease: 'power2.out', overwrite: 'auto' })
      }
      nav.addEventListener('pointerleave', hide)

      const ro = new ResizeObserver(() => {
        const hovered = nav.querySelector<HTMLAnchorElement>('.magnetic-nav__link:hover')
        if (hovered) moveToLink(hovered)
      })
      ro.observe(nav)

      return () => {
        links.forEach((a) => {
          a.removeEventListener('pointerenter', onEnter)
          a.removeEventListener('focus', onFocus)
        })
        nav.removeEventListener('pointerleave', hide)
        ro.disconnect()
      }
    },
    { scope: navRef, dependencies: [mode, itemsKey, moveToLink], revertOnUpdate: true },
  )

  if (items.length === 0) return null

  if (mode === 'simple') {
    return <StaticNav items={items} logoSrc={logoSrc} logoAlt={logoAlt} />
  }

  return (
    <nav ref={navRef} className="magnetic-nav magnetic-nav--animated" aria-label="Primary">
      <div
        ref={pillRef}
        className="magnetic-nav__pill"
        aria-hidden="true"
      />
      <ul className="magnetic-nav__list">
        {logoSrc && (
          <li className="magnetic-nav__logo-item">
            <a className="magnetic-nav__link" href="/">
              <img className="magnetic-nav__logo" src={logoSrc} alt={logoAlt ?? 'Home'} />
            </a>
          </li>
        )}
        {items.map((item) => (
          <li key={`${item.href}-${item.label}`} className="magnetic-nav__item">
            <a
              className="magnetic-nav__link"
              href={item.href}
              {...(item.openInNewTab
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
