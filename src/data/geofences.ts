import type { EvidenceClass } from "@/lib/types";

export interface GeofenceSpec {
  marketId: string;
  /** Closed GeoJSON ring [lng, lat][] */
  ring: [number, number][];
  approxAreaSqMi: number | null;
  note: string;
  evidenceClass: EvidenceClass;
  sourceIds: string[];
}

function close(ring: [number, number][]): [number, number][] {
  const first = ring[0];
  const last = ring[ring.length - 1];
  const closed = first[0] === last[0] && first[1] === last[1] ? [...ring] : [...ring, first];
  let area = 0;
  for (let i = 0; i < closed.length - 1; i += 1) {
    area += closed[i][0] * closed[i + 1][1] - closed[i + 1][0] * closed[i][1];
  }
  if (area < 0) {
    return [closed[0], ...closed.slice(1, -1).reverse(), closed[0]];
  }
  return closed;
}

/**
 * Approximate service polygons reconstructed from published Tesla maps
 * and reputable reporting. Not official Tesla GeoJSON.
 */
export const geofences: GeofenceSpec[] = [
  {
    marketId: "austin",
    approxAreaSqMi: 245,
    evidenceClass: "REPORTED",
    sourceIds: ["electrek-dallas-houston-2026-04-18", "tesla-robotaxi-marketing"],
    note: "Reported metro-scale expansion from an initial South Austin pocket to roughly the full Austin geofence. Still not an official Tesla polygon.",
    ring: close([
      [-97.92, 30.52],
      [-97.78, 30.55],
      [-97.66, 30.54],
      [-97.56, 30.46],
      [-97.53, 30.35],
      [-97.55, 30.24],
      [-97.62, 30.15],
      [-97.72, 30.1],
      [-97.84, 30.11],
      [-97.96, 30.18],
      [-98.02, 30.28],
      [-98.0, 30.4],
      [-97.96, 30.48],
    ]),
  },
  {
    marketId: "dallas",
    approxAreaSqMi: 18,
    evidenceClass: "REPORTED",
    sourceIds: ["electrek-dallas-houston-2026-04-18"],
    note: "Reported launch geofence covering downtown, Uptown, and the Park Cities — bounded roughly by the Dallas North Tollway and US 75.",
    ring: close([
      [-96.832, 32.772],
      [-96.81, 32.768],
      [-96.792, 32.77],
      [-96.78, 32.784],
      [-96.776, 32.804],
      [-96.778, 32.828],
      [-96.786, 32.848],
      [-96.804, 32.858],
      [-96.822, 32.852],
      [-96.836, 32.834],
      [-96.838, 32.808],
      [-96.836, 32.788],
    ]),
  },
  {
    marketId: "houston",
    approxAreaSqMi: 25,
    evidenceClass: "REPORTED",
    sourceIds: ["electrek-dallas-houston-2026-04-18"],
    note: "Reported northwest Houston pocket around Jersey Village / Willowbrook, roughly between Highway 6, the Sam Houston Tollway, 249, and FM 1960.",
    ring: close([
      [-95.642, 29.868],
      [-95.618, 29.9],
      [-95.598, 29.948],
      [-95.568, 29.992],
      [-95.532, 29.994],
      [-95.512, 29.968],
      [-95.514, 29.93],
      [-95.534, 29.892],
      [-95.564, 29.858],
      [-95.604, 29.848],
      [-95.632, 29.854],
    ]),
  },
  {
    marketId: "miami",
    approxAreaSqMi: 16,
    evidenceClass: "REPORTED",
    sourceIds: ["tesla-robotaxi-marketing"],
    note: "Reported West Miami slice toward Doral and Sweetwater — Palmetto to the north, Tamiami Trail to the south. A drawn service box, not a metro launch.",
    ring: close([
      [-80.408, 25.818],
      [-80.36, 25.828],
      [-80.318, 25.824],
      [-80.286, 25.802],
      [-80.274, 25.776],
      [-80.282, 25.752],
      [-80.318, 25.742],
      [-80.368, 25.746],
      [-80.406, 25.764],
      [-80.418, 25.792],
    ]),
  },
  {
    marketId: "orlando",
    approxAreaSqMi: null,
    evidenceClass: "PLANNED",
    sourceIds: ["tesla-q4-2025-update"],
    note: "No public Tesla geofence. Downtown core shown only as a planned placeholder.",
    ring: close([
      [-81.42, 28.56],
      [-81.36, 28.568],
      [-81.33, 28.548],
      [-81.34, 28.518],
      [-81.38, 28.508],
      [-81.42, 28.524],
    ]),
  },
  {
    marketId: "tampa",
    approxAreaSqMi: null,
    evidenceClass: "PLANNED",
    sourceIds: ["tesla-q4-2025-update"],
    note: "No public Tesla geofence. Downtown / Channelside placeholder only.",
    ring: close([
      [-82.48, 27.97],
      [-82.44, 27.978],
      [-82.43, 27.948],
      [-82.45, 27.93],
      [-82.48, 27.938],
    ]),
  },
  {
    marketId: "sf-bay",
    approxAreaSqMi: null,
    evidenceClass: "VERIFIED",
    sourceIds: ["tesla-q4-2025-update"],
    note: "Officially labeled Safety Driver. This Bay Area outline is illustrative only — Tesla has not published a Bay polygon.",
    ring: close([
      [-122.52, 37.81],
      [-122.38, 37.83],
      [-122.22, 37.8],
      [-122.12, 37.7],
      [-122.08, 37.54],
      [-122.14, 37.42],
      [-122.28, 37.36],
      [-122.42, 37.4],
      [-122.52, 37.52],
      [-122.54, 37.68],
    ]),
  },
  {
    marketId: "sjc",
    approxAreaSqMi: 8,
    evidenceClass: "VERIFIED",
    sourceIds: ["tesla-q4-2025-update"],
    note: "Q4 2025 says Bay Area ride-hailing began serving San Jose Airport in October. Airport-adjacent outline only.",
    ring: close([
      [-121.96, 37.38],
      [-121.91, 37.382],
      [-121.9, 37.352],
      [-121.92, 37.338],
      [-121.95, 37.342],
      [-121.962, 37.362],
    ]),
  },
  {
    marketId: "phoenix",
    approxAreaSqMi: null,
    evidenceClass: "PLANNED",
    sourceIds: ["tesla-q4-2025-update"],
    note: "1H 2026 plan. No offered-city listing or published geofence in the seed.",
    ring: close([
      [-112.12, 33.48],
      [-112.04, 33.49],
      [-112.02, 33.44],
      [-112.06, 33.42],
      [-112.12, 33.43],
    ]),
  },
  {
    marketId: "las-vegas",
    approxAreaSqMi: null,
    evidenceClass: "PLANNED",
    sourceIds: ["tesla-q4-2025-update"],
    note: "1H 2026 plan. Strip-adjacent placeholder only.",
    ring: close([
      [-115.18, 36.18],
      [-115.12, 36.185],
      [-115.12, 36.14],
      [-115.17, 36.125],
      [-115.19, 36.155],
    ]),
  },
];

export const geofenceByMarketId = Object.fromEntries(
  geofences.map((spec) => [spec.marketId, spec]),
);



export function ringBBox(ring: [number, number][]): [[number, number], [number, number]] {
  let minLng = 180;
  let minLat = 90;
  let maxLng = -180;
  let maxLat = -90;
  for (const [lng, lat] of ring) {
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
  }
  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ];
}

export function ringCentroid(ring: [number, number][]): [number, number] {
  const pts = ring.slice(0, -1);
  const n = pts.length || 1;
  const sum = pts.reduce(
    (acc, [lng, lat]) => [acc[0] + lng, acc[1] + lat] as [number, number],
    [0, 0] as [number, number],
  );
  return [sum[0] / n, sum[1] / n];
}
