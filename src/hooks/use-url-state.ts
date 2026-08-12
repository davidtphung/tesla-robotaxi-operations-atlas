"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { serializeShareState, useDashboard } from "@/lib/store";
import type { DataMode, DateRange } from "@/lib/types";

export function useUrlState() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const hydrateFromUrl = useDashboard((state) => state.hydrateFromUrl);
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    hydrateFromUrl({
      market: searchParams.get("market"),
      mode: searchParams.get("mode") as DataMode | null,
      range: searchParams.get("range") as DateRange | null,
      layers: searchParams.get("layers"),
      compare: searchParams.get("compare"),
    });
  }, [hydrateFromUrl, searchParams]);

  useEffect(() => {
    let frame = 0;
    const unsub = useDashboard.subscribe((state) => {
      if (pathname !== "/") return;
      const next = serializeShareState(state);
      const current = window.location.search.replace(/^\?/, "");
      if (next === current) return;
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
      });
    });
    return () => {
      unsub();
      window.cancelAnimationFrame(frame);
    };
  }, [pathname, router]);
}

export function shareCurrentUrl() {
  const state = useDashboard.getState();
  const qs = serializeShareState(state);
  const url = `${window.location.origin}${window.location.pathname}${qs ? `?${qs}` : ""}`;
  return url;
}
