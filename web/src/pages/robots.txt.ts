import type { APIRoute } from 'astro'
import { canonical } from '../lib/v9/site'

/**
 * /robots.txt — open door policy. Everything public is crawlable; the CMS
 * admin and raw API are not pages. The AI crawlers that answer questions
 * about the studio are named and explicitly welcomed (GEO/AEO law).
 */
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'PerplexityBot',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'Google-Extended',
  'Applebot-Extended',
  'cohere-ai',
]

export const GET: APIRoute = () => {
  const blocks: string[] = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /api',
    '',
  ]

  for (const bot of AI_CRAWLERS) {
    blocks.push(`User-agent: ${bot}`, 'Allow: /', '')
  }

  blocks.push(`Sitemap: ${canonical('/sitemap.xml')}`, '')

  return new Response(blocks.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
