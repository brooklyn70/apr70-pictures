import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

import { runDryRun } from '../../scripts/migrate-v2/run-dry-run'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const fixtureRoot = path.resolve(__dirname, '../../fixtures/v2-sample')

describe('migrate-v2 dry-run', () => {
  it('scans fixtures and maps blocks without DB', async () => {
    const report = await runDryRun({ v2Root: fixtureRoot })

    expect(report.mode).toBe('dry-run')
    expect(report.summary.jsonFilesScanned).toBe(2)
    expect(report.summary.pages).toBe(1)
    expect(report.summary.projects).toBe(1)
    expect(report.summary.blocksOutput).toBe(3)
    expect(report.summary.blocksSkippedUnknownType).toBe(1)
    expect(report.summary.colorInjectorTokensFound).toContain('310-imax')
    expect(report.ids.pages).toContain('home')
    expect(report.ids.projects).toContain('fixture-project-alpha')
    expect(report.sampleFirstPage?.inferredId).toBe('home')
    expect(report.sampleFirstPage?.mappedLayout).toHaveLength(2)
  })
})
