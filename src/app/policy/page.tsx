"use client";

import { useSearchParams } from "next/navigation";
import { atlasData, getSources } from "@/data/service";
import { PageFrame } from "@/components/atlas/page-frame";
import { EvidenceBadge } from "@/components/atlas/evidence-badge";
import { SourceList } from "@/components/atlas/source-list";
import { LEGAL_ADVICE_DISCLAIMER } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function PolicyPage() {
  const params = useSearchParams();
  const topic = params.get("topic");
  const cardId = params.get("card");

  return (
    <PageFrame
      eyebrow="Rules"
      title="Policy & safety"
      lede="A calm reading of Tesla’s published rider rules. This is a public reference, not a legal opinion and not a substitute for the original documents."
    >
      <aside className="rounded-2xl border border-atlas-amber/30 bg-atlas-amber/8 p-4 text-sm leading-6">
        {LEGAL_ADVICE_DISCLAIMER}
      </aside>

      <div className="mt-8 space-y-10">
        {atlasData.policyTopics.map((section) => {
          const cards = atlasData.policyCards.filter((card) => card.topic === section.id);
          const extra =
            section.id === "legal"
              ? [
                  {
                    id: "legal-pointer",
                    title: "Read the originals",
                    summary:
                      "Tesla’s Robotaxi terms, rider rules, privacy notice, and service-animal policy are the controlling texts.",
                    evidenceClass: "VERIFIED" as const,
                    sourceIds: [
                      "tesla-legal-terms",
                      "tesla-rider-rules-pdf",
                      "tesla-robotaxi-privacy",
                      "tesla-service-animal-pdf",
                    ],
                    asOf: "2026-08-12",
                  },
                ]
              : cards;

          if (topic && topic !== section.id) return null;

          return (
            <section key={section.id} id={section.id}>
              <h3 className="text-xl font-medium">{section.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{section.intro}</p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {extra.map((card) => (
                  <article
                    key={card.id}
                    id={card.id}
                    className={cn(
                      "rounded-2xl border border-border p-4",
                      cardId === card.id && "ring-2 ring-atlas-red",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-medium">{card.title}</h4>
                      <EvidenceBadge value={card.evidenceClass} compact />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{card.summary}</p>
                    <p className="mt-3 text-[11px] text-muted-foreground">
                      Source date {formatDate(card.asOf)}
                    </p>
                    <div className="mt-3">
                      <SourceList sources={getSources(card.sourceIds)} />
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </PageFrame>
  );
}
