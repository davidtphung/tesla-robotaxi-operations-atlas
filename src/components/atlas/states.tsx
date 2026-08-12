import { AlertTriangle, FileQuestion, LoaderCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="grid min-h-40 place-items-center rounded-2xl border border-dashed border-border p-8 text-center">
      <div className="max-w-md space-y-3">
        <FileQuestion className="mx-auto size-6 text-muted-foreground" aria-hidden />
        <h2 className="text-base font-medium">{title}</h2>
        <p className="text-sm leading-6 text-muted-foreground">{body}</p>
        {action}
      </div>
    </div>
  );
}

export function ErrorState({
  title = "This panel could not be loaded",
  body = "The local data service rejected or failed to read a seed record. Nothing here is live Tesla telemetry.",
  onRetry,
}: {
  title?: string;
  body?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="grid min-h-40 place-items-center rounded-2xl border border-atlas-red/20 bg-atlas-red/5 p-8 text-center">
      <div className="max-w-md space-y-3">
        <AlertTriangle className="mx-auto size-6 text-atlas-red" aria-hidden />
        <h2 className="text-base font-medium">{title}</h2>
        <p className="text-sm leading-6 text-muted-foreground">{body}</p>
        {onRetry ? (
          <Button onClick={onRetry} variant="outline" className="min-h-11">
            <RefreshCw className="size-4" />
            Try again
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export function SkeletonLoader({ className, lines = 3 }: { className?: string; lines?: number }) {
  return (
    <div className={cn("space-y-2", className)} aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading</span>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="h-3 animate-pulse rounded-full bg-foreground/8"
          style={{ width: `${88 - index * 12}%` }}
        />
      ))}
    </div>
  );
}

export function InlineSpinner({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
      <LoaderCircle className="size-3.5 animate-spin" aria-hidden />
      {label}
    </span>
  );
}
