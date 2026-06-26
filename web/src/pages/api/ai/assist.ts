import type { APIRoute } from 'astro'
import { runAssist, type AssistMode } from '../../../lib/ai/assist'

export const prerender = false

const MODES: AssistMode[] = ['author', 'theme']

/**
 * POST /api/ai/assist  { mode: 'author'|'theme', prompt: string, context?: string }
 * Gated to dev or PUBLIC_ENABLE_STUDIO=true so it never exposes a paid endpoint
 * on the public site until Marco opts in. The Anthropic key stays server-side.
 */
export const POST: APIRoute = async ({ request }) => {
  const enabled = import.meta.env.DEV || import.meta.env.PUBLIC_ENABLE_STUDIO === 'true'
  if (!enabled) return new Response('Not found', { status: 404 })

  let body: any
  try {
    body = await request.json()
  } catch {
    return json({ ok: false, error: 'Invalid JSON body.' }, 400)
  }

  const mode = body?.mode
  const prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : ''
  if (!MODES.includes(mode)) return json({ ok: false, error: 'mode must be "author" or "theme".' }, 400)
  if (!prompt) return json({ ok: false, error: 'prompt is required.' }, 400)

  const result = await runAssist({ mode, prompt, context: body?.context })
  return json(result, result.ok ? 200 : result.needsInstall ? 501 : 500)
}

function json(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}
