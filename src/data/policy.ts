import type { PolicyCard } from "@/lib/types";

export const policyCards: PolicyCard[] = [
  {
    id: "booking-flow",
    topic: "service-rules",
    title: "How a ride is requested",
    summary:
      "Riders request a ride through the Robotaxi app, choose a destination within the displayed service area, review estimated fare and wait time, then confirm.",
    evidenceClass: "VERIFIED",
    sourceIds: ["tesla-robotaxi-support"],
    asOf: "2026-08-12",
  },
  {
    id: "in-trip-support",
    topic: "service-rules",
    title: "Trip progress and stop requests",
    summary:
      "The app and vehicle interface support trip progress and support. Tesla says riders can request a pull-over or stop.",
    evidenceClass: "VERIFIED",
    sourceIds: ["tesla-robotaxi-support"],
    asOf: "2026-08-12",
  },
  {
    id: "pickup-wait",
    topic: "service-rules",
    title: "Seven-minute pickup window",
    summary:
      "A requested vehicle waits at pickup for seven minutes before a possible cancellation.",
    evidenceClass: "VERIFIED",
    sourceIds: ["tesla-robotaxi-support"],
    asOf: "2026-08-12",
  },
  {
    id: "cabin-personalization",
    topic: "service-rules",
    title: "Cabin personalization",
    summary:
      "Tesla’s support materials describe climate, seat-position, and media personalization during a Robotaxi trip.",
    evidenceClass: "VERIFIED",
    sourceIds: ["tesla-robotaxi-support"],
    asOf: "2026-08-12",
  },
  {
    id: "no-driving",
    topic: "service-rules",
    title: "Riders cannot drive the vehicle",
    summary:
      "Tesla’s terms state that the Robotaxi is a driverless vehicle and riders will not be able to drive it.",
    evidenceClass: "VERIFIED",
    sourceIds: ["tesla-legal-terms"],
    asOf: "2026-08-12",
  },
  {
    id: "age-minors",
    topic: "eligibility",
    title: "Age and unaccompanied minors",
    summary:
      "Tesla’s terms say riders must be at least 18 to request a ride or ride unaccompanied; minors under 8 are not permitted; minors 8–17 must be accompanied by the requesting adult and use appropriate restraints where applicable.",
    evidenceClass: "VERIFIED",
    sourceIds: ["tesla-legal-terms", "tesla-robotaxi-privacy"],
    asOf: "2026-08-12",
  },
  {
    id: "service-animals",
    topic: "accessibility",
    title: "Service animals",
    summary:
      "Service animals are permitted in accordance with applicable law and Tesla’s Service Animal Policy. Tesla’s support page states pets are not permitted.",
    evidenceClass: "VERIFIED",
    sourceIds: ["tesla-legal-terms", "tesla-service-animal-pdf", "tesla-robotaxi-support"],
    asOf: "2026-08-12",
  },
  {
    id: "emergency",
    topic: "emergency",
    title: "Not emergency transportation",
    summary:
      "Tesla says Robotaxi is not intended for emergency transportation.",
    evidenceClass: "VERIFIED",
    sourceIds: ["tesla-legal-terms", "tesla-robotaxi-support"],
    asOf: "2026-08-12",
  },
  {
    id: "privacy-relationship",
    topic: "privacy",
    title: "Privacy, rider rules, and related policies",
    summary:
      "Tesla says services are subject to its rider privacy notice, rider rules, and service animal policy.",
    evidenceClass: "VERIFIED",
    sourceIds: ["tesla-legal-terms", "tesla-robotaxi-privacy", "tesla-rider-rules-pdf"],
    asOf: "2026-08-12",
  },
  {
    id: "fees",
    topic: "pricing",
    title: "Fares and additional charges",
    summary:
      "Terms may include fares, tolls, airport fees, regulatory charges, and damage / litter / soiling fees.",
    evidenceClass: "VERIFIED",
    sourceIds: ["tesla-legal-terms", "tesla-robotaxi-support"],
    asOf: "2026-08-12",
  },
  {
    id: "local-status",
    topic: "regulatory",
    title: "Local operational status",
    summary:
      "City-level offering is sourced from Tesla’s Q4 2025 update and the public Robotaxi page. Permit dockets are not bundled unless a regulator record is added to the ledger.",
    evidenceClass: "VERIFIED",
    sourceIds: ["tesla-q4-2025-update", "tesla-robotaxi-marketing"],
    asOf: "2026-08-12",
  },
];

export const policyTopics: { id: PolicyCard["topic"]; title: string; intro: string }[] = [
  {
    id: "service-rules",
    title: "Service and rider rules",
    intro: "How Tesla describes requesting, riding, and ending a Robotaxi trip.",
  },
  {
    id: "eligibility",
    title: "Eligibility and minors",
    intro: "Age gates and accompaniment rules published in Tesla’s terms.",
  },
  {
    id: "accessibility",
    title: "Service animals and accessibility",
    intro: "Published service-animal policy and the distinction from pets.",
  },
  {
    id: "emergency",
    title: "Emergency limitations",
    intro: "Robotaxi is not described as emergency transportation.",
  },
  {
    id: "privacy",
    title: "Data and privacy",
    intro: "Pointers to Tesla’s rider privacy notice and related rider rules.",
  },
  {
    id: "pricing",
    title: "Pricing and fees",
    intro: "Fare review before confirm, plus categories of extra charges.",
  },
  {
    id: "regulatory",
    title: "Local operational / regulatory status",
    intro: "What official Tesla materials say about where service is offered.",
  },
  {
    id: "legal",
    title: "Legal terms and disclosures",
    intro: "Read original Tesla documents before relying on this summary.",
  },
];
