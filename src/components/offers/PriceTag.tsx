/** A big main price with an optional smaller line under it (recurring fee, note). */
export function PriceTag({ main, detail }: { main: string; detail?: string }) {
  return (
    <p className="flex flex-col">
      <span className="text-3xl font-semibold tracking-tight text-[var(--hawk)]">{main}</span>
      {detail && <span className="font-mono text-sm text-[var(--muted-strong)]">{detail}</span>}
    </p>
  );
}
