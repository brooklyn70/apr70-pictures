# APR 70 PICTURES — WEBSITE UI KIT

Recreation of the production site at `brooklyn70/apr70-clone` (branch `apr70`, v086). Covers:
- Filmstrip rail + numbered nav + footer (persistent chrome)
- Homepage hero (auto-advancing slate imagery)
- Division rows (split-screen, ghost numerals)
- Slate grid (project cards)
- Contact 2×2 colored grid
- Footer with legal metadata

Open `index.html` to see an interactive click-thru across Home → Divisions → Slate → Contact.

**Components** (JSX, one file each):
- `Chrome.jsx` — filmstrip rail, nav, footer, corner accent
- `Hero.jsx` — homepage auto-advance hero
- `DivisionRow.jsx` — homepage split-screen division block
- `ProjectCard.jsx` — slate grid entry
- `ContactGrid.jsx` — 2×2 colored contact tiles
- `TaglineBand.jsx` — "Auteur. Driven. Development." band
- `SectionHeader.jsx` — rule-flanked keycode section divider

All components lift exact tokens from `colors_and_type.css` and the production `CLAUDE.md` locked brand system.
