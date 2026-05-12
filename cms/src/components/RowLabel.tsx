'use client'

/**
 * RowLabel — Payload admin array row label component.
 *
 * Displays a named field value as the row header in array fields,
 * e.g. "WORK" instead of "Item 1" in the FooterLinks admin UI.
 *
 * Usage in a GlobalConfig array field:
 *   admin: {
 *     components: {
 *       RowLabel: {
 *         path: '@/components/RowLabel#RowLabel',
 *         clientProps: { field: 'label', fallback: 'Link' },
 *       },
 *     },
 *   }
 */

import type { RowLabelProps } from '@payloadcms/ui'
import { useRowLabel } from '@payloadcms/ui'

type Props = RowLabelProps & {
  field?: string
  fallback?: string
}

export function RowLabel({ field = 'label', fallback = 'Item' }: Props) {
  const { data } = useRowLabel()
  const value = (data as Record<string, unknown>)?.[field]
  return <>{typeof value === 'string' && value.trim() ? value : fallback}</>
}
