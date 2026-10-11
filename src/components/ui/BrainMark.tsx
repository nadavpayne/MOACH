// הלוגו כ-mask: ה-PNG שקוף (RGBA), אז הוא משמש כצורה בלבד והצבע מגיע
// מ-background-color. כך אותו קובץ נצבע בכל צבע, בלי invert ובלי עותקים.
// היה כתוב פעמיים בקוד הישן (HowItWorks, BookDemo) — עכשיו במקום אחד.
export function BrainMark({
  className = "",
  color = "var(--accent)",
  label,
}: {
  className?: string;
  color?: string;
  // בלי label הסימן דקורטיבי ומוסתר מקוראי מסך.
  label?: string;
}) {
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`inline-block ${className}`}
      style={{
        backgroundColor: color,
        WebkitMaskImage: "url(/logo/moach-mark.png)",
        maskImage: "url(/logo/moach-mark.png)",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}
