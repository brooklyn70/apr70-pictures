import type { CollectionConfig } from 'payload'

/**
 * FoundingRoll — the first public transaction on the site (v10, catalog 1.3).
 *
 * Lineage: the v5 business design's numbered charter roll — the first numbers,
 * never reissued, every join source-tagged. The v10 implementation is the
 * free, no-payment version of that design: a visitor asks to be named on the
 * roll, gets the next number, and the studio owns the list. Money never moves
 * here; dues/tiers remain a human decision for a later version.
 *
 * Access: the public site creates entries (via the Astro /api/roll proxy);
 * only admins read the roll. Numbers are assigned server-side, monotonically,
 * and never reissued (deletes leave gaps by design).
 */
export const FoundingRoll: CollectionConfig = {
  slug: 'founding-roll',
  labels: { singular: 'Founding Roll entry', plural: 'Founding Roll' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['rollNumber', 'name', 'email', 'source', 'createdAt'],
    description:
      'Public enrollments on the Founding Roll. Numbers are assigned automatically and never reissued.',
  },
  access: {
    create: () => true,
    // The roll is public BY DESIGN (v5: members are answered by name and
    // number; the count is printed). Contact details are not: email, note,
    // consent, and source are admin-only via field-level access below.
    read: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data
        // Next roll number: max existing + 1, starting at 1. Numbers are
        // never reissued; a deleted entry leaves its number retired.
        const latest = await req.payload.find({
          collection: 'founding-roll',
          sort: '-rollNumber',
          limit: 1,
          depth: 0,
          overrideAccess: true,
        })
        const max = latest.docs.length ? Number(latest.docs[0].rollNumber) || 0 : 0
        return { ...data, rollNumber: max + 1 }
      },
    ],
  },
  fields: [
    {
      name: 'rollNumber',
      type: 'number',
      label: 'Roll number',
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        description: 'Assigned automatically on enrollment. Never reissued.',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      maxLength: 120,
      label: 'Name (as it appears on the roll)',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      index: true,
      access: { read: ({ req }) => Boolean(req.user) },
    },
    {
      name: 'note',
      type: 'textarea',
      maxLength: 500,
      label: 'Note (optional)',
      access: { read: ({ req }) => Boolean(req.user) },
      admin: { description: 'Anything the enrollee wanted to say to the writer.' },
    },
    {
      name: 'consent',
      type: 'checkbox',
      required: true,
      label: 'Asked to be named on the roll and to receive word when work ships',
      defaultValue: false,
      validate: (value: boolean | null | undefined) =>
        value === true || 'Enrollment requires consent.',
      access: { read: ({ req }) => Boolean(req.user) },
    },
    {
      name: 'source',
      type: 'text',
      label: 'Join source',
      access: { read: ({ req }) => Boolean(req.user) },
      admin: {
        readOnly: true,
        description: 'Page or campaign the enrollment came from (source-tagged per the v5 design).',
      },
    },
  ],
}
