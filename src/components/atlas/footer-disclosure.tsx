import Link from "next/link";
import { AFFILIATION_DISCLAIMER, FOOTER_DISCLOSURE } from "@/lib/constants";

export function FooterDisclosure({ compact = false }: { compact?: boolean }) {
  return (
    <footer className="border-t border-border/80 bg-background/80 px-4 py-3 text-[11px] leading-5 text-muted-foreground backdrop-blur-md">
      <p>
        {FOOTER_DISCLOSURE}{" "}
        <Link href="/methodology" className="underline underline-offset-2 hover:text-foreground">
          Data Methodology
        </Link>
      </p>
      {compact ? null : <p className="mt-1">{AFFILIATION_DISCLAIMER}</p>}
    </footer>
  );
}
