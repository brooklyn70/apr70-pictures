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

/**
 * Recursively find `.json`, `.md`, or `.yaml` files under v2 content root.
 * Classification uses path segments (`pages`, `projects`, `content/pages`, …).
 */
export async function discoverJsonDocuments(v2Root: string): Promise<V2DiscoveredFile[]> {
  const resolved = path.resolve(v2Root)
  
  // Check if there is a 'content' subfolder (common in Keystatic/Payload exports)
  const contentDir = path.join(resolved, 'content')
  const searchDir = existsSync(contentDir) ? contentDir : resolved

  const out: V2DiscoveredFile[] = []
  await walkDir(searchDir, resolved, out)
  
  // If we found nothing and we were searching the subfolder, try the root too
  if (out.length === 0 && searchDir !== resolved) {
    await walkDir(resolved, resolved, out)
  }

  return out
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

  const supportedExtensions = new Set(['.json', '.md', '.mdx', '.yaml', '.yml'])

  for (const ent of entries) {
    const abs = path.join(dir, ent.name)
    const rel = path.relative(root, abs)
    if (ent.isDirectory()) {
      if (SKIP_DIRECTORY_NAMES.has(ent.name)) continue
      await walkDir(abs, root, out)
    } else if (ent.isFile()) {
      const ext = path.extname(ent.name).toLowerCase()
      if (supportedExtensions.has(ext)) {
        out.push({
          absolutePath: abs,
          relativePath: rel,
          kind: classifyRelative(rel),
        })
      }
    }
  }
}

