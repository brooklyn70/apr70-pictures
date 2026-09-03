# 2026-09-02 — Layered-cinema POC: NO GO, reshape or scrap

**Ruled by:** Marco, 2026-09-02 evening, after reviewing `/?design=layered` on the dev server.
**Branch:** `poc/layered-cinema` (commit `0ab0662` is the build-verified state). Not merged, not deployed.

## The verdict, in Marco's words

"There's no parallax movement, nothing interesting in the browser aside from flickering, sprocket holes and a triangle light." "If you would have taken that image even, with the fireworks separated as a layer, the woman as a layer, the ferris wheel... but you cropped it into a film frame. Not what I was looking for at all."

## What was built versus what was meant

- **Built:** plan §C.2, a five-layer composition of chrome AROUND the photograph: grain, a title-card silhouette, a gradient beam, the existing PhotoFold picture inside a 1.85 film gate with perf rows, a sprocket rail. Scroll offsets were 0.05 to 0.16 of the fold height by design ("all small on purpose"), which is 40 to 130px across the whole fold, and the fold scrolls away as it moves. It reads as static. The "flickering" is the grain `steps()` flicker plus the dust loop.
- **Meant:** depth INSIDE the photograph. The still cut into planes (sky and fireworks, the woman, the ferris wheel and pier, foreground) that move at different rates with scroll and pointer, full-bleed, so the picture itself has parallax. The film chrome was never the point.

## Why the miss happened

The brief in plan §C was written from the codebase's own vocabulary (rails, gates, beams) and the word "restrained", not from a reference Marco had pointed at. The eight inspiration links in plan §D were each judged "visual reference only" or "not used" and none shaped the composition. No mock, still, or motion sketch of the direction was shown to Marco before two sessions built and verified it. Verification was thorough on the wrong target: build, pixel diffs, probes all passed.

## Lesson (durable)

For design work, the finish line is Marco recognising the direction, not the build passing its checks. Before building a look: name the one reference it is copying the feel of, show a static mock or a five-second motion sketch of the actual page, and get a yes. "Restrained" motion ratios under 0.2 of a fold read as nothing on a real screen.

## What a reshape needs from Marco (asked 2026-09-02)

1. The reference: which site or video moment shows the depth effect wanted. A link or a ten-second screen recording.
2. Confirmation that the effect is depth inside the photo (plates cut from the still), full-bleed, driven by scroll and pointer.
3. Plates: either a layered PSD, or a go for the agent to cut three or four plates from the full-resolution master (segmentation plus inpainting behind the woman) and where that master lives.
4. Whether any film chrome survives (perfs, rail, beam) or all of it goes.
5. Scope: the home fold only, or the treatment on every route's fold.

## What survives regardless

The exposure mechanism (`?design=layered` / `?design=marquee`, `localStorage['apr70-design']`, the pre-paint stamp), the scoped theme file pattern, the island guard pattern (reduced motion, coarse pointer, splash wait), the screenshot helper, and the proof that the switch costs the marquee design zero pixels. The five layer components are disposable.

## Addendum, same night: the depth sketch was killed too

A second attempt (a standalone sketch, not in the site: each still cut into photographic plates, sections pinned, subjects scaling toward the viewer, pointer parallax, GSAP ScrollSmoother) was shown as a screen recording and killed. Marco: "you miss the whole parallax point that the images move as you scroll, not the same image, three or four layers that don't zoom or any of that." Ruled slop.

**What parallax scrolling means here, so it is never misread again:** the page scrolls normally, nothing pins, nothing zooms, nothing scales. Three to five layers translate vertically at different rates relative to the scroll (background around 0.3 to 0.6 of scroll, subject near 0.9 to 1.0, foreground up to about 1.2, never past 1.3), which is what makes a photograph read as a diorama. Firewatch's game site is the canonical photographic example; Nate Herk's aiautomationsociety.ai hero is the reference Marco pointed at (three flat plates with rates 0.31, 0.17, 0 on Lenis smooth scroll, scroll-driven only, no pointer response).

**Kept from the sketch:** the headline "Brooklyn, before it was a brand." goes on the existing site (NRC / U Bruculinu). Nothing else.

**Next (Marco sets the goal in the morning):** research filed under the handoff, all eight original reference sites re-studied for real parallax-scrolling examples, and any useful one recreated as an original implementation with the plates already cut.
