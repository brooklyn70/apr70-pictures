/**
 * V4 zine copy — compiled-in content source.
 *
 * Every string here comes from the V4 Site Copy Bundle
 * ("site-copy-v4-2026-07-05-DRAFT.md", Marco's canon). No invented copy.
 * Spelling canon: "L.A. Dolce Vita", "Sea Gate", "Da Hook" (no apostrophe).
 * Issues numbered, never dated. No emoji.
 *
 * Public-safe: the bundle's internal ruling notes (Da Hook MacGuffin/recast
 * parentheticals, Shadowmaster "Season arc TBD", U Bruculinu gallery-art +
 * Walsh research-only notes) are stripped, per the bundle's own editor notes.
 * The "(draft — unapproved)" status renders as the small-caps "working draft"
 * tag on zineSynopsis blocks — never as internal notes.
 *
 * Used by:
 *  - web pages as complete static fallback when the Payload row is absent
 *    or not yet re-arranged to v4;
 *  - cms/scripts/apply-v4-content.ts as the upsert payload (content truth is
 *    the Payload DB; this module keeps both surfaces on one source).
 */

// ── Block data shapes (structural; payload-types generation is blocked by the
//    numeric "212"/"310" global slugs, so these mirror the cms block configs) ──

export type ZineLinkData = {
  label: string
  href: string
  id?: string | null
}

export type ZineMastheadData = {
  blockType: 'zineMasthead'
  id?: string | null
  blockName?: string | null
  title: string
  officesLine?: string | null
  issueLabel?: string | null
  dek?: string | null
}

export type ZinePassageData = {
  blockType: 'zinePassage'
  id?: string | null
  blockName?: string | null
  kicker?: string | null
  heading: string
  lede?: string | null
  /** Plain text. Blank line = new paragraph. */
  body?: string | null
  links?: ZineLinkData[] | null
}

export type ZineSynopsisData = {
  blockType: 'zineSynopsis'
  id?: string | null
  blockName?: string | null
  kicker?: string | null
  title: string
  workingDraft?: boolean | null
  logline?: string | null
  /** Plain text. Blank line = new paragraph. */
  body: string
  note?: string | null
}

export type ZineBlockData = ZineMastheadData | ZinePassageData | ZineSynopsisData

// ── V4 FRONT-DOOR block shapes (Wave B) ──────────────────────────────────────
// Bespoke, text-forward front-door blocks matching the approved Screening Room
// mockup (design-source/directions/direction-a-screening-room.html). Each maps
// to one section of the front door; all render as zero-JS Astro components and
// carry stable `data-motion` hooks the T1 motion module (screening-room.ts)
// selects. Copy is Draft 3 VERBATIM. No em dashes in running copy; issues
// numbered, never dated.

export type FrontNameplateData = {
  blockType: 'frontNameplate'
  id?: string | null
  blockName?: string | null
  /** Stacked wordmark, two lines. The full stop after lineTwo is the orange accent. */
  lineOne: string
  lineTwo: string
  /** Chrome sub-line (SPEC §0: an ENTERTAINMENT company). */
  subLine: string
  location: string
  /** THREE DIVISIONS / ONE PARENT COMPANY / ONE STANDARD (mono, tracked). */
  indicia: string[]
}

export type FrontIdentityData = {
  blockType: 'frontIdentity'
  id?: string | null
  blockName?: string | null
  /** Rendered in the accent (orange). */
  firstSentence: string
  rest: string
}

export type FrontDispatchData = {
  blockType: 'frontDispatch'
  id?: string | null
  blockName?: string | null
  label: string
  number: string
  from: string
  note: string
  cta: ZineLinkData
}

export type FrontCoverLine = { text: string; ghost?: boolean }
export type FrontCoverline = { num: string; title: string; text: string }

export type FrontCoverData = {
  blockType: 'frontCover'
  id?: string | null
  blockName?: string | null
  eyebrow: string
  display: FrontCoverLine[]
  deck: string
  cta: ZineLinkData
  plate: {
    src: string
    srcset: string
    width: number
    height: number
    alt: string
    /** Quiet period caption (PD credit line). */
    credit: string
  }
  coverlines: FrontCoverline[]
}

export type FrontDoor = {
  tone: '212' | '310' | 'nrc'
  num: string
  logo: string
  logoAlt: string
  name: string
  tagline: string
  mandate: string
  foot: string
  href: string
}

export type FrontDoorsData = {
  blockType: 'frontDoors'
  id?: string | null
  blockName?: string | null
  heading: string
  keycode: string
  doors: FrontDoor[]
}

export type FrontSlateRow = {
  idx: string
  title: string
  division: string
  format: string
  href: string
  tone: '212' | '310' | 'nrc'
}

export type FrontSlateData = {
  blockType: 'frontSlate'
  id?: string | null
  blockName?: string | null
  heading: string
  lede: string
  rows: FrontSlateRow[]
}

export type FrontAboutData = {
  blockType: 'frontAbout'
  id?: string | null
  blockName?: string | null
  window: string
  body: string
  rule: string
}

export type FrontDoorBlockData =
  | FrontNameplateData
  | FrontIdentityData
  | FrontDispatchData
  | FrontCoverData
  | FrontDoorsData
  | FrontSlateData
  | FrontAboutData

/** Split a plain-text body into paragraphs (blank-line separated). */
export function toParagraphs(body: string | null | undefined): string[] {
  return (body ?? '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}

// ── DISPATCH masthead (bundle: HOME / MASTHEAD) ──────────────────────────────
// NOTE: the FRONT DOOR nameplate is APR 70 PICTURES. (see V4_FRONT_DOOR_BLOCKS);
// this DISPATCH masthead is the numbered-issue destination, rendered on /news
// (web/src/pages/news/index.astro). Dek carries the current standing identity
// line (stale "We don't make work for rooms…" copy purged, 2026-07-06 Wave B).

export const V4_MASTHEAD: ZineMastheadData = {
  blockType: 'zineMasthead',
  title: 'DISPATCH',
  officesLine: 'From the offices of APR 70 Pictures, Long Island City, New York.',
  issueLabel: 'No. 1',
  dek: "Seven actors around real microphones. Index cards on a wall in Long Island City. We make pictures for audiences who've been waiting: crime and documentary built out of the five boroughs, elevated genre for global television, auteur features that trade formula for conviction.",
}

// ── V4 FRONT DOOR (Draft 3 verbatim) ─────────────────────────────────────────
// The approved Screening Room front door: nameplate + identity strip + dispatch
// band + cover story + three doors + the slate + about window. Footer chrome
// (colophon marks, investor line, boilerplate) lives in Footer.astro and is NOT
// duplicated here.

const V4_NAMEPLATE: FrontNameplateData = {
  blockType: 'frontNameplate',
  lineOne: 'APR 70',
  lineTwo: 'PICTURES',
  subLine: 'AN ENTERTAINMENT COMPANY · FILM · TELEVISION · THEATER · RADIO · BOOKS',
  location: 'Long Island City, New York.',
  indicia: ['Three Divisions', 'One Parent Company', 'One Standard'],
}

const V4_IDENTITY: FrontIdentityData = {
  blockType: 'frontIdentity',
  firstSentence: 'Seven actors around real microphones.',
  rest: "Index cards on a wall in Long Island City. We make pictures for audiences who've been waiting: crime and documentary built out of the five boroughs, elevated genre for global television, auteur features that trade formula for conviction.",
}

const V4_DISPATCH_BAND: FrontDispatchData = {
  blockType: 'frontDispatch',
  label: 'Dispatch',
  number: 'No. 1',
  from: 'From the offices of APR 70 Pictures, Long Island City, New York.',
  note: 'Issues numbered, never dated',
  cta: { label: 'Read the issue', href: '/news' },
}

const V4_COVER: FrontCoverData = {
  blockType: 'frontCover',
  eyebrow: 'The APR 70 Troupe Presents No. 1',
  display: [{ text: 'L.A.' }, { text: 'Dolce' }, { text: 'Vita', ghost: true }],
  deck: 'A radio drama for seven voices and a clock. When we cut, the clock will tell you where you stand. Listen for it.',
  cta: { label: 'Program No. 1 plays here', href: '/troupe' },
  plate: {
    src: '/pd/script-owi-rehearsal-1942/script-owi-rehearsal-1942-crop-1000.jpg',
    srcset:
      '/pd/script-owi-rehearsal-1942/script-owi-rehearsal-1942-crop-480.jpg 480w, ' +
      '/pd/script-owi-rehearsal-1942/script-owi-rehearsal-1942-crop-1000.jpg 1000w, ' +
      '/pd/script-owi-rehearsal-1942/script-owi-rehearsal-1942-crop-2000.jpg 2000w',
    width: 2000,
    height: 1496,
    alt: 'Actors reading script pages at a radio microphone during an Office of War Information rehearsal, 1942.',
    credit: 'Office of War Information, 1942 · Library of Congress',
  },
  coverlines: [
    {
      num: '02',
      title: 'Three Doors',
      text: '(212): the five boroughs at street level. (310): Los Angeles, and every market a signal reaches. New Renaissance Cinema: feature films built for permanence.',
    },
    {
      num: '03',
      title: 'The Slate, On Record',
      text: "Draft synopses from every desk. The boroughs, the coasts, the feature slate. On the record before it's on the screen.",
    },
  ],
}

const V4_DOORS: FrontDoorsData = {
  blockType: 'frontDoors',
  heading: 'Three Doors',
  keycode: 'DIVISIONS // 212 · 310 · NRC',
  doors: [
    {
      tone: '212',
      num: 'DOOR 01',
      logo: '/brand/apr70-logos/212-pictures/212_hero.svg',
      logoAlt: '(212) Pictures',
      name: '(212) Pictures',
      tagline: "Everything you want. Everything you don't want.",
      mandate: 'East Coast. New York first. Every format the city touches.',
      foot: 'New York · East Coast',
      href: '/212',
    },
    {
      tone: '310',
      num: 'DOOR 02',
      logo: '/brand/apr70-logos/310-pictures/310_hero.svg',
      logoAlt: '(310) Pictures',
      name: '(310) Pictures',
      tagline: 'Los Angeles, and every market a signal reaches.',
      mandate: 'West Coast and global television.',
      foot: 'Los Angeles · Global',
      href: '/310',
    },
    {
      tone: 'nrc',
      num: 'DOOR 03',
      logo: '/brand/apr70-logos/new-renaissance-cinema/nrc_v3.svg',
      logoAlt: 'New Renaissance Cinema',
      name: 'New Renaissance Cinema',
      tagline: 'Feature films, by mandate.',
      mandate: 'Auteur-driven, morally clear, built for permanence rather than a release window.',
      foot: 'Feature Films',
      href: '/nrc',
    },
  ],
}

const V4_SLATE: FrontSlateData = {
  blockType: 'frontSlate',
  heading: 'The Slate, On Record',
  lede: "On the record before it's on the screen.",
  rows: [
    { idx: 'S.01', title: 'The Mayors', division: '(212)', format: 'Documentary · 11 Episodes', href: '/work/mayors', tone: '212' },
    { idx: 'S.02', title: 'Movement', division: '(212)', format: 'Series', href: '/work/movement', tone: '212' },
    { idx: 'S.03', title: 'Sea Gate', division: '(212)', format: 'Episodic', href: '/work/sea-gate', tone: '212' },
    { idx: 'S.04', title: 'Da Hook', division: '(212)', format: 'Episodic · Radio Parallel', href: '/work/falcon', tone: '212' },
    { idx: 'S.05', title: 'A Need Grows in Brooklyn', division: 'NRC · (212) Co-Prod', format: 'Feature', href: '/work/brooklyn', tone: 'nrc' },
    { idx: 'S.06', title: 'Shadowmaster', division: 'NRC · Series to (310)', format: 'Feature First', href: '/work/shadowmaster', tone: 'nrc' },
    { idx: 'S.07', title: 'U Bruculinu', division: 'NRC', format: 'Feature, Probable', href: '/work/ubrucculinu', tone: 'nrc' },
  ],
}

const V4_ABOUT: FrontAboutData = {
  blockType: 'frontAbout',
  window: 'A window lit at two in the morning in Long Island City. Somebody is still reading.',
  body: "APR 70 Pictures is a film and television production company. Three divisions, one parent company, one standard. The work earns its position or it doesn't get made.",
  rule: 'The audience first, always. Not our slate... their evening.',
}

/** Complete front door, compiled in — used when the Home global is absent or
 *  its layout does not yet carry the v4 front-door blocks. Also the upsert
 *  payload for the Home global (cms/scripts/apply-v4-content.ts). */
export const V4_FRONT_DOOR_BLOCKS: FrontDoorBlockData[] = [
  V4_NAMEPLATE,
  V4_IDENTITY,
  V4_DISPATCH_BAND,
  V4_COVER,
  V4_DOORS,
  V4_SLATE,
  V4_ABOUT,
]

// ── DIVISIONS (bundle: DIVISIONS; primary canon copy, not the ALT variants) ──

export const V4_DIVISION_PASSAGES: Record<'212' | '310' | 'nrc', ZinePassageData> = {
  '212': {
    blockType: 'zinePassage',
    kicker: 'New York · East Coast',
    heading: '(212) Pictures',
    lede: 'East Coast. New York first — every format the city touches.',
    body: 'New York television — crime, drama, documentary — at the level of specificity the city demands. Not a postcard version or a backdrop. The five boroughs are a living subject: the people, the pressure, the detail that only comes from being embedded in it.\n\nFilm co-productions, streaming series, documentary, radio and audio drama, theater, publishing.',
    links: [{ label: 'The Slate, On Record', href: '/work' }],
  },
  '310': {
    blockType: 'zinePassage',
    kicker: 'Los Angeles · Global',
    heading: '(310) Pictures',
    lede: 'West Coast and global television.',
    body: "Television built for audiences who travel. Political thrillers, science fiction, hybrid formats that interrogate genre without abandoning it. Operating out of Los Angeles with reach into international markets — elevated work that doesn't talk down to the room.",
    links: [{ label: 'The Slate, On Record', href: '/work' }],
  },
  nrc: {
    blockType: 'zinePassage',
    kicker: 'Feature Films',
    heading: 'New Renaissance Cinema',
    lede: 'Feature films, by mandate — every APR 70 feature carries the NRC banner; the territory division joins as co-production.',
    body: 'Feature films. Auteur-driven, morally clear, built for permanence rather than a release window. New Renaissance Cinema exists because film deserves its own conversation. It is a different thing entirely — not a faster version of television or a longer episode.',
    links: [{ label: 'The Slate, On Record', href: '/work' }],
  },
}

// ── V4 DIVISION PAGE BLOCKS (Wave F) ─────────────────────────────────────────
// Bespoke, text-forward division blocks that build /212, /310, /nrc out to the
// front-door standard: a division masthead (hero logo at real scale + name +
// tagline + mandate), the Draft-3 section copy VERBATIM, a division slate of
// linked properties, and a cross-doors strip to the other two divisions. Each
// renders as a zero-JS Astro component, token-styled so every theme's rebinds
// carry through, and carries stable `data-motion` hooks the screening-room
// module already selects (slate/slate-row, doors/door/door-logo). Division
// accent: (212) amber, (310) teal/IMAX, NRC off-white grey. Copy VERBATIM from
// Draft 3 (DIVISIONS section). No em dashes in running copy; "..." style.

export type DivisionTone = '212' | '310' | 'nrc'

export type DivisionPlate = {
  src: string
  srcset?: string | null
  width?: number | null
  height?: number | null
  alt: string
  /** Quiet PD credit line (SPEC §5). */
  credit: string
}

export type DivisionMastheadData = {
  blockType: 'divisionMasthead'
  id?: string | null
  blockName?: string | null
  tone: DivisionTone
  /** Mono chrome strip, e.g. "DIVISION 01 // (212) PICTURES · NEW YORK". */
  keycode: string
  /** Local /brand/ hero SVG — displayed at real scale (>=140px desktop). */
  logo: string
  logoAlt: string
  name: string
  tagline?: string | null
  mandate: string
  /** Optional PD plate (212 uses the Abbott El, 1936). */
  plate?: DivisionPlate | null
}

export type DivisionSectionData = {
  blockType: 'divisionSection'
  id?: string | null
  blockName?: string | null
  tone: DivisionTone
  kicker: string
  /** Opening sentence, set large (Draft 3 verbatim). */
  lede: string
  /** Plain text; blank line = new paragraph. Draft 3 verbatim. */
  body: string
  /** Optional formats line (212 only, Draft 3 verbatim). */
  formatsLabel?: string | null
  formats?: string | null
}

export type DivisionSlateRow = {
  idx: string
  title: string
  division: string
  format: string
  href: string
  tone: DivisionTone
}

export type DivisionSlateData = {
  blockType: 'divisionSlate'
  id?: string | null
  blockName?: string | null
  tone: DivisionTone
  heading: string
  lede: string
  rows: DivisionSlateRow[]
}

export type DivisionCrossDoor = {
  tone: DivisionTone
  logo: string
  logoAlt: string
  name: string
  line: string
  href: string
}

export type DivisionCrossDoorsData = {
  blockType: 'divisionCrossDoors'
  id?: string | null
  blockName?: string | null
  heading: string
  keycode: string
  doors: DivisionCrossDoor[]
}

export type DivisionBlockData =
  | DivisionMastheadData
  | DivisionSectionData
  | DivisionSlateData
  | DivisionCrossDoorsData

// Local brand SVGs (never /api/media — see the division pages' logo fallback).
const DIVISION_LOGO: Record<DivisionTone, { hero: string; alt: string; name: string; line: string; href: string }> = {
  '212': {
    hero: '/brand/apr70-logos/212-pictures/212_hero.svg',
    alt: '(212) Pictures',
    name: '(212) Pictures',
    line: 'East Coast. New York first. Every format the city touches.',
    href: '/212',
  },
  '310': {
    hero: '/brand/apr70-logos/310-pictures/310_hero.svg',
    alt: '(310) Pictures',
    name: '(310) Pictures',
    line: 'West Coast and global television.',
    href: '/310',
  },
  nrc: {
    hero: '/brand/apr70-logos/new-renaissance-cinema/nrc_v3.svg',
    alt: 'New Renaissance Cinema',
    name: 'New Renaissance Cinema',
    line: 'Feature films, by mandate.',
    href: '/nrc',
  },
}

/** The two OTHER divisions, in canonical 212 · 310 · NRC order. */
function crossDoorsFor(self: DivisionTone): DivisionCrossDoorsData {
  const order: DivisionTone[] = ['212', '310', 'nrc']
  return {
    blockType: 'divisionCrossDoors',
    heading: 'The Other Doors',
    keycode: 'DIVISIONS // 212 · 310 · NRC',
    doors: order
      .filter((t) => t !== self)
      .map((t) => ({
        tone: t,
        logo: DIVISION_LOGO[t].hero,
        logoAlt: DIVISION_LOGO[t].alt,
        name: DIVISION_LOGO[t].name,
        line: DIVISION_LOGO[t].line,
        href: DIVISION_LOGO[t].href,
      })),
  }
}

const V4_DIVISION_MASTHEADS: Record<DivisionTone, DivisionMastheadData> = {
  '212': {
    blockType: 'divisionMasthead',
    tone: '212',
    keycode: 'DIVISION 01 // (212) PICTURES · NEW YORK',
    logo: DIVISION_LOGO['212'].hero,
    logoAlt: '(212) Pictures',
    name: '(212) Pictures',
    tagline: "Everything you want. Everything you don't want.",
    mandate: 'East Coast. New York first. Every format the city touches.',
    plate: {
      src: '/pd/nyc-el-72nd-1936/nyc-el-72nd-1936-crop-1000.jpg',
      srcset:
        '/pd/nyc-el-72nd-1936/nyc-el-72nd-1936-crop-480.jpg 480w, ' +
        '/pd/nyc-el-72nd-1936/nyc-el-72nd-1936-crop-1000.jpg 1000w, ' +
        '/pd/nyc-el-72nd-1936/nyc-el-72nd-1936-crop-2000.jpg 2000w',
      width: 2000,
      height: 1648,
      alt: 'Elevated train station at 72nd Street and Columbus Avenue, New York, 1936.',
      credit: 'Berenice Abbott, Changing New York (WPA), 1936 · The New York Public Library',
    },
  },
  '310': {
    blockType: 'divisionMasthead',
    tone: '310',
    keycode: 'DIVISION 02 // (310) PICTURES · LOS ANGELES',
    logo: DIVISION_LOGO['310'].hero,
    logoAlt: '(310) Pictures',
    name: '(310) Pictures',
    tagline: null,
    mandate: 'West Coast and global television.',
    plate: null,
  },
  nrc: {
    blockType: 'divisionMasthead',
    tone: 'nrc',
    keycode: 'DIVISION 03 // NEW RENAISSANCE CINEMA · FEATURE FILMS',
    logo: DIVISION_LOGO.nrc.hero,
    logoAlt: 'New Renaissance Cinema',
    name: 'New Renaissance Cinema',
    tagline: null,
    mandate:
      'Feature films, by mandate. Every APR 70 feature carries the NRC banner; the territory division joins as co-production.',
    plate: null,
  },
}

// Section copy — Draft 3 DIVISIONS section, VERBATIM. Lede = the opening
// sentence; body split into paragraphs only at existing sentence boundaries
// (no word changed). "..." style, no em dashes.
const V4_DIVISION_SECTIONS: Record<DivisionTone, DivisionSectionData> = {
  '212': {
    blockType: 'divisionSection',
    tone: '212',
    kicker: 'New York · East Coast',
    lede: 'The El roars over the corner and nobody stops talking.',
    body:
      'New York television: crime, drama, documentary, borough-specific, produced at street level, with the kind of detail that only comes from being in the room.\n\n' +
      "The five boroughs have a texture that most productions smooth over. (212) Pictures doesn't.",
    formatsLabel: 'Formats',
    formats:
      'Film co-productions, streaming series, documentary, radio and audio drama, theater, publishing.',
  },
  '310': {
    blockType: 'divisionSection',
    tone: '310',
    kicker: 'Los Angeles · Global',
    lede: 'Los Angeles, and every market a signal reaches.',
    body:
      'Television built for audiences who travel. Political thrillers, science fiction, hybrid formats that interrogate genre without abandoning it.\n\n' +
      'Wider geography, wider formal range, and the same hard edge underneath.',
    formatsLabel: null,
    formats: null,
  },
  nrc: {
    blockType: 'divisionSection',
    tone: 'nrc',
    kicker: 'Feature Films',
    lede: 'Feature films.',
    body:
      'Auteur-driven, morally clear, built for permanence rather than a release window. The greatest art is born inside clear boundaries.\n\n' +
      'Old Hollywood had rules about what could be shown, so they leaned on subtext, atmosphere, and ingenious writing. We strip away the easy shocks... gratuitous violence, cheap profanity, empty provocation... and force the story to do the heavy lifting.\n\n' +
      'Adult subject matter is allowed; the execution is what is constrained. The touchstones are Rocky (1976) and 8 1/2 (1963): adult, masterful, and clean, watchable across generations.\n\n' +
      'New Renaissance Cinema develops the kind of work that forces a conversation and holds it.',
    formatsLabel: null,
    formats: null,
  },
}

// Division slates — properties as slate rows linking to /work/<slug>. Slugs
// follow v4.ts + the live CMS (falcon = Da Hook; ladolcevita = L.A. Dolce Vita).
// Division assignments are canon-correct per v4.ts: brooklyn is NRC-lead /
// (212) co-production; shadowmaster is NRC feature with a (310) series spawn.
const V4_DIVISION_SLATES: Record<DivisionTone, DivisionSlateData> = {
  '212': {
    blockType: 'divisionSlate',
    tone: '212',
    heading: 'The Slate, On Record',
    lede: "On the record before it's on the screen.",
    rows: [
      { idx: 'S.01', title: 'The Mayors', division: '(212)', format: 'Documentary · 11 Episodes', href: '/work/mayors', tone: '212' },
      { idx: 'S.02', title: 'Movement', division: '(212)', format: 'Series', href: '/work/movement', tone: '212' },
      { idx: 'S.03', title: 'Sea Gate', division: '(212)', format: 'Episodic', href: '/work/sea-gate', tone: '212' },
      { idx: 'S.04', title: 'Da Hook', division: '(212)', format: 'Episodic · Radio Parallel', href: '/work/falcon', tone: '212' },
      { idx: 'S.05', title: 'A Need Grows in Brooklyn', division: 'NRC · (212) Co-Production', format: 'Feature', href: '/work/brooklyn', tone: 'nrc' },
    ],
  },
  '310': {
    blockType: 'divisionSlate',
    tone: '310',
    heading: 'The Slate, On Record',
    lede: "On the record before it's on the screen.",
    rows: [
      { idx: 'S.01', title: 'L.A. Dolce Vita', division: '(310)', format: 'Troupe Presents No. 1', href: '/work/ladolcevita', tone: '310' },
      { idx: 'S.02', title: 'Shadowmaster', division: 'NRC · Series Spawn to (310)', format: 'Feature First', href: '/work/shadowmaster', tone: 'nrc' },
    ],
  },
  nrc: {
    blockType: 'divisionSlate',
    tone: 'nrc',
    heading: 'The Slate, On Record',
    lede: "On the record before it's on the screen.",
    rows: [
      { idx: 'S.01', title: 'A Need Grows in Brooklyn', division: 'NRC Lead · (212) Co-Production', format: 'Feature', href: '/work/brooklyn', tone: 'nrc' },
      { idx: 'S.02', title: 'Shadowmaster', division: 'NRC · Series to (310)', format: 'Feature First', href: '/work/shadowmaster', tone: 'nrc' },
      { idx: 'S.03', title: 'U Bruculinu', division: 'NRC', format: 'Feature, Probable', href: '/work/ubrucculinu', tone: 'nrc' },
    ],
  },
}

/** Complete division-page block stack, compiled in — the fallback used when the
 *  Payload division layout does not yet carry the v4 division blocks (detected
 *  by `divisionMasthead`). Order: masthead, section copy, slate, cross-doors. */
export const V4_DIVISION_BLOCKS: Record<DivisionTone, DivisionBlockData[]> = {
  '212': [V4_DIVISION_MASTHEADS['212'], V4_DIVISION_SECTIONS['212'], V4_DIVISION_SLATES['212'], crossDoorsFor('212')],
  '310': [V4_DIVISION_MASTHEADS['310'], V4_DIVISION_SECTIONS['310'], V4_DIVISION_SLATES['310'], crossDoorsFor('310')],
  nrc: [V4_DIVISION_MASTHEADS.nrc, V4_DIVISION_SECTIONS.nrc, V4_DIVISION_SLATES.nrc, crossDoorsFor('nrc')],
}

// ── PROPERTIES (bundle: PROPERTIES — the 7 draft synopses, verbatim,
//    internal ruling notes stripped per the bundle's editor notes) ───────────

export type V4Property = {
  slug: string
  title: string
  division: '212' | '310' | 'nrc'
  /** Project.subtitle — the format line. */
  subtitle: string
  synopsis: ZineSynopsisData
}

export const V4_PROPERTIES: V4Property[] = [
  {
    slug: 'mayors',
    title: 'The Mayors',
    division: '212',
    subtitle: 'Documentary series, 11 episodes',
    synopsis: {
      blockType: 'zineSynopsis',
      kicker: '(212) · Documentary series, 11 episodes',
      title: 'The Mayors',
      workingDraft: true,
      body: [
        "Over seventy-five years, eleven mayors governed New York City. This eleven-episode documentary series reveals how their decisions, policies, power grabs, their corruption, and their ideology transformed America's greatest city from the American Dream to socialist experiment.",
        'The blessing and curse of our Metropolis is time. Twenty years approximately. That\'s how long it takes the city to put on a new face; where glass towers replace brick, where streets change directions, turn into bus and bike lanes or cease to exist altogether and our sidewalks, well they turn into bedrooms for our guests. Everything changes. Nothing remains the same. A blessing and a curse indeed. For native New Yorkers, we watch as "progress" marches us towards oblivion. In the fifties, the city was prosperous, safer, and cleaner, and the American dream was still alive if you sweat and bled for it. By seventies Brooklyn, that city was a memory — like the Dodgers and Luna Park. Episode by episode, the family\'s first-hand accounts juxtapose the city of the past against the city of the present: from Vincent Impellitteri\'s post-war baseline through Wagner, Lindsay, Beame\'s fiscal collapse, Koch, Dinkins, Giuliani — the one Republican exception, who punched back — Bloomberg, de Blasio, and the indicted Eric Adams. Behind them all looms Robert Moses, the master builder who ruled over many mayors, tore down neighborhoods, displaced thousands of families, and built the roads, bridges, parks, and projects the city still lives with.',
        'The method is muckraking journalism — forensic, not hysterical: cause and effect, names and consequences. Shot cinéma vérité with archival material and contemporary interviews — a Ric Burns homage, but not so liberal — each era rendered in its own visual grammar. No narrator tells you what to think; every episode asks what they were trying to achieve, what actually happened, who benefited, and who paid the price.',
        "The series ends where it began, in reverse: Zohran Mamdani, the city's first Democratic Socialist mayor — himself an immigrant — inherits a broken city, and Episode 11 films his first hundred days as they unfold. Who killed New York City? This is the autopsy report.",
      ].join('\n\n'),
    },
  },
  {
    slug: 'movement',
    title: 'Movement',
    division: '212',
    subtitle: 'Series',
    synopsis: {
      blockType: 'zineSynopsis',
      kicker: '(212) · Series',
      title: 'Movement',
      workingDraft: true,
      logline:
        "Seven gifted international students, recruited into a secret class by clues to a campus bomb, are trained through covert missions to defend New York's mayoral election — never suspecting that every mission serves the hidden consortium they believe they are fighting.",
      body: [
        "It is an election year in New York City, and everybody is paying attention. Incumbent Mayor Grace Camarda — the most popular leader the city has elected since La Guardia, and the first woman to hold the office — faces self-made billionaire City Councilman Ben Gilman, a man with bottomless money and nothing else. What the city cannot see is the hand behind him: the Unknown Global Consortium (UGC), the invisible society that has steered the world's economy for centuries.",
        "On a crowded campus that same week, seven gifted international students — among them Jamie Penn, a senator's son and the only American, and Appolonia Lopez Callas, a Basque weapons expert and born leader — receive clues that a bomb has been planted somewhere on the grounds. Told to trust no authority, they trace it together to the Lab for International Specialists, a class that appears on no schedule. The bomb is fictitious; finding it wins them their seats under the Professor, an ambiguous mentor who has groomed young elites for over thirty years — and who secretly serves the UGC.",
        'Season One runs on two clocks. Each episode is a training mission — a crime, a crisis, an infiltration, the quiet steering of a real event — that the seven are assured is righteous. When one of their own reveals a personal tie to the Mayor, the team throws itself into the race to defend democracy from Gilman\'s money. But every mission secretly bends the election his way. As a hard-boiled reporter and an honest District Attorney circle the rumor of a "movement," and Jamie learns his own father graduated the Lab and broke with the Professor, doubt takes root. Camarda wins the vote — and Gilman is installed as her deputy. Either way, the UGC wins. The seven end the season bonded, blooded, and quietly suspicious of the hand that feeds them.',
      ].join('\n\n'),
    },
  },
  {
    slug: 'sea-gate',
    title: 'Sea Gate',
    division: '212',
    subtitle: 'Episodic',
    synopsis: {
      blockType: 'zineSynopsis',
      kicker: '(212) · Episodic',
      title: 'Sea Gate',
      workingDraft: true,
      logline:
        "Jim Lang's whistleblower client drowned in a foot of water. Inside Brooklyn's private town, fraud investigator Lang stays to turn its rulers against one another over the stolen storm-recovery millions … until the only way to walk the woman he loves out clean is to spend himself in the war he built.",
      body: [
        "Sea Gate, Brooklyn. A private gated town at the western tip of Coney Island. It has its own armed police and a board that decides who belongs... and who doesn't. High summer, beach season. The boardwalk carnival screams are a hundred feet from the fence. Even the biggest city in America stops at a boom gate. Behind the wall the streets are silent, rich, and storm-scarred.",
        'Investigator Jim Lang comes through the gate to meet Dave Connell, the Association engineer who can prove tens of millions in storm-recovery money vanished through shell contractors. Connell is drowned in a condemned basement before they speak, a dry life vest on a nail just out of reach. Lang, an ex-NYPD cop who testified against his own precinct, stays. J.B. Ball, the patriarch who built the Association and lost it, becomes his reluctant employer. Lang works the exhausted truce among the three men who touched the money: Chief Vanning of the private police, board president and Albany fixer Oliver Niles, and speculator Chick Williams. A planted word, a swapped envelope, a posed body … the truce cracks into open war.',
        "Mary Dwight, the sharp title-office secretary who keeps the tally of his dead, becomes the love neither planned; Pete Falcone's boardwalk clam stand is the Brooklyn he left behind. As the bodies drop, Lang finds he likes the work, the blood-simple slide Mary tries to pull him back from. His last turn makes the wall eat itself: the board cuts its private army loose, the NYPD rolls through the gate, and the gate's own cops burn down the men who fed them. Vanning falls. Lang, spending himself so Mary walks out clean, goes into the gunfire and does not come back. The last image is hers: Mary in the Coney Island neon, Jim's hat too big, headed for her sister Lena and the baby, up the other side of the tide.",
      ].join('\n\n'),
    },
  },
  {
    slug: 'falcon',
    title: 'Da Hook',
    division: '212',
    subtitle: 'Episodic',
    synopsis: {
      blockType: 'zineSynopsis',
      kicker: '(212) · Episodic',
      title: 'Da Hook',
      workingDraft: true,
      logline:
        'In the Brooklyn spring of 1973, as the city rides the Knicks toward a championship and the Red Hook piers die under the brand-new towers, an investigator whose partner is murdered over a legendary lost prize follows a lying client to the only end his code allows... turning in the woman he loves.',
      body: [
        'Brooklyn, spring 1973. The World Trade Center has just opened across the harbor, the Red Hook piers are emptying out beneath it, and the Knicks are driving toward their second NBA title... a season clock ticking behind every episode. Here an unreadable investigator and his partner take a tail job from a frightened client whose story is a lie. That night the partner is shot dead near the docks; the man she named dies the same night, same caliber. The police want the investigator for both.',
        'The client sheds her cover story but not her secrets. A scented fixer offers five thousand dollars for a legendary lost prize, and a vast, patient collector who has hunted it for years arrives with a silent young gunman and a history speech that turns the prize into myth. A dying ship\'s captain delivers the prize. At the exchange it proves false... flour and weevils where a fortune should be. The collector composes himself and starts again.',
        "Left with three murders and a police clock, the investigator does the arithmetic: the client killed his partner on night one. He lays out his reasons, seven of them, and hands her over, because when a man's partner is killed he does something about it. The El starts again. The city cheers a title. He goes back to the desk.",
        'Limited streaming series with a parallel radio series. Register: French Connection austerity, documentary grit, monochrome discipline.',
      ].join('\n\n'),
    },
  },
  {
    slug: 'brooklyn',
    title: 'A Need Grows in Brooklyn',
    division: 'nrc',
    subtitle: 'NRC lead · (212) co-production · Feature',
    synopsis: {
      blockType: 'zineSynopsis',
      kicker: 'NRC lead · (212) co-production · Feature',
      title: 'A Need Grows in Brooklyn',
      workingDraft: true,
      body: [
        'Summer 1986, 44th Street and Fort Hamilton Parkway, Borough Park, Brooklyn. Marc, a sensitive 17-year-old who dreams of studying acting at NYU, runs with a crew of neighborhood boys: basement Dungeons & Dragons, midnight basketball under the El, petty mischief outside the deli. Semi-autobiographical and shot in documentary realism — heavy 35mm grain, available light, the El train as structural negative space — the season watches its block as closely as its people. The neighborhood is a character. Nothing is cleaned up.',
        "The opening arc (Episodes 1–4) establishes the crew, the corner, and the two poles of Marc's summer: Sunny, the girl who shares his NYU dream, and the adult world of the club that won't let the boys in. The block's casual violence arrives early — the belligerent Housie Mousie forces Marc and Sal into a night of robbery and crack — and when Mousie savagely beats Marc at the exact moment of his first kiss with Sunny, humiliation drives Marc away from her for good.",
        'In the middle arc (Episodes 5–8) the club opens to Marc alone. Older dealers Frank Gee and Mike Murder adopt him, teach him the "art" of boosting, and expose him to Magic Mike\'s PCP kitchen. Marc proves a natural; the fast life escalates even as bodies drop around him — Mousie thrown off a roof, the innocent Jordan killed just walking by — and Marc internalizes the crew\'s shrug: life goes on.',
        "The final arc (Episodes 9–10) collects the bill. A cocaine-and-crack panic lands Marc in a hospital and a desperate promise to God. The club is busted, Marc is arrested, and his mother delivers the news that Sunny is dead. Plea deal, Shock Camp, letters to Millie, a clean HIV test, NYU plans together — a redemption fully staged before Dave Dirt's gun slides off a dashboard and fires, killing Marc instantly. The dominoes were falling from the first episode.",
      ].join('\n\n'),
    },
  },
  {
    slug: 'shadowmaster',
    title: 'Shadowmaster',
    division: 'nrc',
    subtitle: 'Feature first, series spawn to (310)',
    synopsis: {
      blockType: 'zineSynopsis',
      kicker: 'NRC · Feature first, series spawn to (310)',
      title: 'Shadowmaster',
      workingDraft: true,
      logline:
        'In a televised hybrid of esports and live-action drama, elite gamers — the "Shadow Masters" — command real-life human avatars through high-stakes scenarios (underground poker, urban war games, Old West shootouts), but their avatars may defy orders when survival, greed, or conscience takes over — pitting strategy against free will.',
      body: [
        'Shadowmaster is a fully scripted series fusing esports and live-action drama. In a televised competition, elite gamers — the Shadow Masters — operate from isolated control hubs, situation rooms wired with monitoring feeds, issuing real-time commands to human avatars in the field through concealed earpieces and body cams. Each contest drops the avatars into a high-stakes scenario: underground poker dens, urban war games, Old West shootouts.',
        'The catch that drives the drama: the avatars are people, not pixels. Cardsharps with criminal pasts, trained operatives, gunslingers, bounty hunters, and sheriffs — some mercenaries in it for the money, others coerced participants running on survival instinct. Each hears their gamer through a closed mic, but in moments of crisis may obey or defy: sensing a double-cross, refusing a reckless order, cutting a side deal. Flashbacks reveal the secrets, debts, and loyalties that make every avatar unpredictable — and give the show its emotional weight.',
        "Behind the screens, the gamer roster is a study in playstyles: the Hotshot Bluffer, brash and charismatic, built for high-risk reads and aggressive bluffs; the Calculating Tactician, methodical and command-oriented, most exposed when a human's panic or conscience breaks the plan; the Underdog Hacker, the scrappy fan-favorite wildcard who wins on ingenuity, not resources. Their rivalries, alliances, and vendettas evolve as monetary and reputational stakes mount — while online personas mask real-world vulnerabilities.",
        'Each 8–10 episode season explores new scenarios and expands ongoing arcs, building toward a multi-scenario finale where the line between gamer and avatar blurs.',
      ].join('\n\n'),
      note: 'Based on a concept by Stefano Corti; written by Marc Caruso.',
    },
  },
  {
    slug: 'ubrucculinu',
    title: 'U Bruculinu',
    division: 'nrc',
    subtitle: 'Feature, probable',
    synopsis: {
      blockType: 'zineSynopsis',
      kicker: 'NRC · Feature, probable',
      title: 'U Bruculinu',
      workingDraft: true,
      body: [
        'An expatriate returns to his ancestral Sicily in the 1970s seeking a quiet life, only to find that the land — and its people — will not let him be quiet.',
        'He is U Bruculinu — "the Brooklyn man" — the returning exile, at once of this land and a stranger to it. Around him stand U Capo, the local strongman, the old order that decides what is permitted; and A Sorella, the sister, the kinship tie binding him to the village and its expectations.',
        'A sun-worn village world of old customs, old power, and family obligation — quiet sought, quiet refused.',
      ].join('\n\n'),
    },
  },
]

/** Quick lookup: property fallback by slug (also answers /work/sea-gate before the DB has it). */
export const V4_PROPERTY_BY_SLUG: Record<string, V4Property> = Object.fromEntries(
  V4_PROPERTIES.map((p) => [p.slug, p]),
)

/**
 * Canon overlays for the /work listing while the DB still carries pre-v4
 * values (bundle CANON FLAGS 2, 3, 4, 7): titles + divisions only.
 * alphayy: NRC lead per canon flag 3 (no synopsis in the bundle).
 */
export const V4_LISTING_OVERLAY: Record<
  string,
  { title?: string; division?: '212' | '310' | 'nrc'; subtitle?: string }
> = {
  ...Object.fromEntries(
    V4_PROPERTIES.map((p) => [p.slug, { title: p.title, division: p.division, subtitle: p.subtitle }]),
  ),
  alphayy: { division: 'nrc' },
}

// ── FOOTER / BOILERPLATE (bundle: FOOTER / BOILERPLATE) ──────────────────────

export const V4_FOOTER = {
  /** Studio one-liner (Marco verbatim). */
  studioLine: 'APR 70 Pictures. Three divisions. No decorative flourishes. Built to last.',
  /** Division wordlist. */
  divisions: [
    { label: '(212) Pictures', meta: 'New York · East Coast', href: '/212' },
    { label: '(310) Pictures', meta: 'Los Angeles · Global', href: '/310' },
    { label: 'New Renaissance Cinema', meta: 'Feature Films', href: '/nrc' },
  ],
  addressLine: 'Long Island City, New York.',
}

// ── DISPATCH indicia — numbered, never dated (Draft 3 HOME / MASTHEAD:
//    "DISPATCH No. 1. Issues are numbered, never dated. No season, no month,
//    no year on the front door. The number is the only clock." + CANON FLAGS
//    item 10) ──────────────────────────────────────────────────────────────
// Every dated string is purged: no Vol., no season, no month/year. The field
// KEYS (displayTitle/volume/number/season/coverKicker) are kept so
// cms/scripts/apply-v4-content.ts still compiles; their VALUES are numbered
// only. `volume`/`season` are never rendered as a date on the dispatch surface.

export const V4_DISPATCH_INDICIA = {
  displayTitle: 'DISPATCH No. 1',
  /** Repurposed: the nameplate word, not a "Vol." — never a date. */
  volume: 'DISPATCH',
  number: 'No. 1',
  /** Required by the schema; carries the convention, never a season/date. */
  season: 'ISSUES ARE NUMBERED, NEVER DATED',
  coverKicker: 'DISPATCH No. 1',
  /** Masthead indicia line stating the convention. */
  numberedLine: 'ISSUES ARE NUMBERED, NEVER DATED',
  /** Draft 3: "The number is the only clock." */
  clockLine: 'THE NUMBER IS THE ONLY CLOCK',
  offices: 'LONG ISLAND CITY NY',
  reel: 'REEL 086',
}
