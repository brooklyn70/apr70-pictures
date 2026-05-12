import { existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import path from 'node:path'

import type { V2DiscoveredFile, V2DocumentKind } from './types.js'

/** Skip when walking a full repo checkout by mistake (not a v2 content export tree). */
const SKIP_DIRECTORY_NAMES = new Set([
  'node_modules',
  '.git',
  '.next',
  'dist',
  'coverage',
  '.turbo',
  '.vercel',
  '_archived',
  '.pnpm-store',
  'email-server',
])

function classifyRelative(rel: string): V2DocumentKind {
  const n = rel.replaceAll('\\', '/').toLowerCase()
  if (n.includes('/pages/') || n.startsWith('pages/')) return 'page'
  if (n.includes('/projects/') || n.startsWith('projects/')) return 'project'
  if (n.includes('/content/pages/')) return 'page'
  if (n.includes('/content/projects/')) return 'project'
  return 'unknown'
}

async function walkDir(
  dir: string,
  root: string,
  out: V2DiscoveredFile[],
): Promise<void> {
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return
  }

  for (const ent of entries) {
    const abs = path.join(dir, ent.name)
    const rel = path.relative(root, abs)
    if (ent.isDirectory()) {
      if (SKIP_DIRECTORY_NAMES.has(ent.name)) continue
      await walkDir(abs, root, out)
    } else if (ent.isFile() && ent.name.toLowerCase().endsWith('.json')) {
      out.push({
        absolutePath: abs,
        relativePath: rel,
        kind: classifyRelative(rel),
      })
    }
  }
}

/**
 * Recursively find `.json` files under v2 content root.
 * Classification uses path segments (`pages`, `projects`, `content/pages`, …).
 */
export async function discoverJsonDocuments(v2Root: string): Promise<V2DiscoveredFile[]> {
  const resolved = path.resolve(v2Root)
  const contentDir = path.join(resolved, 'content')
  if (!existsSync(contentDir)) {
    return []
  }
  const out: V2DiscoveredFile[] = []
  await walkDir(contentDir, resolved, out)
  return out
}
