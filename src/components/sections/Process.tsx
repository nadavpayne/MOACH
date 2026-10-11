import { Section } from "@/components/ui/Section";
import { PROCESS } from "@/lib/content";

// 4.6 — טיימליין של 5 שלבים. הקו יושב בצד ההתחלה (ימין ב-RTL) דרך
// מאפיינים לוגיים (border-s, ps), כך שהוא מתהפך נכון בלי קוד נפרד.
export function Process() {
  return (
    <Section id="process" eyebrow={PROCESS.eyebrow} title={PROCESS.title}>
      <ol className="relative max-w-3xl border-s border-border-strong">
        {PROCESS.steps.map((step, i) => (
          <li key={step.title} className="relative ps-10 pb-10 last:pb-0">
            <span
              aria-hidden
              className="absolute -start-[17px] top-0 flex h-8 w-8 items-center justify-center rounded-full border border-accent/50 bg-background text-sm font-bold text-accent-light tabular-nums"
            >
              {i + 1}
            </span>
            <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
            <p className="mt-1.5 leading-relaxed text-foreground-secondary">{step.desc}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
