import type { SerializedEditorState } from 'lexical'
import { sanitizeUrl } from '@payloadcms/richtext-lexical'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import escapeHTML from 'escape-html'

/** Matches v2 `RichText.tsx` / `d7-blocks.mjs` field shapes (`apr70-clone`). */
type StructureDividerFields = {
  label?: string | null
}

type ButtonFields = {
  label?: string | null
  href?: string | null
  variant?: 'primary' | 'secondary' | null
}

type AccentColor = '--orange' | '--amber' | '--teal' | '--offwhite'

type AccentTextFields = {
  text?: string | null
  color?: AccentColor | null
}

/**
 * Serialized Lexical from Payload richText → HTML string.
 * D-7 block rendering mirrors v2 JSX converters (`RichText.tsx`) using locked v3 tokens.
 */
export function richTextLexicalToHtml(data: SerializedEditorState | null | undefined): string {
  if (!data?.root?.children?.length) {
    return ''
  }

  return convertLexicalToHTML({
    data,
    converters: ({ defaultConverters }) => ({
      ...defaultConverters,
      blocks: {
        structureDivider: ({ node }) => {
          const fields = (node as { fields: StructureDividerFields & { blockType: string } }).fields
          const label = fields.label?.trim()
          const rule =
            '<span class="d7-structure-divider__rule" aria-hidden="true"></span>'
          if (!label) {
            return `<div class="d7-structure-divider d7-structure-divider--plain">${rule}</div>`
          }
          return `<div class="d7-structure-divider d7-structure-divider--labeled" aria-hidden="true">${rule}<span class="d7-structure-divider__label">${escapeHTML(label)}</span>${rule}</div>`
        },
        button: ({ node }) => {
          const fields = (node as { fields: ButtonFields & { blockType: string } }).fields
          const label = fields.label ?? ''
          const rawHref = fields.href ?? '#'
          const href = sanitizeUrl(rawHref)
          const isExternal =
            /^https?:\/\//i.test(rawHref.trim()) || rawHref.trim().startsWith('//')
          const variant = fields.variant === 'secondary' ? 'secondary' : 'primary'
          const rel = isExternal ? ' rel="noopener noreferrer"' : ''
          const target = isExternal ? ' target="_blank"' : ''
          return `<div class="d7-button-wrap"><a class="d7-button d7-button--${variant}" href="${escapeHTML(href)}"${target}${rel}>${escapeHTML(label)}</a></div>`
        },
        accentText: ({ node }) => {
          const fields = (node as { fields: AccentTextFields & { blockType: string } }).fields
          const text = fields.text ?? ''
          const token = fields.color ?? '--orange'
          return `<aside class="d7-accent-text" style="border-left-color: var(${escapeHTML(token)});">${escapeHTML(text)}</aside>`
        },
      },
    }),
    disableContainer: true,
  })
}
