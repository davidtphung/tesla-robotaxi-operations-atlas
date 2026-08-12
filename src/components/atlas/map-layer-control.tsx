"use client";

import { Layers } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { satelliteStyleAvailable } from "@/lib/map-style";
import { useDashboard } from "@/lib/store";
import type { LayerState } from "@/lib/types";
import { atlasData } from "@/data/service";

const LAYER_META: {
  key: keyof LayerState;
  label: string;
  hint: string;
  gated?: string;
}[] = [
  { key: "coverage", label: "Coverage zones", hint: "Illustrative polygons, not official boundaries." },
  { key: "cityStatus", label: "City status", hint: "Active, supervised, planned markers." },
  { key: "vehicles", label: "Simulated vehicle activity", hint: "Always labeled Simulation." },
  { key: "charging", label: "Charging and operations nodes", hint: "Illustrative nodes unless a source is added." },
  { key: "airports", label: "Airports / major destinations", hint: "Public airport coordinates." },
  { key: "regulation", label: "Regulation / permit overlays", hint: "Notes only; no invented dockets." },
  {
    key: "traffic",
    label: "Traffic intensity",
    hint: "Requires a licensed public traffic source.",
    gated: "TrafficAdapter is unconfigured.",
  },
  {
    key: "satellite",
    label: "Satellite basemap",
    hint: "Requires MapTiler or Mapbox setup.",
    gated: "No satellite provider key.",
  },
];

export function MapLayerControl() {
  const layers = useDashboard((state) => state.layers);
  const toggleLayer = useDashboard((state) => state.toggleLayer);
  const trafficReady = atlasData.adapters.find((item) => item.id === "traffic")?.status === "ok";
  const satelliteReady = satelliteStyleAvailable();

  return (
    <Popover>
      <PopoverTrigger
        className="atlas-glass inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg border border-transparent bg-secondary px-2.5 text-sm font-medium"
        aria-label="Data layers"
      >
        <Layers className="size-4" />
        <span className="hidden sm:inline">Layers</span>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80">
        <p className="mb-3 text-sm font-medium">Data layers</p>
        <ul className="space-y-3">
          {LAYER_META.map((layer) => {
            const locked =
              (layer.key === "traffic" && !trafficReady) ||
              (layer.key === "satellite" && !satelliteReady);
            return (
              <li key={layer.key} className="flex items-start justify-between gap-3">
                <Label htmlFor={`layer-${layer.key}`} className="text-sm leading-5 font-normal">
                  {layer.label}
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {locked ? layer.gated : layer.hint}
                  </span>
                </Label>
                <Switch
                  id={`layer-${layer.key}`}
                  checked={locked ? false : layers[layer.key]}
                  disabled={locked}
                  onCheckedChange={() => toggleLayer(layer.key)}
                  aria-label={layer.label}
                />
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
