import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Geist_Mono, Inter } from "next/font/google";
import { AppShell } from "@/components/atlas/app-shell";
import { Providers } from "@/components/providers";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s · ${APP_NAME}`,
  },
  description: `${APP_TAGLINE} Independent visualization of Tesla Robotaxi coverage, policy, and source-backed deployment status.`,
  applicationName: APP_NAME,
  authors: [{ name: "Operations Atlas" }],
  keywords: [
    "Tesla Robotaxi",
    "autonomous mobility",
    "operations atlas",
    "public data",
    "Austin",
    "Dallas",
    "Houston",
    "Miami",
  ],
  openGraph: {
    title: APP_NAME,
    description: APP_TAGLINE,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_TAGLINE,
  },
};

export const viewport: Viewport = {
  themeColor: "#090A0C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background font-sans text-foreground antialiased">
        <Providers>
          <Suspense fallback={<div className="grid h-dvh place-items-center text-sm text-muted-foreground">Loading Operations Atlas…</div>}>
            <AppShell>{children}</AppShell>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
