# Tesla Robotaxi — Operations Atlas

Independent public-data visualization. Not affiliated with Tesla, Inc.

## Commands

- `npm run dev` — webpack dev server
- `npm run build` — production build
- `npm run lint` — ESLint

## Data rules

Never invent fleet counts or live Tesla vehicle positions. Every operational figure needs an `EvidenceClass`. Simulated glyphs must stay labeled. Official GeoJSON is not bundled; zones are illustrative hexes.

Seed modules live in `src/data/`. Zod schemas live in `src/lib/schemas.ts`.
