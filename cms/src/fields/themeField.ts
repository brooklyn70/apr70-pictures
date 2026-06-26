import type { Field } from 'payload'

/**
 * Per-division theme skin selector.
 *
 * Mirrors the frontend design registry in `web/src/designs/manifest.ts`.
 * Keep these option values 1:1 with `DesignSlug` there. When empty, the
 * frontend falls back to the division's default skin (DIVISION_DEFAULT_DESIGN).
 *
 * NOTE: adding this field requires the `20260625_division_theme` migration
 * to be applied before deploying to a Postgres environment with push disabled.
 */
export const themeField: Field = {
  name: 'theme',
  type: 'select',
  admin: {
    description:
      'Visual skin for this division. Leave blank to use the recommended default (212 → Amber Heat, 310 → IMAX Deep, NRC → Noir).',
    position: 'sidebar',
  },
  options: [
    { label: 'Signature (house style)', value: 'signature' },
    { label: 'Noir (monochrome)', value: 'noir' },
    { label: 'Amber Heat (warm)', value: 'amber-heat' },
    { label: 'IMAX Deep (cool)', value: 'imax-deep' },
    { label: 'Daylight (light)', value: 'daylight' },
  ],
}
