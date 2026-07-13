import { postgresAdapter } from '@payloadcms/db-postgres'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Project } from './collections/Project'
import { NewsArticle } from './collections/NewsArticle'
import { DispatchIssue } from './collections/DispatchIssue'
import { FoundingRoll } from './collections/FoundingRoll'
import { aprLexicalEditor } from './editor/aprLexicalEditor'
import { Home } from './globals/Home'
import { SiteSettings } from './globals/SiteSettings'
import { FooterLinks } from './globals/FooterLinks'
import { About } from './globals/About'
import { Contact } from './globals/Contact'
import { Jobs } from './globals/Jobs'
import { Pitch } from './globals/Pitch'
import { Investors } from './globals/Investors'
import { Division212 } from './globals/Division212'
import { Division310 } from './globals/Division310'
import { DivisionNRC } from './globals/DivisionNRC'
import { TroupePage } from './globals/TroupePage'
import { TroupeProgram } from './globals/TroupeProgram'
import { V9Home, V9Slate, V9Craft, V9Methods, V9Contact } from './globals/v9Pages'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const envInt = (value: string | undefined, fallback: number): number => {
  const n = Number.parseInt(value ?? '', 10)
  return Number.isFinite(n) ? n : fallback
}

// ── R2 media storage (inert unless S3_BUCKET is set) ─────────────────────────
// NAS/local keep writing to the local `media/` dir. When S3_BUCKET is set
// (Vercel + Cloudflare R2), uploads go to the bucket instead — required on
// Vercel, whose filesystem is ephemeral. R2 specifics: region is always
// "auto", endpoint is https://<ACCOUNT_ID>.r2.cloudflarestorage.com, and
// forcePathStyle must be true.
const s3Plugins = process.env.S3_BUCKET
  ? [
      s3Storage({
        collections: { media: true },
        bucket: process.env.S3_BUCKET,
        config: {
          endpoint: process.env.S3_ENDPOINT,
          region: process.env.S3_REGION || 'auto',
          credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
          },
          forcePathStyle: true,
        },
      }),
    ]
  : []

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      // v10 admin trim: 'home' (v4 front door) is hidden; no globals wired to live preview.
      globals: [],
      breakpoints: [
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
        { label: 'Tablet',  name: 'tablet',  width: 768,  height: 1024 },
        { label: 'Mobile',  name: 'mobile',  width: 390,  height: 844 },
      ],
      url: () => process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:4321',
    },
  },
  collections: [Users, Media, Project, NewsArticle, DispatchIssue, FoundingRoll],
  globals: [Home, SiteSettings, FooterLinks, About, Contact, Jobs, Pitch, Investors, Division212, Division310, DivisionNRC, TroupePage, TroupeProgram, V9Home, V9Slate, V9Craft, V9Methods, V9Contact],
  editor: aprLexicalEditor,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    // ── THE LAW (Supabase pooler discipline — VMS lesson #1) ────────────────
    // Runtime AND builds use the Supabase TRANSACTION pooler on :6543.
    // The SESSION pooler on :5432 is ONLY for the one-shot pg_dump/pg_restore
    // in scripts/migrate-db-to-supabase.sh. The session pooler caps at ~15
    // clients; Next build workers each open a pool, exhaust the cap, and the
    // data layer silently serves fallback content that LOOKS like missing
    // data. Tiny pools (max 4, min 0) keep serverless instances from pinning
    // connections between invocations.
    pool: {
      connectionString: process.env.DATABASE_URL || '',
      max: envInt(process.env.DB_POOL_MAX, 4),
      min: envInt(process.env.DB_POOL_MIN, 0),
      idleTimeoutMillis: envInt(process.env.DB_POOL_IDLE_TIMEOUT_MS, 10_000),
      connectionTimeoutMillis: envInt(process.env.DB_POOL_CONN_TIMEOUT_MS, 5_000),
    },
    push: false,
    migrationDir: './src/migrations',
  }),
  sharp,
  plugins: [...s3Plugins],
})
