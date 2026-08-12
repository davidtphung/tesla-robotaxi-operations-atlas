export type EvidenceClass =
  | "VERIFIED"
  | "REPORTED"
  | "ESTIMATED"
  | "SIMULATED"
  | "PLANNED"
  | "UNAVAILABLE";

export type MarketStatus =
  | "ACTIVE"
  | "SUPERVISED"
  | "RAMPING"
  | "PLANNED"
  | "UNKNOWN";

export type OperatingMode =
  | "DRIVERLESS_REPORTED"
  | "SAFETY_DRIVER"
  | "UNKNOWN"
  | "PLANNED";

export type DataMode = "live" | "reported" | "simulated";

export type DateRange = "today" | "7d" | "30d" | "launch";

export type VehicleSimState =
  | "IDLE"
  | "EN_ROUTE"
  | "PICKUP"
  | "ON_TRIP"
  | "CHARGING";

export type AdapterStatus =
  | "idle"
  | "loading"
  | "ok"
  | "stale"
  | "offline"
  | "error"
  | "unconfigured";

export type EventKind =
  | "COMPANY_PLAN"
  | "SERVICE_START"
  | "REGULATORY"
  | "REPORTED_MILESTONE"
  | "PRODUCT_PLAN";

export type PolicyTopic =
  | "service-rules"
  | "eligibility"
  | "accessibility"
  | "emergency"
  | "privacy"
  | "pricing"
  | "regulatory"
  | "legal";

export interface SourceRecord {
  id: string;
  publisher: string;
  title: string;
  url: string;
  publishedAt: string;
  accessedAt: string;
  evidenceClass: EvidenceClass;
  notes: string;
}

export interface FleetMetric {
  count: number | null;
  evidenceClass: EvidenceClass;
  asOf: string | null;
  sourceIds: string[];
  caveat: string;
}

export interface LngLat {
  lng: number;
  lat: number;
}

export interface RobotaxiMarket {
  id: string;
  city: string;
  state: string;
  country: "US";
  /** GeoJSON order: [longitude, latitude] */
  center: [number, number];
  displayStatus: MarketStatus;
  operatingMode: OperatingMode;
  deploymentDate: string | null;
  publicAnnouncementDate: string | null;
  lastVerifiedDate: string | null;
  firstPublicSourceDate: string | null;
  fleet: FleetMetric;
  zoneRadiusKm: number;
  officialBoundaryAvailable: boolean;
  vehicleTypes: string[];
  sourceIds: string[];
  publicDisclosure: string;
  regulatoryNotes: string;
  known: string[];
  unknown: string[];
  region: "Texas" | "California" | "Florida" | "Arizona" | "Nevada";
}

export interface SimulatedVehicle {
  id: string;
  marketId: string;
  lat: number;
  lng: number;
  heading: number;
  speedMph: number;
  state: VehicleSimState;
  simulationOnly: true;
  updatedAt: string;
  corridorIndex: number;
  progress: number;
}

export interface VehicleTypeProfile {
  id: string;
  name: string;
  category: string;
  deploymentState: string;
  configuration: string;
  productionState: string;
  capacityNote: string;
  notes: string[];
  evidenceClass: EvidenceClass;
  lastVerifiedDate: string | null;
  sourceIds: string[];
  inServiceClaim: string;
}

export interface DeploymentEvent {
  id: string;
  date: string;
  datePrecision: "day" | "month" | "quarter";
  title: string;
  summary: string;
  marketIds: string[];
  kind: EventKind;
  evidenceClass: EvidenceClass;
  sourceIds: string[];
}

export interface PolicyCard {
  id: string;
  topic: PolicyTopic;
  title: string;
  summary: string;
  evidenceClass: EvidenceClass;
  sourceIds: string[];
  asOf: string;
}

export interface LedgerRow {
  id: string;
  dataset: string;
  field: string;
  value: string;
  classification: EvidenceClass;
  asOf: string | null;
  sourceId: string;
  refreshCadence: string;
  caveat: string;
}

export interface InfrastructureNode {
  id: string;
  marketId: string;
  kind: "charging" | "operations" | "airport";
  name: string;
  lng: number;
  lat: number;
  evidenceClass: EvidenceClass;
  note: string;
}

export interface AdapterDescriptor {
  id: string;
  provider: string;
  purpose: string;
  endpoint: string | null;
  requiresApiKey: boolean;
  envVar: string | null;
  license: string;
  pollingIntervalMs: number;
  lastSuccessAt: string | null;
  status: AdapterStatus;
  error: string | null;
  attribution: string;
  fallback: string;
  schemaName: string;
}

export interface LayerState {
  coverage: boolean;
  cityStatus: boolean;
  vehicles: boolean;
  charging: boolean;
  airports: boolean;
  regulation: boolean;
  traffic: boolean;
  satellite: boolean;
}

export interface SimulationStats {
  activeTrips: number;
  pickupCount: number;
  chargingCount: number;
  idleCount: number;
  dispatchedCount: number;
  utilization: number;
  medianPickupMinutes: number | null;
  vehicleCount: number;
  marketId: string | null;
}

export interface SearchHit {
  id: string;
  category: "market" | "vehicle" | "policy" | "event" | "source";
  title: string;
  subtitle: string;
  href: string;
  keywords: string[];
}
