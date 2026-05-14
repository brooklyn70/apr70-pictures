import { formatApplyReportConsole, runApply } from './apply.js'
import { formatApplyMediaRestoreConsole, runApplyMediaRestore } from './apply-media-restore.js'
import { formatReportConsole, runDryRun } from './run-dry-run.js'

const HELP = `migrate-v2-to-v3 — Phase 4 seed CLI (apr70-pictures)

Reads v2 JSON under a content root, maps layout blocks toward v3 Payload shapes,
and emits a review report. Does not connect to Postgres unless you use --apply
or --apply-media.

Usage:
  pnpm exec tsx scripts/migrate-v2-to-v3.ts --dry-run --v2-root <path>
  DRY_RUN=1 V2_CONTENT_ROOT=<path> pnpm exec tsx scripts/migrate-v2-to-v3.ts

Options:
  --dry-run           No database writes (default for safety if neither flag set).
  --v2-root <path>    Root directory to scan (or env V2_CONTENT_ROOT).
  --report <file>     Write full JSON report to this path.
  --apply             Live seed to Payload via REST API. Requires CMS_URL, PAYLOAD_SEED_EMAIL, PAYLOAD_SEED_PASSWORD env vars and a running v3 CMS container. Take a pg_dump backup first.
  --apply-media       After v2 public files are on MEDIA_ROOT: create Media rows and PATCH projects + news layouts. Same auth env as --apply; MEDIA_ROOT defaults to /app/media. Run migrate:v2:apply first.
  -h, --help          Show this message.

Path classification: JSON files under .../pages/, .../projects/, or
.../content/pages/, .../content/projects/ are counted as pages vs projects.
Other JSON files are scanned but marked unknownKind.

See docs/handoff/phase-4-orchestrator-handoff-2026-05-12.md (Runbook).
`

function parseArgs(argv: string[]): {
  dryRun: boolean
  apply: boolean
  applyMedia: boolean
  v2Root?: string
  report?: string
  help: boolean
} {
  let dryRun = false
  let apply = false
  let applyMedia = false
  let v2Root: string | undefined
  let report: string | undefined
  let help = false

  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i]
    if (a === '-h' || a === '--help') help = true
    else if (a === '--dry-run') dryRun = true
    else if (a === '--apply') apply = true
    else if (a === '--apply-media') applyMedia = true
    else if (a === '--v2-root' && argv[i + 1]) {
      v2Root = argv[i + 1]
      i += 1
    } else if (a === '--report' && argv[i + 1]) {
      report = argv[i + 1]
      i += 1
    }
  }

  if (process.env.DRY_RUN === '1' || process.env.DRY_RUN === 'true') dryRun = true

  return { dryRun, apply, applyMedia, v2Root: v2Root ?? process.env.V2_CONTENT_ROOT, report, help }
}

export async function runCli(argv: string[]): Promise<void> {
  const args = parseArgs(argv)
  if (args.help) {
    console.log(HELP)
    return
  }

  if (args.apply && args.applyMedia) {
    console.error('Error: use only one of --apply or --apply-media (not both).\n')
    process.exitCode = 1
    return
  }

  if (args.apply) {
    if (!args.v2Root?.trim()) {
      console.error('Error: set --v2-root <path> or V2_CONTENT_ROOT to the v2 content directory.\n')
      process.exitCode = 1
      return
    }
    console.log('Running live seed (--apply). Ensure pg_dump backup exists before proceeding.')
    const report = await runApply({
      v2Root: args.v2Root.trim(),
      reportPath: args.report?.trim() || undefined,
    })
    console.log(formatApplyReportConsole(report))
    if (report.errors.length > 0) process.exitCode = 1
    return
  }

  if (args.applyMedia) {
    if (!args.v2Root?.trim()) {
      console.error('Error: set --v2-root <path> or V2_CONTENT_ROOT to the v2 content directory.\n')
      process.exitCode = 1
      return
    }
    console.log('Running media restore (--apply-media). Requires files on MEDIA_ROOT and existing projects/news rows.')
    const report = await runApplyMediaRestore(args.v2Root.trim())
    console.log(formatApplyMediaRestoreConsole(report))
    if (report.errors.length > 0) process.exitCode = 1
    return
  }

  if (!args.dryRun) {
    console.error(
      'Error: specify --dry-run for the non-mutating report, or pass --apply / --apply-media for live writes.\n',
    )
    process.exitCode = 1
    return
  }

  if (!args.v2Root?.trim()) {
    console.error('Error: set --v2-root <path> or V2_CONTENT_ROOT to the v2 content directory.\n')
    process.exitCode = 1
    return
  }

  const report = await runDryRun({
    v2Root: args.v2Root.trim(),
    reportPath: args.report?.trim() || undefined,
  })

  console.log(formatReportConsole(report))
  if (args.report?.trim()) {
    console.log('')
    console.log(`Full JSON report written to ${args.report.trim()}`)
  }
}
