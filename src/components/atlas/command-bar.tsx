"use client";

import { Accessibility, Search, Share2, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { shareCurrentUrl } from "@/hooks/use-url-state";
import { useDashboard } from "@/lib/store";

export function CommandBar() {
  const { resolvedTheme, setTheme } = useTheme();
  const setCommandOpen = useDashboard((state) => state.setCommandOpen);
  const setA11yOpen = useDashboard((state) => state.setA11yOpen);

  return (
    <header className="relative z-20 flex items-center gap-2 border-b border-border/70 bg-background/70 px-3 py-1.5 backdrop-blur-xl">
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-sm font-medium tracking-tight">
          Tesla Robotaxi
          <span className="ml-2 font-normal text-muted-foreground">Operations Atlas</span>
        </h1>
      </div>

      <Button
        variant="outline"
        className="h-10 min-h-10 min-w-10 justify-start gap-2 text-muted-foreground sm:min-w-56"
        onClick={() => setCommandOpen(true)}
        aria-label="Search city, zone, policy, vehicle"
      >
        <Search className="size-4" />
        <span className="hidden sm:inline">Search cities…</span>
        <kbd className="ml-auto hidden rounded-md border border-border px-1.5 text-[10px] sm:inline">
          ⌘K
        </kbd>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="min-h-10 min-w-10"
        aria-label={resolvedTheme === "dark" ? "Switch to light appearance" : "Switch to dark appearance"}
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      >
        <SunMoon className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="min-h-10 min-w-10"
        aria-label="Accessibility preferences"
        onClick={() => setA11yOpen(true)}
      >
        <Accessibility className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="min-h-10 min-w-10"
        aria-label="Copy shareable link for the current map state"
        onClick={async () => {
          const url = shareCurrentUrl();
          await navigator.clipboard.writeText(url);
          toast.success("Link copied");
        }}
      >
        <Share2 className="size-4" />
      </Button>
    </header>
  );
}
