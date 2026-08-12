"use client";

import { useSearchParams } from "next/navigation";
import { atlasData } from "@/data/service";
import { PageFrame } from "@/components/atlas/page-frame";
import { EvidenceBadge } from "@/components/atlas/evidence-badge";
import { SourceQualityChart } from "@/components/atlas/charts";
import { NO_LIVE_TELEMETRY } from "@/lib/constants";
import { formatDate, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

const classes = [
  {
    title: "Official company disclosure",
    body: "Shareholder updates, tesla.com product and support pages, and legal terms. Classified VERIFIED when quoted directly.",
  },
  {
    title: "Government / regulator record",
    body: "Permit dockets and formal agency publications. None are fabricated here; the adapter stays empty until a record is attached.",
  },
  {
    title: "Reputable media reporting",
    body: "Named trade-press reports with dates and URLs. Classified REPORTED and never upgraded to VERIFIED.",
  },
  {
    title: "Simulated visualization data",
    body: "Local, deterministic vehicle glyphs. Always labeled Simulation. Never a VIN, plate, rider, or Tesla telemetry.",
  },
];

export default function MethodologyPage() {
  const params = useSearchParams();
  const focus = params.get("source");

  return (
    <PageFrame
      eyebrow="Evidence"
      title="Data methodology"
      lede="The atlas is only as good as its ledger. Every operational number must wear exactly one evidence class."
    >
      <blockquote className="rounded-2xl border border-border bg-muted/30 p-5 text-sm leading-7">
        {NO_LIVE_TELEMETRY} This product must visualize vehicle movement only as authorized live data or
        explicitly labeled simulated activity.
      </blockquote>

      <section className="mt-8 grid gap-3 md:grid-cols-2">
        {classes.map((item) => (
          <article key={item.title} className="rounded-2xl border border-border p-4">
            <h3 className="text-sm font-medium">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
          </article>
        ))}
      </section>

      <section className="mt-10 rounded-2xl border border-border p-4">
        <SourceQualityChart />
      </section>

      <section className="mt-10">
        <h3 className="text-lg font-medium">Source ledger</h3>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[960px] text-sm">
            <caption className="sr-only">Dataset fields, values, classification, and sources</caption>
            <thead className="bg-muted/40 text-left text-xs text-muted-foreground uppercase">
              <tr>
                <th className="px-3 py-3">Dataset</th>
                <th className="px-3 py-3">Field</th>
                <th className="px-3 py-3">Value</th>
                <th className="px-3 py-3">Class</th>
                <th className="px-3 py-3">As-of</th>
                <th className="px-3 py-3">Source</th>
                <th className="px-3 py-3">Refresh</th>
                <th className="px-3 py-3">Caveat</th>
              </tr>
            </thead>
            <tbody>
              {atlasData.ledger.map((row) => {
                const source = atlasData.sources.find((item) => item.id === row.sourceId);
                return (
                  <tr key={row.id} className="border-t border-border align-top">
                    <td className="px-3 py-3">{row.dataset}</td>
                    <td className="px-3 py-3">{row.field}</td>
                    <td className="px-3 py-3">{row.value}</td>
                    <td className="px-3 py-3">
                      <EvidenceBadge value={row.classification} compact />
                    </td>
                    <td className="px-3 py-3">{formatDate(row.asOf)}</td>
                    <td className="px-3 py-3">
                      {source ? (
                        <a
                          href={source.url}
                          className="text-atlas-blue underline-offset-2 hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {source.publisher}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-3 py-3 text-xs">{row.refreshCadence}</td>
                    <td className="max-w-xs px-3 py-3 text-xs leading-5 text-muted-foreground">
                      {row.caveat}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h3 className="text-lg font-medium">Live data adapters</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Interfaces exist. Availability is never faked. API keys stay on the server or in local env — never
          hardcoded.
        </p>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {atlasData.adapters.map((adapter) => (
            <article key={adapter.id} className="rounded-2xl border border-border p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-medium">{adapter.provider}</h4>
                  <p className="text-xs text-muted-foreground">{adapter.purpose}</p>
                </div>
                <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase">
                  {adapter.status}
                </span>
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <dt className="text-muted-foreground">Endpoint</dt>
                  <dd className="break-all">{adapter.endpoint ?? "None"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">API key</dt>
                  <dd>{adapter.requiresApiKey ? adapter.envVar : "Not required"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">License</dt>
                  <dd>{adapter.license}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Poll</dt>
                  <dd>
                    {adapter.pollingIntervalMs
                      ? `${adapter.pollingIntervalMs / 1000 / 60} min`
                      : "On load"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Last success</dt>
                  <dd>{formatDateTime(adapter.lastSuccessAt)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Schema</dt>
                  <dd>{adapter.schemaName}</dd>
                </div>
              </dl>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                Fallback: {adapter.fallback}
                {adapter.error ? ` Error: ${adapter.error}` : ""}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h3 className="text-lg font-medium">Attached sources</h3>
        <ul className="mt-4 space-y-3">
          {atlasData.sources.map((source) => (
            <li
              key={source.id}
              id={source.id}
              className={cn(
                "rounded-2xl border border-border p-4",
                focus === source.id && "ring-2 ring-atlas-red",
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{source.title}</p>
                  <p className="text-xs text-muted-foreground">{source.publisher}</p>
                </div>
                <EvidenceBadge value={source.evidenceClass} />
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{source.notes}</p>
              <a
                href={source.url}
                className="mt-2 inline-flex min-h-11 items-center text-sm text-atlas-blue underline-offset-2 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                {source.url}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </PageFrame>
  );
}
