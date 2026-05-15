# Agent Handoff: Gemini — HeroBlock Slider Island
**Date:** 2026-05-14
**Repo:** `brooklyn70/apr70-pictures`
**Target Agent:** Gemini (Visual/Motion capabilities)

---

## 1. Context & Previous State
The previous Gemini session successfully completed the high-fidelity cinematic styling of the `FilmstripBlock` renderer. The filmstrip now features anatomically accurate longitudinal zoning (edge bands, perforation support area, and frame aperture bounds) with meticulously accurate Kodak KeyKode typesetting and format-specific physical traits (Super35, Academy, Widescreen200, and IMAX). 

Visual QA for the filmstrip has been successfully passed and locked.

## 2. Immediate Next Task
You are beginning Phase 5: **HeroBlock Slider Island (`[gemini]`)**.

**Objective:** Build a highly polished, interactive React + GSAP crossfade slider for the `HeroBlock` component.

**Key Requirements:**
- **Stack:** React (`client:idle` or `client:visible` Astro island) + GSAP.
- **Strict Rule:** **DO NOT** use Framer Motion or native CSS transitions for complex choreography. GSAP only.
- **Modes:** Support both `auto-featured` (pulling latest projects/news automatically) and `curated` (explicitly selected media from Payload).
- **Aesthetics:** This is the flagship component of the site. It must execute a stunning, premium crossfade animation. It must look absolutely pristine in both Dark mode (default) and Light mode (`[data-theme="light"]`).
- **Responsive:** Mobile-first design, fluidly adapting to tablet and 1440px+ desktop layouts.

## 3. Working Guidelines
- Review `AGENTS.md` before writing code to refresh yourself on the strict architectural rules (e.g., token contracts, no hardcoded layouts, GSAP only).
- Keep your changes strictly contained to the `HeroBlock` component and its associated React island.
- Focus heavily on visual excellence. The animation must be fluid, and the transitions should wow the user without feeling gimmicky.

## 4. Getting Started
1. Audit the existing `web/src/components/blocks/HeroBlock.astro` to understand its current static implementation and Payload schema data structure.
2. Draft the React Island component (e.g. `HeroSliderIsland.tsx`).
3. Wire GSAP for the crossfade transitions.
4. Execute and ask Marco to review via `[requires-gui]`.

## 5. Current Status (PAUSED)
**Update: 2026-05-14**
The initial structure for the `HeroSliderIsland` has been implemented, adding `sliderItems` to the `HeroBlock` Payload schema and creating the GSAP React island. 

However, visual QA with the user revealed the following issues that cannot be resolved until other dependencies are completed:
1. **Video Support:** The slider currently only renders `<img>` tags for media. It needs to detect and render `<video>` tags properly when video media is selected.
2. **True Fullscreen Layout:** The slider does not currently overlap or hide the global navigation header, and scroll bars remain on the side. The image needs to be truly full-screen within the viewport, staying fixed regardless of resize, without being pushed down by the nav.
3. **Text Positioning & Z-index:** Overlay text falls off or renders underneath the image. It needs proper styling to float above the image crossfades.

**Next Steps:**
This task is marked as **IN PROGRESS (PAUSED)**. 
Do not resume this task until:
1. The global navigation and header are fully implemented.
2. Actual project pages and project media are populated in the database.
Once those are ready, return to this task to finalize the layout, absolute positioning, text overlay CSS, and video rendering logic.
