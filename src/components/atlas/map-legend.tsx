const items = [
  { key: "offered", label: "Offered service area", swatch: "bg-atlas-red" },
  { key: "supervised", label: "Supervised", swatch: "bg-atlas-blue" },
  { key: "planned", label: "Planned / unverified", swatch: "bg-atlas-amber" },
];

export function MapLegend() {
  return (
    <section
      aria-label="Map legend"
      className="atlas-glass rounded-xl px-3 py-2 text-[11px] leading-4"
    >
      <p className="mb-1.5 text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
        Approximate geofences
      </p>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item.key} className="flex items-center gap-2 text-muted-foreground">
            <span aria-hidden className={`size-2 rounded-[2px] ${item.swatch}`} />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
