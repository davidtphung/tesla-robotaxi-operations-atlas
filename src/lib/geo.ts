import type { Feature, FeatureCollection, Point, Polygon } from "geojson";
import type { RobotaxiMarket } from "@/lib/types";

export function hexagonRing(
  center: [number, number],
  radiusKm: number,
  rotation = Math.PI / 6,
): [number, number][] {
  const [lng, lat] = center;
  const latScale = 1 / 110.574;
  const lngScale = 1 / (111.32 * Math.cos((lat * Math.PI) / 180));
  const ring: [number, number][] = [];
  for (let i = 0; i <= 6; i += 1) {
    const angle = (Math.PI / 3) * i + rotation;
    ring.push([
      lng + radiusKm * Math.cos(angle) * lngScale,
      lat + radiusKm * Math.sin(angle) * latScale,
    ]);
  }
  return ring;
}

export function makeIllustrativeZone(
  market: RobotaxiMarket,
): Feature<Polygon, { marketId: string; illustrative: true }> {
  return {
    type: "Feature",
    properties: { marketId: market.id, illustrative: true },
    geometry: {
      type: "Polygon",
      coordinates: [hexagonRing(market.center, market.zoneRadiusKm)],
    },
  };
}

export function marketsToZoneCollection(
  markets: RobotaxiMarket[],
): FeatureCollection<Polygon, { marketId: string; illustrative: true; status: string }> {
  return {
    type: "FeatureCollection",
    features: markets.map((market) => ({
      type: "Feature",
      properties: {
        marketId: market.id,
        illustrative: true,
        status: market.displayStatus,
      },
      geometry: {
        type: "Polygon",
        coordinates: [hexagonRing(market.center, market.zoneRadiusKm)],
      },
    })),
  };
}

export function pointFeature(
  lng: number,
  lat: number,
  properties: Record<string, string | number | boolean | null>,
): Feature<Point> {
  return {
    type: "Feature",
    properties,
    geometry: { type: "Point", coordinates: [lng, lat] },
  };
}

export function destinationPoint(
  lng: number,
  lat: number,
  distanceKm: number,
  bearingDeg: number,
): [number, number] {
  const brng = (bearingDeg * Math.PI) / 180;
  const lat1 = (lat * Math.PI) / 180;
  const lng1 = (lng * Math.PI) / 180;
  const angDist = distanceKm / 6371;
  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(angDist) +
      Math.cos(lat1) * Math.sin(angDist) * Math.cos(brng),
  );
  const lng2 =
    lng1 +
    Math.atan2(
      Math.sin(brng) * Math.sin(angDist) * Math.cos(lat1),
      Math.cos(angDist) - Math.sin(lat1) * Math.sin(lat2),
    );
  return [((lng2 * 180) / Math.PI + 540) % 360 - 180, (lat2 * 180) / Math.PI];
}

export function interpolate(
  a: [number, number],
  b: [number, number],
  t: number,
): [number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

export function headingBetween(a: [number, number], b: [number, number]): number {
  const dLng = ((b[0] - a[0]) * Math.PI) / 180;
  const lat1 = (a[1] * Math.PI) / 180;
  const lat2 = (b[1] * Math.PI) / 180;
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

export function haversineKm(
  a: [number, number],
  b: [number, number],
): number {
  const toRad = (n: number) => (n * Math.PI) / 180;
  const dLat = toRad(b[1] - a[1]);
  const dLng = toRad(b[0] - a[0]);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[1])) * Math.cos(toRad(b[1])) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.min(1, Math.sqrt(s)));
}

export function makeCorridors(
  center: [number, number],
  radiusKm: number,
  count: number,
): [number, number][][] {
  const corridors: [number, number][][] = [];
  for (let i = 0; i < count; i += 1) {
    const base = (360 / count) * i;
    const path: [number, number][] = [];
    const stops = 8;
    for (let s = 0; s < stops; s += 1) {
      const t = s / (stops - 1);
      const bearing = base + Math.sin(s * 0.9) * 28;
      const dist = 0.4 + t * radiusKm * 0.92;
      path.push(destinationPoint(center[0], center[1], dist, bearing));
    }
    const loop = [...path, ...[...path].reverse().slice(1)];
    corridors.push(loop);
  }
  return corridors;
}
