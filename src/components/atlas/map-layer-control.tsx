"use client";

import { Layers } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDashboard } from "@/lib/store";
import type { LayerState } from "@/lib/types";

const LAYER_META: { key: keyof LayerState; label: string }[] = [
  { key: "coverage", label: "Service geofences" },
  { key: "cityStatus", label: "City labels" },
  { key: "vehicles", label: "Simulated vehicles" },
  { key: "airports", label: "Airports" },
];

export function MapLayerControl() {
  const layers = useDashboard((state) => state.layers);
  const toggleLayer = useDashboard((state) => state.toggleLayer);

  return (
    <Popover>
      <PopoverTrigger
        className="atlas-glass inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg bg-secondary"
        aria-label="Map layers"
      >
        <Layers className="size-4" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64">
        <p className="mb-2 text-sm font-medium">Layers</p>
        <ul className="space-y-2">
          {LAYER_META.map((layer) => (
            <li key={layer.key} className="flex items-center justify-between gap-3">
              <Label htmlFor={`layer-${layer.key}`} className="text-sm font-normal">
                {layer.label}
              </Label>
              <Switch
                id={`layer-${layer.key}`}
                checked={layers[layer.key]}
                onCheckedChange={() => toggleLayer(layer.key)}
                aria-label={layer.label}
              />
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[11px] leading-4 text-muted-foreground">
          Geofences are approximate. Tesla does not publish official boundary files.
        </p>
      </PopoverContent>
    </Popover>
  );
}
