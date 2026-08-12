import { SIMULATION_DISCLAIMER } from "@/lib/constants";

const items = [
  { key: "service", label: "Service area (illustrative)", swatch: "bg-atlas-red/70", mark: "▣" },
  { key: "supervised", label: "Supervised rides", swatch: "bg-atlas-blue", mark: "◎" },
  { key: "driverless", label: "Unsupervised / driverless reported", swatch: "bg-atlas-green", mark: "●" },
  { key: "planned", label: "Planned zone", swatch: "bg-atlas-amber", mark: "○" },
  { key: "ops", label: "Charging / operations node", swatch: "bg-foreground", mark: "▢" },
  { key: "sim", label: "Simulated activity vehicle", swatch: "bg-atlas-red", mark: "▸" },
];

export function MapLegend() {
  return (
    <section
      aria-label="Map legend"
      className="atlas-glass max-w-[280px] rounded-2xl p-3 text-xs"
    >
      <p className="mb-2 text-[10px] tracking-[0.14em] text-muted-foreground uppercase">Legend</p>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item.key} className="flex items-center gap-2">
            <span aria-hidden className={`size-2.5 rounded-[3px] ${item.swatch}`} />
            <span className="sr-only">{item.mark} </span>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 border-t border-border pt-2 text-[11px] leading-4 text-muted-foreground">
        {SIMULATION_DISCLAIMER}
      </p>
    </section>
  );
}
