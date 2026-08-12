import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Data Methodology",
  description: "Evidence classes, source ledger, and live-data adapter contracts.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-muted-foreground">Loading methodology…</div>}>
      {children}
    </Suspense>
  );
}
