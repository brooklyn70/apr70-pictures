For a single-photo, diorama‑style parallax section, the most convincing implementations cut the image into **3–6 depth layers**, give each layer **extra vertical bleed**, and drive them with **scroll factors between ~0.3 and ~1.2** (relative to scroll), with no zoom. Firewatch and many Awwwards / agency sites stay in this band; when you push much beyond **~1.3×** on foreground layers or start scaling, it reads as gimmick rather than depth.[8][12]

Below is a practical, numbers‑driven breakdown tailored to a 100vh section with one photographic still.

---

## 1. Layer preparation: cutouts, fills, bleed

### 1.1. Separating one photograph into depth layers

The pattern from multi‑layer parallax examples (Firewatch hero, various Awwwards winners, multi‑layer tutorials) is:

- **Background / sky layer**
  - The original sky, distant mountains, buildings, etc.[8][3]
  - Often extended or painted to cover extra vertical space as it will move slower than scroll (so you see “more” sky as you move).[3][8]

- **Midground / subject layer**
  - The main subject: character, building, or product, extracted with alpha.[3][6]
  - This is usually the visual anchor and often moves at or slightly below scroll speed to feel “stable”.[7][8]

- **Foreground layers**
  - Trees, foreground hills, dust, light flares, UI framing elements.[8][3]
  - Several layers (foreground‑1, foreground‑2) can be used with increasing speed to amplify depth, similar to Firewatch’s 5–6 layers.[8]

Per Firewatch analyses and recreations, the original hero often uses **about six discrete depth layers** (sky, distant mountains, near mountains, trees, foreground trees, UI overlay).[8][11]

**Implementation notes:**

- Export **each layer as a transparent PNG / WebP** with alpha.
- Keep the **base canvas size at least equal to the viewport** (e.g., 1920×1080 for desktop) so there is no scaling at runtime; all motion is translation.

### 1.2. Background fill behind subject cutouts

When you cut the subject out of the original photo, you must **fill the “hole”** in the background layer so that when layers move relative to each other you don’t expose the transparent gap.

Typical practice (also seen in parallax tutorials and multi‑layer guides):

- Duplicate the base photo.
- Remove the subject to create a **clean plate**:
  - Use content‑aware fill or manual painting to reconstruct the background.[6][3]
- This clean plate is your **background layer**; the subject lives on its own, above, with alpha.

This is mandatory whenever midground or foreground layers move relative to the background; otherwise you get visible halos or seams when scrolling.

### 1.3. Vertical bleed: how much extra height per layer?

You need **extra vertical pixels** because layers are translated vertically relative to scroll. Fast‑moving layers travel further; if their intrinsic height equals the viewport, you will reveal blank edges.

Assume:

- Section height \( H \) (in px) — for a 100vh section at 1080px viewport height, \( H ≈ 1080 \).
- Scroll factor \( f \) for a layer:
  - The layer’s vertical translation \( T ≈ f \times H \) over the section.

To ensure no edges show:

- **Minimum layer height** \( \ge H + |T_{\text{max}}| \)
- If you center the layer and allow translation up and down, double that margin.

A practical simple rule for a single‑direction scroll (top→bottom):

- For a layer with factor \( f \), extra height \( \Delta H ≈ (|f-1|) \times H \)

But because you often animate from one section to the next, a safer, production‑style heuristic:

- **Background (f ≈ 0.4–0.7):**  
  - Max additional movement vs page: roughly \(|1 - f| \times H\).  
  - For \(f = 0.5\), \(|1-0.5| × H = 0.5H\).  
  - So **background height ≈ 1.5H** (≈ 150vh).
- **Subject / midground (f ≈ 0.8–1.0):**
  - Extra movement small, but allow some slack for chaining sections.  
  - **Height ≈ 1.2H** (≈ 120vh).
- **Foreground slow (f ≈ 1.1–1.2):**
  - \(|1.2-1| × H = 0.2H\)  
  - **Height ≈ 1.4H** to be safe.
- **Foreground faster (f up to ≈ 1.3 in tasteful sites):**
  - \(|1.3-1| × H = 0.3H\)  
  - **Height ≈ 1.5H–1.6H**.

To keep math simple in a pipeline, many teams pre‑export **all layers at ~150–200vh** relative height for a 100vh section, then crop via CSS masks / overflow clipping to the visible region.

---

## 2. Typical scroll rates per layer (100vh section)

Modern parallax guidance (Framer, Vev, MagneticPoint, etc.) converges on:

- Background moves **slower than scroll**.
- Foreground moves **slightly faster than scroll**.
- Subject / key content stays **close to scroll speed** for comfort.[7][3][8][10]

Translate that to concrete factors (layer transform offset vs scroll delta):

For a 100vh section:

- **Background / sky**: \( f_{bg} ≈ 0.3–0.6 \)
  - Apple‑style product pages often stick in this zone: background image lagging behind the content so it “drifts” more slowly.[1][4][8]
- **Distant midground** (mountains, buildings): \( f ≈ 0.6–0.8 \)
- **Main subject** (hero character / product): \( f_{subject} ≈ 0.8–1.0 \)
  - Often **≈0.9–1.0** on Apple‑like pages so it feels anchored to the scroll and readable.[4][7]
- **Near foreground** (trees, rocks, frame elements): \( f ≈ 1.05–1.2 \)
- **Closest foreground accents** (sparks, particles): \( f ≈ 1.1–1.25 \)

Firewatch’s parallax hero (original game marketing site and clones) spreads six layers roughly within this pattern: very slow sky/distant mountains, slightly faster mid mountains, near trees ≈1×, foreground trees and UI just above 1×.[8][11][2][14]

**Key point for cinematic diorama:**  
Avoid **foreground factors above ≈1.3**; beyond that, the foreground appears to “slide off” the scene and feels like a UI gimmick, which many UX critiques (NN/g) flag as distracting and fatiguing.[10][7][8]

---

## 3. Should the subject move slower or faster than the page?

For film / photography sites that want a diorama, the subject usually:

- **Moves slightly slower than the page** or **at exactly scroll speed**:
  - Keeps the subject visually stable and legible.[7][10]
  - Maintains focus: background and foreground “peel” around the subject, but the subject doesn’t drift far.
- Concrete recommendation:
  - **Subject factor** \( f_{subject} ≈ 0.9–1.0 \).

Patterns from Apple product pages and premium parallax sites:

- Apple’s hero devices often track close to scroll speed, with **background gradients and imagery lagging**, not the device itself.[1][4][8][10]
- On Firewatch, UI/logo overlays tend to move closer to 1×, with background art slower; the “world” moves relative to a nearly fixed title block.[8][11][14]

For a film production homepage, this translates to:

- Subject (actor, frame still) **≈0.9–1×**.
- Background sky **≈0.5**.
- Foreground trees / silhouettes **≈1.1–1.2**.

This yields a clear parallax without making the hero feel detached.

---

## 4. Headline text: placement, rate, legibility

### 4.1. Placement between layers

Common patterns on award‑winning parallax / agency sites and tutorials:

- Place headline text **in its own layer**:
  - Logically between midground and foreground (z‑order).
  - Physically, you may wrap it in a separate element with **position: absolute/fixed** inside the section, with its own scroll factor.[7][6][14]

- Two common strategies:
  1. **Pinned / nearly pinned headline** (factor ≈0–0.3):
     - The text barely moves relative to the viewport while the image layers drift behind and in front.
     - Gives a “camera sliding through a diorama while a title card floats in space” feel.
  2. **Text slightly slower than subject** (e.g., subject 0.9, text 0.8):
     - Creates gentle separation and avoids text drifting off too fast, enhancing readability.

Firewatch clones and tutorials often place overlay text inside the same container as a particular layer and assign **the same modifier**, so text tracks exactly with that layer for coherence.[14][11]

### 4.2. Keeping text legible

Common techniques on Apple‑like and Awwwards‑type parallax sites:

- **Separate layer, independent background:**
  - Use a **semi‑transparent backing plate** (e.g., black at 40–60% or blurred panel) behind the headline.[7][6]
  - This layer can be pinned while image layers move behind it.

- **High contrast with image:**
  - Large, bold typography.
  - Text color chosen for contrast with the subject layer (often white over darkened still).

- **Avoid large relative motion under text:**
  - When background and foreground move too much under text, reading becomes difficult; NN/g explicitly criticizes these cases for usability.[10]
  - For main headline, keep underlying layers’ delta within **≈20–30% of viewport height** over the time the user reads.

For your case:

- Place **headline text layer between subject and foreground**.
- Give it factor **≈0.7–0.9**, with a **soft mask or panel** to stabilize contrast.
- Ensure background under text darkens slightly (color grading) to keep micro‑contrast.

---

## 5. Chaining successive sections

To maintain a **continuous diorama feel down the entire page**, well‑executed parallax sites (including Firewatch‑style sections and Awwwards winners) do:

1. **Section‑by‑section parallax, not infinite scroll hijacking:**
   - Each section is a **100vh block** with its own parallax stack.[8][12][9]
   - Scroll is normal; no forced scroll‑jacking (NN/g criticizes Apple’s older parallax pages where users saw blank frames before animations triggered).[10]

2. **Shared scroll coordinate or timeline:**
   - Instead of resetting animations per section, they map the global scroll position into each section’s local range.
   - Layers often **crossfade or cross‑slide** between sections:
     - The background sky of section A continues as section B’s background with different mid/foreground elements.
     - Rate factors remain consistent, so the eye reads a continuous depth.

3. **Overlapping transitions:**
   - To chain photos, many sites:
     - Fade the foreground of the outgoing section while fading in the foreground of the next.
     - Maintain a relatively stable background tone so sky/atmosphere feels persistent.

Concrete pattern:

- Each **100vh section**:
  - Scroll span: 100vh (one full viewport).
  - Scroll factors per layer are consistent across sections (e.g., background 0.5, subject 0.9, foreground 1.15).
- Between sections:
  - Opacity animation: outgoing section fades from opacity 1→0 over the last 30% of its scroll span.
  - Incoming section fades from 0→1 over the first 30% of its span.

This matches how many Awwwards / case-study sites maintain continuity without heavy scroll hijacking.[9][12][7]

---

## 6. Concrete numeric recipe for your scenario

For a **single cinematic photo** per section, 100vh tall, with **3 primary layers**:

Assume viewport \(H = 1080\) px.

**Layer setup:**

- **Background (sky / distant set):**
  - Scroll factor: **0.5**.
  - Image export height: **≈1.5H** (1620 px).
  - Positioned so that at top of section, the extra height is evenly distributed above/below visible region.

- **Midground subject:**
  - Scroll factor: **0.9**.
  - Image export height: **≈1.2H** (≈1296 px).
  - Anchored around the frame’s key subject (rule of thirds or center).

- **Foreground (framing elements):**
  - Scroll factor: **1.15**.
  - Image export height: **≈1.5–1.6H** (≈1620–1728 px).

**Headline text:**

- Scroll factor: **0.8**.
- Placed between subject and foreground.
- Backed with a **semi‑transparent black rectangle** (e.g., rgba(0,0,0,0.5)) to stabilize.

You can expand to **5–6 layers** like Firewatch:

- Sky: 0.3–0.4
- Far mountains/buildings: 0.5
- Mid buildings/trees: 0.7
- Subject: 0.9
- Near foreground objects: 1.1
- UI / foreground accents: 1.15

All while staying within comfortable ranges observed in praised implementations.[8][3][7][12]

---

## 7. Common mistakes and the numeric thresholds that cause them

### 7.1. Parallax “feels like nothing”

Typical problems flagged by designers and UX experts:

- **Rates too close to 1.0:**
  - Background at 0.9, subject at 1.0, foreground at 1.05 yields <10% difference; on a 1080px scroll, layers differ by \<100px. On many displays this reads as noise, not depth.
  - For a visible effect, aim for **at least ~0.2 difference** between background and foreground factors (e.g., 0.5 vs 1.1).

- **Sections pinned / content static:**
  - If you pin everything or overuse scroll‑jacking, users feel like nothing is happening until triggers fire. NN/g documents complaints where users saw “almost nothing on the screen” due to parallax animations misaligned with scroll.[10]

- **Too much easing / delayed response:**
  - Applying heavy easing (e.g., spring or 600ms ease‑out) to scroll‑linked transforms causes lag.  
  - The practical guideline is **no more than ~100–150ms interpolation** for scroll‑linked elements. Longer eases break the “attached to scroll” illusion.

### 7.2. Parallax “feels like a gimmick”

Patterns called out negatively in UX and design critiques:

- **Rates too far apart:**
  - Background ~0.1 and foreground ~2.0+ cause huge separation; the scene disintegrates into independent sprites rather than a diorama.
  - For tasteful cinematic depth, keep **foreground factors ≤1.3** and background ≥0.3.[7][8][10]

- **Foreground faster than ~1.3×:**
  - Above ≈1.3, the foreground slides unrealistically fast and draws attention away from content. It’s common in “wow” demos but rarely in refined production sites.
  - Game sites like Firewatch and curated parallax examples keep their fastest layers **just slightly above 1×**, not double.[8][3][12]

- **Elements scaling with scroll:**
  - Raster parallax variants include scaling or zooming the background.[8]
  - On cinematic photography, uncontrolled **scale >1.05×** over a 100vh span feels like camera zoom rather than depth; when combined with large translation it becomes disorienting.
  - High‑end product / film pages generally **avoid continuous zoom** and rely on pure translation for scroll sections; zoom is reserved for discrete “step” transitions (e.g., separate scenes).[1][4][8]

- **Too many moving layers:**
  - While Firewatch uses six layers, it restricts parallax to a hero segment and keeps motion restrained.[8]
  - Awwwards selectors and UX research warn against animating every element; limit active layers to **3–6** and keep the rest static or fading.[7][9][12]

---

## 8. Summary of practical constraints for your film homepage

- **Layers:** 3–6, each with alpha cutouts and a properly filled background plate.
- **Scroll factors (relative to scroll):**
  - Background: **0.3–0.6**
  - Subject: **0.8–1.0**
  - Foreground: **1.05–1.2** (never beyond ≈1.3 for serious sites).
- **Vertical bleed per layer:**
  - Export heights between **120–160vh** depending on factor; 150vh is a robust default for backgrounds and fast foregrounds.
- **Text:**
  - Own layer, factor **≈0.7–0.9**, placed between subject and foreground with a stabilizing background.
- **Chaining sections:**
  - Each 100vh, consistent factors, subtle crossfades instead of scroll hijack.
- **Avoid:**
  - Factors all clustered near 1.0.
  - Foreground factors >1.3.
  - Long easing (>150ms) on scroll‑linked transforms.
  - Zoom/scaling on elements if you want a grounded diorama, not a showy gimmick.

These ranges align with how Firewatch’s multi‑layer hero, curated parallax examples, and premium product pages achieve depth without sacrificing clarity or usability.[8][3][7][9][10][12]

SOURCES
https://www.protopie.io/blog/parallax-effect
https://www.reddit.com/r/web_design/comments/2pe82b/a_great_example_of_parallax_scrolling_used_well/
https://www.vev.design/blog/parallax-website-examples/
https://stackoverflow.com/questions/34425359/apples-website-parallax-effect
https://forum.bricksbuilder.io/t/multi-layered-parallax-effect/24799
https://www.wix.com/playground/post/how-to-create-a-multi-layered-parallax-website
https://www.framer.com/blog/parallax-scrolling-examples/
https://www.magneticpoint.com/blog/what-is-parallax-scrolling-website-top-5-examples-jaw-dropping-websites
https://www.awwwards.com/websites/parallax/
https://www.nngroup.com/articles/parallax-usability/
https://webflow.com/made-in-webflow/website/fire-watch-parallax
https://www.awwwards.com/30-great-websites-with-parallax-scrolling.html
https://developer.apple.com/app-store/product-page-optimization/
https://stackoverflow.com/questions/59510139/firewatch-parallax-effect-with-another-div-above-with-content
https://www.reddit.com/r/web_design/comments/1elqheh/how_to_design_the_crazy_animated_sites_like_on/