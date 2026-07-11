/**
 * v9 copy micro-markdown — the exact grammar of the v9 copy canon:
 *   **bold** · *italic* · ==highlight== · [label](/href) · blank line = new ¶
 * Everything is HTML-escaped FIRST; the produced markup is the only HTML.
 * Rendered via set:html in the section components.
 */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function isSafeHref(href: string): boolean {
  return (
    href.startsWith('/') ||
    href.startsWith('#') ||
    href.startsWith('https://') ||
    href.startsWith('http://') ||
    href.startsWith('mailto:')
  )
}

/** Inline spans only (no paragraphs). */
export function renderInline(text: string | null | undefined): string {
  if (!text) return ''
  let out = escapeHtml(text)
  // [label](href)
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label: string, href: string) =>
    isSafeHref(href) ? `<a href="${href}">${label}</a>` : label,
  )
  // ==highlight==
  out = out.replace(/==([^=]+)==/g, '<mark class="v9-hl">$1</mark>')
  // **bold**
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  // *italic*
  out = out.replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
  return out
}

/** Paragraph blocks: blank line starts a new <p>. */
export function renderParagraphs(text: string | null | undefined): string {
  if (!text) return ''
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${renderInline(p)}</p>`)
    .join('')
}

/** Plain-text form (markers stripped) — for meta tags, JSON-LD, llms.txt. */
export function plainText(text: string | null | undefined): string {
  if (!text) return ''
  return text
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '$1')
    .replace(/==([^=]+)==/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*\n]+)\*/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}
