import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import { d7LexicalBlocks } from '../blocks/D7LexicalBlocks'

/**
 * Global Lexical config: default editor features + v2 D-7 custom blocks.
 */
export const aprLexicalEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures,
    BlocksFeature({
      blocks: d7LexicalBlocks,
    }),
  ],
})
