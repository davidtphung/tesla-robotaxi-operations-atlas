"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_LAYERS } from "@/lib/constants";
import { atlasData } from "@/data/service";
import type { DataMode, DateRange, LayerState } from "@/lib/types";

interface DashboardState {
  sidebarExpanded: boolean;
  selectedMarketId: string | null;
  selectedVehicleId: string | null;
  highlightedEventId: string | null;
  compareIds: string[];
  compareOpen: boolean;
  dataMode: DataMode;
  dateRange: DateRange;
  playback: boolean;
  layers: LayerState;
  commandOpen: boolean;
  a11yOpen: boolean;
  sheetOpen: boolean;
  largeText: boolean;
  highContrast: boolean;
  lastRefreshed: string;
  statusMessage: string;
  setSidebarExpanded: (value: boolean) => void;
  toggleSidebar: () => void;
  selectMarket: (id: string | null) => void;
  selectVehicle: (id: string | null) => void;
  setHighlightedEvent: (id: string | null) => void;
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  setCompareOpen: (value: boolean) => void;
  setDataMode: (mode: DataMode) => void;
  setDateRange: (range: DateRange) => void;
  setPlayback: (value: boolean) => void;
  toggleLayer: (key: keyof LayerState) => void;
  setLayers: (layers: Partial<LayerState>) => void;
  setCommandOpen: (value: boolean) => void;
  setA11yOpen: (value: boolean) => void;
  setSheetOpen: (value: boolean) => void;
  setLargeText: (value: boolean) => void;
  setHighContrast: (value: boolean) => void;
  announce: (message: string) => void;
  hydrateFromUrl: (params: {
    market?: string | null;
    mode?: DataMode | null;
    range?: DateRange | null;
    layers?: string | null;
    compare?: string | null;
  }) => void;
}

export const useDashboard = create<DashboardState>()(
  persist(
    (set, get) => ({
      sidebarExpanded: false,
      selectedMarketId: null,
      selectedVehicleId: null,
      highlightedEventId: null,
      compareIds: [],
      compareOpen: false,
      dataMode: "reported",
      dateRange: "today",
      playback: false,
      layers: DEFAULT_LAYERS,
      commandOpen: false,
      a11yOpen: false,
      sheetOpen: false,
      largeText: false,
      highContrast: false,
      lastRefreshed: atlasData.generatedAt,
      statusMessage: "Public data view ready. Simulation labels are on.",
      setSidebarExpanded: (sidebarExpanded) => set({ sidebarExpanded }),
      toggleSidebar: () => set({ sidebarExpanded: !get().sidebarExpanded }),
      selectMarket: (selectedMarketId) =>
        set({
          selectedMarketId,
          selectedVehicleId: null,
          sheetOpen: Boolean(selectedMarketId),
          statusMessage: selectedMarketId
            ? `Selected market ${selectedMarketId.replaceAll("-", " ")}.`
            : "Market selection cleared.",
        }),
      selectVehicle: (selectedVehicleId) =>
        set({
          selectedVehicleId,
          statusMessage: selectedVehicleId
            ? `Opened ${selectedVehicleId}. This is a simulated vehicle, not a real Tesla location.`
            : "Simulation vehicle card closed.",
        }),
      setHighlightedEvent: (highlightedEventId) => set({ highlightedEventId }),
      toggleCompare: (id) => {
        const current = get().compareIds;
        if (current.includes(id)) {
          set({ compareIds: current.filter((item) => item !== id) });
          return;
        }
        if (current.length >= 3) return;
        set({ compareIds: [...current, id], compareOpen: true });
      },
      clearCompare: () => set({ compareIds: [], compareOpen: false }),
      setCompareOpen: (compareOpen) => set({ compareOpen }),
      setDataMode: (dataMode) =>
        set({
          dataMode,
          playback: dataMode === "simulated",
          statusMessage:
            dataMode === "live" && !atlasData.liveVehicleFeedConfigured
              ? "Live vehicle feed is not configured. Showing labeled simulated activity."
              : `Data mode set to ${dataMode}.`,
        }),
      setDateRange: (dateRange) => set({ dateRange }),
      setPlayback: (playback) => set({ playback }),
      toggleLayer: (key) =>
        set({
          layers: { ...get().layers, [key]: !get().layers[key] },
        }),
      setLayers: (layers) => set({ layers: { ...get().layers, ...layers } }),
      setCommandOpen: (commandOpen) => set({ commandOpen }),
      setA11yOpen: (a11yOpen) => set({ a11yOpen }),
      setSheetOpen: (sheetOpen) => set({ sheetOpen }),
      setLargeText: (largeText) => set({ largeText }),
      setHighContrast: (highContrast) => set({ highContrast }),
      announce: (statusMessage) => set({ statusMessage }),
      hydrateFromUrl: ({ market, mode, range, layers, compare }) => {
        const next: Partial<DashboardState> = {};
        if (market && atlasData.markets.some((item) => item.id === market)) {
          next.selectedMarketId = market;
          next.sheetOpen = true;
        }
        if (mode && ["live", "reported", "simulated"].includes(mode)) {
          next.dataMode = mode;
        }
        if (range && ["today", "7d", "30d", "launch"].includes(range)) {
          next.dateRange = range;
        }
        void layers;
        if (compare) {
          next.compareIds = compare
            .split(",")
            .filter((id) => atlasData.markets.some((item) => item.id === id))
            .slice(0, 3);
          next.compareOpen = (next.compareIds?.length ?? 0) > 1;
        }
        if (Object.keys(next).length) set(next);
      },
    }),
    {
      name: "atlas-prefs-v3",
      partialize: (state) => ({
        largeText: state.largeText,
        highContrast: state.highContrast,
      }),
    },
  ),
);

export function serializeShareState(state: DashboardState) {
  const params = new URLSearchParams();
  if (state.selectedMarketId) params.set("market", state.selectedMarketId);
  if (state.compareIds.length) params.set("compare", state.compareIds.join(","));
  return params.toString();
}
