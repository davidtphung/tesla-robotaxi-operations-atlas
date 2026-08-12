"use client";

import Link from "next/link";
import { Share2, X } from "lucide-react";
import { toast } from "sonner";
import { atlasData, eventsForMarket, getSources, marketScore } from "@/data/service";
import { Button } from "@/components/ui/button";
import { EvidenceBadge, StatusGlyph } from "@/components/atlas/evidence-badge";
import { SourceList } from "@/components/atlas/source-list";
import { shareCurrentUrl } from "@/hooks/use-url-state";
import { ILLUSTRATIVE_ZONE_DISCLAIMER, UNDISCLOSED_LABEL } from "@/lib/constants";
import { confidenceLabel } from "@/lib/confidence";
import { formatDate, formatFleetCount, modeLabel } from "@/lib/format";
import { useDashboard } from "@/lib/store";
import { cn } from "@/lib/utils";

export function CityInspector({ className }: { className?: string }) {
  const selectedMarketId = useDashboard((state) => state.selectedMarketId);
  const selectMarket = useDashboard((state) => state.selectMarket);
  const toggleCompare = useDashboard((state) => state.toggleCompare);
  const compareIds = useDashboard((state) => state.compareIds);
  const market = atlasData.markets.find((item) => item.id === selectedMarketId);

  if (!market) {
    return (
      <aside className={cn("flex h-full flex-col justify-between p-5", className)}>
        <div>
          <p className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase">Inspector</p>
          <h2 className="mt-2 text-xl font-medium">Select a market</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Choose a city marker, search ⌘K, or open Markets. Every figure is labeled by evidence class.
          </p>
        </div>
        <ul className="space-y-2">
          {atlasData.markets.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => selectMarket(item.id)}
                className="flex min-h-11 w-full items-center justify-between rounded-xl border border-border px-3 text-left text-sm"
              >
                <span>
                  {item.city}, {item.state}
                </span>
                <StatusGlyph status={item.displayStatus} />
              </button>
            </li>
          ))}
        </ul>
      </aside>
    );
  }

  const sources = getSources(market.sourceIds);
  const score = marketScore(market);
  const history = eventsForMarket(market.id);
  const vehicles = atlasData.vehicleProfiles.filter((profile) =>
    market.vehicleTypes.includes(profile.id),
  );

  return (
    <aside className={cn("flex h-full flex-col overflow-y-auto p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase">Market</p>
          <h2 className="mt-1 text-2xl font-medium tracking-tight">
            {market.city}
            <span className="ml-2 align-middle text-sm font-normal text-muted-foreground">
              {market.state}
            </span>
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusGlyph status={market.displayStatus} />
            <EvidenceBadge
              value={
                market.displayStatus === "PLANNED"
                  ? "PLANNED"
                  : market.operatingMode === "DRIVERLESS_REPORTED"
                    ? "REPORTED"
                    : "VERIFIED"
              }
              compact
            />
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="min-h-11 min-w-11"
          aria-label="Close inspector"
          onClick={() => selectMarket(null)}
        >
          <X className="size-4" />
        </Button>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-muted/40 p-4">
        <p className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase">Zone overview</p>
        <p className="mt-1 text-sm">
          Illustrative {market.zoneRadiusKm} km hex around the city core.
        </p>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">{ILLUSTRATIVE_ZONE_DISCLAIMER}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {[
          { label: "Mode", value: modeLabel(market.operatingMode) },
          { label: "Service status", value: market.displayStatus.replaceAll("_", " ") },
          { label: "Deployment date", value: formatDate(market.deploymentDate) },
          {
            label: "Fleet disclosure",
            value: formatFleetCount(market.fleet.count, market.fleet.evidenceClass),
          },
        ].map((card) => (
          <article key={card.label} className="rounded-2xl border border-border p-3">
            <p className="text-[10px] tracking-[0.12em] text-muted-foreground uppercase">{card.label}</p>
            <p className="mt-1 text-sm leading-5 font-medium">{card.value}</p>
          </article>
        ))}
      </div>

      <section className="mt-6">
        <h3 className="text-sm font-medium">Fleet composition</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {UNDISCLOSED_LABEL} as a headcount. Vehicle types below are contextual, not inventory.
        </p>
        <ul className="mt-2 space-y-2">
          {vehicles.map((vehicle) => (
            <li key={vehicle.id} className="rounded-xl border border-border px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm">{vehicle.name}</p>
                <EvidenceBadge value={vehicle.evidenceClass} compact />
              </div>
              <p className="text-xs text-muted-foreground">{vehicle.inServiceClaim}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h3 className="text-sm font-medium">Deployment history</h3>
        <ol className="mt-3 space-y-3 border-l border-border pl-4">
          {history.map((event) => (
            <li key={event.id} className="relative">
              <span className="absolute top-1.5 -left-[21px] size-2 rounded-full bg-foreground/50" />
              <p className="text-xs text-muted-foreground">{formatDate(event.date, event.datePrecision)}</p>
              <p className="text-sm">{event.title}</p>
              <EvidenceBadge value={event.evidenceClass} compact className="mt-1" />
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-6">
        <h3 className="text-sm font-medium">Policy & permits</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{market.regulatoryNotes}</p>
      </section>

      <section className="mt-6">
        <h3 className="text-sm font-medium">Public data sources</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Source-quality score {Math.round(score * 100)} / 100 — {confidenceLabel(score)}. Derived from
          evidence class, corroboration, and recency. Not an AI confidence score.
        </p>
        <div className="mt-3">
          <SourceList sources={sources} />
        </div>
      </section>

      <section className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-border p-3">
          <h3 className="text-sm font-medium">What we know</h3>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-5 text-muted-foreground">
            {market.known.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border p-3">
          <h3 className="text-sm font-medium">What is not publicly disclosed</h3>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-5 text-muted-foreground">
            {market.unknown.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Button
          variant="outline"
          className="min-h-11 flex-1"
          onClick={() => toggleCompare(market.id)}
        >
          {compareIds.includes(market.id) ? "Remove from compare" : "Compare city"}
        </Button>
        <Button
          variant="secondary"
          className="min-h-11 flex-1"
          onClick={async () => {
            await navigator.clipboard.writeText(shareCurrentUrl());
            toast.success("Market link copied");
          }}
        >
          <Share2 className="size-4" />
          Share this market
        </Button>
      </div>
      <Link href="/methodology" className="mt-3 text-xs text-atlas-blue underline-offset-2 hover:underline">
        View methodology
      </Link>
    </aside>
  );
}
