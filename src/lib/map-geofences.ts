import type { GeoJSONSource, Map as MapLibreMap } from "maplibre-gl";
import type { FeatureCollection, Polygon } from "geojson";

export const GEOFENCE_SOURCE = "geofences";
export const GEOFENCE_FILL = "geofences-fill";
export const GEOFENCE_LINE = "geofences-line";
export const GEOFENCE_LINE_PLANNED = "geofences-line-planned";

export function syncGeofenceLayers(
  map: MapLibreMap,
  data: FeatureCollection<Polygon>,
) {
  if (!map.isStyleLoaded()) return;

  const existing = map.getSource(GEOFENCE_SOURCE) as GeoJSONSource | undefined;
  if (existing) {
    existing.setData(data);
    return;
  }

  map.addSource(GEOFENCE_SOURCE, {
    type: "geojson",
    data,
  });

  map.addLayer({
    id: GEOFENCE_FILL,
    type: "fill",
    source: GEOFENCE_SOURCE,
    paint: {
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
        "#D4A017",
        "#8E8E93",
      ],
      "fill-opacity": [
        "match",
        ["get", "status"],
        "PLANNED",
        0.22,
        "SUPERVISED",
        0.38,
        0.5,
      ],
      "fill-outline-color": "#ffffff",
    },
  });

  map.addLayer({
    id: GEOFENCE_LINE,
    type: "line",
    source: GEOFENCE_SOURCE,
    filter: ["!=", ["get", "status"], "PLANNED"],
    paint: {
      "line-color": [
        "match",
        ["get", "status"],
        "ACTIVE",
        "#FFD0D1",
        "SUPERVISED",
        "#D6EBFF",
        "#FFFFFF",
      ],
      "line-width": 2.25,
      "line-opacity": 1,
    },
  });

  map.addLayer({
    id: GEOFENCE_LINE_PLANNED,
    type: "line",
    source: GEOFENCE_SOURCE,
    filter: ["==", ["get", "status"], "PLANNED"],
    paint: {
      "line-color": "#FFD60A",
      "line-width": 1.75,
      "line-dasharray": [1.6, 1.4],
      "line-opacity": 0.95,
    },
  });
}

export function highlightGeofence(map: MapLibreMap, marketId: string | null) {
  if (!map.getLayer(GEOFENCE_FILL)) return;
  map.setPaintProperty(GEOFENCE_FILL, "fill-opacity", [
    "case",
    ["==", ["get", "marketId"], marketId ?? ""],
    0.68,
    [
      "match",
      ["get", "status"],
      "PLANNED",
      0.2,
      "SUPERVISED",
      0.36,
      0.48,
    ],
  ]);
  if (map.getLayer(GEOFENCE_LINE)) {
    map.setPaintProperty(GEOFENCE_LINE, "line-width", [
      "case",
      ["==", ["get", "marketId"], marketId ?? ""],
      3.4,
      2.25,
    ]);
  }
}
