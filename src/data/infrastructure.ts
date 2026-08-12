import type { InfrastructureNode } from "@/lib/types";
import { destinationPoint } from "@/lib/geo";
import { markets } from "@/data/markets";

const airportCatalog: { id: string; marketId: string; name: string; lng: number; lat: number }[] = [
  { id: "aus", marketId: "austin", name: "Austin-Bergstrom (AUS)", lng: -97.6699, lat: 30.1975 },
  { id: "dal", marketId: "dallas", name: "Dallas Love Field (DAL)", lng: -96.8518, lat: 32.8471 },
  { id: "dfw", marketId: "dallas", name: "Dallas/Fort Worth (DFW)", lng: -97.038, lat: 32.8998 },
  { id: "iah", marketId: "houston", name: "George Bush Intercontinental (IAH)", lng: -95.3414, lat: 29.9902 },
  { id: "hou", marketId: "houston", name: "William P. Hobby (HOU)", lng: -95.2789, lat: 29.6454 },
  { id: "mia", marketId: "miami", name: "Miami International (MIA)", lng: -80.2906, lat: 25.7959 },
  { id: "mco", marketId: "orlando", name: "Orlando International (MCO)", lng: -81.3089, lat: 28.4312 },
  { id: "tpa", marketId: "tampa", name: "Tampa International (TPA)", lng: -82.5332, lat: 27.9755 },
  { id: "sfo", marketId: "sf-bay", name: "San Francisco International (SFO)", lng: -122.379, lat: 37.6213 },
  { id: "sjc", marketId: "sjc", name: "San José Mineta (SJC)", lng: -121.9289, lat: 37.3639 },
  { id: "phx", marketId: "phoenix", name: "Phoenix Sky Harbor (PHX)", lng: -112.0116, lat: 33.4342 },
  { id: "las", marketId: "las-vegas", name: "Harry Reid (LAS)", lng: -115.1523, lat: 36.084 },
];

export const infrastructure: InfrastructureNode[] = [
  ...airportCatalog.map((airport) => ({
    id: `airport-${airport.id}`,
    marketId: airport.marketId,
    kind: "airport" as const,
    name: airport.name,
    lng: airport.lng,
    lat: airport.lat,
    evidenceClass: "VERIFIED" as const,
    note: "Public airport coordinate. Not a Tesla facility and not an official Robotaxi destination list.",
  })),
  ...markets.flatMap((market, index) => {
    const [opsLng, opsLat] = destinationPoint(market.center[0], market.center[1], 3.2, 40 + index * 18);
    const [chgLng, chgLat] = destinationPoint(market.center[0], market.center[1], 4.1, 210 + index * 12);
    return [
      {
        id: `ops-${market.id}`,
        marketId: market.id,
        kind: "operations" as const,
        name: `${market.city} operations node (illustrative)`,
        lng: opsLng,
        lat: opsLat,
        evidenceClass: "SIMULATED" as const,
        note: "Simulated operations node for map literacy. Not an official Tesla depot.",
      },
      {
        id: `chg-${market.id}`,
        marketId: market.id,
        kind: "charging" as const,
        name: `${market.city} charging node (illustrative)`,
        lng: chgLng,
        lat: chgLat,
        evidenceClass: "SIMULATED" as const,
        note: "Simulated charging / staging node. Not a published Robotaxi-only Supercharger list.",
      },
    ];
  }),
];
