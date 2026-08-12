"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { atlasData, marketScore } from "@/data/service";
import { PageFrame } from "@/components/atlas/page-frame";
import { EvidenceBadge, StatusGlyph } from "@/components/atlas/evidence-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate, formatFleetCount, modeLabel } from "@/lib/format";
import { useDashboard } from "@/lib/store";
import type { MarketStatus } from "@/lib/types";

const filters: { id: "all" | MarketStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ACTIVE", label: "Active" },
  { id: "SUPERVISED", label: "Supervised" },
  { id: "PLANNED", label: "Planned" },
];

export default function MarketsPage() {
  const router = useRouter();
  const selectMarket = useDashboard((state) => state.selectMarket);
  const toggleCompare = useDashboard((state) => state.toggleCompare);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");

  const rows = useMemo(() => {
    return atlasData.markets.filter((market) => {
      const hay = `${market.city} ${market.state} ${market.displayStatus}`.toLowerCase();
      const matchesQuery = hay.includes(query.toLowerCase());
      const matchesFilter = filter === "all" || market.displayStatus === filter;
      return matchesQuery && matchesFilter;
    });
  }, [filter, query]);

  return (
    <PageFrame
      eyebrow="Coverage"
      title="Markets"
      lede="Every city is shown with the evidence that supports it. Illustrative zones are not official Tesla geofences."
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter by city or state"
          aria-label="Filter markets"
          className="min-h-11 sm:max-w-xs"
        />
        <div role="tablist" aria-label="Status filter" className="flex flex-wrap gap-1">
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
      </div>

      <div className="hidden overflow-x-auto rounded-2xl border border-border md:block">
        <table className="w-full min-w-[720px] text-sm">
          <caption className="sr-only">Robotaxi markets and source-backed status</caption>
          <thead className="bg-muted/50 text-left text-xs tracking-wide text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3">Market</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Mode</th>
              <th className="px-4 py-3">First public source</th>
              <th className="px-4 py-3">Fleet</th>
              <th className="px-4 py-3">Quality</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((market) => (
              <tr key={market.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <p className="font-medium">{market.city}</p>
                  <p className="text-xs text-muted-foreground">{market.state}</p>
                </td>
                <td className="px-4 py-3">
                  <StatusGlyph status={market.displayStatus} />
                </td>
                <td className="px-4 py-3">{modeLabel(market.operatingMode)}</td>
                <td className="px-4 py-3">{formatDate(market.firstPublicSourceDate)}</td>
                <td className="px-4 py-3">
                  {formatFleetCount(market.fleet.count, market.fleet.evidenceClass)}
                </td>
                <td className="px-4 py-3">{Math.round(marketScore(market) * 100)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      className="min-h-11"
                      onClick={() => {
                        selectMarket(market.id);
                        router.push(`/?market=${market.id}`);
                      }}
                    >
                      Inspect
                    </Button>
                    <Button size="sm" variant="outline" className="min-h-11" onClick={() => toggleCompare(market.id)}>
                      Compare
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-8 text-sm text-muted-foreground">
          No markets match that filter. Status labels stay visible so an empty list is not confused with “no service.”
        </p>
      ) : null}

      <ul className="grid gap-3 md:hidden">
        {rows.map((market) => (
          <li key={market.id} className="rounded-2xl border border-border p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-medium">{market.city}</h3>
                <p className="text-xs text-muted-foreground">{market.state}</p>
              </div>
              <StatusGlyph status={market.displayStatus} />
            </div>
            <p className="mt-3 text-sm">{modeLabel(market.operatingMode)}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Fleet {formatFleetCount(market.fleet.count, market.fleet.evidenceClass)}
            </p>
            <EvidenceBadge
              value={market.displayStatus === "PLANNED" ? "PLANNED" : "VERIFIED"}
              className="mt-3"
            />
            <div className="mt-3 flex gap-2">
              <Button
                className="min-h-11 flex-1"
                onClick={() => {
                  selectMarket(market.id);
                  router.push(`/?market=${market.id}`);
                }}
              >
                Inspect
              </Button>
              <Button variant="outline" className="min-h-11 flex-1" onClick={() => toggleCompare(market.id)}>
                Compare
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </PageFrame>
  );
}
