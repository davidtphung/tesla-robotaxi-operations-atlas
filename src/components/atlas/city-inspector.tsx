"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { geofenceByMarketId } from "@/data/geofences";
import { atlasData } from "@/data/service";
import { StatusGlyph } from "@/components/atlas/evidence-badge";
import { modeLabel } from "@/lib/format";
import { useDashboard } from "@/lib/store";
import { cn } from "@/lib/utils";

export function CityInspector({ className }: { className?: string }) {
  const selectedMarketId = useDashboard((state) => state.selectedMarketId);
  const selectMarket = useDashboard((state) => state.selectMarket);
  const market = atlasData.markets.find((item) => item.id === selectedMarketId);

  if (!market) return null;

  const fence = geofenceByMarketId[market.id];

  return (
    <aside className={cn("p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium tracking-tight">
            {market.city}
            <span className="ml-2 text-sm font-normal text-muted-foreground">{market.state}</span>
          </h2>
          <div className="mt-1">
            <StatusGlyph status={market.displayStatus} />
          </div>
        </div>
        <button
          type="button"
          className="grid size-9 place-items-center rounded-full text-muted-foreground hover:text-foreground"
          aria-label="Close city details"
          onClick={() => selectMarket(null)}
        >
          <X className="size-4" />
        </button>
      </div>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">{modeLabel(market.operatingMode)}</p>
      {fence?.approxAreaSqMi ? (
        <p className="text-sm text-muted-foreground">About {fence.approxAreaSqMi} sq mi</p>
      ) : null}

      <p className="mt-3 text-sm leading-6 text-muted-foreground">{fence?.note ?? market.publicDisclosure}</p>
      <p className="mt-2 text-[11px] leading-4 text-muted-foreground">
        Approximate public visualization — not an official Tesla boundary.
      </p>

      <Link href="/methodology" className="mt-3 inline-flex min-h-9 items-center text-xs text-white/70 underline-offset-2 hover:underline">
        Sources
      </Link>
    </aside>
  );
}
