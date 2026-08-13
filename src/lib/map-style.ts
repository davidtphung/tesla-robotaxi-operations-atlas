import type { StyleSpecification } from "maplibre-gl";

export function rasterStyle(theme: "dark" | "light"): StyleSpecification {
  const tiles =
    theme === "dark"
      ? [
          "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
          "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
          "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
        ]
      : [
          "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png",
          "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png",
          "https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png",
        ];

  return {
    version: 8,
    name: theme === "dark" ? "Atlas Dark Raster" : "Atlas Light Raster",
    glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
    sources: {
      carto: {
        type: "raster",
        tiles,
        tileSize: 256,
        attribution: "© OpenStreetMap contributors © CARTO",
      },
    },
    layers: [
      {
        id: "background",
        type: "background",
        paint: {
          "background-color": theme === "dark" ? "#090A0C" : "#E8EAED",
        },
      },
      {
        id: "carto",
        type: "raster",
        source: "carto",
        paint: {
          "raster-opacity": theme === "dark" ? 0.9 : 0.94,
        },
      },
    ],
  };
}

export function resolveMapStyle(theme: "dark" | "light") {
  const custom = process.env.NEXT_PUBLIC_MAP_STYLE_URL;
  if (custom) return custom;
  if (theme === "dark" && process.env.NEXT_PUBLIC_MAP_STYLE_URL_DARK) {
    return process.env.NEXT_PUBLIC_MAP_STYLE_URL_DARK;
  }
  if (theme === "light" && process.env.NEXT_PUBLIC_MAP_STYLE_URL_LIGHT) {
    return process.env.NEXT_PUBLIC_MAP_STYLE_URL_LIGHT;
  }
  return rasterStyle(theme);
}

export function satelliteStyleAvailable() {
  return Boolean(
    process.env.NEXT_PUBLIC_MAPTILER_KEY || process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
  );
}

export function satelliteStyle() {
  const maptiler = process.env.NEXT_PUBLIC_MAPTILER_KEY;
  if (maptiler) {
    return `https://api.maptiler.com/maps/hybrid/style.json?key=${maptiler}`;
  }
  return null;
}
