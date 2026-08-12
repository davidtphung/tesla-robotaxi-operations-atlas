"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { searchAtlas } from "@/lib/search";
import { useDashboard } from "@/lib/store";

const labels = {
  market: "Markets",
  vehicle: "Vehicles",
  policy: "Policy",
  event: "Deployment events",
  source: "Sources",
};

export function CommandPalette() {
  const router = useRouter();
  const open = useDashboard((state) => state.commandOpen);
  const setOpen = useDashboard((state) => state.setCommandOpen);
  const selectMarket = useDashboard((state) => state.selectMarket);
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchAtlas(query, 24), [query]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const grouped = useMemo(() => {
    return results.reduce<Record<string, typeof results>>((acc, hit) => {
      acc[hit.category] = acc[hit.category] ?? [];
      acc[hit.category].push(hit);
      return acc;
    }, {});
  }, [results]);

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Search the atlas"
      description="Jump to a market, vehicle type, policy topic, event, or source."
    >
      <CommandInput
        placeholder="Search city, zone, policy, vehicle…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No matching public record.</CommandEmpty>
        {Object.entries(grouped).map(([category, hits]) => (
          <CommandGroup key={category} heading={labels[category as keyof typeof labels]}>
            {hits.map((hit) => (
              <CommandItem
                key={hit.id}
                value={`${hit.title} ${hit.subtitle}`}
                onSelect={() => {
                  if (hit.category === "market") {
                    const id = hit.id.replace("market-", "");
                    selectMarket(id);
                  }
                  router.push(hit.href);
                  setOpen(false);
                }}
              >
                <span className="flex flex-col">
                  <span>{hit.title}</span>
                  <span className="text-xs text-muted-foreground">{hit.subtitle}</span>
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
