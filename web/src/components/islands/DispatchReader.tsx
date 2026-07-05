import { useEffect, useState } from 'react'

type ReaderParagraph = {
  variant?: 'text' | 'first' | 'pull' | 'small' | 'head'
  text?: string
  attr?: string | null
  // Loose-shape fallback for hand-built articles (Feature open)
  pull?: string
  head?: string
  first?: boolean
  small?: string
}

export type DispatchReaderArticle = {
  section?: string
  folio?: string
  eyebrow?: string
  title: string
  deck?: string
  by?: string
  date?: string
  length?: string
  heroSrc?: string
  body?: ReaderParagraph[]
}

const HERO_FALLBACK = '/brand/placeholders/placeholder-16x9-default.svg'

function renderParagraph(p: ReaderParagraph, i: number) {
  const variant = p.variant
  if (variant === 'pull' || p.pull) {
    return <p className="pull" key={i}>{p.text ?? p.pull}</p>
  }
  if (variant === 'head' || p.head) {
    return <h3 key={i}>{p.text ?? p.head}</h3>
  }
  if (variant === 'small' || p.small) {
    return <p className="small" key={i}>· · · {p.text ?? p.small} · · ·</p>
  }
  const first = variant === 'first' || p.first
  return (
    <p key={i} className={first ? 'first' : ''}>
      {p.text}
    </p>
  )
}

export default function DispatchReader() {
  const [article, setArticle] = useState<DispatchReaderArticle | null>(null)

  useEffect(() => {
    const featureNode = document.querySelector<HTMLScriptElement>(
      '[data-dispatch-feature-article]',
    )
    let featureArticle: DispatchReaderArticle | null = null
    if (featureNode) {
      try {
        featureArticle = JSON.parse(featureNode.textContent ?? 'null')
      } catch {
        featureArticle = null
      }
    }

    const openContents = (entryEl: HTMLElement) => {
      const folio = entryEl.dataset.folio ?? ''
      const title = entryEl.dataset.title ?? ''
      const deck = entryEl.dataset.deck ?? ''
      const by = entryEl.dataset.by ?? ''
      setArticle({
        section: 'CONTENTS',
        folio,
        eyebrow: 'FEATURE · ' + folio,
        title,
        deck,
        by,
        date: 'APR 2026',
        length: '8 MIN READ',
        body: [
          {
            variant: 'first',
            text:
              deck +
              ' This piece is filed for the inaugural issue of DISPATCH; the long version sits in the print folio at the page noted in the contents.',
          },
          {
            variant: 'text',
            text:
              'Editorial copy continues here for the reading view. In the live edition, this is where the reported feature appears in full — pages, photos, pull-quotes, the works. For preview purposes the deck is reproduced and a stub follows.',
          },
          {
            variant: 'pull',
            text: '"' + (deck.split('.')[0] ?? '') + '."',
          },
          {
            variant: 'text',
            text:
              'Issues are numbered, never dated. The discipline is the work. The byline is the room. — Editorial Desk',
          },
        ],
      })
    }

    const onContentsClick = (e: Event) => {
      const target = e.target as HTMLElement
      const link = target.closest<HTMLElement>('[data-dispatch-open]')
      if (!link) return
      e.preventDefault()
      openContents(link)
    }
    const onFeatureClick = (e: Event) => {
      const target = e.target as HTMLElement
      const link = target.closest<HTMLElement>('[data-dispatch-open-feature]')
      if (!link) return
      e.preventDefault()
      if (featureArticle) setArticle(featureArticle)
    }

    document.addEventListener('click', onContentsClick)
    document.addEventListener('click', onFeatureClick)
    return () => {
      document.removeEventListener('click', onContentsClick)
      document.removeEventListener('click', onFeatureClick)
    }
  }, [])

  useEffect(() => {
    if (!article) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setArticle(null)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [article])

  if (!article) return null

  const heroSrc = article.heroSrc || HERO_FALLBACK

  return (
    <div className="reader" role="dialog" aria-modal="true" aria-labelledby="reader-title">
      <div className="reader-bar">
        <span className="reader-bar-label">
          DISPATCH · {article.section || 'FEATURE'} · {article.folio}
        </span>
        <span className="reader-bar-center">VOL. 01 · NO. 01</span>
        <button className="reader-bar-close" onClick={() => setArticle(null)}>
          CLOSE — ESC
        </button>
      </div>
      <div className="reader-wrap">
        <div className="reader-hero-eyebrow">{article.eyebrow || 'FEATURE'}</div>
        <h1 className="reader-hero-title" id="reader-title">{article.title}</h1>
        <p className="reader-hero-deck">{article.deck}</p>
        <div className="reader-hero-meta">
          <span><b>BY</b> {article.by || 'M.A. CARUSO'}</span>
          <span><b>FILED</b> {article.date || 'APR 14, 2026'}</span>
          <span><b>FOLIO</b> {article.folio || '012'}</span>
          <span><b>LENGTH</b> {article.length || '11 MIN READ'}</span>
        </div>
        <div className="reader-hero-image">
          <img
            src={heroSrc}
            alt=""
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div className="reader-body">
          {(article.body || []).map((p, i) => renderParagraph(p, i))}
        </div>
        <div className="reader-end">END · DISPATCH 0086</div>
      </div>
    </div>
  )
}
