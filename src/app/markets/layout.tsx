import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markets",
  description: "Source-backed Tesla Robotaxi market status, not official geofences.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
