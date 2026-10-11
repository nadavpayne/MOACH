// "מקור: ERP · תיבת מייל" — הרכיב שחוזר הכי הרבה באתר, כי הוא הטענה המרכזית:
// כל תשובה ניתנת לבדיקה. מופיע ב-Hero, בהדגמת יום המסירה ובכל מקום שמראה תשובה.
export function SourceTag({ sources, className = "" }: { sources: readonly string[]; className?: string }) {
  return (
    <p
      className={`inline-flex flex-wrap items-center gap-x-1.5 gap-y-1 rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-xs font-medium text-accent-light ${className}`}
    >
      <span className="font-semibold">מקור:</span>
      {sources.map((s, i) => (
        <span key={s} className="inline-flex items-center gap-1.5">
          {i > 0 && <span aria-hidden className="text-accent-light/50">·</span>}
          {s}
        </span>
      ))}
    </p>
  );
}
