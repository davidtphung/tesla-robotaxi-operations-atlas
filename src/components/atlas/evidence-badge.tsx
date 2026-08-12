import { EVIDENCE_COPY } from "@/lib/constants";
import type { EvidenceClass } from "@/lib/types";
import { cn } from "@/lib/utils";

const tone: Record<EvidenceClass, string> = {
  VERIFIED: "border-atlas-green/30 bg-atlas-green/10 text-atlas-green",
  REPORTED: "border-atlas-blue/30 bg-atlas-blue/10 text-atlas-blue",
  ESTIMATED: "border-atlas-amber/30 bg-atlas-amber/10 text-atlas-amber",
  SIMULATED: "border-atlas-red/35 bg-atlas-red/10 text-[#ff8a8d]",
  PLANNED: "border-foreground/15 bg-foreground/6 text-muted-foreground",
  UNAVAILABLE: "border-foreground/10 bg-muted text-muted-foreground",
};

const mark: Record<EvidenceClass, string> = {
  VERIFIED: "✓",
  REPORTED: "R",
  ESTIMATED: "~",
  SIMULATED: "S",
  PLANNED: "P",
  UNAVAILABLE: "—",
};

export function EvidenceBadge({
  value,
  className,
  compact = false,
}: {
  value: EvidenceClass;
  className?: string;
  compact?: boolean;
}) {
  const copy = EVIDENCE_COPY[value];
  return (
    <span
      className={cn(
        "inline-flex min-h-6 items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] font-medium tracking-[0.08em] uppercase",
        tone[value],
        className,
      )}
      title={copy.description}
    >
      <span aria-hidden className="grid size-3.5 place-items-center rounded-full bg-current/15 text-[9px] leading-none">
        {mark[value]}
      </span>
      <span>{compact ? copy.short : copy.label}</span>
      <span className="sr-only">. {copy.description}</span>
    </span>
  );
}

export function StatusGlyph({
  status,
  className,
}: {
  status: "ACTIVE" | "SUPERVISED" | "RAMPING" | "PLANNED" | "UNKNOWN";
  className?: string;
}) {
  const map = {
    ACTIVE: { label: "Active", cls: "bg-atlas-green", glyph: "●" },
    RAMPING: { label: "Ramping", cls: "bg-atlas-amber", glyph: "◐" },
    SUPERVISED: { label: "Supervised", cls: "bg-atlas-blue", glyph: "◎" },
    PLANNED: { label: "Planned", cls: "bg-muted-foreground", glyph: "○" },
    UNKNOWN: { label: "Unknown", cls: "bg-muted-foreground/60", glyph: "?" },
  }[status];

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs text-muted-foreground", className)}>
      <span aria-hidden className={cn("size-2 rounded-full", map.cls)} />
      <span className="text-foreground">{map.label}</span>
    </span>
  );
}
