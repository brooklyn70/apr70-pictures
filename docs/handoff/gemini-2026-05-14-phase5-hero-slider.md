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
