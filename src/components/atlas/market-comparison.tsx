"use client";

import { atlasData, getSources, marketScore } from "@/data/service";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EvidenceBadge, StatusGlyph } from "@/components/atlas/evidence-badge";
import { formatDate, formatFleetCount, modeLabel } from "@/lib/format";
import { useDashboard } from "@/lib/store";

export function MarketComparison() {
  const open = useDashboard((state) => state.compareOpen);
  const setOpen = useDashboard((state) => state.setCompareOpen);
  const compareIds = useDashboard((state) => state.compareIds);
  const toggleCompare = useDashboard((state) => state.toggleCompare);
  const clearCompare = useDashboard((state) => state.clearCompare);
  const selected = atlasData.markets.filter((market) => compareIds.includes(market.id));

  return (
    <Dialog open={open && selected.length > 0} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Compare markets</DialogTitle>
          <DialogDescription>
            Up to three cities. Fleet counts stay blank unless a public source supplies them.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 md:grid-cols-3">
          {selected.map((market) => {
            const score = marketScore(market);
            const sources = getSources(market.sourceIds);
            return (
              <article key={market.id} className="rounded-2xl border border-border p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-medium">{market.city}</h3>
                    <p className="text-xs text-muted-foreground">{market.state}</p>
                  </div>
                  <StatusGlyph status={market.displayStatus} />
                </div>
                <dl className="mt-4 space-y-2 text-sm">
                  <div>
                    <dt className="text-xs text-muted-foreground">Mode</dt>
                    <dd>{modeLabel(market.operatingMode)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Deployment</dt>
                    <dd>{formatDate(market.deploymentDate)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Fleet</dt>
                    <dd>{formatFleetCount(market.fleet.count, market.fleet.evidenceClass)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Source quality</dt>
                    <dd>{Math.round(score * 100)} / 100</dd>
                  </div>
                </dl>
                <div className="mt-3 flex flex-wrap gap-1">
                  {sources.map((source) => (
                    <EvidenceBadge key={source.id} value={source.evidenceClass} compact />
                  ))}
                </div>
                <Button
                  variant="ghost"
                  className="mt-3 min-h-11 w-full"
                  onClick={() => toggleCompare(market.id)}
                >
                  Remove
                </Button>
              </article>
            );
          })}
        </div>
        <Button variant="outline" className="min-h-11" onClick={clearCompare}>
          Clear comparison
        </Button>
      </DialogContent>
    </Dialog>
  );
}
