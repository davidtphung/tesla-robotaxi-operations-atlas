"use client";

import { useEffect } from "react";
import { AccessibilitySettings } from "@/components/atlas/accessibility-settings";
import { CommandBar } from "@/components/atlas/command-bar";
import { CommandPalette } from "@/components/atlas/command-palette";
import { DesktopSidebar } from "@/components/atlas/desktop-sidebar";
import { FooterDisclosure } from "@/components/atlas/footer-disclosure";
import { MarketComparison } from "@/components/atlas/market-comparison";
import { MobileTabBar } from "@/components/atlas/mobile-tab-bar";
import { useUrlState } from "@/hooks/use-url-state";
import { useDashboard } from "@/lib/store";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  useUrlState();
  const largeText = useDashboard((state) => state.largeText);
  const highContrast = useDashboard((state) => state.highContrast);
  const statusMessage = useDashboard((state) => state.statusMessage);
  const commandOpen = useDashboard((state) => state.commandOpen);
  const a11yOpen = useDashboard((state) => state.a11yOpen);
  const compareOpen = useDashboard((state) => state.compareOpen);
  const selectedVehicleId = useDashboard((state) => state.selectedVehicleId);
  const selectedMarketId = useDashboard((state) => state.selectedMarketId);
  const setCommandOpen = useDashboard((state) => state.setCommandOpen);
  const setA11yOpen = useDashboard((state) => state.setA11yOpen);
  const setCompareOpen = useDashboard((state) => state.setCompareOpen);
  const selectVehicle = useDashboard((state) => state.selectVehicle);
  const selectMarket = useDashboard((state) => state.selectMarket);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (commandOpen) {
        setCommandOpen(false);
        return;
      }
      if (a11yOpen) {
        setA11yOpen(false);
        return;
      }
      if (compareOpen) {
        setCompareOpen(false);
        return;
      }
      if (selectedVehicleId) {
        selectVehicle(null);
        return;
      }
      if (selectedMarketId) {
        selectMarket(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    a11yOpen,
    commandOpen,
    compareOpen,
    selectMarket,
    selectVehicle,
    selectedMarketId,
    selectedVehicleId,
    setA11yOpen,
    setCommandOpen,
    setCompareOpen,
  ]);

  return (
    <div
      className={cn(
        "flex h-dvh flex-col overflow-hidden bg-background",
        largeText && "large-text",
        highContrast && "high-contrast",
      )}
    >
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="flex min-h-0 flex-1">
        <DesktopSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <CommandBar />
          <main id="main" className="relative flex min-h-0 flex-1 flex-col pb-16 lg:pb-0">
            {children}
          </main>
          <div className="hidden lg:block">
            <FooterDisclosure compact />
          </div>
        </div>
      </div>
      <MobileTabBar />
      <CommandPalette />
      <AccessibilitySettings />
      <MarketComparison />
      <div className="sr-only" aria-live="polite">
        {statusMessage}
      </div>
    </div>
  );
}
