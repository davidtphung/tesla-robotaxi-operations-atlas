"use client";

import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef } from "react";
import Map, { type MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { GeofenceOverlay } from "@/components/atlas/geofence-overlay";
import { geofenceByMarketId, ringBBox } from "@/data/geofences";
import { getMarket } from "@/data/service";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { resolveMapStyle } from "@/lib/map-style";
import { useDashboard } from "@/lib/store";

export function NetworkMap() {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "light" ? "light" : "dark";
  const mapRef = useRef<MapRef>(null);
  const reducedMotion = usePrefersReducedMotion();
  const selectedMarketId = useDashboard((state) => state.selectedMarketId);
  const selectedMarket = getMarket(selectedMarketId);
  const mapStyle = useMemo(() => resolveMapStyle(theme), [theme]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!selectedMarket) {
      map.easeTo({
        center: [-97.35, 30.55],
        zoom: 6.15,
        duration: reducedMotion ? 0 : 600,
      });
      return;
    }
    const fence = geofenceByMarketId[selectedMarket.id];
    if (fence) {
      map.fitBounds(ringBBox(fence.ring), {
        padding: 72,
        duration: reducedMotion ? 0 : 700,
        maxZoom: 11.6,
      });
      return;
    }
    map.flyTo({
      center: selectedMarket.center,
      zoom: 10.2,
      duration: reducedMotion ? 0 : 700,
    });
  }, [reducedMotion, selectedMarket]);

  return (
    <div className="absolute inset-0 bg-[#090A0C]">
      <Map
        ref={mapRef}
        mapStyle={mapStyle}
        initialViewState={{ longitude: -97.35, latitude: 30.55, zoom: 6.15 }}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        attributionControl={{ compact: true }}
        cursor="grab"
        reuseMaps={false}
      />
      <GeofenceOverlay mapRef={mapRef} />
    </div>
  );
}
