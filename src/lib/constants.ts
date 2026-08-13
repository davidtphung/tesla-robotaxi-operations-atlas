import type { DataMode, DateRange, EvidenceClass, LayerState } from "@/lib/types";

export const APP_NAME = "Tesla Robotaxi — Operations Atlas";
export const APP_SHORT_NAME = "Operations Atlas";
export const APP_TAGLINE = "Autonomous mobility, mapped with evidence.";

export const FOOTER_DISCLOSURE =
  "Independent visualization. Tesla trademarks belong to Tesla, Inc. Fleet positions and operational estimates may be simulated or source-reported; see Data Methodology.";

export const AFFILIATION_DISCLAIMER =
  "This is an independent public-interest visualization. It is not affiliated with, endorsed by, or operated by Tesla, Inc.";

export const LEGAL_ADVICE_DISCLAIMER =
  "Policy information is a summarized public reference, not legal advice. Read original Tesla and local-regulator materials before relying on it.";

export const FLEET_COUNT_DISCLAIMER =
  "Public fleet numbers do not necessarily equal active vehicles.";

export const UNDISCLOSED_LABEL = "Not publicly disclosed";

export const ILLUSTRATIVE_ZONE_DISCLAIMER =
  "Approximate public visualization — not official service boundary. Illustrative coverage area only.";

export const NO_LIVE_TELEMETRY =
  "Private vehicle positions are not public. Tesla does not provide an open public API for exact Robotaxi vehicle locations or a continuously updated active-fleet count.";

export const SIMULATION_DISCLAIMER =
  "Simulated live activity. This is not a real Tesla vehicle location and is not private telemetry.";

export const DEFAULT_LAYERS: LayerState = {
  coverage: true,
  cityStatus: true,
  vehicles: false,
  charging: false,
  airports: false,
  regulation: false,
  traffic: false,
  satellite: false,
};

export const DATA_MODE_COPY: Record<
  DataMode,
  { label: string; description: string }
> = {
  live: {
    label: "Live",
    description:
      "Authorized live feeds only. If none are configured, the map stays in labeled simulation.",
  },
  reported: {
    label: "Reported",
    description:
      "Official disclosures and reputable published reports. Simulated vehicles are hidden.",
  },
  simulated: {
    label: "Simulated",
    description:
      "Deterministic modeled activity for visualization. Every glyph is labeled Simulation.",
  },
};

export const DATE_RANGE_COPY: Record<DateRange, string> = {
  today: "Today",
  "7d": "7D",
  "30d": "30D",
  launch: "Since launch",
};

export const EVIDENCE_COPY: Record<
  EvidenceClass,
  { label: string; short: string; description: string }
> = {
  VERIFIED: {
    label: "Verified",
    short: "VERIFIED",
    description: "Confirmed by an official company or regulator source.",
  },
  REPORTED: {
    label: "Reported",
    short: "REPORTED",
    description: "Attributed to a reputable published report.",
  },
  ESTIMATED: {
    label: "Estimated",
    short: "ESTIMATED",
    description: "Transparent calculation or model output.",
  },
  SIMULATED: {
    label: "Simulated",
    short: "SIMULATED",
    description: "Generated demo visualization data. Not operational telemetry.",
  },
  PLANNED: {
    label: "Planned",
    short: "PLANNED",
    description: "Company or regulator deployment plan, not a live service.",
  },
  UNAVAILABLE: {
    label: "Unavailable",
    short: "UNAVAILABLE",
    description: "No defensible public figure has been published.",
  },
};

export const SEED_ACCESSED_AT = "2026-08-12";
export const SEED_GENERATED_AT = "2026-08-12T16:00:00.000Z";

export const NAV_DESKTOP = [
  { href: "/", id: "map", label: "Live Map", description: "Network activity" },
  { href: "/markets", id: "markets", label: "Markets", description: "City coverage" },
  {
    href: "/fleet",
    id: "fleet",
    label: "Fleet Intelligence",
    description: "Disclosure and vehicles",
  },
  {
    href: "/timeline",
    id: "timeline",
    label: "Deployment Timeline",
    description: "Milestones",
  },
  {
    href: "/policy",
    id: "policy",
    label: "Policy & Safety",
    description: "Rider rules",
  },
  {
    href: "/methodology",
    id: "methodology",
    label: "Data Methodology",
    description: "Sources and adapters",
  },
] as const;

export const NAV_MOBILE = [
  { href: "/", id: "map", label: "Map" },
  { href: "/markets", id: "markets", label: "Markets" },
  { href: "/fleet", id: "fleet", label: "Fleet" },
  { href: "/policy", id: "policy", label: "Policy" },
  { href: "/about", id: "about", label: "About" },
] as const;
