# Block Library Specification (v3)

This document defines the schema, allowed variants, and renderer signatures for the initial 6 starter blocks in the APR 70 Pictures v3 architecture.

These blocks enforce design discipline at the schema level. Editors construct layouts by composing these blocks rather than relying on hardcoded page templates.

## 1. HeroBlock

**Description:**
The primary opening block for a page. Contains a heading, subtext, and optional media.

**Schema (Payload):**
- `heading` (Text, required)
- `subtext` (Text, optional)
- `media` (Upload: Image or Video, optional)
- `variant` (Select: `default` | `split` | `fullscreen`)
- `division` (Select: `pictures-212` | `pictures-310` | `corporate`, default: `corporate`)

**Allowed Variants (Token-locked):**
- `default`: Standard width/padding.
- `split`: 50/50 visual split using the 8px grid system.
- `fullscreen`: 100vh hero block, typically used with immersive media.
Colors and typography are derived from the `division` token (e.g., `--amber` for 212, `--teal` for 310).

**Renderer Signature:**
```astro
---
import type { HeroBlock as HeroBlockType } from 'payload-types';

interface Props {
  block: HeroBlockType;
}

const { block } = Astro.props;
---
```
*(Interactive elements within the Hero will be mounted as a `HeroIsland` React component via `client:idle`)*

## 2. TwoColBlock

**Description:**
A standard layout block featuring a left label/heading and right body content. Used for company info, principles, and jobs sections.

**Schema (Payload):**
- `leftHeading` (Text, required)
- `rightBody` (RichText, required)
- `ratio` (Select: `1-3` | `1-1` | `1-2`, default: `1-3`)
- `alignment` (Select: `top` | `center`, default: `top`)

**Allowed Variants (Token-locked):**
- The `ratio` mapping ensures strict adherence to the grid (e.g. 1-3 means 1 column left, 3 columns right out of a 4-column subgrid).
- Margin and padding strictly use the 8px grid tokens.

**Renderer Signature:**
```astro
---
import type { TwoColBlock as TwoColBlockType } from 'payload-types';

interface Props {
  block: TwoColBlockType;
}

const { block } = Astro.props;
---
```

## 3. GridBlock

**Description:**
An array of typed items rendered as a CSS grid using an auto-fill minmax pattern.

**Schema (Payload):**
- `items` (Array)
  - `title` (Text, required)
  - `subtitle` (Text, optional)
  - `media` (Upload, optional)
  - `link` (Relationship/URL, optional)
- `columns` (Select: `2` | `3` | `4`, default: `3`)

**Allowed Variants (Token-locked):**
- Grid gap locked to `--spacing-grid-gap`.
- Automatically collapses to 1 column on mobile breakpoints.

**Renderer Signature:**
```astro
---
import type { GridBlock as GridBlockType } from 'payload-types';

interface Props {
  block: GridBlockType;
}

const { block } = Astro.props;
---
```

## 4. CTABlock

**Description:**
A Call to Action block with a heading and buttons.

**Schema (Payload):**
- `heading` (Text, required)
- `body` (Text, optional)
- `buttons` (Array, max 2)
  - `label` (Text, required)
  - `url` (Text, required)
  - `variant` (Select: `primary` | `secondary` | `ghost`)

**Allowed Variants (Token-locked):**
- `primary`: Uses UI border token (`--apr-near-black`) or inverted depending on theme.
- `secondary`: Uses `--apr-mid-dark` meta text coloring.
- `ghost`: Transparent background, hover state using system opacity changes.

**Renderer Signature:**
```astro
---
import type { CTABlock as CTABlockType } from 'payload-types';

interface Props {
  block: CTABlockType;
}

const { block } = Astro.props;
---
```

## 5. QuotesBlock

**Description:**
Displays quotes and attributions, either as a single stacked item or a carousel.

**Schema (Payload):**
- `quotes` (Array)
  - `quote` (Text, required)
  - `author` (Text, required)
  - `role` (Text, optional)
- `displayMode` (Select: `stacked` | `carousel`, default: `stacked`)

**Allowed Variants (Token-locked):**
- `stacked`: Outputs quotes vertically with 8px grid spacing.
- `carousel`: Outputs an interactive slider.
- Typography strictly inherits from `Futura Bold` or `Barlow` based on the quote's importance.

**Renderer Signature:**
```astro
---
import type { QuotesBlock as QuotesBlockType } from 'payload-types';

interface Props {
  block: QuotesBlockType;
}

const { block } = Astro.props;
---
```

## 6. RichTextBlock

**Description:**
A standard block for body copy, wrapping Lexical editor content.

**Schema (Payload):**
- `content` (RichText, required)

**Allowed Variants (Token-locked):**
- Allows D-7 inline blocks ported from v2 (`structureDivider`, `button`, `accentText`).
- Typography locked to `Barlow` (body) and `Courier New` (mono/meta).
- `structureDivider` locked to standard UI border colors (`--apr-near-black` or `--offwhite`).

**Renderer Signature:**
```astro
---
import type { RichTextBlock as RichTextBlockType } from 'payload-types';

interface Props {
  block: RichTextBlockType;
}

const { block } = Astro.props;
---
```
