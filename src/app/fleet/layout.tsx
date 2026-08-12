import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Fleet Intelligence",
  description: "Disclosed fleet coverage, vehicle profiles, and source-quality scores.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-muted-foreground">Loading fleet intelligence…</div>}>
      {children}
    </Suspense>
  );
}
