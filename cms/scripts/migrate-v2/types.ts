/**
 * Types for the v2 → v3 seed / migration CLI (dry-run report contract).
 * @see docs/handoff/phase-4-orchestrator-handoff-2026-05-12.md
 */

export type V2DocumentKind = 'page' | 'project' | 'unknown'

export type V2DiscoveredFile = {
  absolutePath: string
  relativePath: string
  kind: V2DocumentKind
}

export type MigrationReport = {
  generatedAt: string
  mode: 'dry-run'
  seedVersion: string
  v2Root: string
  summary: {
    jsonFilesScanned: number
    pages: number
    projects: number
    unknownKind: number
    parseFailures: number
    blocksInput: number
    blocksOutput: number
    blocksSkippedUnknownType: number
    lexicalRootsScanned: number
    colorInjectorTokensFound: string[]
    mediaLikePathsFound: string[]
  }
  /** Stable ids: slug, id, or basename without extension */
  ids: {
    pages: string[]
    projects: string[]
  }
  warnings: string[]
  /** First successfully mapped page-like document (for review) */
  sampleFirstPage: null | {
    sourcePath: string
    inferredId: string
    mappedLayout: unknown[]
  }
}
