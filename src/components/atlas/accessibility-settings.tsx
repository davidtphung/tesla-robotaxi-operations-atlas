"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useDashboard } from "@/lib/store";

export function AccessibilitySettings() {
  const open = useDashboard((state) => state.a11yOpen);
  const setOpen = useDashboard((state) => state.setA11yOpen);
  const largeText = useDashboard((state) => state.largeText);
  const highContrast = useDashboard((state) => state.highContrast);
  const setLargeText = useDashboard((state) => state.setLargeText);
  const setHighContrast = useDashboard((state) => state.setHighContrast);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Accessibility preferences</DialogTitle>
          <DialogDescription>
            These settings stay on this device. The interface already follows your reduced-motion preference.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 py-2">
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="large-text" className="text-sm leading-5">
              Larger text
              <span className="mt-1 block font-normal text-muted-foreground">
                Increases interface type without clipping map cards.
              </span>
            </Label>
            <Switch id="large-text" checked={largeText} onCheckedChange={setLargeText} />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="high-contrast" className="text-sm leading-5">
              Higher contrast
              <span className="mt-1 block font-normal text-muted-foreground">
                Strengthens borders and secondary text. Status still uses labels, not color alone.
              </span>
            </Label>
            <Switch id="high-contrast" checked={highContrast} onCheckedChange={setHighContrast} />
          </div>
          <p className="text-xs leading-5 text-muted-foreground">
            Keyboard: ⌘K search, Escape closes dialogs and the inspector, Tab reaches every control. Map
            details are duplicated in Markets and the city inspector.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
