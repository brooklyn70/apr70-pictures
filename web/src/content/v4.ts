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

/** Split a plain-text body into paragraphs (blank-line separated). */
export function toParagraphs(body: string | null | undefined): string[] {
  return (body ?? '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}

// ── HOME / MASTHEAD (bundle: HOME / MASTHEAD) ────────────────────────────────

export const V4_MASTHEAD: ZineMastheadData = {
  blockType: 'zineMasthead',
  title: 'DISPATCH',
  officesLine: 'From the offices of APR 70 Pictures, Long Island City, New York.',
  issueLabel: 'No. 1',
  dek: "We don't make work for rooms that need convincing. We make it for audiences who've been waiting. Three divisions, one parent company, one standard: crime and documentary built out of the five boroughs, elevated genre for global television, auteur features that trade formula for conviction.",
}

export const V4_FRONT_DOOR_TEASERS: ZinePassageData[] = [
  {
    blockType: 'zinePassage',
    kicker: 'The APR 70 Troupe Presents',
    heading: 'No. 1: L.A. Dolce Vita',
    body: "A radio drama for seven voices and a clock. Human actors, one story, three places at once. The Troupe's first program.",
    links: [{ label: 'Troupe Presents No. 1', href: '/troupe' }],
  },
  {
    blockType: 'zinePassage',
    heading: 'The Third Way',
    body: 'Three divisions, separate and connected to the craft of constraint. (212) East Coast. (310) West Coast and global. New Renaissance Cinema — features, by mandate.',
    links: [
      { label: '(212) Pictures', href: '/212' },
      { label: '(310) Pictures', href: '/310' },
      { label: 'New Renaissance Cinema', href: '/nrc' },
    ],
  },
  {
    blockType: 'zinePassage',
    heading: 'The Slate, On Record',
    body: "Draft synopses from every desk — the boroughs, the coasts, the feature slate. The work earns its position or it doesn't get made.",
    links: [
      { label: 'The Mayors', href: '/work/mayors' },
      { label: 'Movement', href: '/work/movement' },
      { label: 'Sea Gate', href: '/work/sea-gate' },
      { label: 'Da Hook', href: '/work/falcon' },
      { label: 'A Need Grows in Brooklyn', href: '/work/brooklyn' },
      { label: 'Shadowmaster', href: '/work/shadowmaster' },
      { label: 'U Bruculinu', href: '/work/ubrucculinu' },
    ],
  },
]

/** Complete front door, compiled in — used when the Home global is absent or pre-v4. */
export const V4_FRONT_DOOR_BLOCKS: ZineBlockData[] = [V4_MASTHEAD, ...V4_FRONT_DOOR_TEASERS]

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

// ── DISPATCH indicia — numbered, never dated (bundle: HOME / MASTHEAD +
//    CANON FLAGS item 10) ────────────────────────────────────────────────────

export const V4_DISPATCH_INDICIA = {
  displayTitle: 'Vol. 01 No. 01',
  volume: 'VOL. 01',
  number: 'NO. 01',
  /** Required field in the schema; never rendered as a date. */
  season: 'NUMBERED, NEVER DATED',
  coverKicker: 'INAUGURAL ISSUE',
  /** Masthead indicia line stating the convention. */
  numberedLine: 'ISSUES ARE NUMBERED, NEVER DATED',
}
