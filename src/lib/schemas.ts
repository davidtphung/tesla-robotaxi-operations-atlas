import { z } from "zod";

export const EvidenceClassSchema = z.enum([
  "VERIFIED",
  "REPORTED",
  "ESTIMATED",
  "SIMULATED",
  "PLANNED",
  "UNAVAILABLE",
]);

export const MarketStatusSchema = z.enum([
  "ACTIVE",
  "SUPERVISED",
  "RAMPING",
  "PLANNED",
  "UNKNOWN",
]);

export const OperatingModeSchema = z.enum([
  "DRIVERLESS_REPORTED",
  "SAFETY_DRIVER",
  "UNKNOWN",
  "PLANNED",
]);

export const SourceRecordSchema = z.object({
  id: z.string(),
  publisher: z.string(),
  title: z.string(),
  url: z.string(),
  publishedAt: z.string(),
  accessedAt: z.string(),
  evidenceClass: EvidenceClassSchema,
  notes: z.string(),
});

export const FleetMetricSchema = z.object({
  count: z.number().nullable(),
  evidenceClass: EvidenceClassSchema,
  asOf: z.string().nullable(),
  sourceIds: z.array(z.string()),
  caveat: z.string(),
});

export const RobotaxiMarketSchema = z.object({
  id: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.literal("US"),
  center: z.tuple([z.number(), z.number()]),
  displayStatus: MarketStatusSchema,
  operatingMode: OperatingModeSchema,
  deploymentDate: z.string().nullable(),
  publicAnnouncementDate: z.string().nullable(),
  lastVerifiedDate: z.string().nullable(),
  firstPublicSourceDate: z.string().nullable(),
  fleet: FleetMetricSchema,
  zoneRadiusKm: z.number(),
  officialBoundaryAvailable: z.boolean(),
  vehicleTypes: z.array(z.string()),
  sourceIds: z.array(z.string()),
  publicDisclosure: z.string(),
  regulatoryNotes: z.string(),
  known: z.array(z.string()),
  unknown: z.array(z.string()),
  region: z.enum(["Texas", "California", "Florida", "Arizona", "Nevada"]),
});

export const SimulatedVehicleSchema = z.object({
  id: z.string(),
  marketId: z.string(),
  lat: z.number(),
  lng: z.number(),
  heading: z.number(),
  speedMph: z.number(),
  state: z.enum(["IDLE", "EN_ROUTE", "PICKUP", "ON_TRIP", "CHARGING"]),
  simulationOnly: z.literal(true),
  updatedAt: z.string(),
  corridorIndex: z.number(),
  progress: z.number(),
});

export const AdapterHealthSchema = z.object({
  id: z.string(),
  status: z.enum([
    "idle",
    "loading",
    "ok",
    "stale",
    "offline",
    "error",
    "unconfigured",
  ]),
  lastSuccessAt: z.string().nullable(),
  error: z.string().nullable(),
});
