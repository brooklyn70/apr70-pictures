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

type NavProps = {
  items: MagneticNavItem[]
  logoSrc?: string
  logoAlt?: string
  /** True when the mark is the global apr70 wordmark, swappable by the theme picker. */
  brandSwappable?: boolean
}

const pillBaseWidth = 100

/**
 * Global brand mark. When swappable, the current src is owned by the
 * `data-logo-src` attribute on <html> (stamped pre-paint from localStorage,
 * updated live by ThemeControlIsland via `img[data-brand-wordmark]`).
 * If the file fails to load, fall back to live text in currentColor so the
 * brand never silently disappears.
 */
function BrandMark({ src, alt, swappable }: { src: string; alt?: string; swappable?: boolean }) {
  const [failed, setFailed] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    // Catch errors that fired before hydration attached the onError handler.
    const img = imgRef.current
    if (img && img.complete && img.naturalWidth === 0 && img.naturalHeight === 0) {
      setFailed(true)
    }
  }, [])

  /* The visitor-picked mark lives on <html data-logo-src> (stamped pre-paint).
     Never read it during render — that forks the client tree from SSR and
     breaks hydration. Sync it after mount instead (also covers remounts when
     the nav upgrades from simple to full chrome). */
  useEffect(() => {
    if (!swappable) return
    const img = imgRef.current
    const domSrc = document.documentElement.getAttribute('data-logo-src')
    if (img && domSrc && img.getAttribute('src') !== domSrc) img.setAttribute('src', domSrc)
  }, [swappable])

  if (failed) {
    return (
      <a className="magnetic-nav__link magnetic-nav__brand-text" href="/">
        APR 70
      </a>
    )
  }

  /* suppressHydrationWarning: the inline body script swaps src pre-hydration
     for non-default picks — the attribute is intentionally DOM-owned. */
  return (
    <a className="magnetic-nav__link" href="/">
      <img
        ref={imgRef}
        className="magnetic-nav__logo"
        src={src}
        alt={alt ?? 'Home'}
        {...(swappable ? { 'data-brand-wordmark': 'true' } : {})}
        onError={() => setFailed(true)}
        suppressHydrationWarning
      />
    </a>
  )
}

function useChromeMode(): 'full' | 'simple' {
  // Always start 'simple' so the first client render matches SSR exactly —
  // reading matchMedia in the initializer forked server/client trees and
  // failed hydration on every page. The mount effect below upgrades to
  // 'full' on fine-pointer, motion-ok devices.
  const [mode, setMode] = useState<'full' | 'simple'>('simple')

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

function StaticNav({ items, logoSrc, logoAlt, brandSwappable }: NavProps) {
  return (
    <nav className="magnetic-nav magnetic-nav--static" aria-label="Primary">
      <ul className="magnetic-nav__list">
        {logoSrc && (
          <li className="magnetic-nav__item magnetic-nav__logo-item">
            <BrandMark src={logoSrc} alt={logoAlt} swappable={brandSwappable} />
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

export default function MagneticNavIsland({ items, logoSrc, logoAlt, brandSwappable }: NavProps) {
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
    return <StaticNav items={items} logoSrc={logoSrc} logoAlt={logoAlt} brandSwappable={brandSwappable} />
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
            <BrandMark src={logoSrc} alt={logoAlt} swappable={brandSwappable} />
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
