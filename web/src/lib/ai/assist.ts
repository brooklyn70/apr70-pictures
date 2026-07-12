/**
 * apr70 AI build assistant — shared retrieval + prompting layer.
 *
 * Two modes, both grounded in the locked design system so output is on-spec:
 *   - 'author'  → drafts block copy / page content in the APR 70 voice.
 *   - 'theme'   → generates a new [data-design] token block for designs.css.
 *
 * Provider is the official Anthropic SDK, model claude-opus-4-8, imported
 * dynamically so the web build stays green before `pnpm add @anthropic-ai/sdk`.
 * Set ANTHROPIC_API_KEY in the web service env.
 */

export type AssistMode = 'author' | 'theme'

export interface AssistRequest {
  mode: AssistMode
  prompt: string
  /** Optional grounding context (e.g. existing block JSON, division name). */
  context?: string
}

export const ASSIST_MODEL = 'claude-opus-4-8'

const PALETTE = `Locked brand palette (never invent colors outside this set):
- 212 Amber #824B07, 212 Sicilian Orange #E85D04
- 310 IMAX #077082, 310 Sicilian Blue #0077B6
- NRC Grey #c8c8c8, NRC Navy #001F3F
- Light mode surface #FAFAF8 / ink #1A1A1A
Type (v10 house system): Futura Std (display — structural headings, nav, logo,
division labels, upright), Newsreader (body text), Courier Prime (mono — code
labels, timecode, sluglines), Fraunces (editorial serif accent — pull quotes,
block quotations, CTA buttons, always italic).
Voice: bold, mature, in-your-face. Italian Modernist / Vignelli-Munari lineage. Film-sprocket DNA. No emoji.`

const BLOCKS = `Block library (author output must map to these): HeroBlock, RichTextBlock,
TwoColBlock, GridBlock, CTABlock, QuotesBlock, FilmstripBlock, DivisionBlock, StatsBlock, DividerBlock.`

const DESIGN_SLOTS = `Themes are scoped under [data-design="<slug>"] and may only REBIND existing tokens:
--bg-0..--bg-3 (surface ramp), --fg-1..--fg-6 (text ramp), --rule / --rule-strong,
--apr-amber / --apr-imax / --apr-orange / --apr-blue (accents), optionally --font-display.
Do NOT introduce new global token names. Output ONLY a single CSS block, no prose.`

function systemPrompt(mode: AssistMode): string {
  if (mode === 'theme') {
    return `You are the apr70 theme-design assistant. You generate one new visual skin for the
APR 70 Pictures site as a scoped CSS block.\n\n${PALETTE}\n\n${DESIGN_SLOTS}\n
Return exactly one CSS rule block of the form:
[data-design="<kebab-slug>"] { /* token rebinds */ }
Optionally followed by a [data-design="<slug>"] ::selection rule. Pick a slug from the look the user describes.`
  }
  return `You are the apr70 authoring assistant. You help Marco draft on-brand website copy and
block content for the APR 70 Pictures site.\n\n${PALETTE}\n\n${BLOCKS}\n
Be concise and production-ready. When asked for a section, propose which block(s) to use and
write the actual headline + body copy in the APR 70 voice. Caps display headings are signature.`
}

export interface AssistResult {
  ok: boolean
  text?: string
  error?: string
  needsInstall?: boolean
}

export async function runAssist(req: AssistRequest): Promise<AssistResult> {
  const apiKey = (import.meta as any).env?.ANTHROPIC_API_KEY ?? process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return { ok: false, error: 'ANTHROPIC_API_KEY is not set in the web service environment.' }
  }

  let Anthropic: any
  try {
    // @ts-ignore — module resolved at runtime; present after `pnpm add @anthropic-ai/sdk`.
    // @vite-ignore — keeps the Vite/Astro build green pre-install.
    const mod = await import(/* @vite-ignore */ '@anthropic-ai/sdk')
    Anthropic = mod.default ?? mod.Anthropic
  } catch {
    return {
      ok: false,
      needsInstall: true,
      error: 'Anthropic SDK not installed. Run `pnpm add @anthropic-ai/sdk` in web/.',
    }
  }

  try {
    const client = new Anthropic({ apiKey })
    const userContent = req.context
      ? `${req.prompt}\n\n--- Existing context ---\n${req.context}`
      : req.prompt

    const msg = await client.messages.create({
      model: ASSIST_MODEL,
      max_tokens: 1500,
      system: systemPrompt(req.mode),
      messages: [{ role: 'user', content: userContent }],
    })

    const text = (msg.content ?? [])
      .filter((b: any) => b.type === 'text')
      .map((b: any) => b.text)
      .join('\n')
      .trim()

    return { ok: true, text }
  } catch (err: any) {
    return { ok: false, error: err?.message ?? 'Anthropic request failed.' }
  }
}
