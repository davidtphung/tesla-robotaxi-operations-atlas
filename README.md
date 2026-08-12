# Tesla Robotaxi — Operations Atlas

Independent public-interest visualization of Tesla Robotaxi coverage, deployment status, policy, and data provenance.

**Autonomous mobility, mapped with evidence.**

This is not a ride-booking app and is not affiliated with Tesla, Inc. Tesla trademarks belong to Tesla, Inc. Fleet positions and operational estimates may be simulated or source-reported.

## What this product is

A map-centric operations atlas. You can:

- Explore active, supervised, and planned markets
- Inspect service status, operating mode, and source quality
- See that **no public city-level fleet count** is treated as a real number
- Read rider, accessibility, and safety disclosures with original Tesla links
- Watch **explicitly labeled simulated activity** — never presented as Tesla telemetry

## Quick start

```bash
npm install
npm run dev
```

The Next.js scripts use webpack (`--webpack`) so MapLibre’s worker bundle compiles cleanly. No API keys are required.

Open [http://localhost:3000](http://localhost:3000). No API keys are required.

```bash
npm run build
npm start
```

Copy `.env.example` to `.env.local` only if you want optional live adapters.

## Stack

- Next.js App Router, TypeScript, Tailwind CSS v4
- shadcn/ui (Radix) primitives
- MapLibre GL via `react-map-gl/maplibre`
- Zustand, Zod, Recharts, Lucide

## Data truth

Every operational claim is classified as exactly one of:

| Class | Meaning |
| --- | --- |
| **VERIFIED** | Official Tesla or regulator text |
| **REPORTED** | Reputable published reporting |
| **ESTIMATED** | Transparent calculation |
| **SIMULATED** | Local demo visualization |
| **PLANNED** | Company or regulator plan |
| **UNAVAILABLE** | No defensible public figure |

If a live vehicle feed is not configured, the map stays in **SIMULATED** mode and every glyph is labeled.

Tesla does not provide an open public API for exact Robotaxi vehicle locations or a continuously updated active-fleet count. This product will not invent one.

## Seed facts

Bundled sources live in `src/data/`:

- Tesla Q4 and FY 2025 Update (28 Jan 2026)
- Tesla Robotaxi support, terms, privacy, rider rules, service-animal policy
- tesla.com/robotaxi offered-city copy as accessed 12 Aug 2026
- Electrek report on Dallas / Houston (18 Apr 2026), classified REPORTED

Illustrative GeoJSON hexes are **not** official service boundaries. Official polygons can be ingested later through `MapDataAdapter`.

## Replacing simulation with an authorized live feed

1. Obtain a license and endpoint that explicitly allows public display of vehicle positions.
2. Set `NEXT_PUBLIC_LIVE_VEHICLE_ENDPOINT` in `.env.local`.
3. Implement a server-side proxy (do not expose private keys in the browser).
4. Validate payloads with `SimulatedVehicleSchema` (or a live equivalent) in `src/lib/schemas.ts` **before** writing to state.
5. Switch the default data mode to `live` only after the adapter reports `ok`.
6. Keep the Simulation label on any remaining modeled layer.

Traffic and satellite layers stay dark until their env keys exist.

## Accessibility

- Keyboard: `⌘K` / `Ctrl+K` search, `Escape` closes overlays, 44×44px targets
- Visible focus, skip link, `aria-live` status, chart data tables
- `prefers-reduced-motion` pauses simulation playback
- Dark default, light toggle, large text and contrast preferences

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

## Disclaimer

Policy summaries are not legal advice. Read Tesla’s original terms and local regulator materials before relying on them.
