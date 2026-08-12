import type { SourceRecord } from "@/lib/types";
import { SEED_ACCESSED_AT } from "@/lib/constants";

export const sources: SourceRecord[] = [
  {
    id: "tesla-q4-2025-update",
    publisher: "Tesla, Inc.",
    title: "Q4 and FY 2025 Update",
    url: "https://assets-ir.tesla.com/tesla-contents/IR/TSLA-Q4-2025-Update.pdf",
    publishedAt: "2026-01-28",
    accessedAt: SEED_ACCESSED_AT,
    evidenceClass: "VERIFIED",
    notes:
      "Official shareholder update. Austin listed as “Ramping Unsupervised”; SF Bay Area as “Safety Driver”; Dallas, Houston, Phoenix, Miami, Orlando, Tampa, and Las Vegas listed as “1H 2026.” States Tesla began removing safety monitors from Robotaxis in Austin in January 2026 on a limited basis; Bay Area ride-hailing began serving San Jose Airport in October; Cybercab and Tesla Semi volume production scheduled to begin in 2026.",
  },
  {
    id: "tesla-robotaxi-support",
    publisher: "Tesla, Inc.",
    title: "Robotaxi Support",
    url: "https://www.tesla.com/support/robotaxi",
    publishedAt: "2026-01-01",
    accessedAt: SEED_ACCESSED_AT,
    evidenceClass: "VERIFIED",
    notes:
      "Official support page describing app booking flow, in-service-area destinations, fare and wait-time review, seven-minute pickup wait, cabin personalization, trip progress, pull-over / stop support, and service-animal vs. pet rules.",
  },
  {
    id: "tesla-legal-terms",
    publisher: "Tesla, Inc.",
    title: "Terms of Use — Robotaxi",
    url: "https://www.tesla.com/legal/terms",
    publishedAt: "2026-01-01",
    accessedAt: SEED_ACCESSED_AT,
    evidenceClass: "VERIFIED",
    notes:
      "Official terms: riders cannot drive the driverless vehicle; age and minor restrictions; service-animal conditions; pricing and fee categories; non-emergency limitation; relationship to rider privacy notice, rider rules, and service-animal policy.",
  },
  {
    id: "tesla-robotaxi-marketing",
    publisher: "Tesla, Inc.",
    title: "Robotaxi product page",
    url: "https://www.tesla.com/robotaxi",
    publishedAt: "2026-08-01",
    accessedAt: SEED_ACCESSED_AT,
    evidenceClass: "VERIFIED",
    notes:
      "Official public page stating autonomous Robotaxi rides are currently being offered in Miami, Austin, Dallas, and Houston. Does not publish a fleet count or live vehicle locations.",
  },
  {
    id: "tesla-robotaxi-privacy",
    publisher: "Tesla, Inc.",
    title: "Robotaxi Rider Privacy Notice",
    url: "https://www.tesla.com/legal/privacy/robotaxi",
    publishedAt: "2026-01-01",
    accessedAt: SEED_ACCESSED_AT,
    evidenceClass: "VERIFIED",
    notes:
      "Official rider privacy notice referenced by Tesla terms. Notes cabin camera and sound-detection defaults and minor-guest language.",
  },
  {
    id: "tesla-rider-rules-pdf",
    publisher: "Tesla, Inc.",
    title: "Robotaxi Rider Rules",
    url: "https://digitalassets.tesla.com/tesla-contents/image/upload/Robotaxi-Rider-Rules.pdf",
    publishedAt: "2026-01-01",
    accessedAt: SEED_ACCESSED_AT,
    evidenceClass: "VERIFIED",
    notes: "Official rider-conduct PDF referenced from Tesla legal resources.",
  },
  {
    id: "tesla-service-animal-pdf",
    publisher: "Tesla, Inc.",
    title: "Robotaxi Service Animal Policy",
    url: "https://digitalassets.tesla.com/tesla-contents/image/upload/Robotaxi-Service-Animal-Policy.pdf",
    publishedAt: "2026-01-01",
    accessedAt: SEED_ACCESSED_AT,
    evidenceClass: "VERIFIED",
    notes:
      "Official service-animal policy. Support page states pets are not permitted; service animals are permitted for disabled riders in accordance with applicable law and this policy.",
  },
  {
    id: "electrek-dallas-houston-2026-04-18",
    publisher: "Electrek",
    title: "Tesla Robotaxi launches in Dallas and Houston",
    url: "https://electrek.co/2026/04/18/tesla-robotaxi-launches-dallas-houston-small-geofences/",
    publishedAt: "2026-04-18",
    accessedAt: SEED_ACCESSED_AT,
    evidenceClass: "REPORTED",
    notes:
      "Reputable trade press report that Tesla launched unsupervised Robotaxi service in Dallas and Houston on 18 April 2026, describing small geofences. Not an official Tesla fleet disclosure.",
  },
];

export const sourceById = Object.fromEntries(sources.map((source) => [source.id, source]));
