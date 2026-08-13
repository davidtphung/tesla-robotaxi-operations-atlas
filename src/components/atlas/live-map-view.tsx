"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { atlasData } from "@/data/service";
import { statusLabel } from "@/lib/format";
import { useDashboard } from "@/lib/store";

const NetworkMap = dynamic(
  () => import("@/components/atlas/network-map").then((mod) => mod.NetworkMap),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-[#090A0C]" />,
  },
);

export function LiveMapView() {
  const selectedMarketId = useDashboard((state) => state.selectedMarketId);
  const selectMarket = useDashboard((state) => state.selectMarket);

  return (
    <div className="relative min-h-0 flex-1">
      <NetworkMap />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-3 py-2">
        <p className="text-[12px] font-medium tracking-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
          Tesla Robotaxi
        </p>
        <label className="pointer-events-auto sr-only" htmlFor="city-jump">
          Jump to city
        </label>
        <select
          id="city-jump"
          className="pointer-events-auto appearance-none bg-transparent text-right text-[12px] text-white outline-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]"
          value={selectedMarketId ?? ""}
          onChange={(event) => selectMarket(event.target.value || null)}
          aria-label="Jump to city"
        >
          <option value="">All cities</option>
          {atlasData.markets.map((market) => (
            <option key={market.id} value={market.id}>
              {market.city} — {statusLabel(market.displayStatus)}
            </option>
          ))}
        </select>
      </div>

      <div className="pointer-events-auto absolute bottom-3 left-3 z-20 hidden gap-3 text-[11px] text-white/45 lg:flex">
        <Link href="/markets" className="hover:text-white">
          Markets
        </Link>
        <Link href="/policy" className="hover:text-white">
          Policy
        </Link>
        <Link href="/methodology" className="hover:text-white">
          Sources
        </Link>
      </div>
    </div>
  );
}
