"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { atlasData } from "@/data/service";
import { statusLabel } from "@/lib/format";

const STATUS_COLOR: Record<string, string> = {
  ACTIVE: "#35C759",
  SUPERVISED: "#0A84FF",
  RAMPING: "#FF9F0A",
  PLANNED: "#A1A1AA",
  UNKNOWN: "#71717A",
};

export function MarketStatusChart() {
  const data = ["ACTIVE", "SUPERVISED", "RAMPING", "PLANNED", "UNKNOWN"].map((status) => ({
    status,
    label: statusLabel(status as "ACTIVE"),
    count: atlasData.markets.filter((market) => market.displayStatus === status).length,
  }));

  return (
    <figure>
      <figcaption className="mb-3 text-sm font-medium">Market status distribution</figcaption>
      <div className="h-56" aria-hidden>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="label" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: 12,
              }}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.status} fill={STATUS_COLOR[entry.status]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <table className="mt-3 w-full text-sm">
        <caption className="sr-only">Market counts by status</caption>
        <thead>
          <tr className="text-left text-muted-foreground">
            <th className="py-1 font-medium">Status</th>
            <th className="py-1 font-medium">Markets</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.status} className="border-t border-border">
              <td className="py-1.5">{row.label}</td>
              <td>{row.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

export function SourceQualityChart() {
  const data = ["VERIFIED", "REPORTED", "PLANNED", "SIMULATED", "UNAVAILABLE"].map((cls) => ({
    cls,
    count: atlasData.sources.filter((source) => source.evidenceClass === cls).length +
      atlasData.ledger.filter((row) => row.classification === cls).length,
  }));

  return (
    <figure>
      <figcaption className="mb-3 text-sm font-medium">Source-quality distribution</figcaption>
      <div className="h-52" aria-hidden>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 24 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis type="number" allowDecimals={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
            <YAxis type="category" dataKey="cls" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} width={90} />
            <Tooltip
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: 12,
              }}
            />
            <Bar dataKey="count" fill="#E82127" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <table className="mt-3 w-full text-sm">
        <caption className="sr-only">Records by evidence class</caption>
        <thead>
          <tr className="text-left text-muted-foreground">
            <th className="py-1 font-medium">Class</th>
            <th className="py-1 font-medium">Records</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.cls} className="border-t border-border">
              <td className="py-1.5">{row.cls}</td>
              <td>{row.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

export function FleetDisclosureChart() {
  const data = atlasData.markets.map((market) => ({
    city: market.city,
    disclosed: market.fleet.count != null ? 1 : 0,
    unavailable: market.fleet.count == null ? 1 : 0,
  }));
  const anyDisclosed = data.some((row) => row.disclosed);

  if (!anyDisclosed) {
    return (
      <figure>
        <figcaption className="mb-2 text-sm font-medium">Fleet disclosure by market</figcaption>
        <p className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
          Insufficient public data. Tesla has not published a defensible city-level Robotaxi fleet count in
          the attached sources. The chart is withheld so a zero bar is not mistaken for an empty fleet.
        </p>
      </figure>
    );
  }

  return (
    <figure>
      <figcaption className="mb-3 text-sm font-medium">Fleet disclosure by market</figcaption>
      <div className="h-56" aria-hidden>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="city" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
            <YAxis allowDecimals={false} />
            <Bar dataKey="disclosed" fill="#35C759" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
}
