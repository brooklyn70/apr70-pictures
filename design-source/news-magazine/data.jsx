// data.jsx — DISPATCH editorial content for Vol. 1 No. 1

const ISSUE = {
  volume: 'VOL. 01',
  number: 'NO. 01',
  season: 'SPRING 2026',
  reel: 'REEL 086',
  isoDate: 'APR · MAY · JUN 2026',
  printRun: 'PRESSRUN 1,200',
  offices: 'LIC NY 11101',
  tagline: 'PRECISE. PURPOSEFUL. BUILT TO LAST.',
};

const COVER = {
  kicker: 'INAUGURAL ISSUE — APR 70 PICTURES QUARTERLY',
  // Big cover headline split into lines for typographic control
  lines: [
    { text: 'Three' },
    { text: 'Divisions', accent: true },
    { text: 'One', outline: true },
    { text: 'Vision.' },
  ],
  deck: 'The company opens its books. A first dispatch from the boroughs, the coasts, and the desks where APR 70 builds its slate — assembled, set, and pressed in Long Island City.',
  byline: 'FROM THE OFFICES OF MARC ANDREW CARUSO',
  coverlines: [
    { num: '01', head: 'A NEED GROWS IN BROOKLYN', deck: 'Casting locks. Pages 24–31.' },
    { num: '02', head: 'L.A. DOLCE VITA · UNIVERSE BIBLE COMPLETE', deck: 'Inside the writers room. P. 18.' },
    { num: '03', head: 'THE MAYORS, FIFTEEN YEARS IN', deck: 'Archive built. P. 12.' },
    { num: '04', head: 'NRC OPENS THE FEATURE DESK', deck: 'Auteur. Driven. P. 36.' },
    { num: '05', head: 'NOTES ON CONSTRAINT', deck: 'An essay. P. 44.' },
  ],
};

const CONTENTS = [
  {
    label: 'FEATURES',
    meta: 'PP. 12 — 46',
    entries: [
      { folio: '012', title: 'The Mayors — Fifteen Years in the Vault', deck: 'How seventy-five years of New York leadership became an eleven-episode documentary, one tape at a time.', by: 'M.A. CARUSO' },
      { folio: '018', title: 'L.A. Dolce Vita: Building the Bible', deck: 'Inside the universe-bible process for the (310) Pictures political-thriller event series.', by: 'EDITORIAL STAFF' },
      { folio: '024', title: 'A Need Grows in Brooklyn — Casting Locks', deck: 'Ten episodes. 1990s Brooklyn. Five locked. Five pending. A reported breakdown.', by: 'STAFF DISPATCH' },
      { folio: '036', title: 'New Renaissance Cinema — Opening the Feature Desk', deck: 'Marc Caruso on launching the feature division and what auteur-driven means in 2026.', by: 'INTERVIEW' },
      { folio: '044', title: 'Notes on Constraint', deck: 'An essay: how the right limits make work that lasts. Vignelli, Munari, and the production slate.', by: 'M.A. CARUSO' },
    ],
  },
  {
    label: 'DISPATCHES',
    meta: 'PP. 48 — 56',
    entries: [
      { folio: '048', title: 'From the (212) Desk', deck: 'Brooklyn diaries. Mayors archive. Maltese Falcon read-throughs.', by: '(212) PICTURES' },
      { folio: '052', title: 'From the (310) Desk', deck: 'Dolce Vita. Cleopatra. Shadowmaster. Status, budgets, casting talk.', by: '(310) PICTURES' },
      { folio: '055', title: 'From the NRC Desk', deck: 'Feature slate. U Brucculinu. The Falcon at the theater.', by: 'NEW RENAISSANCE CINEMA' },
    ],
  },
  {
    label: 'DEPARTMENTS',
    meta: 'PP. 58 — 72',
    entries: [
      { folio: '058', title: 'The Trades', deck: 'What Variety, Deadline, and the THR are saying this quarter.', by: 'INDUSTRY ROUNDUP' },
      { folio: '064', title: 'The Calendar', deck: 'Pitches, premieres, festival deadlines, and reading copy due.', by: 'PRODUCTION SLATE' },
      { folio: '068', title: 'Open Calls & Classifieds', deck: 'Crew positions, RFPs, location holds, agent of record notices.', by: 'BACK OF BOOK' },
      { folio: '072', title: 'Colophon', deck: 'Indicia, masthead, type credits, and the long thank-yous.', by: 'PRODUCTION' },
    ],
  },
];

const EDITORIAL = {
  eyebrow: 'FROM THE EDITOR — P. 008',
  title: 'A Quarterly, Not a Newsletter.',
  lead: 'The trades will cover what they cover. This is the long form. Issued four times a year. Read on the train or with the door closed.',
  paragraphs: [
    'When the company filed its first papers in April 2026, the intent was already in the name. APR 70 — short for nothing, owed to no acronym, lifted from a date in 1970 that means more in Sicilian than in English. The mark was the work. The work was the mark. There was no separate marketing apparatus to assemble, and there will not be one now.',
    'A newsletter would have done. A daily Substack would have done better, by some metric. But the company is not in the business of velocity. It is in the business of work that lasts past the press cycle that announced it. So the news comes quarterly, in long form, on a schedule that matches the rhythm of the slate — pages locked, casting set, photography rolling, prints struck.',
    'What is in front of you is a first attempt at that. There are features on the four projects furthest along. There are short dispatches from each division. There is a roundup of what the trades are saying, and a calendar of what is due to whom. There is a back of the book for the working crew — the open calls, the agent-of-record notices, the location holds. And there is a colophon, because the only credits a press magazine has are its own.',
    'It will be wrong about some things. The whole point of putting it on paper, even paper of the digital kind, is to be wrong about something and have to correct it later — in print, where you can see what was wrong and what came after. That is a discipline this town gave up. The company picks it back up here.',
    'See you in summer.',
  ],
  signatureName: 'M.A.C.',
  signatureMeta: 'MARC ANDREW CARUSO · FOUNDER · APR 70 LLC',
  quote: '"This is the long form. Issued four times a year. Read on the train or with the door closed."',
};

const FEATURE = {
  eyebrow: 'FEATURE — P. 012 — COVER STORY',
  title: ['The Mayors —', 'Fifteen Years', { italic: true, text: 'in the' }, 'Vault.'],
  deck: 'Seventy-five years of New York City leadership. Eleven episodes. One archive cart at a time. A reported piece on how a (212) Pictures documentary actually gets built.',
  meta: [
    ['BYLINE', 'M.A. CARUSO'],
    ['FILED', 'APR 14, 2026'],
    ['DIVISION', '(212) PICTURES'],
    ['LENGTH', '11 EPS · ~58 MIN'],
    ['STATUS', 'POST-PRODUCTION'],
    ['BUDGET', 'CONFIDENTIAL'],
  ],
  imageCaption: ['Reel from the LaGuardia archive collection, 1939', 'PHOTO — APR 70 / NYC MUNICIPAL ARCHIVE'],
  paragraphs: [
    { first: true, text: 'New York has had one hundred and ten mayors. The good and bad of them is a matter of public record. The footage of them is not. It is a matter of municipal archives, family estates, three TV stations that no longer exist, and the basement of a building on Chambers Street that we were not, at first, allowed inside.' },
    { text: 'The premise of the series is simple. Each of the last twenty-five mayors, going back to John F. Hylan in 1918, gets a forty-five-minute hour, working forward in time. Each hour is built around primary footage — campaign reels, City Hall press conferences, Saturday morning broadcasts that nobody has watched since the broadcast itself. The talking heads come last, and only when the tape runs out.' },
    { pull: '"The tape comes first. The interview comes when the tape runs out. That is the rule of the room."', attr: 'LEAD EDITOR · DISPATCH BRIEFING' },
    { text: 'That rule was set in the second month of development. It is a rule that is hard to keep. It is much easier to put a historian on camera for an hour and ask leading questions. The tape, on the other hand, is contested, inconsistent, missing for three of the eleven episodes, and — when it does exist — runs at three different frame rates and has audio in monophonic 1940s telephone quality.' },
    { text: 'But the tape is the show. The thesis of the series — that the office is shaped by the person and the person is shaped by the office — does not survive the talking-head treatment. It survives when you watch Fiorello LaGuardia read the funny papers over WNYC on a Sunday morning in 1945 because the newspaper strike has cut off the city, and you understand why nobody after him sounded like him. It survives when you watch David Dinkins, in the rotunda, the day after a verdict, choose his words.' },
    { text: 'The first eight hours have locked picture. Three remain. The Bloomberg hour is the one we have spent the most on, because the Bloomberg years are the most documented and the least understood. The de Blasio hour is the one we have argued about most, because the public record is still being written. The Adams hour we have postponed twice; it is the one with the most footage and the least clarity.' },
    { small: 'CONTINUED FROM P. 12.' },
    { text: 'We have not announced a network. We have shown the first hour to four buyers; we have placed it with none of them, yet. The thinking on that is the same as the thinking on everything else at APR 70: take the time, get the work right, and the distribution will follow the work. The reverse has never been true in this town and it is not going to start being true now.' },
    { text: 'A reasonable question would be: why a documentary as the first major project? Because a documentary is the cheapest way to learn how to make television. You cannot fake a documentary. You can spend less on it than on drama, you can take longer with it than with drama, and at the end of it you have learned every craft in the building. By the time we shoot the first day of A Need Grows in Brooklyn — which is on the books for late summer — the company will have already shipped eleven hours of finished work.' },
    { pull: '"A documentary is the cheapest way to learn how to make television. You cannot fake it."', attr: 'M.A.C., FOUNDER' },
    { text: 'The series will be called The Mayors. The release will be one hour per month for the eleven months that follow the announcement of the buyer. The episodes will be in chronological order, except for one. The episode order is the one piece of editorial business we have already locked.' },
    { text: 'There is a screening of the Lindsay hour at the office on May 11. The list is small. The list is closed. We will publish a short reaction roundup in the Summer issue, on the back-of-book pages, in the spot that is currently being held for "what the room said."' },
  ],
  factbox: {
    label: 'AT A GLANCE',
    fields: [
      ['DIVISION', '(212)', 'amber'],
      ['FORMAT', '11 × 58 MIN'],
      ['SUBJECT', 'NYC MAYORS'],
      ['ORIGIN', '1918 — 2026'],
      ['STATUS', 'POST', 'orange'],
      ['DELIVERY', 'Q3 2026'],
      ['BUDGET', 'CONFIDENTIAL'],
      ['BUYER', 'TBD'],
    ],
  },
  related: [
    { idx: 'I', name: 'A Need Grows', meta: 'P. 24' },
    { idx: 'II', name: 'L.A. Dolce Vita', meta: 'P. 18' },
    { idx: 'III', name: 'U Brucculinu', meta: 'P. 36' },
    { idx: 'IV', name: 'The Movement', meta: 'P. 41' },
  ],
  jumpFrom: 'CONTINUED FROM COVER',
  jumpTo: 'CONTINUED ON P. 016',
};

const DISPATCHES = [
  {
    div: '(212) PICTURES', color: 'var(--apr-amber)',
    date: 'APR 14, 2026',
    title: 'A Need Grows in Brooklyn — Five Leads Locked',
    body: 'Casting on the ten-episode crime drama set in 1990s Carroll Gardens reaches the halfway mark. Five locked, five pending. Production designer engaged for period scout in May.',
    status: 'PRE-PROD', link: 'DISPATCH 0086-A',
    ghost: '212',
  },
  {
    div: '(212) PICTURES', color: 'var(--apr-amber)',
    date: 'APR 09, 2026',
    title: 'The Mayors — Eight Hours Locked',
    body: 'Picture lock on episodes 1 through 8. Bloomberg, de Blasio, and Adams hours remain in cut. Screening calendar to follow in the Summer issue.',
    status: 'POST', link: 'DISPATCH 0086-B',
    ghost: '212',
  },
  {
    div: '(212) PICTURES', color: 'var(--apr-amber)',
    date: 'MAR 28, 2026',
    title: 'Maltese Falcon — Read-through Set',
    body: 'Theater adaptation enters the table-read phase. All-Italian-American cast convenes in LIC on May 04 for the first read of the revised second act.',
    status: 'DEVELOPMENT', link: 'DISPATCH 0086-C',
    ghost: '212',
  },
  {
    div: '(310) PICTURES', color: 'var(--apr-teal)',
    date: 'APR 11, 2026',
    title: 'L.A. Dolce Vita — Universe Bible Complete',
    body: 'Ten-episode neo-noir political thriller. Bible covers political geography of the 2028 election year as fictional armature. Budget envelope holds at $30M–$50M.',
    status: 'BIBLE LOCKED', link: 'DISPATCH 0086-D',
    ghost: '310',
  },
  {
    div: '(310) PICTURES', color: 'var(--apr-teal)',
    date: 'APR 03, 2026',
    title: "L'Odissea di Cleopatra — Pilot Script Delivered",
    body: 'Sci-fi psychological thriller. First-episode draft submitted; second-pass notes from showrunner room expected end of month. Budget envelope $40M–$80M.',
    status: 'SCRIPT', link: 'DISPATCH 0086-E',
    ghost: '310',
  },
  {
    div: '(310) PICTURES', color: 'var(--apr-teal)',
    date: 'MAR 22, 2026',
    title: 'Shadowmaster — Format Test Greenlit',
    body: 'Hybrid series-reality format proceeds to a two-day shooting test in early May. Format treatment registered.',
    status: 'TEST', link: 'DISPATCH 0086-F',
    ghost: '310',
  },
  {
    div: 'NEW RENAISSANCE CINEMA', color: 'var(--apr-offwhite)',
    date: 'APR 18, 2026',
    title: 'U Brucculinu — Treatment in Circulation',
    body: 'Feature film. Treatment now in front of three financiers. Sicilian-American story; Caruso sensibility. Director attachment pending the budget conversation.',
    status: 'DEV', link: 'DISPATCH 0086-G',
    ghost: 'NRC',
  },
  {
    div: 'NEW RENAISSANCE CINEMA', color: 'var(--apr-offwhite)',
    date: 'APR 02, 2026',
    title: 'NRC Opens Feature Desk',
    body: 'New Renaissance Cinema formally seats its first development desk in LIC. Currently accepting select projects for the 2027 slate.',
    status: 'OPEN', link: 'DISPATCH 0086-H',
    ghost: 'NRC',
  },
];

const TRADES = [
  {
    pub: 'Variety', city: 'LOS ANGELES',
    headline: 'APR 70 Quietly Stakes Claim with Three-Division Structure',
    deck: 'New York-based production house under founder Marc Andrew Caruso opens with a documented, dated slate. No publicists. No agents on payroll. A trade-press first read.',
    attr: 'V. CHANG · TV DESK · APR 09, 2026',
  },
  {
    pub: 'Deadline', city: 'HOLLYWOOD',
    headline: 'L.A. Dolce Vita Lands on Buyer Lists Without a Sale',
    deck: 'Political-thriller event series — ten episodes, $30M–$50M envelope — circulating in town with universe-bible-first sales materials. Distribution still open.',
    attr: 'M. PETROSKI · APR 11, 2026',
  },
  {
    pub: 'The Hollywood Reporter', city: 'NYC BUREAU',
    headline: 'Caruso, NYU Grad, Bets on Documentary Before Drama',
    deck: 'A long, technical Q&A on why a first-out-the-gate slate leads with eleven hours of nonfiction before the company shoots a frame of scripted.',
    attr: 'INTERVIEW · APR 02, 2026',
  },
  {
    pub: 'IndieWire', city: 'NEW YORK',
    headline: 'New Renaissance Cinema Opens a Feature Desk in LIC',
    deck: 'A note on auteur-driven feature companies and what "moral clarity" means in development meetings in 2026.',
    attr: 'D. EHRLICH · MAR 27, 2026',
  },
];

const CALENDAR = [
  { date: 'MAY 04', title: 'Maltese Falcon — Table Read', sub: 'LIC office · closed', tag: 'STAGE' },
  { date: 'MAY 11', title: 'Lindsay Hour — Office Screening', sub: 'The Mayors · invite only', tag: 'DOC' },
  { date: 'MAY 18', title: 'Dolce Vita Bible — Buyer Send', sub: '(310) · staggered windows', tag: 'TV' },
  { date: 'MAY 22', title: 'Brooklyn Casting — Reads 06–10', sub: 'A Need Grows · Brooklyn Heights', tag: 'TV' },
  { date: 'JUN 03', title: 'Cleopatra Pilot — Notes Lock', sub: '(310) · showrunner room', tag: 'TV' },
  { date: 'JUN 12', title: 'Q2 Investor Call', sub: 'APR 70 LLC · prospectus rev. C', tag: 'IR' },
  { date: 'JUN 20', title: 'Mayors — Picture Lock 09', sub: 'Bloomberg hour', tag: 'DOC' },
  { date: 'JUL 01', title: 'NRC Slate Read', sub: 'U Brucculinu + 2', tag: 'FEAT' },
];

const CLASSIFIEDS = [
  { cat: 'OPEN CALL', title: 'Period Production Designer', body: 'A Need Grows in Brooklyn — late 1990s Carroll Gardens. Documentation of personal references required. Reels by May 12.', meta: '212 / NYC' },
  { cat: 'OPEN CALL', title: 'Documentary Editor — Episodes 09–11', body: 'The Mayors. Avid. Familiarity with municipal archive workflow preferred. Six-month engagement.', meta: '212 / LIC' },
  { cat: 'RFP', title: 'Music Clearance Counsel', body: 'Catalogue clearances for The Mayors — 1940s–2020s. Outside counsel sought for a fixed-fee engagement.', meta: 'APR 70 LEGAL' },
  { cat: 'OPEN CALL', title: 'Sicilian-American Writer\u2019s Room', body: 'U Brucculinu (NRC, feature). Three-week assembly in LIC. Travel covered. Sicilian or American-Sicilian backgrounds prioritized.', meta: 'NRC / LIC' },
  { cat: 'LOCATION HOLD', title: 'Carroll St & Court St, Brooklyn', body: 'Block hold for one weekend in late Aug, A Need Grows in Brooklyn pilot. Community board liaison engaged.', meta: '212 / BK' },
  { cat: 'AGENT OF RECORD', title: 'APR 70 LLC — Capacity Notice', body: 'Currently accepting select projects for 2026. Direct inquiries only via the contact desk. No unsolicited materials.', meta: 'LIC NY 11101' },
];

const ARCHIVE = [
  { vol: 'VOL. 01', no: 'NO. 01', season: 'SPRING 2026', mast: 'DISPATCH', line: 'Three Divisions. One Vision.', state: 'CURRENT ISSUE', current: true },
  { vol: 'VOL. 00', no: 'NO. 04', season: 'COMING SOON', mast: 'PROSPECT', line: 'Investor Prospectus — Rev. C', state: 'BY REQUEST' },
  { vol: 'VOL. 00', no: 'NO. 03', season: 'WINTER 2025', mast: 'TREATMENT', line: 'A Need Grows in Brooklyn — One-Pager', state: 'INTERNAL' },
  { vol: 'VOL. 00', no: 'NO. 02', season: 'AUTUMN 2025', mast: 'SLATE', line: 'Slate Memo — Year-End Recap', state: 'INTERNAL' },
  { vol: 'VOL. 00', no: 'NO. 01', season: 'SUMMER 2025', mast: 'NOTES', line: 'Notes Toward an Italian-American Cinema', state: 'ESSAY' },
];

const COLOPHON = {
  legal: 'APR 70 LLC · 1063 Jackson Avenue PH G · Long Island City, NY 11101 · EIN 41-4120354 · NY DOS ID 7827718',
  type: 'Set in FUTURA STD (Paul Renner, 1927) for display and BARLOW (Jeremy Tribby, 2017) for text. Slates in SHARE TECH MONO. Composed and pressed in Long Island City, NY.',
  baseline: 'PRECISE. PURPOSEFUL. BUILT TO LAST.',
};

window.DISPATCH_DATA = { ISSUE, COVER, CONTENTS, EDITORIAL, FEATURE, DISPATCHES, TRADES, CALENDAR, CLASSIFIEDS, ARCHIVE, COLOPHON };
