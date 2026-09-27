# Personal website — design concept

A working concept build for the personal website of a senior executive, international
lawyer, geoeconomics strategist and former diplomat.

**Live:** https://anirudhatalmale6-alt.github.io/executive-personal-site-concept/

Everything on the page — name, biography, engagements, publications, photography — is
placeholder material written to fill the real section architecture. It exists so the
typography, editorial rhythm, photographic treatment and responsive behaviour can be
judged on something concrete rather than a static mockup.

## Two design directions, one page

The A / B switch in the header swaps the whole page between:

- **A — Warm editorial.** Bone paper, ink, oxblood accent. Bodoni Moda display.
  Broadsheet weekend-magazine feel.
- **B — Cool architectural.** Near-black, stone, pewter and brass. Instrument Serif
  display. Tighter, more restrained, gallery-like.

The choice persists in `localStorage`.

## What's in the build

- Profile / biography with drop cap and pull quote
- Professional services as an expanding index (six mandates)
- Speaking: topics and a ledger of past engagements
- Articles and publications: featured piece plus a filterable list
- Speeches and interviews: media cards
- Boards and advisory appointments
- Curated gallery with a keyboard-navigable lightbox
- Contact and speaking enquiries form with inline validation

## Notes on the code

- No framework, no build step: one HTML file, one stylesheet, one script.
- Content lives in the HTML, not in JavaScript — the page renders complete with
  JavaScript disabled. Reveal animations are gated on `html.js` so they can never
  hide content.
- `prefers-reduced-motion` is respected throughout.
- The photographic plates are generated procedurally by `tools/make_plates.py`
  (greyscale abstractions of architectural light, tinted per direction in CSS).
  They are placeholders for the client's own photography.
- `tools/shots.py` drives Playwright to screenshot every section in both directions
  at desktop and mobile widths.

Designed and built by Anirudha Talmale.
