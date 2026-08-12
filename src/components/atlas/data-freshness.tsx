import { formatDateTime, formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";

export function DataFreshnessIndicator({
  at,
  label = "Last refreshed",
  stale = false,
  className,
}: {
  at: string | null;
  label?: string;
  stale?: boolean;
  className?: string;
}) {
  return (
    <p className={cn("text-xs text-muted-foreground", className)}>
      <span className="sr-only">{label}: </span>
      <span aria-hidden className={cn("mr-1.5 inline-block size-1.5 rounded-full", stale ? "bg-atlas-amber" : "bg-atlas-green")} />
      {label} {formatRelative(at)}
      <span className="hidden sm:inline"> · {formatDateTime(at)}</span>
      {stale ? <span className="ml-1 text-atlas-amber">Stale</span> : null}
    </p>
  );
}
