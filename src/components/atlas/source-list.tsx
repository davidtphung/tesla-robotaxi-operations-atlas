import { formatDate } from "@/lib/format";
import { EvidenceBadge } from "@/components/atlas/evidence-badge";
import type { SourceRecord } from "@/lib/types";

export function SourceList({ sources }: { sources: SourceRecord[] }) {
  if (sources.length === 0) {
    return <p className="text-sm text-muted-foreground">No public sources attached.</p>;
  }

  return (
    <ul className="space-y-3">
      {sources.map((source) => (
        <li key={source.id} className="rounded-xl border border-border/80 p-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-sm font-medium">{source.title}</p>
              <p className="text-xs text-muted-foreground">{source.publisher}</p>
            </div>
            <EvidenceBadge value={source.evidenceClass} compact />
          </div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">{source.notes}</p>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Published {formatDate(source.publishedAt)} · Accessed {formatDate(source.accessedAt)}
          </p>
          <a
            href={source.url}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex min-h-11 items-center text-xs font-medium text-atlas-blue underline-offset-2 hover:underline"
          >
            Open original source
          </a>
        </li>
      ))}
    </ul>
  );
}
