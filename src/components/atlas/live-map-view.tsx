"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { atlasData } from "@/data/service";
import { CityInspector } from "@/components/atlas/city-inspector";
import { KpiStack } from "@/components/atlas/kpi-stack";
import { MapLegend } from "@/components/atlas/map-legend";
import { TelemetryStrip } from "@/components/atlas/telemetry-strip";
import { SkeletonLoader } from "@/components/atlas/states";
import { EvidenceBadge } from "@/components/atlas/evidence-badge";
import { useIsDesktop } from "@/hooks/use-media-query";
import { useDashboard } from "@/lib/store";
import type { SimulationStats } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NetworkMap = dynamic(
  () => import("@/components/atlas/network-map").then((mod) => mod.NetworkMap),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-full place-items-center bg-[#090A0C] p-8">
        <div className="w-64">
          <SkeletonLoader lines={4} />
          <p className="mt-3 text-sm text-muted-foreground">Loading map canvas…</p>
        </div>
      </div>
    ),
  },
);

const emptyStats: SimulationStats = {
  activeTrips: 0,
  pickupCount: 0,
  chargingCount: 0,
  idleCount: 0,
  dispatchedCount: 0,
  utilization: 0,
  medianPickupMinutes: null,
  vehicleCount: 0,
  marketId: null,
};

export function LiveMapView() {
  const isDesktop = useIsDesktop();
  const selectedMarketId = useDashboard((state) => state.selectedMarketId);
  const selectMarket = useDashboard((state) => state.selectMarket);
  const dataMode = useDashboard((state) => state.dataMode);
  const [stats, setStats] = useState<SimulationStats>(emptyStats);
  const [snap, setSnap] = useState<18 | 48 | 92>(18);

  const liveFallback = dataMode === "live" && !atlasData.liveVehicleFeedConfigured;

  const sheetHeight = useMemo(() => {
    if (isDesktop) return undefined;
    return snap === 18 ? "18dvh" : snap === 48 ? "48dvh" : "92dvh";
  }, [isDesktop, snap]);

  return (
    <div className="relative flex min-h-0 flex-1">
      <div className="relative min-w-0 flex-1">
        <div className="pointer-events-none absolute top-3 right-3 left-3 z-10 flex items-start justify-between gap-3">
          <div className="atlas-glass pointer-events-auto max-w-md rounded-2xl p-3">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-medium">Network activity</h2>
              <EvidenceBadge value={liveFallback ? "SIMULATED" : dataMode === "reported" ? "REPORTED" : "SIMULATED"} compact />
            </div>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Publicly available deployment data and transparent modeled activity.
            </p>
            <p className="mt-2 inline-flex items-center rounded-full border border-border px-2 py-0.5 text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
              Mixed data sources
            </p>
            {liveFallback ? (
              <p className="mt-2 text-[11px] text-atlas-amber" role="status">
                Live vehicle feed is not configured. Showing labeled simulated activity.
              </p>
            ) : null}
          </div>
          <div className="pointer-events-auto hidden lg:block">
            <KpiStack stats={stats} />
          </div>
        </div>

        <NetworkMap onStats={setStats} />

        <div className="pointer-events-none absolute bottom-28 left-3 z-10 hidden md:block lg:bottom-24">
          <div className="pointer-events-auto">
            <MapLegend />
          </div>
        </div>

        <TelemetryStrip stats={stats} />
      </div>

      <div className="hidden w-[380px] shrink-0 border-l border-border bg-background/80 backdrop-blur-xl xl:block 2xl:w-[420px]">
        <CityInspector />
      </div>

      <div
        className={cn(
          "atlas-glass atlas-motion fixed inset-x-0 z-30 flex flex-col rounded-t-2xl lg:hidden",
          "bottom-14",
        )}
        style={{ height: sheetHeight }}
      >
        <div className="flex items-center justify-center pt-2">
          <button
            type="button"
            className="h-11 w-full"
            aria-label="Adjust city details sheet"
            onClick={() => setSnap((value) => (value === 18 ? 48 : value === 48 ? 92 : 18))}
          >
            <span className="mx-auto block h-1 w-12 rounded-full bg-foreground/20" />
          </button>
        </div>
        <div className="flex items-center justify-between gap-2 px-4 pb-2">
          <p className="text-sm font-medium">
            {selectedMarketId
              ? atlasData.markets.find((item) => item.id === selectedMarketId)?.city
              : "Explore markets"}
          </p>
          <div className="flex gap-1">
            {([18, 48, 92] as const).map((value) => (
              <Button
                key={value}
                variant={snap === value ? "secondary" : "ghost"}
                className="min-h-11 px-3 text-xs"
                onClick={() => setSnap(value)}
                aria-label={`Sheet height ${value} percent`}
              >
                {value}%
              </Button>
            ))}
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {snap === 18 ? (
            <div className="flex gap-2 overflow-x-auto px-4 pb-3">
              {atlasData.markets.map((market) => (
                <button
                  key={market.id}
                  type="button"
                  onClick={() => {
                    selectMarket(market.id);
                    setSnap(48);
                  }}
                  className="min-h-11 shrink-0 rounded-full border border-border px-3 text-xs"
                >
                  {market.city}
                </button>
              ))}
            </div>
          ) : (
            <CityInspector />
          )}
        </div>
      </div>
    </div>
  );
}
