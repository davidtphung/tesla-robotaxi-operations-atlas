import { kpis } from "@/data/service";
import { UNDISCLOSED_LABEL } from "@/lib/constants";
import type { SimulationStats } from "@/lib/types";

export function KpiStack({ stats }: { stats: SimulationStats }) {
  const snapshot = kpis();
  const cards = [
    {
      label: "Active service markets",
      value: String(snapshot.activeServiceMarkets),
      note: "Officially listed as offered or ramping",
    },
    {
      label: "Planned markets",
      value: String(snapshot.plannedMarkets),
      note: "Company plan; not confirmed live",
    },
    {
      label: "Published fleet count",
      value: snapshot.publishedFleetCount == null ? UNDISCLOSED_LABEL : String(snapshot.publishedFleetCount),
      note: "No defensible city totals in the seed",
    },
    {
      label: "Simulated active vehicles",
      value: String(stats.vehicleCount),
      note: "Simulation only — not Tesla telemetry",
    },
  ];

  return (
    <section aria-label="Network indicators" className="flex w-[220px] flex-col gap-2">
      {cards.map((card) => (
        <article key={card.label} className="atlas-glass rounded-2xl px-3 py-2.5">
          <p className="text-[10px] tracking-[0.12em] text-muted-foreground uppercase">{card.label}</p>
          <p className="mt-1 text-lg font-medium leading-tight">{card.value}</p>
          <p className="mt-1 text-[11px] leading-4 text-muted-foreground">{card.note}</p>
        </article>
      ))}
    </section>
  );
}
