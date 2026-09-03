Parallax scrolling on websites is a **multi‑layer scroll effect** where different visual layers move at **different rates** in response to the same scroll input, typically with **background layers moving more slowly than foreground layers**, creating an illusion of depth in a 2D scene.[10][1][4][7][13] Most web definitions describe it as *background content moving at a slower pace than foreground* as the user scrolls, mimicking camera parallax from games and 2D graphics.[10][1][7][13]

---

## Precise definition vs commonly confused patterns

### 1. True parallax scrolling

Core characteristics:

- **Multiple layers** (background, midground, foreground) with independent translation tied to the **same scroll position**.[10][7][13]  
- Each layer’s position is a function of scroll, typically linear with a **rate factor per layer**.  
- **Depth illusion** arises because layers with larger apparent depth move slower; layers perceived as closer move faster.[10][4][7]

Canonical definition from computer graphics:  
> “Parallax scrolling is a technique … where background images move past the camera more slowly than foreground images, creating an illusion of depth in a 2D scene of distance.”[10]

Typical web formulation:  
> “Background content moves at a different speed from the foreground… splitting content into layers that scroll at different rates (background slower) to mimic depth perception.”[7][1][4][13]

So: **parallax scrolling = scroll‑mapped multi‑layer movement at different speeds to simulate depth**, not simply “something moves on scroll.”

### 2. Pinned scroll‑scrubbed scenes (often confused with parallax)

Pinned scrubbed scenes:

- Use **scroll position as a scrubber for a timeline**, often via pinning a section so it stays fixed in the viewport while the scroll drives an animation timeline.  
- The section height is often extended and the viewport “sticks” to the scene while some animation plays (e.g., timeline = 0–1 as the user scrolls 0–100% of the pinned block).  
- This can include camera moves, opacity changes, SVG morphs, etc., none of which have to be multi‑layer or different‑speed.

Key difference:

- **Pinned scrub = scroll → arbitrary timeline**, frequently with pinning.  
- **Parallax = scroll → direct per‑layer position, no need for pin**, and **relative different speeds** are the defining feature.  
- A pinned scene may include parallax, but pinning and scrubbing by themselves do **not** define parallax.

### 3. Zoom/scale on scroll

Zoom/scale on scroll:

- Maps scroll progress to a **scale transform** on one or more elements (e.g., `scale(1 + k * progress)`), often with opacity or blur.  
- Only one “camera” plane is involved; there is no requirement that multiple layers move at different rates.  
- You can’t infer depth from relative motion; you just get a zoom.

Difference:

- **Parallax:** depth is conveyed by **relative translation speed** across layers.[10][4][7]  
- **Zoom‑on‑scroll:** a single object (or group) scales uniformly; no multi‑layer rate difference.  

It can be combined with parallax (e.g., background slow translate + subtle scale), but zoom alone is **not** parallax.

### 4. Scroll‑triggered reveal

Scroll‑triggered reveal:

- Uses scroll position to **trigger entry animations** (fade, slide, clip‑path, etc.) once an element enters a threshold of the viewport.  
- Often implemented with Intersection Observer or CSS scroll‑driven *view* timelines (`animation-timeline: view()`), so the animation runs over part of the viewport exposure.[2][5][14]  
- After reveal completes, the element usually stays static relative to its container.

Difference:

- **Parallax:** element motion is **continuous** and proportional to scroll, with a distinct speed per layer throughout the scroll range.[10][4][7]  
- **Reveal:** scroll only **starts or drives** a one‑off animation; once complete, the element doesn’t keep moving at a different speed relative to the rest of the document.

---

## Standard math for multi‑layer parallax

Let:

- \( \text{scrollY} \) = current vertical scroll position of the document (in px).  
- \( \text{sectionTop} \) = document offset of the parallax section top (in px).  
- \( f \) = **speed factor** for a layer (dimensionless).  
- \( y \) = the translateY we apply to that layer (in px).

We define **local scroll** within the section:

\[
s = \text{scrollY} - \text{sectionTop}
\]

For a simple linear parallax, a common mapping is:

\[
\text{translateY} = y = s \cdot (1 - f)
\]

Interpretation:

- When \( f = 1 \):  
  \[
  y = s \cdot (1 - 1) = 0
  \]  
  Layer does **not move relative to its section**; it tracks the foreground (no parallax).

- When \( f < 1 \) (e.g. \( f = 0.5 \)):  
  \[
  y = s \cdot (1 - 0.5) = 0.5s
  \]  
  The layer moves **less than the scroll**, simulating a **background that lags** behind the main content. Backgrounds often use \( f \) in the range \(0.2–0.8\).

- When \( f > 1 \) (e.g. \( f = 1.5 \)):  
  \[
  y = s \cdot (1 - 1.5) = -0.5s
  \]  
  The layer moves **opposite** or faster than the section; visually, it behaves as a **foreground leading the scroll**, often used for foreground elements that “outrun” the page or drift ahead. Layers perceived as closer can be assigned \( f > 1 \) so they translate more aggressively than base content.[10]

Sign conventions (practical usage):

- With this formula, **background lagging**: \(0 < f < 1\) → positive translateY proportional to scroll but smaller magnitude.  
- **Foreground leading:** \(f > 1\) gives a negative slope, which can be exploited to make elements appear to move faster or in the opposite direction; many implementations clamp or constrain ranges to avoid extreme motion.

Alternative form (explicit rate):

Sometimes implementations express it as:

\[
\text{translateY} = y = s \cdot r
\]

where \( r \) is a **rate** per layer (background e.g. \(r = 0.3\), midground \(r = 0.6\), foreground \(r = 1.2\)). This is equivalent, just with a different parameterization.

---

## Implementation approaches & trade‑offs

### (a) Pure CSS: `perspective` + `translateZ` + scale compensation

Approach:

- Set a **3D context** on a parent:  
  ```css
  .scene {
    perspective: 1000px;
    transform-style: preserve-3d;
  }
  ```
- Each layer receives a `translateZ(z)` to place it “closer” or “farther” from the camera: background layers with larger negative z, foreground less negative or positive.  
- Because CSS 3D transforms change apparent size with Z, you typically compensate with **scale** so the layer fills the viewport (e.g., background with `translateZ(-500px)` and `scale(1.3)`).

Pros:

- Very **compositor‑friendly**: pure `transform` and `perspective` are GPU‑accelerated on modern browsers.  
- Natural depth ordering; you can get realistic parallax and even subtle rotations.  
- No JS required if combined with CSS scroll‑driven animations (`animation-timeline: scroll()` or `view()`).[2][5][14]

Cons:

- **Layout complexity**: 3D transforms can complicate stacking contexts and z‑index behavior, especially with fixed or position:sticky elements.  
- Requires careful **scale compensation** to avoid blurry or oversized assets when placed far back on the Z axis.  
- Historically, different browsers have had quirks in how `perspective` interacts with nested transforms; still requires testing across engines.

Use when:

- You want real 3D depth and can keep a small number of composited layers.  
- You prefer declarative CSS and want to integrate with CSS scroll timelines.

### (b) JS `requestAnimationFrame`: read `scrollY`, set transforms via `data-rate`

Pattern (like aiautomationsociety.ai):

- Elements declare a **parallax rate** in data attributes, e.g. `data-rate="0.4"` or `data-speed="0.6"`.  
- On each animation frame (using `requestAnimationFrame`), JS reads the current `scrollY`, computes local scroll \( s = \text{scrollY} - \text{sectionTop} \), and sets `transform: translateY(...)` per layer.

Pseudo‑implementation:

```js
const layers = document.querySelectorAll('[data-rate]');

function update() {
  const scrollY = window.scrollY;
  layers.forEach(layer => {
    const rate = parseFloat(layer.dataset.rate);
    const sectionTop = layer.parentElement.offsetTop; // or cached
    const s = scrollY - sectionTop;
    const y = s * (1 - rate);  // f = rate
    layer.style.transform = `translate3d(0, ${y}px, 0)`;
  });
  requestAnimationFrame(update);
}

requestAnimationFrame(update);
```

Pros:

- **Flexible**: any mapping, easing, clamping, or responsive adjustments can be implemented.  
- Works in **all modern browsers**, independent of CSS scroll timeline support.  
- Easy to integrate with other JS animation systems.

Cons:

- **Performance risk** if you:
  - Read layout (`offsetTop`, `getBoundingClientRect`) every frame instead of caching.  
  - Write to many DOM nodes per frame.  
- Requires manual handling of **reduced motion** preferences and scroll smoothing interactions.  
- Added JS size and maintenance cost compared to pure CSS.

Use when:

- You need full control over motion curves, or want to support precise mapping beyond what CSS timelines provide.  
- You must support older browsers lacking scroll‑timeline support.

### (c) GSAP ScrollTrigger: scrub on `translateY` (no pin)

Pattern:

- Use GSAP’s ScrollTrigger to bind scroll progress to a tween on `translateY` without pinning:

```js
gsap.to('.layer', {
  y: (index, target) => /* computed offset */,
  scrollTrigger: {
    trigger: '.section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
    // pin: false
  }
});
```

Characteristics:

- **scrub: true** ties the animation progress **continuously** to scroll position, which matches parallax’s continuous relationship.  
- Each layer can have its own target `y` end value or custom function; effectively you implement your rate factor via GSAP’s `progress` mapping.  
- No pin: the viewport doesn’t stick to the section; the section flows naturally.

Pros:

- Battle‑tested in production; ScrollTrigger manages **start/end offsets, responsive resizing, and viewport changes**.  
- Simple to define complex timelines (e.g., multiple layers with different easing, offsets).  
- Integrates with GSAP’s broader animation ecosystem.

Cons:

- Adds a **non‑trivial JS payload** (GSAP + ScrollTrigger).  
- Requires careful **configuration** to avoid jank (limit number of triggers, avoid heavy DOM in each tick).  
- Need explicit handling of **`prefers-reduced-motion`** in GSAP (e.g., disabling ScrollTrigger or setting durations to zero) for accessibility.

Use when:

- You already use GSAP, want **scroll‑scrubbed multi‑layer motion**, and want GSAP’s convenience (responsive adjustments, built‑in debug tooling).

### (d) CSS scroll‑driven animations (`animation-timeline: view()` etc.) as of ~2026

Concept:

- CSS scroll‑driven animations replace time‑based timelines with **scroll or view timelines**.[2][5][14]  
- `animation-timeline: scroll()` ties animation progress to the scroll container’s scroll range.  
- `animation-timeline: view()` ties progress to **element visibility** in the viewport, functioning like a declarative Intersection Observer.[2][5][14]

Example:

```css
@keyframes parallaxLayer {
  from { transform: translateY(0); }
  to   { transform: translateY(-100px); }
}

.layer {
  animation-name: parallaxLayer;
  animation-duration: 1s; /* acts as scaling factor */
  animation-timing-function: linear;
  animation-fill-mode: both;
  animation-timeline: scroll();
}
```

Browser support (~2025–2026):

- Guides on CSS scroll timeline note **full support** in Chromium‑based browsers (Chrome/Edge) from about version 115+, Firefox from ~110+, and Safari from ~17.5+.[5][2][14]  
- Community notes indicate that by 2026, **Firefox was the last major browser not enabling scroll‑driven animations by default**, but development is in progress.[11][8]  
- Chromium and WebKit blog posts describe scroll and view timelines as **shipping features** with growing support.[2][5]

Pros:

- **No JS**: declarative, uses the browser’s compositor and scroll pipeline directly.  
- Great for **simple parallax** and scroll‑triggered reveals: you can define different keyframes per layer, and tie them to scroll or view timelines.  
- Smaller code footprint, easier to respect **`prefers-reduced-motion`** via media queries and animation overrides.

Cons:

- Requires **modern browsers**; older versions lack support or have it behind flags.[5][11][8]  
- Less flexible than JS for complex dynamic mapping (e.g., per‑device rates, interactive reconfiguration).  
- Tooling and documentation are still maturing compared to JS ecosystems.

Use when:

- Target audience is on **modern Chrome/Edge/Safari/Firefox** with scroll‑timeline support.  
- You prioritize **maintainability, declarative animation, and minimal JS**.

---

## Smooth scrolling (Lenis, GSAP ScrollSmoother): feel, math, and when to avoid

### How smooth scroll changes the feel

Smooth scroll libraries like **Lenis** and **GSAP ScrollSmoother** modify the relationship between **user input** and **effective scroll position**:

- Instead of letting `scrollY` jump instantly to its new value on wheel/touch, they compute an intermediate “virtual” scroll position with **interpolation** (lerp) or eased progression over time.  
- Essentially, on each frame they do:

\[
\text{virtualScrollY}_{t+1} = \text{lerp}(\text{virtualScrollY}_t,\ \text{targetScrollY},\ \alpha)
\]

where \( \alpha \) is a smoothing factor \(0 < \alpha \le 1\). Lower \( \alpha \) → more smoothing, more **latency** between user input and visual movement.

Effects:

- Motion feels **glossy and inertial**, which can amplify the perceived depth of parallax.  
- But it also adds **latency**: content responds slightly after input, which some users experience as less responsive or motion‑sick.

### Lenis specifics (including `prefers-reduced-motion`)

The Lenis documentation explicitly states:

- By default, Lenis **honors `prefers-reduced-motion`**: when set to `reduce`, smoothing is disabled; **lerp is forced to 1**, making scroll track input 1:1 and making programmatic scrolls jump instantly.[6]  
- A `respectReducedMotion` option (default `true`) controls this behavior; `lenis.prefersReducedMotion` reports whether reduced motion is active.[6]

So, with Lenis:

- Normal case: `lerp < 1` → **smoothed** virtual scroll; parallax transforms are driven by that virtual value.  
- Reduced motion: `lerp = 1` → **no smoothing**, so parallax still works but without lag; programmatic scrolls are instant (no easing).[6]

Lenis pros:

- **Lightweight** and designed to work with native DOM structure; it doesn’t reposition everything into a master scroller, so it plays better with other libraries.[3][6][12][15]  
- Built‑in respect for `prefers-reduced-motion` is a strong accessibility win.[6]

Lenis cons / when to avoid:

- Smooth scroll can **conflict with default browser behaviors**, e.g., anchor jumps or OS‑level touch expectations; community reports issues with anchor scrolling and certain use cases.[12]  
- If your content is very **text‑heavy** or needs **precise, latency‑free interactions** (e.g., forms, productivity tools), smoothing may feel sluggish or disorienting.  
- If users are sensitive to motion, even with reduced motion preference off, heavy smoothing plus parallax can increase the risk of discomfort.

### GSAP ScrollSmoother characteristics

From comparisons:

- ScrollSmoother operates by treating a **central container as the scroll origin**, then smoothing scroll across that origin.[3][9]  
- This can lead to layout issues with **absolutely positioned elements in tall containers**: the center origin shifts, forcing ScrollSmoother to constantly recalc layout, causing alignment drift or unpredictable motion.[3]  
- Born Digital notes that ScrollSmoother fixes some integration issues found in other smooth scroll libraries (e.g., Locomotive Scroll), and lets you control individual **scroll speed and scroll lag** attributes per element.[9]

Pros:

- Deep integration with GSAP: you can control **per‑element scroll speed/lag**, making parallax configuration straightforward.[9]  
- Addresses some known issues from other smooth scroll libraries.[9]

Cons / when to avoid:

- More complex layout requirements: central origin model can break with complex positioning, causing drift.[3]  
- Like all smooth scroll, introduces **latency** and can affect UX for content‑heavy sites.  
- Requires separate handling to respect **`prefers-reduced-motion`**; this is not automatic like Lenis’s default.[6][3][9]

Avoid smoothing when:

- You’re building **utility, documentation, or form‑heavy interfaces** where immediacy matters more than cinematic feel.  
- Users are likely to have **motion sensitivity**, or your brand requires strictly functional, non‑cinematic behavior.  
- You rely heavily on **native browser scroll behaviors** (jump links, focus management, built‑in scrolling on elements).

---

## Performance rules for parallax scroll

### 1. Transform‑only, avoid layout on scroll

- Use **`transform` (translate, scale, rotate)** for motion; avoid changing `top/left`, `height`, or other properties that cause layout or paint.  
- Translate with `translate3d(0, y, 0)` or `transform: translateY(y)`; avoid animating `margin` or `position` offsets.  

Reason: modern browsers move transform animations to the **compositor**, avoiding main‑thread layout and paint, which is critical for smooth scrolling and parallax.[2][5]

### 2. Use `will-change` judiciously to promote compositor layers

- Apply `will-change: transform` on elements that will be animated, to hint to the browser to create a **separate compositing layer**.  
- Do this sparingly: too many layers increase memory and can hurt performance. Use it only for genuinely animated elements (parallax layers, foreground hero content).

### 3. Limit number and size of layers; optimize images

- Keep the number of parallax layers small (often 3–5 layers: background, midground, foreground).  
- Use **optimized image sizes**:  
  - Raster backgrounds should be **appropriately sized** for max display resolution plus some parallax margin.  
  - Use modern formats (AVIF, WebP) and responsive variants (`srcset`/`sizes`).  
- Avoid gigantic background textures that are scaled up via CSS; large GPU textures increase memory and can cause jank when composited.

### 4. Avoid expensive per‑frame operations

In JS implementations (requestAnimationFrame or GSAP):

- **Cache `sectionTop` and element references**, recompute only on resize or layout changes; do not call `getBoundingClientRect()` for many nodes in every frame.  
- Avoid per‑frame DOM reads that cause **layout thrash**; keep the animation pipeline write‑only where possible (read scroll once, then write transforms).  
- Avoid animating hundreds of elements simultaneously; limit parallax to a handful of key layers.

In CSS timeline implementations:

- Keep keyframes **simple** (transform/opacity); avoid animating clip‑paths or filters over large areas unless absolutely necessary, as these may not be fully composited on all engines.

---

## Accessibility: `prefers-reduced-motion` and parallax

The key rule: **respect `prefers-reduced-motion`**.

- Lenis explicitly documents honoring `prefers-reduced-motion`: when the user preference is `reduce`, smoothing is disabled, with **lerp forced to 1** so scroll tracks input exactly and programmatic scrolls are instant; Lenis continues running only to keep WebGL/DOM sync intact.[6]  
- It exposes `respectReducedMotion` (default `true`) and `lenis.prefersReducedMotion` so your own animations can adapt.[6]

Implications for parallax:

- When `prefers-reduced-motion: reduce`:

  - **Disable parallax** or reduce rates dramatically (e.g., set all `f = 1` so layers don’t move differently from the document), or switch to a static background.  
  - In JS implementations, gate the parallax logic:

    ```js
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      // Skip parallax transforms or set them to 0
    }
    ```

  - In CSS, use media queries:

    ```css
    @media (prefers-reduced-motion: reduce) {
      .parallax-layer {
        animation: none;
        transform: none;
      }
    }
    ```

- Reduce **smoothing** and **camera‑like movement**: heavy smoothing + deep parallax can be among the most motion‑intense patterns; users with vestibular issues are particularly affected.

As scroll‑driven CSS animations become standard, respecting `prefers-reduced-motion` via CSS media queries and animation overrides is the baseline expectation for accessible parallax and scroll effects.[6][2][5][14]

---

**Summary of key distinctions:**

- **Parallax scrolling:** multi‑layer, different speeds, depth illusion.[10][4][7][13]  
- **Pinned scrub:** scroll driving a timeline while a section is pinned; may include parallax but is not inherently parallax.  
- **Zoom on scroll:** scale‑driven, typically single‑plane; no differential layer speed.  
- **Scroll‑triggered reveals:** scroll starts/controls discrete animations, not continuous multi‑rate motion.

**Core math:** \( y = (\text{scrollY} - \text{sectionTop}) \cdot (1 - f) \) with \( f < 1 \) for background lag, \( f > 1 \) for foreground lead.  

Use transform‑only animation, compositing hints, optimized assets, and strict `prefers-reduced-motion` handling to keep parallax both performant and accessible.[2][5][6][10][7][13]

SOURCES
https://www.wix.com/blog/what-is-parallax-scrolling-explained-with-examples
https://webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css/
https://zuncreative.com/blog/smooth_scroll_meditation/
https://www.framer.com/blog/parallax-scrolling-examples/
https://dev.to/softheartengineer/mastering-css-scroll-timeline-a-complete-guide-to-animation-on-scroll-in-2025-3g7p
https://github.com/darkroomengineering/lenis
https://webflow.com/blog/parallax-scrolling
https://connect.mozilla.org/t5/ideas/implement-css-scroll-driven-animations-animation-timeline/idi-p/116931
https://www.borndigital.be/blog/our-smooth-scrolling-libraries
https://en.wikipedia.org/wiki/Parallax_scrolling
https://www.reddit.com/r/firefox/comments/1nl63n5/as_of_today_mozilla_firefox_is_the_only_major/
https://forum.bricksforge.io/t/new-smooth-scrolling-provider-lenis/386
https://www.sleeplessmedia.com/articles/understanding-parallax-style-website-design-and-how-it-works
https://www.reddit.com/r/webdev/comments/1sy4uwv/scrolldriven_animations/
https://tympanus.net/codrops/2026/05/28/the-never-ending-story-building-a-seamless-infinite-scroll-experience-with-gsap-lenis/