import type { DeploymentEvent } from "@/lib/types";

export const events: DeploymentEvent[] = [
  {
    id: "evt-sjc-october",
    date: "2025-10-01",
    datePrecision: "month",
    title: "San Jose Airport service begins",
    summary:
      "Tesla’s Q4 2025 update states Bay Area ride-hailing began serving San Jose Airport in October.",
    marketIds: ["sjc", "sf-bay"],
    kind: "SERVICE_START",
    evidenceClass: "VERIFIED",
    sourceIds: ["tesla-q4-2025-update"],
  },
  {
    id: "evt-austin-driverless-testing",
    date: "2025-12-01",
    datePrecision: "month",
    title: "Driverless Robotaxi testing in Austin",
    summary:
      "Q4 2025 states Tesla began testing driverless Robotaxis in Austin in December.",
    marketIds: ["austin"],
    kind: "REPORTED_MILESTONE",
    evidenceClass: "VERIFIED",
    sourceIds: ["tesla-q4-2025-update"],
  },
  {
    id: "evt-austin-monitor-removal",
    date: "2026-01-01",
    datePrecision: "month",
    title: "Limited safety-monitor removal in Austin",
    summary:
      "Tesla reported it began removing safety monitors from Robotaxis in Austin in January 2026 on a limited basis.",
    marketIds: ["austin"],
    kind: "REPORTED_MILESTONE",
    evidenceClass: "VERIFIED",
    sourceIds: ["tesla-q4-2025-update"],
  },
  {
    id: "evt-q4-city-plan",
    date: "2026-01-28",
    datePrecision: "day",
    title: "Q4 2025 city status published",
    summary:
      "Official update: Austin ramping unsupervised; SF Bay Area safety driver; Dallas, Houston, Phoenix, Miami, Orlando, Tampa, Las Vegas listed as 1H 2026.",
    marketIds: [
      "austin",
      "dallas",
      "houston",
      "miami",
      "orlando",
      "tampa",
      "sf-bay",
      "phoenix",
      "las-vegas",
    ],
    kind: "COMPANY_PLAN",
    evidenceClass: "VERIFIED",
    sourceIds: ["tesla-q4-2025-update"],
  },
  {
    id: "evt-cybercab-plan",
    date: "2026-01-28",
    datePrecision: "day",
    title: "Cybercab volume production scheduled for 2026",
    summary:
      "Q4 2025 says Cybercab and Tesla Semi volume production were scheduled to begin in 2026. This is a plan at the source date, not proof of actual production volume.",
    marketIds: [],
    kind: "PRODUCT_PLAN",
    evidenceClass: "PLANNED",
    sourceIds: ["tesla-q4-2025-update"],
  },
  {
    id: "evt-dallas-houston-press",
    date: "2026-04-18",
    datePrecision: "day",
    title: "Dallas and Houston unsupervised launch reported",
    summary:
      "Trade press reported Tesla launched unsupervised Robotaxi service in Dallas and Houston, describing limited geofences.",
    marketIds: ["dallas", "houston"],
    kind: "REPORTED_MILESTONE",
    evidenceClass: "REPORTED",
    sourceIds: ["electrek-dallas-houston-2026-04-18"],
  },
  {
    id: "evt-product-page-offered",
    date: "2026-08-12",
    datePrecision: "day",
    title: "Official page lists four offered cities",
    summary:
      "As accessed for this seed, tesla.com/robotaxi states autonomous rides are currently offered in Miami, Austin, Dallas, and Houston.",
    marketIds: ["miami", "austin", "dallas", "houston"],
    kind: "SERVICE_START",
    evidenceClass: "VERIFIED",
    sourceIds: ["tesla-robotaxi-marketing"],
  },
];
