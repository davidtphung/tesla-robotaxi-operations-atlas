import type {
  EvidenceClass,
  MarketStatus,
  OperatingMode,
  VehicleSimState,
} from "@/lib/types";
import { UNDISCLOSED_LABEL } from "@/lib/constants";

export function formatDate(value: string | null, precision: "day" | "month" | "quarter" = "day") {
  if (!value) return "Not dated";
  const date = new Date(value.includes("T") ? value : `${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  if (precision === "quarter") {
    const q = Math.floor(date.getUTCMonth() / 3) + 1;
    return `Q${q} ${date.getUTCFullYear()}`;
  }
  if (precision === "month") {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(date);
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatDateTime(value: string | null) {
  if (!value) return "Not refreshed";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

export function formatRelative(value: string | null) {
  if (!value) return "unknown";
  const date = new Date(value);
  const delta = Date.now() - date.getTime();
  const minutes = Math.round(delta / 60000);
  if (Math.abs(minutes) < 1) return "just now";
  if (Math.abs(minutes) < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 48) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export function formatFleetCount(count: number | null, evidence: EvidenceClass) {
  if (count == null || evidence === "UNAVAILABLE") return UNDISCLOSED_LABEL;
  return new Intl.NumberFormat("en-US").format(count);
}

export function statusLabel(status: MarketStatus) {
  switch (status) {
    case "ACTIVE":
      return "Active";
    case "SUPERVISED":
      return "Supervised";
    case "RAMPING":
      return "Ramping";
    case "PLANNED":
      return "Planned";
    default:
      return "Unknown";
  }
}

export function modeLabel(mode: OperatingMode) {
  switch (mode) {
    case "DRIVERLESS_REPORTED":
      return "Unsupervised / driverless reported";
    case "SAFETY_DRIVER":
      return "Safety driver";
    case "PLANNED":
      return "Planned service";
    default:
      return "Unknown";
  }
}

export function vehicleStateLabel(state: VehicleSimState) {
  switch (state) {
    case "IDLE":
      return "Idle";
    case "EN_ROUTE":
      return "Dispatched";
    case "PICKUP":
      return "Pickup";
    case "ON_TRIP":
      return "On trip";
    case "CHARGING":
      return "Charging";
  }
}

export function percent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
