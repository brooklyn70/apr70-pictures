/**
 * Troupe Presents page (/troupe) — types and static fallback layout.
 *
 * The `troupe` Payload global does not exist until migration
 * cms/src/migrations/20260705_troupe_page.ts is applied at merge time, so the
 * page MUST render completely without the CMS. TROUPE_FALLBACK_BLOCKS mirrors
 * the seed layout in cms/scripts/migrate-v2/seed-troupe.ts — keep in sync.
 *
 * DRAFT COPY (v01): every string below is draft for Marco's edit. It is
 * spoiler-safe against the radio script's "does not reveal" list.
 */

import type { Home, Media } from 'payload-types'

export type GeneratedLayoutBlock = NonNullable<Home['layout']>[number]

export type PlaybillVoice = {
  voice: string
  descriptor?: string | null
  roles: string
  note?: string | null
  id?: string | null
}

/** Playbill block shape (types regenerate after `payload generate:types` post-merge). */
export type PlaybillBlockData = {
  programNumber?: string | null
  title: string
  subtitle?: string | null
  runtime?: string | null
  sceneCount?: number | null
  status: 'in-production' | 'coming-soon' | 'released'
  posterImage?: (number | null) | Media
  artwork?: ('on-air' | 'microphone' | 'script') | null
  voices?: PlaybillVoice[] | null
  notes?: string | null
  id?: string | null
  blockName?: string | null
  blockType: 'playbill'
}

export type TroupeLayoutBlock = GeneratedLayoutBlock | PlaybillBlockData

type LexicalDoc = {
  root: {
    type: string
    children: { type: any; version: number; [k: string]: unknown }[]
    direction: ('ltr' | 'rtl') | null
    format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | ''
    indent: number
    version: number
  }
  [k: string]: unknown
}

/** Minimal Lexical doc: one paragraph per input line (mirrors cms createSimpleLexical). */
function lex(text: string): LexicalDoc {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: null,
      children: text
        .split('\n')
        .filter((l) => l.trim().length > 0)
        .map((line) => ({
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          children: [{ type: 'text', text: line, version: 1 }],
        })),
    },
  }
}

export const TROUPE_FALLBACK_BLOCKS: TroupeLayoutBlock[] = [
  {
    blockType: 'hero',
    variant: 'default',
    heading: 'THE APR 70 TROUPE\nPRESENTS',
    subtext: 'No. 1 — L.A. Dolce Vita. A radio drama for seven voices and a clock.',
    division: 'pictures-310',
  },
  {
    blockType: 'playbill',
    programNumber: 'No. 1',
    title: 'L.A. DOLCE VITA',
    subtitle: 'Il Primo Giorno — a radio drama for seven voices and a clock',
    runtime: 'About 15 minutes',
    sceneCount: 16,
    status: 'in-production',
    artwork: 'on-air',
    voices: [
      { voice: 'Voice One', descriptor: 'M, 45-60', roles: 'The Host · Newsreader · Inspector Lucchese' },
      { voice: 'Voice Two', descriptor: 'M, 40s', roles: 'Marcello di Bari', note: 'Lead. No doubling.' },
      { voice: 'Voice Three', descriptor: 'F, 18-25', roles: 'Aimee Pearl', note: 'Lead. No doubling.' },
      { voice: 'Voice Four', descriptor: 'F, 25-35', roles: 'Kokó Yi-Kim · Aurora · Telemundo Anchor' },
      { voice: 'Voice Five', descriptor: 'M, 55-75', roles: 'Senator "Big Jim" Thomson · Frank Pearl · Al Weinstein' },
      { voice: 'Voice Six', descriptor: 'M, 20s-30s', roles: 'Jojo Brody · Agent One · Gianni · Ciro · Waiter · Tony · RAI Anchor' },
      { voice: 'Voice Seven', descriptor: 'F, range', roles: 'Emily Pearl · Elizabeth Hartly · Station PA · Second Anchor' },
    ],
    notes:
      'Adapted for sound from Episode 101 of L.A. Dolce Vita, Season One. Performed by seven players, a clock, and the sounds of the actual world.',
  },
  {
    blockType: 'stats',
    columns: '4',
    stats: [
      { value: '7', label: 'Voices', colorToken: '310-imax' },
      { value: '16', label: 'Scenes', colorToken: '310-imax' },
      { value: '3', label: 'Time zones', colorToken: '310-imax' },
      { value: '1', label: 'Clock', colorToken: '310-imax' },
    ],
  },
  {
    blockType: 'divider',
    label: '// THE PROGRAM',
    spacing: 'normal',
  },
  {
    blockType: 'twoCol',
    leftHeading: 'THE STORY',
    rightBody: lex(
      'One story, three places at once, ten days in February — this is the first day. On a family ranch in the Arizona desert, a wedding ends with a secret stopped half a sentence short. In Rome, a gossip columnist who owns no cell phone boards a legendary train dressed for Carnevale. And in East Los Angeles, a senator’s homecoming rally goes off script in front of ten thousand raised telephones.\n' +
        'By nightfall the strands are pulling toward each other. A scandal is born live on a phone stream, and one question crosses every language on earth. A stranger in the dining car stays one step ahead of the timetable. A young woman prepares to ride west with a shoebox full of questions and half a name. Nobody at the rally, on the train, or on the ranch knows they are in the same story yet. The listener does.\n' +
        'Three time zones, one clock. Every cut is stamped in local time and Universal Time, and the Host speaks the stitch aloud — when we cut, the clock tells you where you stand.',
    ),
    ratio: '1-2',
    alignment: 'top',
  },
  {
    blockType: 'twoCol',
    leftHeading: 'VOICES FIRST',
    rightBody: lex(
      'The APR 70 Troupe works in the Mercury Theatre lineage: a resident company, a numbered program, one finished artifact at a time. Voices first, pictures after — the radio play is the proof of the story, made before any camera rolls.\n' +
        'Every part is played by a human actor in a room. No synthetic voices. Our people play many parts, in the old tradition.',
    ),
    ratio: '1-2',
    alignment: 'top',
  },
  {
    blockType: 'divider',
    label: '// HOW WE MAKE IT',
    spacing: 'normal',
  },
  {
    blockType: 'richText',
    megaScale: false,
    content: lex(
      'We make it the way small companies have always made it: bradded scripts, index cards on a corkboard, and the gear we already own. Rehearse until the doubling disappears, then record — with friends, with borrowed microphones, with an iPhone where an iPhone will do.\n' +
        'What matters is the finished artifact: fifteen minutes you can hold to your ear. When it is ready, it lands — not before.',
    ),
  },
  {
    blockType: 'quotes',
    layout: 'stacked',
    quotes: [
      {
        quote: 'Our people play many parts, in the old tradition, and we will not tell you which.',
        attribution: 'The Host, closing No. 1',
      },
    ],
  },
  {
    blockType: 'cta',
    heading: 'The Troupe will return.',
    subtext: 'Program No. 1 is in production. Follow the build on DISPATCH, or write to us.',
    buttons: [
      { label: 'Read DISPATCH', url: '/news', variant: 'solid' },
      { label: 'Contact', url: '/contact', variant: 'ghost' },
    ],
  },
]
