"use client";

import { useTheme } from "next-themes";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Map, {
  Layer,
  Marker,
  NavigationControl,
  Popup,
  Source,
  type MapLayerMouseEvent,
  type MapRef,
} from "react-map-gl/maplibre";
import type { GeoJSONSource } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Compass, LocateFixed } from "lucide-react";
import { atlasData, getMarket } from "@/data/service";
import { Button } from "@/components/ui/button";
import { MapLayerControl } from "@/components/atlas/map-layer-control";
import { EvidenceBadge, StatusGlyph } from "@/components/atlas/evidence-badge";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { ILLUSTRATIVE_ZONE_DISCLAIMER, SIMULATION_DISCLAIMER } from "@/lib/constants";
import { marketsToZoneCollection } from "@/lib/geo";
import { resolveMapStyle, satelliteStyle, satelliteStyleAvailable } from "@/lib/map-style";
import {
  createMarketVehicles,
  simulationStats,
  vehiclesToGeoJSON,
} from "@/lib/simulation";
import { useDashboard } from "@/lib/store";
import type { SimulatedVehicle, SimulationStats } from "@/lib/types";
import { modeLabel, vehicleStateLabel } from "@/lib/format";
import { cn } from "@/lib/utils";

const EMPTY = vehiclesToGeoJSON([]);

export function NetworkMap({
  onStats,
}: {
  onStats: (stats: SimulationStats) => void;
}) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "light" ? "light" : "dark";
  const mapRef = useRef<MapRef>(null);
  const tickRef = useRef(0);
  const vehiclesRef = useRef<SimulatedVehicle[]>([]);
  const reducedMotion = usePrefersReducedMotion();

  const selectedMarketId = useDashboard((state) => state.selectedMarketId);
  const selectedVehicleId = useDashboard((state) => state.selectedVehicleId);
  const selectMarket = useDashboard((state) => state.selectMarket);
  const selectVehicle = useDashboard((state) => state.selectVehicle);
  const dataMode = useDashboard((state) => state.dataMode);
  const playback = useDashboard((state) => state.playback);
  const layers = useDashboard((state) => state.layers);
  const announce = useDashboard((state) => state.announce);

  const [zoom, setZoom] = useState(4.15);
  const [ready, setReady] = useState(false);
  const [hoverMarket, setHoverMarket] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<SimulatedVehicle | null>(null);

  const showSim =
    layers.vehicles &&
    (dataMode === "simulated" ||
      (dataMode === "live" && !atlasData.liveVehicleFeedConfigured));

  const mapStyle = useMemo(() => {
    if (layers.satellite && satelliteStyleAvailable()) {
      return satelliteStyle() ?? resolveMapStyle(theme);
    }
    return resolveMapStyle(theme);
  }, [layers.satellite, theme]);

  const zones = useMemo(() => marketsToZoneCollection(atlasData.markets), []);

  const selectedMarket = getMarket(selectedMarketId);

  const rebuild = useCallback(
    (tick: number) => {
      const focus = selectedMarketId
        ? atlasData.markets.filter((market) => market.id === selectedMarketId)
        : atlasData.markets.filter((market) =>
            ["ACTIVE", "RAMPING", "SUPERVISED"].includes(market.displayStatus),
          );
      const next = focus.flatMap((market) => createMarketVehicles(market, tick));
      vehiclesRef.current = next;
      const source = mapRef.current?.getSource("sim-vehicles") as GeoJSONSource | undefined;
      source?.setData(showSim ? vehiclesToGeoJSON(next) : EMPTY);
      onStats(simulationStats(next, selectedMarketId));
      return next;
    },
    [onStats, selectedMarketId, showSim],
  );

  useEffect(() => {
    rebuild(tickRef.current);
  }, [rebuild, ready]);

  const popupVehicle =
    selectedVehicleId && selectedVehicle?.id === selectedVehicleId ? selectedVehicle : null;

  useEffect(() => {
    if (!showSim || !playback || reducedMotion) return;
    const id = window.setInterval(() => {
      tickRef.current += 1;
      const next = rebuild(tickRef.current);
      if (selectedVehicleId && next) {
        setSelectedVehicle(next.find((item) => item.id === selectedVehicleId) ?? null);
      }
    }, 2000);
    return () => window.clearInterval(id);
  }, [playback, rebuild, reducedMotion, selectedVehicleId, showSim]);

  useEffect(() => {
    if (!selectedMarket || !mapRef.current) return;
    mapRef.current.flyTo({
      center: selectedMarket.center,
      zoom: selectedMarket.id === "sf-bay" ? 9.2 : 10.6,
      duration: reducedMotion ? 0 : 900,
    });
  }, [reducedMotion, selectedMarket]);

  const onMapClick = useCallback(
    (event: MapLayerMouseEvent) => {
      const feature = event.features?.[0];
      if (feature?.properties?.id && feature.layer.id.startsWith("sim-")) {
        const id = String(feature.properties.id);
        selectVehicle(id);
        setSelectedVehicle(vehiclesRef.current.find((item) => item.id === id) ?? null);
        return;
      }
      if (feature?.properties?.marketId) {
        selectMarket(String(feature.properties.marketId));
        return;
      }
    },
    [selectMarket, selectVehicle],
  );

  const locate = useCallback(async () => {
    if (!("geolocation" in navigator)) {
      announce("Geolocation is not available in this browser.");
      return;
    }
    try {
      const permission = await navigator.permissions.query({ name: "geolocation" });
      if (permission.state === "denied") {
        announce("Location permission is blocked. Enable it in the browser to geolocate.");
        return;
      }
    } catch {
      // Permissions API can be missing; the prompt below still asks first.
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        mapRef.current?.flyTo({
          center: [position.coords.longitude, position.coords.latitude],
          zoom: 11,
          duration: reducedMotion ? 0 : 800,
        });
        announce("Moved the map to your approximate location. This does not reveal Tesla vehicles.");
      },
      () => announce("Location request was cancelled or failed."),
    );
  }, [announce, reducedMotion]);

  const resetBearing = () => {
    mapRef.current?.resetNorthPitch({ duration: reducedMotion ? 0 : 400 });
  };

  const infra = atlasData.infrastructure.filter((node) => {
    if (node.kind === "airport") return layers.airports;
    return layers.charging;
  });

  return (
    <div className="relative h-full min-h-[420px] w-full overflow-hidden bg-[#090A0C]">
      <Map
        ref={mapRef}
        mapStyle={mapStyle}
        initialViewState={{ longitude: -97.8, latitude: 31.4, zoom: 4.15 }}
        style={{ width: "100%", height: "100%" }}
        attributionControl={{ compact: true }}
        cooperativeGestures={false}
        interactiveLayerIds={[
          ...(layers.coverage ? ["zones-fill"] : []),
          ...(showSim ? ["sim-vehicles-circle"] : []),
        ]}
        cursor="grab"
        onLoad={() => {
          setReady(true);
        }}
        onMoveEnd={(event) => setZoom(event.viewState.zoom)}
        onClick={onMapClick}
        reuseMaps
      >
        {layers.coverage ? (
          <Source id="zones" type="geojson" data={zones}>
            <Layer
              id="zones-fill"
              type="fill"
              paint={{
                "fill-color": [
                  "match",
                  ["get", "status"],
                  "ACTIVE",
                  "#E82127",
                  "RAMPING",
                  "#FF9F0A",
                  "SUPERVISED",
                  "#0A84FF",
                  "PLANNED",
                  "#A1A1AA",
                  "#71717A",
                ],
                "fill-opacity": theme === "dark" ? 0.16 : 0.2,
              }}
            />
            <Layer
              id="zones-line"
              type="line"
              paint={{
                "line-color": [
                  "match",
                  ["get", "status"],
                  "ACTIVE",
                  "#E82127",
                  "SUPERVISED",
                  "#0A84FF",
                  "PLANNED",
                  "#FF9F0A",
                  "#A1A1AA",
                ],
                "line-width": 1.2,
                "line-dasharray": [1, 1.2],
                "line-opacity": 0.85,
              }}
            />
          </Source>
        ) : null}

        <Source id="sim-vehicles" type="geojson" data={EMPTY}>
          <Layer
            id="sim-vehicles-circle"
            type="circle"
            layout={{ visibility: showSim ? "visible" : "none" }}
            paint={{
              "circle-radius": ["interpolate", ["linear"], ["zoom"], 4, 2.5, 11, 5.5],
              "circle-color": [
                "match",
                ["get", "state"],
                "ON_TRIP",
                "#E82127",
                "PICKUP",
                "#FF9F0A",
                "CHARGING",
                "#0A84FF",
                "EN_ROUTE",
                "#F5F5F7",
                "#A1A1AA",
              ],
              "circle-stroke-width": 1.2,
              "circle-stroke-color": theme === "dark" ? "#090A0C" : "#ffffff",
              "circle-opacity": 0.95,
            }}
          />
        </Source>

        {layers.cityStatus
          ? atlasData.markets.map((market) => (
              <Marker key={market.id} longitude={market.center[0]} latitude={market.center[1]} anchor="center">
                <button
                  type="button"
                  aria-label={`${market.city}, ${market.state}. Status ${market.displayStatus.replaceAll("_", " ")}. ${modeLabel(market.operatingMode)}.`}
                  onClick={() => selectMarket(market.id)}
                  onFocus={() => setHoverMarket(market.id)}
                  onBlur={() => setHoverMarket((value) => (value === market.id ? null : value))}
                  onMouseEnter={() => setHoverMarket(market.id)}
                  onMouseLeave={() => setHoverMarket((value) => (value === market.id ? null : value))}
                  className={cn(
                    "grid min-h-11 min-w-11 place-items-center rounded-full border bg-background/85 text-[11px] font-medium shadow-lg backdrop-blur-md atlas-motion",
                    selectedMarketId === market.id
                      ? "border-atlas-red text-atlas-red scale-110"
                      : "border-border text-foreground",
                  )}
                >
                  {market.city.slice(0, 2).toUpperCase()}
                </button>
              </Marker>
            ))
          : null}

        {infra.map((node) => (
          <Marker key={node.id} longitude={node.lng} latitude={node.lat} anchor="center">
            <button
              type="button"
              aria-label={`${node.name}. ${node.note}`}
              title={`${node.name}. ${node.note}`}
              className={cn(
                "size-3 rounded-[2px] border border-background",
                node.kind === "airport" ? "rotate-45 bg-atlas-blue" : "bg-foreground",
              )}
            />
          </Marker>
        ))}

        {hoverMarket && zoom < 8
          ? (() => {
              const market = getMarket(hoverMarket);
              if (!market) return null;
              return (
                <Popup
                  longitude={market.center[0]}
                  latitude={market.center[1]}
                  closeButton={false}
                  offset={18}
                  anchor="bottom"
                >
                  <div className="atlas-glass rounded-xl px-3 py-2 text-xs">
                    <p className="font-medium">
                      {market.city}, {market.state}
                    </p>
                    <StatusGlyph status={market.displayStatus} />
                    <p className="mt-1 text-muted-foreground">{modeLabel(market.operatingMode)}</p>
                  </div>
                </Popup>
              );
            })()
          : null}

        {popupVehicle ? (
          <Popup
            longitude={popupVehicle.lng}
            latitude={popupVehicle.lat}
            closeButton={false}
            offset={12}
            anchor="bottom"
            onClose={() => {
              selectVehicle(null);
              setSelectedVehicle(null);
            }}
          >
            <div className="atlas-glass w-56 rounded-xl p-3 text-xs">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium">
                  Simulation vehicle {popupVehicle.id.split("-").slice(-1)}
                </p>
                <EvidenceBadge value="SIMULATED" compact />
              </div>
              <p className="mt-1">Current modeled state: {vehicleStateLabel(popupVehicle.state)}</p>
              <p className="mt-1 text-muted-foreground">{SIMULATION_DISCLAIMER}</p>
              <Button
                variant="ghost"
                className="mt-2 min-h-11 w-full"
                onClick={() => {
                  selectVehicle(null);
                  setSelectedVehicle(null);
                }}
              >
                Close
              </Button>
            </div>
          </Popup>
        ) : null}

        <NavigationControl position="top-left" visualizePitch showCompass={false} />
      </Map>

      <div className="pointer-events-none absolute top-3 left-3 flex flex-col gap-2">
        <div className="pointer-events-auto flex flex-col gap-2">
          <MapLayerControl />
          <Button
            variant="secondary"
            className="atlas-glass min-h-11 min-w-11"
            onClick={locate}
            aria-label="Geolocate after permission"
          >
            <LocateFixed className="size-4" />
            <span className="hidden sm:inline">Locate</span>
          </Button>
          <Button
            variant="secondary"
            className="atlas-glass min-h-11 min-w-11"
            onClick={resetBearing}
            aria-label="Reset map bearing"
          >
            <Compass className="size-4" />
            <span className="hidden sm:inline">North</span>
          </Button>
        </div>
      </div>

      {layers.coverage ? (
        <p className="pointer-events-none absolute top-3 left-1/2 hidden max-w-sm -translate-x-1/2 rounded-full border border-border bg-background/70 px-3 py-1 text-[11px] text-muted-foreground backdrop-blur md:block">
          {ILLUSTRATIVE_ZONE_DISCLAIMER}
        </p>
      ) : null}
    </div>
  );
}
