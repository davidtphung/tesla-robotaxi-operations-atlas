"use client";

import { Accessibility, Search, Share2, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DataFreshnessIndicator } from "@/components/atlas/data-freshness";
import { shareCurrentUrl } from "@/hooks/use-url-state";
import { DATA_MODE_COPY } from "@/lib/constants";
import { useDashboard } from "@/lib/store";
import type { DataMode } from "@/lib/types";
import { cn } from "@/lib/utils";

const modes: DataMode[] = ["live", "reported", "simulated"];

export function CommandBar() {
  const { resolvedTheme, setTheme } = useTheme();
  const dataMode = useDashboard((state) => state.dataMode);
  const setDataMode = useDashboard((state) => state.setDataMode);
  const setCommandOpen = useDashboard((state) => state.setCommandOpen);
  const setA11yOpen = useDashboard((state) => state.setA11yOpen);
  const lastRefreshed = useDashboard((state) => state.lastRefreshed);

  return (
    <header className="atlas-glass relative z-20 flex flex-wrap items-center gap-2 rounded-none border-x-0 border-t-0 px-3 py-2 lg:rounded-b-2xl lg:border-x lg:mx-3 lg:mt-0">
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
          Tesla Robotaxi
        </p>
        <h1 className="truncate text-sm font-medium sm:text-base">Operations Atlas</h1>
      </div>

      <div className="hidden items-center gap-2 md:flex">
        <span className="rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground">
          Public data view
        </span>
        <DataFreshnessIndicator at={lastRefreshed} />
      </div>

      <div
        role="tablist"
        aria-label="Data mode"
        className="flex rounded-full border border-border bg-background/50 p-1"
      >
        {modes.map((mode) => (
          <button
            key={mode}
            type="button"
            role="tab"
            aria-selected={dataMode === mode}
            onClick={() => setDataMode(mode)}
            title={DATA_MODE_COPY[mode].description}
            className={cn(
              "min-h-9 rounded-full px-3 text-xs font-medium atlas-motion",
              dataMode === mode
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {DATA_MODE_COPY[mode].label}
          </button>
        ))}
      </div>

      <Button
        variant="outline"
        className="min-h-11 min-w-[44px] justify-start gap-2 text-muted-foreground sm:min-w-48"
        onClick={() => setCommandOpen(true)}
        aria-label="Search city, zone, policy, vehicle"
      >
        <Search className="size-4" />
        <span className="hidden sm:inline">Search city, zone, policy, vehicle…</span>
        <kbd className="ml-auto hidden rounded-md border border-border px-1.5 text-[10px] sm:inline">
          ⌘K
        </kbd>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="min-h-11 min-w-11"
        aria-label={resolvedTheme === "dark" ? "Switch to light appearance" : "Switch to dark appearance"}
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      >
        <SunMoon className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="min-h-11 min-w-11"
        aria-label="Accessibility preferences"
        onClick={() => setA11yOpen(true)}
      >
        <Accessibility className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="min-h-11 min-w-11"
        aria-label="Copy shareable link for the current map state"
        onClick={async () => {
          const url = shareCurrentUrl();
          await navigator.clipboard.writeText(url);
          toast.success("Link copied", { description: "Current market, layers, and data mode are in the URL." });
        }}
      >
        <Share2 className="size-4" />
      </Button>
    </header>
  );
}
