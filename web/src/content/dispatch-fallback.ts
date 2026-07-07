/**
 * DISPATCH No. 1 — static fallback issue.
 *
 * Renders the FULL magazine on /news with no CMS row seeded, so staging never
 * shows an empty shell. The DB path (fetchCurrentDispatchIssue) stays primary;
 * this is used ONLY when it returns no current issue.
 *
 * COPY AUDIT (Wave D):
 *  - Numbered, NEVER dated. No Vol./season/month/year/date string anywhere.
 *    "date"-named fields on cards/calendar are repurposed as FORMAT / index
 *    keycodes, never a date. The number is the only clock.
 *  - Spelling canon: L.A. Dolce Vita, Sea Gate, Da Hook, U Bruculinu.
 *  - No em dashes in running copy ("..." style, per writers-room law).
 *  - No invented facts. Every synopsis/logline/section line is grounded in
 *    Draft 3 (site-copy-v4-DRAFT3-2026-07-06.md): HOME/MASTHEAD, DIVISIONS,
 *    PROPERTIES, TROUPE PRESENTS No. 1, ABOUT, FOOTER. The trade "clippings"
 *    are reframed as the company's own on-record desk bulletins (no fabricated
 *    third-party press, bylines, or dates). The "calendar" is the numbered
 *    order of programs, not a dated schedule.
 *  - Cover + feature plates are verified public-domain photographs served from
 *    web/public/pd, each with a quiet period credit line (SPEC §5).
 */
import type { DispatchIssueDoc } from '../lib/payload'
import type { Media } from 'payload-types'
import { V4_DISPATCH_INDICIA } from './v4'

/** Minimal Media-like ref for a public-domain plate served from web/public/pd.
 *  resolveMediaSrcOrPlaceholder() only reads url/alt/width/height. */
function pd(url: string, alt: string): Media {
  return { url, alt } as unknown as Media
}

/** Quiet period credit for the cover plate (SPEC §5 credit style). */
export const DISPATCH_FALLBACK_COVER_CREDIT =
  'Berenice Abbott, Changing New York (WPA), 1936 · New York Public Library'

export const DISPATCH_FALLBACK_ISSUE: DispatchIssueDoc = {
  slug: 'no-1',
  displayTitle: V4_DISPATCH_INDICIA.displayTitle,
  current: true,

  // ── Indicia — numbered only. volume/season carry the convention, never a
  //    date. reel is a mono keycode, not a date. ─────────────────────────────
  indicia: {
    volume: V4_DISPATCH_INDICIA.volume, // 'DISPATCH' — never rendered as "Vol."
    number: V4_DISPATCH_INDICIA.number, // 'No. 1'
    season: V4_DISPATCH_INDICIA.season, // convention line, never a date
    reel: V4_DISPATCH_INDICIA.reel, // 'REEL 086' — keycode
    printRun: 'ON THE RECORD',
    offices: V4_DISPATCH_INDICIA.offices, // 'LONG ISLAND CITY NY'
    tagline: 'NO DECORATIVE FLOURISHES. BUILT TO LAST.',
  },

  // ── Cover ────────────────────────────────────────────────────────────────
  cover: {
    kicker: 'DISPATCH No. 1 · FROM THE OFFICES OF APR 70 PICTURES',
    lines: [
      { text: 'Three', style: 'normal' },
      { text: 'Divisions', style: 'accent' },
      { text: 'One', style: 'outline' },
      { text: 'Standard.', style: 'normal' },
    ],
    deck: "Seven actors around real microphones. Index cards on a wall in Long Island City. We make pictures for audiences who've been waiting: crime and documentary built out of the five boroughs, elevated genre for global television, auteur features that trade formula for conviction.",
    byline: 'FROM THE OFFICES OF APR 70 PICTURES',
    coverImage: pd(
      '/pd/nyc-el-72nd-1936/nyc-el-72nd-1936-crop-1000.jpg',
      'The elevated line over 72nd Street and Columbus Avenue, New York, 1936.',
    ),
    coverlines: [
      {
        num: '01',
        head: 'THE TROUPE PRESENTS No. 1 · L.A. DOLCE VITA',
        deck: 'A radio drama for seven voices and a clock.',
      },
      {
        num: '02',
        head: 'THREE DOORS',
        deck: '(212), (310), New Renaissance Cinema.',
      },
      {
        num: '03',
        head: 'THE SLATE, ON RECORD',
        deck: "Draft synopses from every desk.",
      },
    ],
  },

  // ── Contents ─────────────────────────────────────────────────────────────
  contents: [
    {
      label: 'FEATURES',
      meta: 'PP. 008 -- 020',
      entries: [
        {
          folio: '008',
          title: 'The Number Is the Only Clock',
          deck: 'From the editor. Voices first, film after. Numbered programs, released as finished things.',
          by: 'M.A. CARUSO',
        },
        {
          folio: '012',
          title: 'The Mayors -- One Autopsy',
          deck: 'Eleven mayors, seventy-five years. Muckraking documentary, forensic not hysterical. Who killed New York City?',
          by: '(212) PICTURES',
        },
        {
          folio: '016',
          title: 'L.A. Dolce Vita -- The Troupe Presents No. 1',
          deck: 'One story, three places at once. Ten days in February. This is the first day.',
          by: 'THE APR 70 TROUPE',
        },
      ],
    },
    {
      label: 'DISPATCHES',
      meta: 'PP. 022 -- 030',
      entries: [
        {
          folio: '022',
          title: 'From the (212) Desk',
          deck: 'The five boroughs at street level. The Mayors, Movement, Sea Gate, Da Hook.',
          by: '(212) PICTURES',
        },
        {
          folio: '026',
          title: 'From the (310) Desk',
          deck: 'Every market a signal reaches. Elevated genre for global television.',
          by: '(310) PICTURES',
        },
        {
          folio: '028',
          title: 'From the NRC Desk',
          deck: 'Feature films built for permanence. A Need Grows in Brooklyn, Shadowmaster, U Bruculinu.',
          by: 'NEW RENAISSANCE CINEMA',
        },
      ],
    },
    {
      label: 'DEPARTMENTS',
      meta: 'PP. 032 -- 040',
      entries: [
        {
          folio: '032',
          title: 'The Order of Programs',
          deck: 'Numbered, not dated. The number is the only clock.',
          by: 'THE APR 70 TROUPE',
        },
        {
          folio: '036',
          title: 'Open Calls & Notices',
          deck: 'Human actors only. No unsolicited materials. Write to the offices.',
          by: 'BACK OF BOOK',
        },
        {
          folio: '040',
          title: 'Colophon',
          deck: 'The only credits a press magazine has are its own.',
          by: 'PRODUCTION',
        },
      ],
    },
  ],

  // ── From the Editor ──────────────────────────────────────────────────────
  editorial: {
    eyebrow: 'FROM THE EDITOR · P. 008',
    title: 'The Number Is the Only Clock.',
    lead: 'Voices first, film after. Numbered programs, performed by human actors and released as finished things. No dates, no episodes dropped into a feed. Just No. 1, then No. 2.',
    paragraphs: [
      {
        text: 'DISPATCH No. 1. Issues are numbered, never dated. No season, no month, no year on the front door. The number is the only clock.',
      },
      {
        text: 'The Troupe works in the old tradition: a resident company, seven players and many parts to a player, and we will not tell you which. The radio drama came before the picture once, and it can again. The Troupe will return.',
      },
      {
        text: 'Made the way it sounds: human actors around real microphones, bradded scripts on the table, index cards on the wall, recorded on our own gear, in our own rooms. The sounds are the sounds of the actual world. No AI performances, no AI art, nothing decorative.',
      },
      {
        text: "APR 70 Pictures is a film and television production company. Three divisions, one parent company, one standard. The work earns its position or it doesn't get made.",
      },
      {
        text: 'The audience first, always. Not our slate... their evening.',
      },
    ],
    signatureName: 'M.',
    signatureMeta: 'MARC ANDREW CARUSO · FOUNDER · APR 70 LLC',
    quote: '"Voices first, film after. Just No. 1, then No. 2."',
  },

  // ── Feature (cover story) — The Mayors ───────────────────────────────────
  feature: {
    eyebrow: 'FEATURE · P. 012 · COVER STORY',
    titleParts: [{ text: 'The' }, { text: 'Mayors', italic: true }],
    deck: "Over seventy-five years, eleven mayors governed New York City. This eleven-episode documentary reveals how their policies, their power grabs, their corruption, and their ideology remade America's greatest city, decision by decision, into the city outside your window.",
    meta: [
      { key: 'BYLINE', value: 'M.A. CARUSO' },
      { key: 'DIVISION', value: '(212) PICTURES' },
      { key: 'FORMAT', value: '11 EPISODES' },
      { key: 'METHOD', value: 'MUCKRAKING' },
      { key: 'STATUS', value: 'WORKING DRAFT' },
      { key: 'ON RECORD', value: 'No. 1' },
    ],
    heroImage: pd(
      '/pd/nyc-seventh-ave-1935/nyc-seventh-ave-1935-crop-1000.jpg',
      'Seventh Avenue looking south from 35th Street, New York, 1935.',
    ),
    imageCaption: {
      caption: 'Seventh Avenue looking south from 35th Street... the city the series films.',
      credit: 'Berenice Abbott, Changing New York (WPA), 1935 · New York Public Library',
    },
    paragraphs: [
      {
        variant: 'first',
        text: 'Every twenty years the city puts on a new face. Glass towers replace brick. Streets change direction or cease to exist. Sidewalks turn into bedrooms. In the fifties the city was prosperous, safer, and cleaner, and the American dream was still alive if you sweated and bled for it.',
      },
      {
        variant: 'text',
        text: "By the seventies, that city was a memory... the Dodgers and Luna Park. Episode by episode, first-hand accounts juxtapose the city of the past against the city of the present: from Vincent Impellitteri's post-war baseline to the indicted Eric Adams, with Beame's fiscal collapse and Koch's swagger between them.",
      },
      {
        variant: 'pull',
        text: '"Eleven men, one autopsy."',
        attr: 'THE MAYORS · (212) PICTURES',
      },
      {
        variant: 'text',
        text: 'Behind them all looms Robert Moses, the master builder who ruled over many mayors, tore down neighborhoods, displaced thousands of families, and built the roads, bridges, parks, and projects the city still lives with.',
      },
      {
        variant: 'text',
        text: 'The method is muckraking journalism: forensic, not hysterical. Cause and effect, names and consequences. Shot cinéma vérité with archival material and contemporary interviews, each era rendered in its own visual grammar. No narrator tells you what to think.',
      },
      {
        variant: 'text',
        text: 'Every episode asks what they were trying to achieve, what actually happened, who benefited, and who paid the price.',
      },
      { variant: 'small', text: 'CONTINUED ACROSS THE BOOK' },
      {
        variant: 'text',
        text: "The series ends where it began, in reverse: Zohran Mamdani, the city's first Democratic Socialist mayor, himself an immigrant, inherits a broken city, and the final episode films his first hundred days as they unfold.",
      },
      {
        variant: 'pull',
        text: '"Who killed New York City? This is the autopsy report."',
        attr: 'M.A.C., FOUNDER',
      },
    ],
    factbox: {
      label: 'AT A GLANCE',
      fields: [
        { key: 'DIVISION', value: '(212)', accent: 'amber' },
        { key: 'FORMAT', value: '11 EPISODES' },
        { key: 'METHOD', value: 'CINÉMA VÉRITÉ' },
        { key: 'SUBJECT', value: 'NYC MAYORS' },
        { key: 'STATUS', value: 'DRAFT', accent: 'orange' },
        { key: 'ON RECORD', value: 'No. 1' },
      ],
    },
    related: [
      { idx: 'I', name: 'L.A. Dolce Vita', meta: 'P. 016' },
      { idx: 'II', name: 'Sea Gate', meta: 'P. 024' },
      { idx: 'III', name: 'Da Hook', meta: 'P. 024' },
      { idx: 'IV', name: 'A Need Grows in Brooklyn', meta: 'P. 028' },
    ],
    jumpFrom: 'DISPATCH No. 1 · COVER STORY',
    jumpTo: 'CONTINUED ON P. 016',
  },

  // ── Slate dispatches — grounded loglines, no dates. The `date` field is
  //    repurposed as a FORMAT keycode (never a date). ─────────────────────────
  dispatches: [
    {
      division: '212',
      date: 'DOCUMENTARY · 11 EPS',
      title: 'The Mayors',
      body: 'Eleven mayors, seventy-five years, one autopsy. From Impellitteri to Adams, with Robert Moses looming behind them all. Muckraking documentary: forensic, not hysterical.',
      status: 'DRAFT',
      link: 'P. 012',
      ghost: '212',
    },
    {
      division: '212',
      date: 'SERIES',
      title: 'Movement',
      body: "Seven gifted international students, recruited by clues to a campus bomb, are trained through covert missions to defend a New York mayoral election... never suspecting whom the missions truly serve.",
      status: 'DRAFT',
      link: 'P. 022',
      ghost: '212',
    },
    {
      division: '212',
      date: 'EPISODIC',
      title: 'Sea Gate',
      body: "Inside Brooklyn's private gated town, a fraud investigator turns its rulers against one another over the stolen storm-recovery millions... until the only way to walk the woman he loves out clean is to bet everything he has left.",
      status: 'DRAFT',
      link: 'P. 024',
      ghost: '212',
    },
    {
      division: '212',
      date: 'EPISODIC · RADIO PARALLEL',
      title: 'Da Hook',
      body: 'Brooklyn, spring 1973. A partner murdered over a legendary lost prize, a client whose story is a lie, and the only end a code allows. French Connection austerity, monochrome discipline.',
      status: 'DRAFT',
      link: 'P. 024',
      ghost: '212',
    },
    {
      division: '310',
      date: 'THE TROUPE · RADIO',
      title: 'L.A. Dolce Vita',
      body: 'The Troupe Presents No. 1. A radio drama for seven voices and a clock. One story, three places at once: a ranch in Mojave County, the city of Los Angeles, a train crossing Italy toward Venice. Program No. 1 plays here.',
      status: 'PROGRAM No. 1',
      link: 'P. 016',
      ghost: '310',
    },
    {
      division: 'nrc',
      date: 'FEATURE · (212) CO-PROD',
      title: 'A Need Grows in Brooklyn',
      body: 'Summer 1986, Borough Park. A sensitive seventeen-year-old who dreams of NYU runs with a crew of neighborhood boys. Semi-autobiographical, documentary realism, the El as structural negative space.',
      status: 'DRAFT',
      link: 'P. 028',
      ghost: 'NRC',
    },
    {
      division: 'nrc',
      date: 'FEATURE FIRST',
      title: 'Shadowmaster',
      body: 'Elite gamers command real human avatars through high-stakes scenarios. The avatars are people, not pixels, and may obey or defy. Every command is a bet that a human being will obey.',
      status: 'DRAFT',
      link: 'P. 028',
      ghost: 'NRC',
    },
    {
      division: 'nrc',
      date: 'FEATURE, PROBABLE',
      title: 'U Bruculinu',
      body: 'An expatriate returns to his ancestral Sicily in the 1970s seeking a quiet life, only to find that the land, and its people, will not let him be quiet. Quiet sought, quiet refused.',
      status: 'PREMISE',
      link: 'P. 029',
      ghost: 'NRC',
    },
  ],

  // ── The Trades — reframed as the company's own on-record desk bulletins.
  //    No fabricated third-party press, bylines, or dates. ────────────────────
  trades: [
    {
      pub: '(212) DESK',
      city: 'NEW YORK',
      headline: "Everything you want. Everything you don't want.",
      deck: 'The El roars over the corner and nobody stops talking. New York television at street level, with the kind of detail that only comes from being in the room.',
      attr: 'APR 70 EDITORIAL DESK · ON THE RECORD',
    },
    {
      pub: '(310) DESK',
      city: 'LOS ANGELES',
      headline: 'Every market a signal reaches.',
      deck: 'Television built for audiences who travel. Political thrillers, science fiction, hybrid formats that interrogate genre without abandoning it.',
      attr: 'APR 70 EDITORIAL DESK · ON THE RECORD',
    },
    {
      pub: 'NRC',
      city: 'FEATURE FILMS',
      headline: 'Feature films, by mandate.',
      deck: 'Auteur-driven, morally clear, built for permanence rather than a release window. The greatest art is born inside clear boundaries.',
      attr: 'APR 70 EDITORIAL DESK · ON THE RECORD',
    },
    {
      pub: 'THE TROUPE',
      city: 'LONG ISLAND CITY',
      headline: 'Voices first, film after.',
      deck: 'A resident company, seven players and many parts to a player. Numbered programs, performed by human actors and released as finished things. The Troupe will return.',
      attr: 'APR 70 TROUPE · ON THE RECORD',
    },
  ],

  // ── The Order of Programs — numbered, not dated. `date` is repurposed as
  //    the program/slate index (No. 1, S.01...), never a calendar date. ───────
  calendar: [
    { date: 'No. 1', title: 'L.A. Dolce Vita', sub: 'The Troupe Presents · radio drama', tag: 'RADIO' },
    { date: 'S.01', title: 'The Mayors', sub: '(212) · documentary, 11 episodes', tag: '212' },
    { date: 'S.02', title: 'Movement', sub: '(212) · series', tag: '212' },
    { date: 'S.03', title: 'Sea Gate', sub: '(212) · episodic', tag: '212' },
    { date: 'S.04', title: 'Da Hook', sub: '(212) · episodic, radio parallel', tag: '212' },
    { date: 'S.05', title: 'A Need Grows in Brooklyn', sub: 'NRC · (212) co-production', tag: 'NRC' },
    { date: 'S.06', title: 'Shadowmaster', sub: 'NRC · feature first', tag: 'NRC' },
    { date: 'S.07', title: 'U Bruculinu', sub: 'NRC · feature, probable', tag: 'NRC' },
  ],

  // ── Open Calls & Notices — grounded standing notices, no dates. ───────────
  classifieds: [
    {
      cat: 'THE TROUPE',
      title: 'Human actors only',
      body: 'Made the way it sounds: human actors around real microphones, bradded scripts on the table, index cards on the wall. No AI performances, no AI art, nothing decorative.',
      meta: 'LONG ISLAND CITY NY',
    },
    {
      cat: 'SUBSCRIBE',
      title: 'Leave your address at the masthead',
      body: 'Numbered programs, released as finished things. Leave your address and the Troupe will tell you when No. 2 exists.',
      meta: 'THE TROUPE',
    },
    {
      cat: 'INVESTORS',
      title: 'In person, always',
      body: 'Investor conversations happen in person. Write to the offices.',
      meta: 'APR 70 LLC',
    },
    {
      cat: 'AGENT OF RECORD',
      title: 'APR 70 LLC -- capacity notice',
      body: 'Currently accepting select projects. Direct inquiries only via the contact desk. No unsolicited materials.',
      meta: 'LONG ISLAND CITY NY',
    },
    {
      cat: 'ON RECORD',
      title: 'The slate, on record',
      body: "Draft synopses from every desk. The boroughs, the coasts, the feature slate. On the record before it's on the screen.",
      meta: 'APR 70 PICTURES',
    },
    {
      cat: 'STANDARD',
      title: 'The work earns its position',
      body: "Three divisions, one parent company, one standard. The work earns its position or it doesn't get made.",
      meta: 'APR 70 PICTURES',
    },
  ],

  // ── Archive — numbered only. No Vol., no season. ─────────────────────────
  archive: [
    {
      no: 'No. 1',
      mast: 'DISPATCH',
      line: 'The Troupe Presents No. 1 · L.A. Dolce Vita',
      state: 'CURRENT ISSUE',
      isCurrent: true,
    },
    {
      no: 'No. 2',
      mast: 'DISPATCH',
      line: 'The Troupe will return.',
      state: 'NOT YET',
    },
    {
      no: 'THE RULE',
      mast: 'NUMBERED',
      line: 'Issues are numbered, never dated. The number is the only clock.',
      state: 'ON RECORD',
    },
  ],

  // ── Colophon ─────────────────────────────────────────────────────────────
  colophon: {
    legal: 'APR 70 LLC · Long Island City, New York. From the offices of APR 70 Pictures.',
    type: 'Set in Futura Std for display and Barlow for text. Slates in Share Tech Mono. Composed in Long Island City, New York.',
    baseline: 'NO DECORATIVE FLOURISHES. BUILT TO LAST.',
  },
}
