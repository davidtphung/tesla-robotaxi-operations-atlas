import type { EvidenceClass, SourceRecord } from "@/lib/types";

const CLASS_WEIGHT: Record<EvidenceClass, number> = {
  VERIFIED: 0.9,
  REPORTED: 0.68,
  PLANNED: 0.55,
  ESTIMATED: 0.4,
  SIMULATED: 0.18,
  UNAVAILABLE: 0.08,
};

/**
 * Source-quality score, not a model confidence or “AI certainty.”
 * Derived only from evidence class, recency, and corroboration.
 */
export function sourceQualityScore(
  sourceIds: string[],
  sources: SourceRecord[],
  asOf?: string | null,
): number {
  const matched = sourceIds
    .map((id) => sources.find((source) => source.id === id))
    .filter((source): source is SourceRecord => Boolean(source));

  if (matched.length === 0) return 0.08;

  const best = Math.max(...matched.map((source) => CLASS_WEIGHT[source.evidenceClass]));
  const uniqueClasses = new Set(matched.map((source) => source.evidenceClass));
  const corroboration = uniqueClasses.has("VERIFIED")
    ? Math.min(0.06, (matched.length - 1) * 0.03)
    : Math.min(0.04, (matched.length - 1) * 0.02);

  let recency = 0;
  if (asOf) {
    const ageDays = (Date.now() - new Date(asOf).getTime()) / 86_400_000;
    if (ageDays <= 45) recency = 0.04;
    else if (ageDays <= 180) recency = 0.02;
    else if (ageDays > 400) recency = -0.06;
  }

  return Math.max(0.05, Math.min(0.96, best + corroboration + recency));
}

export function confidenceLabel(score: number) {
  if (score >= 0.82) return "High source quality";
  if (score >= 0.6) return "Moderate source quality";
  if (score >= 0.35) return "Limited source quality";
  return "Insufficient public evidence";
}
