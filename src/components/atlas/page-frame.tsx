export function PageFrame({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 pb-24 lg:px-8 lg:pb-10">
        <header className="max-w-3xl">
          <p className="text-[11px] tracking-[0.18em] text-muted-foreground uppercase">{eyebrow}</p>
          <h2 className="mt-2 text-3xl font-medium tracking-tight sm:text-4xl">{title}</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">{lede}</p>
        </header>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
