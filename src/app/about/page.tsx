import Link from "next/link";
import { PageFrame } from "@/components/atlas/page-frame";
import { FooterDisclosure } from "@/components/atlas/footer-disclosure";
import { AFFILIATION_DISCLAIMER, APP_TAGLINE, LEGAL_ADVICE_DISCLAIMER, NO_LIVE_TELEMETRY } from "@/lib/constants";

export default function AboutPage() {
  return (
    <PageFrame
      eyebrow="About"
      title="An atlas, not a booking app"
      lede={APP_TAGLINE}
    >
      <div className="space-y-5 text-sm leading-7 text-muted-foreground">
        <p>{AFFILIATION_DISCLAIMER}</p>
        <p>
          Operations Atlas is a public-interest map of what Tesla has actually published about Robotaxi:
          which metros appear in official materials, how Tesla describes the rider experience, and where
          the public record simply stops.
        </p>
        <p>{NO_LIVE_TELEMETRY}</p>
        <p>{LEGAL_ADVICE_DISCLAIMER}</p>
        <p>
          Moving dots on the Live Map are a deterministic local simulation. They exist so the interface can
          teach coverage, not so anyone can follow a car.
        </p>
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/methodology"
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-foreground px-4 text-sm font-medium text-background"
        >
          Read the methodology
        </Link>
        <Link
          href="/policy"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border px-4 text-sm"
        >
          Policy & safety
        </Link>
      </div>
      <div className="mt-10">
        <FooterDisclosure />
      </div>
    </PageFrame>
  );
}
