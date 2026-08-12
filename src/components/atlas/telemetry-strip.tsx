"use client";

import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DATE_RANGE_COPY, NO_LIVE_TELEMETRY } from "@/lib/constants";
import { percent } from "@/lib/format";
import { useDashboard } from "@/lib/store";
import type { DateRange, SimulationStats } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { atlasData } from "@/data/service";

const ranges: DateRange[] = ["today", "7d", "30d", "launch"];

export function TelemetryStrip({ stats }: { stats: SimulationStats }) {
  const dateRange = useDashboard((state) => state.dateRange);
  const setDateRange = useDashboard((state) => state.setDateRange);
  const playback = useDashboard((state) => state.playback);
  const setPlayback = useDashboard((state) => state.setPlayback);
  const dataMode = useDashboard((state) => state.dataMode);

  return (
    <div className="pointer-events-none absolute inset-x-3 bottom-3 z-10 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
      <div className="pointer-events-auto hidden md:block">
        {/* legend injected by parent */}
      </div>

      <section
        aria-label="Simulation timeline"
        className="atlas-glass pointer-events-auto mx-auto flex w-full max-w-xl flex-col gap-2 rounded-2xl p-2 sm:flex-row sm:items-center"
      >
        <div
          role="tablist"
          aria-label="Date range"
          className="flex flex-1 rounded-xl bg-background/40 p-1"
        >
          {ranges.map((range) => (
            <button
              key={range}
              type="button"
              role="tab"
              aria-selected={dateRange === range}
              onClick={() => setDateRange(range)}
              className={cn(
                "min-h-11 flex-1 rounded-lg px-2 text-xs font-medium",
                dateRange === range ? "bg-foreground text-background" : "text-muted-foreground",
              )}
            >
              {DATE_RANGE_COPY[range]}
            </button>
          ))}
        </div>
        <Button
          variant="secondary"
          className="min-h-11"
          aria-label={playback ? "Pause simulated activity" : "Play simulated activity"}
          onClick={() => setPlayback(!playback)}
        >
          {playback ? <Pause className="size-4" /> : <Play className="size-4" />}
          {playback ? "Pause" : "Play"}
        </Button>
        <p className="px-2 text-[11px] leading-4 text-muted-foreground">
          {dataMode === "reported"
            ? "Reported view hides simulated vehicles."
            : "Playback animates aggregated modeled flow, not private trips."}
        </p>
      </section>

      <article className="atlas-glass pointer-events-auto w-full max-w-xs rounded-2xl p-3 text-xs lg:ml-auto">
        <p className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase">Data integrity</p>
        <p className="mt-1 leading-5">{NO_LIVE_TELEMETRY}</p>
        <dl className="mt-2 grid grid-cols-2 gap-2">
          <div>
            <dt className="text-muted-foreground">Sources</dt>
            <dd>{atlasData.sources.length}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Sim. utilization</dt>
            <dd>{percent(stats.utilization)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Sim. trips</dt>
            <dd>{stats.activeTrips}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Charging (sim.)</dt>
            <dd>{stats.chargingCount}</dd>
          </div>
        </dl>
        <Link href="/methodology" className="mt-2 inline-flex min-h-11 items-center text-atlas-blue underline-offset-2 hover:underline">
          View methodology
        </Link>
      </article>
    </div>
  );
}
