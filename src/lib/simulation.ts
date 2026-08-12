import type { RobotaxiMarket, SimulatedVehicle, SimulationStats, VehicleSimState } from "@/lib/types";
import { headingBetween, interpolate, makeCorridors } from "@/lib/geo";

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(value: string) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

const STATES: VehicleSimState[] = ["IDLE", "EN_ROUTE", "PICKUP", "ON_TRIP", "CHARGING"];

function stateFromTick(seed: number, tick: number): VehicleSimState {
  const cycle = (seed + Math.floor(tick / 8)) % 20;
  if (cycle < 3) return "IDLE";
  if (cycle < 6) return "EN_ROUTE";
  if (cycle < 8) return "PICKUP";
  if (cycle < 16) return "ON_TRIP";
  return "CHARGING";
}

export function vehicleCountForMarket(market: RobotaxiMarket) {
  const seed = hashString(market.id);
  return 8 + (seed % 17);
}

export function createMarketVehicles(
  market: RobotaxiMarket,
  tick = 0,
  now = new Date().toISOString(),
): SimulatedVehicle[] {
  const rand = mulberry32(hashString(market.id));
  const count = vehicleCountForMarket(market);
  const corridors = makeCorridors(market.center, market.zoneRadiusKm * 0.78, 6);

  return Array.from({ length: count }, (_, index) => {
    const corridorIndex = index % corridors.length;
    const corridor = corridors[corridorIndex];
    const progress = (rand() + index / count + tick * 0.012) % 1;
    const scaled = progress * (corridor.length - 1);
    const i = Math.floor(scaled);
    const localT = scaled - i;
    const a = corridor[i];
    const b = corridor[Math.min(i + 1, corridor.length - 1)];
    const [lng, lat] = interpolate(a, b, localT);
    const state = stateFromTick(index + hashString(market.id), tick);
    const speed =
      state === "IDLE" || state === "CHARGING" || state === "PICKUP"
        ? 0
        : 11 + ((index * 7 + tick) % 18);

    return {
      id: `sim-${market.id}-${String(index + 1).padStart(2, "0")}`,
      marketId: market.id,
      lat,
      lng,
      heading: headingBetween(a, b),
      speedMph: speed,
      state,
      simulationOnly: true,
      updatedAt: now,
      corridorIndex,
      progress,
    };
  });
}

export function advanceVehicles(
  vehicles: SimulatedVehicle[],
  markets: RobotaxiMarket[],
  tick: number,
): SimulatedVehicle[] {
  const now = new Date().toISOString();
  const byMarket = new Map(markets.map((market) => [market.id, market]));
  return vehicles.map((vehicle) => {
    const market = byMarket.get(vehicle.marketId);
    if (!market) return vehicle;
    const next = createMarketVehicles(market, tick, now).find((item) => item.id === vehicle.id);
    return next ?? vehicle;
  });
}

export function simulationStats(
  vehicles: SimulatedVehicle[],
  marketId: string | null,
): SimulationStats {
  const set = marketId ? vehicles.filter((vehicle) => vehicle.marketId === marketId) : vehicles;
  const count = (state: VehicleSimState) => set.filter((vehicle) => vehicle.state === state).length;
  const pickup = count("PICKUP");
  const trips = count("ON_TRIP");
  const charging = count("CHARGING");
  const idle = count("IDLE");
  const dispatched = count("EN_ROUTE");
  const utilized = trips + pickup + dispatched;

  return {
    activeTrips: trips,
    pickupCount: pickup,
    chargingCount: charging,
    idleCount: idle,
    dispatchedCount: dispatched,
    utilization: set.length ? utilized / set.length : 0,
    medianPickupMinutes: set.length ? 4 : null,
    vehicleCount: set.length,
    marketId,
  };
}

export function vehiclesToGeoJSON(vehicles: SimulatedVehicle[]) {
  return {
    type: "FeatureCollection" as const,
    features: vehicles.map((vehicle) => ({
      type: "Feature" as const,
      properties: {
        id: vehicle.id,
        marketId: vehicle.marketId,
        state: vehicle.state,
        heading: vehicle.heading,
        speedMph: vehicle.speedMph,
        simulationOnly: true,
      },
      geometry: {
        type: "Point" as const,
        coordinates: [vehicle.lng, vehicle.lat],
      },
    })),
  };
}

export { STATES };
