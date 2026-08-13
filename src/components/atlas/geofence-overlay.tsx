"use client";

import { useEffect, useState } from "react";
import type { MapRef } from "react-map-gl/maplibre";
import { geofences } from "@/data/geofences";
import { atlasData } from "@/data/service";
import { useDashboard } from "@/lib/store";

const FILL: Record<string, string> = {
  ACTIVE: "rgba(232, 33, 39, 0.42)",
  RAMPING: "rgba(255, 159, 10, 0.38)",
  SUPERVISED: "rgba(10, 132, 255, 0.38)",
  PLANNED: "rgba(212, 160, 23, 0.22)",
  UNKNOWN: "rgba(142, 142, 147, 0.22)",
};

const STROKE: Record<string, string> = {
  ACTIVE: "#FF6B6F",
  RAMPING: "#FFB340",
  SUPERVISED: "#64B5FF",
  PLANNED: "#FFD60A",
  UNKNOWN: "#C7C7CC",
};

type ProjectedFence = {
  id: string;
  name: string;
  status: string;
  d: string;
  labelX: number;
  labelY: number;
};

function getMap(mapRef: React.RefObject<MapRef | null>) {
  const ref = mapRef.current;
  if (!ref) return null;
  const maybe = ref as MapRef & { project?: (lngLat: [number, number]) => { x: number; y: number } };
  return maybe.getMap?.() ?? maybe;
}

export function GeofenceOverlay({
  mapRef,
}: {
  mapRef: React.RefObject<MapRef | null>;
}) {
  const selectedMarketId = useDashboard((state) => state.selectedMarketId);
  const selectMarket = useDashboard((state) => state.selectMarket);
  const [fences, setFences] = useState<ProjectedFence[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const redraw = () => {
      const map = getMap(mapRef);
      if (!map || typeof map.project !== "function") return;
      const container = map.getContainer?.() as HTMLElement | undefined;
      if (container) {
        setSize({ w: container.clientWidth, h: container.clientHeight });
      }

      const next = geofences.map((spec) => {
        const market = atlasData.markets.find((item) => item.id === spec.marketId);
        const points = spec.ring.map(([lng, lat]) => {
          const point = map.project([lng, lat]);
          return `${point.x.toFixed(1)},${point.y.toFixed(1)}`;
        });
        const label = spec.ring.reduce(
          (acc, [lng, lat], index, arr) => {
            if (index === arr.length - 1) return acc;
            const point = map.project([lng, lat]);
            return { x: acc.x + point.x, y: acc.y + point.y, n: acc.n + 1 };
          },
          { x: 0, y: 0, n: 0 },
        );
        return {
          id: spec.marketId,
          name: market?.city ?? spec.marketId,
          status: market?.displayStatus ?? "UNKNOWN",
          d: `M${points.join("L")}Z`,
          labelX: label.n ? label.x / label.n : 0,
          labelY: label.n ? label.y / label.n : 0,
        };
      });
      setFences(next);
    };

    const map = getMap(mapRef);
    redraw();
    if (!map || typeof map.on !== "function") {
      const timer = window.setInterval(redraw, 250);
      const stop = window.setTimeout(() => window.clearInterval(timer), 4000);
      return () => {
        window.clearInterval(timer);
        window.clearTimeout(stop);
      };
    }

    map.on("move", redraw);
    map.on("zoom", redraw);
    map.on("resize", redraw);
    map.on("load", redraw);
    return () => {
      map.off("move", redraw);
      map.off("zoom", redraw);
      map.off("resize", redraw);
      map.off("load", redraw);
    };
  }, [mapRef]);

  if (!size.w || !size.h) {
    return null;
  }

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-[2]"
      width={size.w}
      height={size.h}
      viewBox={`0 0 ${size.w} ${size.h}`}
      aria-hidden={false}
      role="img"
      aria-label="Tesla Robotaxi approximate service geofences"
    >
      {fences.map((fence) => {
        const selected = fence.id === selectedMarketId;
        const planned = fence.status === "PLANNED";
        return (
          <g key={fence.id}>
            <path
              d={fence.d}
              fill={FILL[fence.status] ?? FILL.UNKNOWN}
              stroke="none"
              className="pointer-events-auto cursor-pointer"
              onClick={() => selectMarket(selected ? null : fence.id)}
            />
            <path
              d={fence.d}
              fill="none"
              stroke={selected ? "#FFFFFF" : STROKE[fence.status]}
              strokeWidth={selected ? 5 : 3.25}
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeDasharray={planned ? "6 5" : undefined}
              className="pointer-events-none"
            />
            <text
              x={fence.labelX}
              y={fence.labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              className="pointer-events-none select-none"
              fill="#FFFFFF"
              stroke="#090A0C"
              strokeWidth="3"
              paintOrder="stroke"
              fontSize="12"
              fontWeight="600"
            >
              {fence.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
