import { getPayload } from 'payload'
import config from './src/payload.config'
import fs from 'fs'
import path from 'path'

async function run() {
  const payload = await getPayload({ config })
  
  // Create a dummy file
  const testFilePath = path.join(__dirname, 'test.txt')
  fs.writeFileSync(testFilePath, 'test')
  
  // Create media
  const media = await payload.create({
    collection: 'media',
    data: { alt: 'test logo' },
    filePath: testFilePath,
  })
  
  console.log('Created media:', media.id)
  
  // Update 212 global
  const global = await payload.updateGlobal({
    slug: '212',
    data: {
      headerLogo: media.id,
      footerLogo: media.id,
    },
  })
  
  console.log('Updated 212 global')
  
  // Fetch with depth 2
  const fetched = await payload.findGlobal({
    slug: '212',
    depth: 2,
  })
  
  console.log('Fetched headerLogo:', JSON.stringify(fetched.headerLogo, null, 2))
  
  process.exit(0)
}

run().catch(console.error)
