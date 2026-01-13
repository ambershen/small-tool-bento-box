# SMALL TOOL BENTO BOX.
### VOL. 1.0 — CURATED UTILITY.

Utility is beauty. We've stripped away the digital noise to serve you the core of web productivity. This is a monorepo of raw, uncompromising tools packed into a brutalist bento grid.

---

## THE MENU.
A balanced collection of digital nutrients.

- **THE BASE (RICE)** 🍚
  - `apps/hub` — The container. A brutalist landing page that holds everything together.
  - `packages/ui` — The shared infrastructure. Shared components for consistent plating.

- **THE CORE (MAIN DISHES)** 🍱
  - `apps/image-compressor` — High-fidelity shrinkage. Sharp.js under the hood.
  - `apps/pdf-expert` — Clinical document surgery. Merge, fill, and convert.
  - `apps/qrcode-gen` — Modular geometry. Raw data turned into scannable art.

---

## KITCHEN SETUP.
How to prep the ingredients.

```bash
# Install everything at once
npm install

# Fire up the whole kitchen
npm run dev

# Prep a specific dish
npm run dev -w @smalltool/qrcode-gen
npm run dev -w @smalltool/pdf-expert
npm run dev -w @smalltool/image-compressor
```

---

## PLATING.
Serving it to the world.

Each tool is a standalone dish. Deploy them as separate Vercel projects:

1. **Root Directory**: Point to the specific `apps/` folder.
2. **Framework**: Vite.
3. **Build**: `npm run build`.
4. **Output**: `dist`.

---

## MANIFESTO.
1. **NO SLOP.** If it doesn't do work, it doesn't exist.
2. **BRUTALIST.** Function dictates form.
3. **RAW AESTHETIC.** Beauty served in its most brutal form.

© 2026 — NO RIGHTS RESERVED. JUST ART.

Build with TRAE SOLO.