"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { atlasData, kpis, marketScore } from "@/data/service";
import { PageFrame } from "@/components/atlas/page-frame";
import { EvidenceBadge, StatusGlyph } from "@/components/atlas/evidence-badge";
import { FleetDisclosureChart, MarketStatusChart } from "@/components/atlas/charts";
import { FLEET_COUNT_DISCLAIMER, UNDISCLOSED_LABEL } from "@/lib/constants";
import { formatDate, formatFleetCount, modeLabel } from "@/lib/format";
import type { MarketStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function FleetPage() {
  const params = useSearchParams();
  const focus = params.get("vehicle");
  const snapshot = kpis();
  const [sort, setSort] = useState<"city" | "status" | "quality">("city");
  const [status, setStatus] = useState<MarketStatus | "all">("all");

  const rows = useMemo(() => {
    return [...atlasData.markets]
      .filter((market) => status === "all" || market.displayStatus === status)
      .sort((a, b) => {
        if (sort === "status") return a.displayStatus.localeCompare(b.displayStatus);
        if (sort === "quality") return marketScore(b) - marketScore(a);
        return a.city.localeCompare(b.city);
      });
  }, [sort, status]);

  return (
    <PageFrame
      eyebrow="Disclosure"
      title="Fleet intelligence"
      lede="Public fleet numbers do not necessarily equal active vehicles. This atlas refuses to invent a headcount."
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <article className="rounded-2xl border border-border p-4">
          <p className="text-xs text-muted-foreground">Total disclosed fleet</p>
          <p className="mt-2 text-2xl font-medium">{UNDISCLOSED_LABEL}</p>
        </article>
        <article className="rounded-2xl border border-border p-4">
          <p className="text-xs text-muted-foreground">Active service markets</p>
          <p className="mt-2 text-2xl font-medium">{snapshot.activeServiceMarkets}</p>
        </article>
        <article className="rounded-2xl border border-border p-4">
          <p className="text-xs text-muted-foreground">Fleet disclosure coverage</p>
          <p className="mt-2 text-2xl font-medium">
            {Math.round(snapshot.disclosureCoverage * 100)}%
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{FLEET_COUNT_DISCLAIMER}</p>
        </article>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border p-4">
          <MarketStatusChart />
        </div>
        <div className="rounded-2xl border border-border p-4">
          <FleetDisclosureChart />
        </div>
      </div>

      <section className="mt-10">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <h3 className="mr-auto text-lg font-medium">City comparison</h3>
          <label className="text-xs text-muted-foreground">
            Sort
            <select
              className="ml-2 min-h-11 rounded-xl border border-border bg-background px-2"
              value={sort}
              onChange={(event) => setSort(event.target.value as typeof sort)}
            >
              <option value="city">Market</option>
              <option value="status">Status</option>
              <option value="quality">Source quality</option>
            </select>
          </label>
          <label className="text-xs text-muted-foreground">
            Status
            <select
              className="ml-2 min-h-11 rounded-xl border border-border bg-background px-2"
              value={status}
              onChange={(event) => setStatus(event.target.value as typeof status)}
            >
              <option value="all">All</option>
              <option value="ACTIVE">Active</option>
              <option value="SUPERVISED">Supervised</option>
              <option value="PLANNED">Planned</option>
            </select>
          </label>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[880px] text-sm">
            <caption className="sr-only">Fleet disclosure by market</caption>
            <thead className="bg-muted/40 text-left text-xs text-muted-foreground uppercase">
              <tr>
                <th className="px-3 py-3">Market</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Operating mode</th>
                <th className="px-3 py-3">Vehicle type</th>
                <th className="px-3 py-3">Fleet count</th>
                <th className="px-3 py-3">Classification</th>
                <th className="px-3 py-3">As-of</th>
                <th className="px-3 py-3">Deployment</th>
                <th className="px-3 py-3">Permit / policy</th>
                <th className="px-3 py-3">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((market) => (
                <tr key={market.id} className="border-t border-border">
                  <td className="px-3 py-3 font-medium">{market.city}</td>
                  <td className="px-3 py-3">
                    <StatusGlyph status={market.displayStatus} />
                  </td>
                  <td className="px-3 py-3">{modeLabel(market.operatingMode)}</td>
                  <td className="px-3 py-3">{market.vehicleTypes.join(", ")}</td>
                  <td className="px-3 py-3">
                    {formatFleetCount(market.fleet.count, market.fleet.evidenceClass)}
                  </td>
                  <td className="px-3 py-3">
                    <EvidenceBadge value={market.fleet.evidenceClass} compact />
                  </td>
                  <td className="px-3 py-3">{formatDate(market.fleet.asOf)}</td>
                  <td className="px-3 py-3">{formatDate(market.deploymentDate)}</td>
                  <td className="max-w-[220px] px-3 py-3 text-xs leading-5 text-muted-foreground">
                    {market.regulatoryNotes}
                  </td>
                  <td className="px-3 py-3">{Math.round(marketScore(market) * 100)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h3 className="text-lg font-medium">Vehicle types</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Do not treat these cards as real-time fleet inventory.
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {atlasData.vehicleProfiles.map((vehicle) => (
            <article
              key={vehicle.id}
              id={vehicle.id}
              className={cn(
                "rounded-2xl border border-border p-5",
                focus === vehicle.id && "ring-2 ring-atlas-red",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-base font-medium">{vehicle.name}</h4>
                <EvidenceBadge value={vehicle.evidenceClass} compact />
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">Category</dt>
                  <dd>{vehicle.category}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Deployment state</dt>
                  <dd>{vehicle.deploymentState}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Configuration</dt>
                  <dd>{vehicle.configuration}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Production state</dt>
                  <dd>{vehicle.productionState}</dd>
                </div>
              </dl>
              <ul className="mt-3 list-disc space-y-1 pl-4 text-xs leading-5 text-muted-foreground">
                {vehicle.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">
                Last verified {formatDate(vehicle.lastVerifiedDate)}
              </p>
              {vehicle.sourceIds[0] ? (
                <a
                  href={
                    atlasData.sources.find((source) => source.id === vehicle.sourceIds[0])?.url
                  }
                  className="mt-2 inline-flex min-h-11 items-center text-xs text-atlas-blue underline-offset-2 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  View evidence
                </a>
              ) : (
                <p className="mt-2 text-xs text-muted-foreground">No evidence attached.</p>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-border p-5">
        <h3 className="text-lg font-medium">Data quality</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Confidence numbers on this page are source-quality scores: official documents outrank press,
          recent sources outrank stale ones, and corroboration adds a small bump. They are not a model’s
          guess that a fleet exists.
        </p>
      </section>
    </PageFrame>
  );
}
