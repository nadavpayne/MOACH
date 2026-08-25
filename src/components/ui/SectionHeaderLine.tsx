export function SectionHeaderLine({ light = false }: { light?: boolean }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 top-[72px] h-px ${
        light ? "bg-slate-200" : "bg-white/10"
      }`}
    />
  );
}
