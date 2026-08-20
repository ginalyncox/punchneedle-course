# The Loop & The Line

[![Last commit](https://img.shields.io/github/last-commit/ginalyncox/punchneedle-course)](https://github.com/ginalyncox/punchneedle-course/commits)

A self-directed course website for punch needle rug making — from foundations through sculpted, carved pile. Built as a personal learning reference.

## What's in it

- **Six modules** covering foundations, tools & materials, setup & design transfer, core technique, sculpted pile, and finishing.
- **DIY frame build** — a step-by-step guide to building a standard 14" gripper lap frame from pine 1×2 and carpet tack strip for about $25.
- **Four progressive projects** — from a mug rug coaster to a sculpted wall piece — each introducing exactly one new variable.
- **Troubleshooting matrix** mapping every "why is this happening?" symptom to its underlying cause.
- **Glossary** covering fabrics, tools, techniques, and related crafts.
- **Tufting crossover notes** for anyone coming from a tufting gun.

## Design

- Warm cream + wool navy + terracotta palette derived from the subject matter (wool, monks cloth, natural dye).
- Boska (Fontshare) display serif paired with Work Sans body — both self-hosted as `woff2` under `fonts/`.
- Full dark mode, responsive layout, editorial multi-column composition.
- Zero JavaScript frameworks — hand-written HTML/CSS with a small vanilla JS layer for theme bootstrap, theme toggle, mobile menu, and reveal animations.
- Content-Security-Policy meta tag locking scripts, styles, and fonts to same-origin.

## Structure

```
punchneedle-course/
├── src/                    # Page source templates (body only + front-matter comment)
├── partials/               # Shared head, header, and footer partials
├── css/style.css           # Design system + component styles
├── js/site.js              # Theme toggle, mobile menu, scroll reveal
├── generated_assets/       # Original image assets (gitignored)
├── assets/                 # Deployed image copies (build.py copies from generated_assets)
├── build.py                # Merges partials into each src/*.html page
└── *.html                  # Built pages at repo root
```

## Building

```bash
python3 build.py
```

The build script parses the front-matter comment at the top of each `src/*.html` file (TITLE, DESCRIPTION, NAV), injects the shared head/header/footer partials, and writes the finished page to the repository root. Assets in `generated_assets/` are copied to `assets/` for deployment.

## Editing

- **Content edits**: modify the files in `src/`. Never edit the built pages at the repo root directly — they'll be overwritten.
- **Design edits**: `css/style.css` contains all design tokens (color, typography, spacing, radii) and component styles.
- **Structure edits**: add or reorder nav links in `partials/header.html`, then re-run `build.py`.

## License

Personal reference — do what you like with it.
