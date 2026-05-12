import type { SerializedEditorState } from 'lexical'
import { sanitizeUrl } from '@payloadcms/richtext-lexical'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import escapeHTML from 'escape-html'

/** Canonical brand token slugs — must match TextStateFeature state keys in aprLexicalEditor.ts
 *  and [data-color="..."] selectors in tokens.css. */
const VALID_COLOR_TOKENS = new Set([
  '212-amber',
  '212-sicilian-orange',
  '310-imax',
  'nrc-grey',
  '310-sicilian-blue',
  'nrc-navy',
])

/** Matches v2 `RichText.tsx` / `d7-blocks.mjs` field shapes (`apr70-clone`). */
type StructureDividerFields = {
  label?: string | null
}

type ButtonFields = {
  label?: string | null
  href?: string | null
  variant?: 'primary' | 'secondary' | null
}

type AccentColor =
  | '212-amber'
  | '212-sicilian-orange'
  | '310-imax'
  | 'nrc-grey'
  | '310-sicilian-blue'
  | 'nrc-navy'

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

      /**
       * Color Injector — replaces the default inline-style text converter.
       *
       * TextStateFeature serializes color selections as a top-level `color` key
       * on the text node JSON (via Lexical's `__state.toJSON()` spread).
       * We detect that key and wrap the formatted text in a
       * `<span data-color="...">` so that tokens.css selectors handle all styling.
       *
       * Only canonical token slugs are accepted; unknown values fall through
       * to the default text converter with no color attribute.
       */
      text: ({ node }) => {
        // Call the default text converter to handle bold/italic/underline etc.
        const defaultTextConverter = defaultConverters.text as (args: { node: typeof node }) => string
        let html = defaultTextConverter({ node })

        const nodeData = node as unknown as Record<string, unknown>

        // Color Injector — emit data-color="<slug>" for tokens.css selectors.
        // Only canonical token slugs are accepted; unknown values are ignored.
        const colorSlug = nodeData.color
        if (typeof colorSlug === 'string' && VALID_COLOR_TOKENS.has(colorSlug)) {
          html = `<span data-color="${colorSlug}">${html}</span>`
        }

        // Mega Scale toggle — emit data-display="mega" for the tokens.css
        // [data-display="mega"] selector (clamp(3.5rem, 15vw, 18rem) Futura Bold).
        // Wraps outermost so the display-scale box is the layout root.
        if (nodeData.display === 'mega') {
          html = `<span data-display="mega">${html}</span>`
        }

        return html
      },

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
          // v3 canonical slug → CSS custom property in tokens.css
          const colorSlug = fields.color ?? '212-sicilian-orange'
          return `<aside class="d7-accent-text" data-color="${escapeHTML(colorSlug)}" style="border-left-color: var(--color-${escapeHTML(colorSlug)});"><p>${escapeHTML(text)}</p></aside>`
        },
      },
    }),
    disableContainer: true,
  })
}
