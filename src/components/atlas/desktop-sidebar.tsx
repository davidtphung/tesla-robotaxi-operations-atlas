"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarRange,
  CarFront,
  CircleHelp,
  Map as MapIcon,
  PanelLeft,
  Scale,
  Shield,
} from "lucide-react";
import { NAV_DESKTOP } from "@/lib/constants";
import { useDashboard } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";


const icons = {
  map: MapIcon,
  markets: CircleHelp,
  fleet: CarFront,
  timeline: CalendarRange,
  policy: Shield,
  methodology: Scale,
};

export function DesktopSidebar() {
  const pathname = usePathname();
  const expanded = useDashboard((state) => state.sidebarExpanded);
  const toggle = useDashboard((state) => state.toggleSidebar);

  return (
    <aside
      className={cn(
        "atlas-motion relative z-30 hidden h-dvh shrink-0 flex-col border-r border-border bg-sidebar/90 py-3 backdrop-blur-xl lg:flex",
        expanded ? "w-[272px] px-3" : "w-[88px] px-2",
      )}
      aria-label="Primary"
    >
      <div className={cn("mb-6 flex items-center", expanded ? "justify-between px-2" : "justify-center")}>
        <Link href="/" className="flex min-h-11 items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl bg-atlas-red text-xs font-semibold text-white">
            TA
          </span>
          {expanded ? (
            <span className="leading-tight">
              <span className="block text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
                Tesla Robotaxi
              </span>
              <span className="block text-sm font-medium">Operations Atlas</span>
            </span>
          ) : (
            <span className="sr-only">Tesla Robotaxi Operations Atlas</span>
          )}
        </Link>
        {expanded ? (
          <Button
            variant="ghost"
            size="icon"
            className="min-h-11 min-w-11"
            onClick={toggle}
            aria-label="Collapse navigation"
          >
            <PanelLeft className="size-4" />
          </Button>
        ) : null}
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_DESKTOP.map((item) => {
          const Icon = icons[item.id];
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.id}
              href={item.href}
              title={item.label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "atlas-motion flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm",
                expanded ? "" : "justify-center",
                active
                  ? "bg-foreground/8 text-foreground"
                  : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
              )}
            >
              <Icon className={cn("size-4 shrink-0", active && "text-atlas-red")} aria-hidden />
              {expanded ? (
                <span>
                  <span className="block font-medium">{item.label}</span>
                  <span className="block text-[11px] text-muted-foreground">{item.description}</span>
                </span>
              ) : (
                <span className="sr-only">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {expanded ? null : (
        <Button
          variant="ghost"
          size="icon"
          className="mx-auto min-h-11 min-w-11"
          onClick={toggle}
          aria-label="Expand navigation"
        >
          <PanelLeft className="size-4" />
        </Button>
      )}

      {expanded ? (
        <p className="px-3 pt-4 text-[11px] leading-4 text-muted-foreground">
          Independent visualization. Not affiliated with Tesla, Inc.
        </p>
      ) : null}
    </aside>
  );
}
