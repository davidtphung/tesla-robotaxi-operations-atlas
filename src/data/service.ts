import { RobotaxiMarketSchema, SourceRecordSchema } from "@/lib/schemas";
import { adapters, liveVehicleFeedConfigured } from "@/data/adapters";
import { events } from "@/data/events";
import { infrastructure } from "@/data/infrastructure";
import { ledger } from "@/data/ledger";
import { markets } from "@/data/markets";
import { policyCards, policyTopics } from "@/data/policy";
import { sources } from "@/data/sources";
import { vehicleProfiles } from "@/data/vehicles";
import { sourceQualityScore } from "@/lib/confidence";
import { SEED_GENERATED_AT } from "@/lib/constants";
import type { RobotaxiMarket, SourceRecord } from "@/lib/types";

function parseMarkets(input: RobotaxiMarket[]) {
  const result = RobotaxiMarketSchema.array().safeParse(input);
  if (!result.success) {
    console.error("Market seed failed validation", result.error);
    return input;
  }
  return result.data;
}

function parseSources(input: SourceRecord[]) {
  const result = SourceRecordSchema.array().safeParse(input);
  if (!result.success) {
    console.error("Source seed failed validation", result.error);
    return [] as SourceRecord[];
  }
  return result.data;
}

const validatedMarkets = parseMarkets(markets);
const validatedSources = parseSources(sources);

export const atlasData = {
  generatedAt: SEED_GENERATED_AT,
  markets: validatedMarkets,
  sources: validatedSources,
  events,
  policyCards,
  policyTopics,
  vehicleProfiles,
  infrastructure,
  ledger,
  adapters,
  liveVehicleFeedConfigured: liveVehicleFeedConfigured(),
};

export function getMarket(id: string | null | undefined) {
  if (!id) return undefined;
  return atlasData.markets.find((market) => market.id === id);
}

export function getSources(ids: string[]) {
  return ids
    .map((id) => atlasData.sources.find((source) => source.id === id))
    .filter((source): source is SourceRecord => Boolean(source));
}

export function marketScore(market: RobotaxiMarket) {
  return sourceQualityScore(
    market.sourceIds,
    atlasData.sources,
    market.lastVerifiedDate,
  );
}

export function kpis() {
  const active = atlasData.markets.filter((market) =>
    ["ACTIVE", "RAMPING"].includes(market.displayStatus),
  ).length;
  const supervised = atlasData.markets.filter(
    (market) => market.displayStatus === "SUPERVISED",
  ).length;
  const planned = atlasData.markets.filter(
    (market) => market.displayStatus === "PLANNED",
  ).length;
  const disclosed = atlasData.markets.filter((market) => market.fleet.count != null).length;
  const publishedFleet = atlasData.markets.reduce(
    (sum, market) => sum + (market.fleet.count ?? 0),
    0,
  );

  return {
    activeServiceMarkets: active,
    supervisedMarkets: supervised,
    plannedMarkets: planned,
    publishedFleetCount: disclosed === 0 ? null : publishedFleet,
    disclosedMarketCount: disclosed,
    disclosureCoverage: disclosed / atlasData.markets.length,
    sourceCount: atlasData.sources.length,
    lastSeedRefresh: atlasData.generatedAt,
  };
}

export function eventsForMarket(marketId: string) {
  return atlasData.events
    .filter((event) => event.marketIds.includes(marketId) || event.marketIds.length === 0)
    .sort((a, b) => a.date.localeCompare(b.date));
}
