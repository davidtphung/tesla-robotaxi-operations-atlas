import type { VehicleTypeProfile } from "@/lib/types";

export const vehicleProfiles: VehicleTypeProfile[] = [
  {
    id: "model-y-service",
    name: "Model Y Robotaxi service vehicle",
    category: "Passenger EV / existing Tesla platform",
    deploymentState: "Service-use context is source dependent. Current public pages do not publish a city-level inventory of body styles.",
    configuration: "Capacity: verify by service configuration. Do not assume a fixed passenger count from marketing images.",
    productionState: "Existing high-volume Tesla platform. This is not a Cybercab production claim.",
    capacityNote: "Verify by service configuration",
    notes: [
      "Do not state autonomous capability beyond the cited city deployment status.",
      "Do not treat this card as real-time fleet inventory.",
      "Body style in service is not officially itemized in the Q4 2025 city table.",
    ],
    evidenceClass: "REPORTED",
    lastVerifiedDate: "2026-08-12",
    sourceIds: ["tesla-robotaxi-marketing", "tesla-q4-2025-update"],
    inServiceClaim:
      "Public Tesla materials describe Robotaxi as a Tesla vehicle service. They do not publish a verified Model Y headcount by city.",
  },
  {
    id: "cybercab",
    name: "Cybercab",
    category: "Purpose-built autonomous vehicle",
    deploymentState:
      "Announced product. Q4 2025 scheduled volume production to begin in 2026. That is a plan at the source date, not proof of vehicles currently in passenger service.",
    configuration:
      "Two-seat, steering-wheel-free design is treated as announced product information only if cited from Tesla materials — not as proof of vehicles in the current Robotaxi fleet.",
    productionState: "Tooling / ramp / production plan as of 28 January 2026. Not a delivered-volume figure.",
    capacityNote: "Announced two-seat configuration — not a live inventory count",
    notes: [
      "Clearly distinguish announced product information from vehicles currently in service.",
      "No public city has a verified Cybercab in-service count in this seed.",
      "Do not treat this card as real-time fleet inventory.",
    ],
    evidenceClass: "PLANNED",
    lastVerifiedDate: "2026-01-28",
    sourceIds: ["tesla-q4-2025-update"],
    inServiceClaim:
      "No official in-service Cybercab count is included. Production timing is a 2026 plan from the Q4 2025 update.",
  },
  {
    id: "future-unconfirmed",
    name: "Future / unconfirmed",
    category: "Unconfirmed platform",
    deploymentState: "No technical claims without a source.",
    configuration: "Not specified.",
    productionState: "Not specified.",
    capacityNote: "Unavailable",
    notes: [
      "This slot exists so unconfirmed vehicles are not silently invented.",
      "Do not treat this card as real-time fleet inventory.",
    ],
    evidenceClass: "UNAVAILABLE",
    lastVerifiedDate: null,
    sourceIds: [],
    inServiceClaim: "No unconfirmed vehicle type is treated as deployed.",
  },
];
