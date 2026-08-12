import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Deployment Timeline",
  description: "Company plans, service starts, and reported Robotaxi milestones.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-muted-foreground">Loading timeline…</div>}>
      {children}
    </Suspense>
  );
}
