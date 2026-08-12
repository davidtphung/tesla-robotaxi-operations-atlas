import { AdapterHealthSchema } from "@/lib/schemas";
import type { AdapterDescriptor, AdapterStatus } from "@/lib/types";
import { SEED_GENERATED_AT } from "@/lib/constants";

function envConfigured(name: string | null) {
  if (!name) return false;
  if (typeof process === "undefined") return false;
  const value = process.env[name];
  return Boolean(value && value.length > 4);
}

function descriptor(
  partial: Omit<AdapterDescriptor, "status" | "lastSuccessAt" | "error"> & {
    configuredStatus: AdapterStatus;
  },
): AdapterDescriptor {
  const configured = envConfigured(partial.envVar);
  const status = partial.requiresApiKey
    ? configured
      ? partial.configuredStatus
      : "unconfigured"
    : partial.configuredStatus;

  return {
    ...partial,
    status,
    lastSuccessAt: status === "ok" ? SEED_GENERATED_AT : null,
    error:
      status === "unconfigured"
        ? `No ${partial.envVar} configured. Adapter remains dark.`
        : null,
  };
}

export const adapters: AdapterDescriptor[] = [
  descriptor({
    id: "tesla-public-disclosure",
    provider: "TeslaPublicDisclosureAdapter",
    purpose: "Curated official Tesla pages, shareholder updates, and support copy.",
    endpoint: "/data/seed (bundled JSON/TS)",
    requiresApiKey: false,
    envVar: null,
    license: "Quoted Tesla public materials with attribution. Not Tesla-licensed software.",
    pollingIntervalMs: 86_400_000,
    attribution: "Tesla, Inc. public disclosures",
    fallback: "Serve last validated seed snapshot.",
    schemaName: "RobotaxiMarketSchema + SourceRecordSchema",
    configuredStatus: "ok",
  }),
  descriptor({
    id: "regulatory-feed",
    provider: "RegulatoryFeedAdapter",
    purpose: "Manually managed public permit records and regulator notes.",
    endpoint: "/data/seed regulatory notes",
    requiresApiKey: false,
    envVar: "REGULATORY_FEED_URL",
    license: "Public government records where attached.",
    pollingIntervalMs: 604_800_000,
    attribution: "Manual curator / public dockets",
    fallback: "City regulatoryNotes field only; no invented permit numbers.",
    schemaName: "SourceRecordSchema",
    configuredStatus: "ok",
  }),
  descriptor({
    id: "traffic",
    provider: "TrafficAdapter",
    purpose: "Optional legal public traffic intensity overlay.",
    endpoint: process.env.NEXT_PUBLIC_TRAFFIC_ENDPOINT ?? null,
    requiresApiKey: true,
    envVar: "NEXT_PUBLIC_TRAFFIC_API_KEY",
    license: "Provider-specific. Do not enable without a license that allows public display.",
    pollingIntervalMs: 300_000,
    attribution: "Unconfigured",
    fallback: "Layer toggle stays disabled and explains the missing source.",
    schemaName: "AdapterHealthSchema",
    configuredStatus: "ok",
  }),
  descriptor({
    id: "weather",
    provider: "WeatherAdapter",
    purpose: "Optional public weather context. Not used for vehicle motion.",
    endpoint: process.env.NEXT_PUBLIC_WEATHER_ENDPOINT ?? null,
    requiresApiKey: true,
    envVar: "NEXT_PUBLIC_WEATHER_API_KEY",
    license: "Provider-specific",
    pollingIntervalMs: 900_000,
    attribution: "Unconfigured",
    fallback: "No weather chrome is shown.",
    schemaName: "AdapterHealthSchema",
    configuredStatus: "ok",
  }),
  descriptor({
    id: "map-data",
    provider: "MapDataAdapter",
    purpose: "Basemap tiles plus future official GeoJSON import.",
    endpoint:
      process.env.NEXT_PUBLIC_MAP_STYLE_URL ??
      "raster fallback (Carto / OpenStreetMap attribution)",
    requiresApiKey: false,
    envVar: "NEXT_PUBLIC_MAP_STYLE_URL",
    license: "OpenStreetMap + selected basemap vendor. Official Tesla polygons when supplied.",
    pollingIntervalMs: 0,
    attribution: "© OpenStreetMap contributors",
    fallback: "Dark raster basemap shipped with the client. No key required.",
    schemaName: "GeoJSON Feature",
    configuredStatus: "ok",
  }),
];

export function validateAdapterHealth(input: unknown) {
  return AdapterHealthSchema.safeParse(input);
}

export function liveVehicleFeedConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_LIVE_VEHICLE_ENDPOINT &&
      process.env.NEXT_PUBLIC_LIVE_VEHICLE_ENDPOINT.length > 8,
  );
}
