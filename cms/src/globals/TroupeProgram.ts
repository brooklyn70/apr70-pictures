import type { GlobalConfig } from 'payload'

/**
 * TROUPE PROGRAM — the radio play (Marco 2026-07-13).
 *
 * WHY THIS EXISTS, AND WHY IT IS EMPTY
 * Three investors, independently, named the radio play as the single highest-return
 * move available to APR 70. The site already promises radio and quotes the Mercury
 * Theatre. What does NOT exist yet is the artifact: as of today there is a ~15-minute
 * script for L.A. Dolce Vita EP101 (`troupe-presents-01-la-dolce-vita-radio-v01.md`,
 * drafted 2026-07-02) which Marco has not yet read and accepted, no cast, and no
 * recording. So this global ships with the words fillable and the AUDIO EMPTY.
 *
 * THE SWITCH. /troupe is live only when BOTH are true:
 *   1. Site Settings → TROUPE → "Publish the TROUPE page" is ticked, AND
 *   2. `audio` here holds a file.
 * Either one missing and the route serves a real 404. That second condition is the
 * point: a radio page with no radio on it is worse than no page, and it is exactly
 * the kind of promise the investor panel already punished this company for. The
 * page cannot go live until the thing it advertises exists. It publishes itself the
 * day the recording lands — no deploy (the site is output:'server').
 *
 * NOT the old `troupe` global (slug 'troupe', TroupePage). That one is a legacy
 * v4 block-layout page feeding a BlockRenderer that v10 deleted. It stays hidden
 * and untouched for archive. This is a RADIO PROGRAM, so it is shaped like one.
 */
export const TroupeProgram: GlobalConfig = {
  slug: 'troupe-program',
  label: 'Troupe Programme',
  access: { read: () => true },
  admin: {
    group: 'Dispatch',
    description:
      'The APR 70 Troupe Presents — the radio programme. The page at /troupe stays dark until BOTH the switch in Site Settings → TROUPE is on AND an audio file is uploaded below. No radio, no radio page.',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'programNumber',
          type: 'text',
          label: 'Programme number',
          defaultValue: 'No. 1',
          admin: {
            width: '30%',
            description: 'The Mercury lineage: a numbered programme. "No. 1", "No. 2"…',
          },
        },
        {
          name: 'runtime',
          type: 'text',
          label: 'Runtime',
          admin: { width: '30%', description: 'As performed, e.g. "15 minutes".' },
        },
        {
          name: 'recordedOn',
          type: 'date',
          label: 'Recorded',
          admin: { width: '40%', date: { pickerAppearance: 'dayOnly' } },
        },
      ],
    },
    {
      name: 'title',
      type: 'text',
      label: 'Programme title',
      admin: { description: 'The property being performed, e.g. "L.A. Dolce Vita".' },
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
      admin: { description: 'The episode or movement, e.g. "Il Primo Giorno".' },
    },
    {
      name: 'property',
      type: 'relationship',
      relationTo: 'projects',
      label: 'Property',
      admin: { description: 'Links the programme back to the slate entry it performs.' },
    },
    {
      name: 'logline',
      type: 'textarea',
      label: 'Logline',
      admin: { description: 'One or two sentences. What the listener is about to hear.' },
    },

    // ── THE ARTIFACT ────────────────────────────────────────────────────────────
    {
      name: 'audio',
      type: 'upload',
      relationTo: 'media',
      label: 'The recording',
      admin: {
        description:
          'The finished programme. THIS IS THE GATE: while it is empty, /troupe returns 404 even with the switch on. Upload it and the page publishes itself. Human voices only — no synthetic voices (house policy).',
      },
    },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
      label: 'Programme still',
      admin: { description: 'Optional. A single frame to sit above the player.' },
    },

    // ── THE PLAYBILL ────────────────────────────────────────────────────────────
    {
      name: 'cast',
      type: 'array',
      label: 'Cast',
      labels: { singular: 'Player', plural: 'Cast' },
      admin: { description: 'Every voice, credited. A resident company is the whole idea.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'role', type: 'text', label: 'Role', admin: { width: '50%' } },
            { name: 'player', type: 'text', label: 'Played by', admin: { width: '50%' } },
          ],
        },
      ],
    },
    {
      name: 'programmeNote',
      type: 'textarea',
      label: 'Programme note',
      admin: {
        description:
          'The note in the playbill — what this is, why radio first. Supports ==highlight== markup.',
      },
    },
    {
      name: 'credits',
      type: 'textarea',
      label: 'Credits',
      admin: { description: 'Writer, direction, sound. Supports ==highlight== markup.' },
    },
  ],
}
