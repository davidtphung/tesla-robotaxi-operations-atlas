"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { atlasData } from "@/data/service";
import { PageFrame } from "@/components/atlas/page-frame";
import { EvidenceBadge } from "@/components/atlas/evidence-badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

const filters = [
  { id: "all", label: "All markets" },
  { id: "Texas", label: "Texas" },
  { id: "California", label: "California" },
  { id: "Florida", label: "Florida" },
  { id: "planned", label: "Planned" },
  { id: "supervised", label: "Supervised" },
  { id: "driverless", label: "Reported driverless" },
] as const;

const kindLabel = {
  COMPANY_PLAN: "Company plan",
  SERVICE_START: "Service start",
  REGULATORY: "Regulatory status",
  REPORTED_MILESTONE: "Reported operational milestone",
  PRODUCT_PLAN: "Product plan",
};

export default function TimelinePage() {
  const params = useSearchParams();
  const focus = params.get("event");
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");

  const events = useMemo(() => {
    return [...atlasData.events]
      .filter((event) => {
        if (filter === "all") return true;
        if (filter === "planned") return event.kind === "COMPANY_PLAN" || event.evidenceClass === "PLANNED";
        if (filter === "supervised") {
          return event.marketIds.some((id) => {
            const market = atlasData.markets.find((item) => item.id === id);
            return market?.displayStatus === "SUPERVISED";
          });
        }
        if (filter === "driverless") {
          return event.marketIds.some((id) => {
            const market = atlasData.markets.find((item) => item.id === id);
            return market?.operatingMode === "DRIVERLESS_REPORTED";
          });
        }
        return event.marketIds.some((id) => {
          const market = atlasData.markets.find((item) => item.id === id);
          return market?.region === filter;
        });
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [filter]);

  return (
    <PageFrame
      eyebrow="History"
      title="Deployment timeline"
      lede="Company plans, service starts, regulatory notes, and reported milestones are drawn in different registers so a slide is never confused with a launch."
    >
      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <Button
            key={item.id}
            variant={filter === item.id ? "default" : "outline"}
            className="min-h-11"
            onClick={() => setFilter(item.id)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      <div className="mt-8 hidden overflow-x-auto pb-4 md:block">
        <ol className="relative flex min-w-max gap-6 border-t border-border pt-6">
          {events.map((event) => (
            <li key={event.id} className="w-56 shrink-0">
              <span className="absolute top-0 size-2 -translate-y-1/2 rounded-full bg-atlas-red" />
              <p className="text-xs text-muted-foreground">
                {formatDate(event.date, event.datePrecision)}
              </p>
              <p className="mt-1 text-sm font-medium">{event.title}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{kindLabel[event.kind]}</p>
            </li>
          ))}
        </ol>
      </div>

      <ol className="mt-8 space-y-4 border-l border-border pl-6">
        {events.map((event) => (
          <li
            key={event.id}
            id={event.id}
            className={cn(
              "relative rounded-2xl border border-border p-4",
              focus === event.id && "ring-2 ring-atlas-red",
            )}
          >
            <span className="absolute top-5 -left-[29px] size-2.5 rounded-full bg-foreground" />
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs text-muted-foreground">
                {formatDate(event.date, event.datePrecision)}
              </p>
              <span className="rounded-full border border-border px-2 py-0.5 text-[10px] tracking-wide uppercase">
                {kindLabel[event.kind]}
              </span>
              <EvidenceBadge value={event.evidenceClass} compact />
            </div>
            <h3 className="mt-2 text-base font-medium">{event.title}</h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{event.summary}</p>
            {event.marketIds.length ? (
              <p className="mt-2 text-xs text-muted-foreground">
                Markets: {event.marketIds.join(", ")}
              </p>
            ) : (
              <p className="mt-2 text-xs text-muted-foreground">Network-wide / product</p>
            )}
          </li>
        ))}
      </ol>
    </PageFrame>
  );
}
