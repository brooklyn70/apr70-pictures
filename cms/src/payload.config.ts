import { postgresAdapter } from '@payloadcms/db-postgres'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Project } from './collections/Project'
import { NewsArticle } from './collections/NewsArticle'
import { aprLexicalEditor } from './editor/aprLexicalEditor'
import { Home } from './globals/Home'
import { SiteSettings } from './globals/SiteSettings'
import { FooterLinks } from './globals/FooterLinks'
import { About } from './globals/About'
import { Contact } from './globals/Contact'
import { Jobs } from './globals/Jobs'
import { Pitch } from './globals/Pitch'
import { Investors } from './globals/Investors'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      globals: ['home'],
      breakpoints: [
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
        { label: 'Tablet',  name: 'tablet',  width: 768,  height: 1024 },
        { label: 'Mobile',  name: 'mobile',  width: 390,  height: 844 },
      ],
      url: () => process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:4321',
    },
  },
  collections: [Users, Media, Project, NewsArticle],
  globals: [Home, SiteSettings, FooterLinks, About, Contact, Jobs, Pitch, Investors],
  editor: aprLexicalEditor,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    push: false,
    migrationDir: './src/migrations',
  }),
  sharp,
  plugins: [],
})
