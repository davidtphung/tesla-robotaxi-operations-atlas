# Replaceable seed payloads

The running app loads typed modules from `src/data/`. This folder is the public contract for swapping in curated JSON later.

Suggested files:

- `sources.json`
- `markets.json`
- `events.json`
- `policy.json`
- `vehicles.json`
- `ledger.json`

Validate with the Zod schemas in `src/lib/schemas.ts` before committing to dashboard state. Do not place API keys here.
