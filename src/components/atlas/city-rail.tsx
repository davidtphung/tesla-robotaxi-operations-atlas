"use client";

import { atlasData } from "@/data/service";
import { statusLabel } from "@/lib/format";
import { useDashboard } from "@/lib/store";
import { cn } from "@/lib/utils";

const pip: Record<string, string> = {
  ACTIVE: "bg-atlas-green",
  RAMPING: "bg-atlas-amber",
  SUPERVISED: "bg-atlas-blue",
  PLANNED: "bg-muted-foreground",
  UNKNOWN: "bg-muted-foreground/50",
};

export function CityRail() {
  const selectedMarketId = useDashboard((state) => state.selectedMarketId);
  const selectMarket = useDashboard((state) => state.selectMarket);

  return (
    <nav
      aria-label="Markets"
      className="atlas-glass pointer-events-auto flex max-h-[min(72dvh,640px)] w-[200px] flex-col overflow-hidden rounded-2xl"
    >
      <p className="px-3 pt-3 pb-1 text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
        Cities
      </p>
      <ul className="overflow-y-auto px-1.5 pb-2">
        {atlasData.markets.map((market) => {
          const active = selectedMarketId === market.id;
          return (
            <li key={market.id}>
              <button
                type="button"
                onClick={() => selectMarket(active ? null : market.id)}
                aria-pressed={active}
                aria-label={`${market.city}, ${statusLabel(market.displayStatus)}`}
                className={cn(
                  "flex min-h-10 w-full items-center gap-2 rounded-xl px-2.5 text-left text-sm",
                  active
                    ? "bg-foreground/10 text-foreground"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                )}
              >
                <span aria-hidden className={cn("size-1.5 shrink-0 rounded-full", pip[market.displayStatus])} />
                <span className="truncate">{market.city}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
