import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Policy & Safety",
  description: "Summarized Tesla Robotaxi rider rules with original source links. Not legal advice.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-muted-foreground">Loading policy center…</div>}>
      {children}
    </Suspense>
  );
}
