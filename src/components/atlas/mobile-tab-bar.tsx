"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CarFront, Info, Map as MapIcon, Shield, Building2 } from "lucide-react";
import { NAV_MOBILE } from "@/lib/constants";
import { cn } from "@/lib/utils";

const icons = {
  map: MapIcon,
  markets: Building2,
  fleet: CarFront,
  policy: Shield,
  about: Info,
};

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 bg-[#090A0C]/80 pb-[max(0.35rem,env(safe-area-inset-bottom))] text-white lg:hidden"
    >
      {NAV_MOBILE.map((item) => {
        const Icon = icons[item.id];
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.id}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px]",
              active ? "text-white" : "text-white/45",
            )}
          >
            <Icon className={cn("size-5", active && "text-atlas-red")} aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
