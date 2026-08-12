import { atlasData } from "@/data/service";
import type { SearchHit } from "@/lib/types";

export function buildSearchIndex(): SearchHit[] {
  const markets = atlasData.markets.map((market) => ({
    id: `market-${market.id}`,
    category: "market" as const,
    title: `${market.city}, ${market.state}`,
    subtitle: `${market.displayStatus.replaceAll("_", " ")} · ${market.operatingMode.replaceAll("_", " ")}`,
    href: `/?market=${market.id}`,
    keywords: [market.city, market.state, market.id, market.displayStatus, market.region],
  }));

  const vehicles = atlasData.vehicleProfiles.map((vehicle) => ({
    id: `vehicle-${vehicle.id}`,
    category: "vehicle" as const,
    title: vehicle.name,
    subtitle: vehicle.category,
    href: `/fleet?vehicle=${vehicle.id}`,
    keywords: [vehicle.name, vehicle.category, vehicle.id],
  }));

  const policies = atlasData.policyCards.map((card) => ({
    id: `policy-${card.id}`,
    category: "policy" as const,
    title: card.title,
    subtitle: card.topic.replace("-", " "),
    href: `/policy?topic=${card.topic}&card=${card.id}`,
    keywords: [card.title, card.summary, card.topic],
  }));

  const events = atlasData.events.map((event) => ({
    id: `event-${event.id}`,
    category: "event" as const,
    title: event.title,
    subtitle: event.date,
    href: `/timeline?event=${event.id}`,
    keywords: [event.title, event.summary, event.kind],
  }));

  const sources = atlasData.sources.map((source) => ({
    id: `source-${source.id}`,
    category: "source" as const,
    title: source.title,
    subtitle: source.publisher,
    href: `/methodology?source=${source.id}`,
    keywords: [source.title, source.publisher, source.notes],
  }));

  return [...markets, ...vehicles, ...policies, ...events, ...sources];
}

export function searchAtlas(query: string, limit = 20): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return buildSearchIndex().slice(0, limit);
  return buildSearchIndex()
    .map((hit) => {
      const hay = `${hit.title} ${hit.subtitle} ${hit.keywords.join(" ")}`.toLowerCase();
      const score = hay.includes(q) ? (hit.title.toLowerCase().startsWith(q) ? 2 : 1) : 0;
      return { hit, score };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((row) => row.hit);
}
