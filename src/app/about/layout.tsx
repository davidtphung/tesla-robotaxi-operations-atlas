import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Independent Tesla Robotaxi Operations Atlas. Not affiliated with Tesla, Inc.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
