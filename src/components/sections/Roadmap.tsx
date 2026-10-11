import { Section } from "@/components/ui/Section";
import { ROADMAP } from "@/lib/content";

// 4.8 — מסלול של שלושה שלבים. הראשון מודגש כ"כאן מתחילים"; השניים האחרים
// מוצגים עמומים בכוונה — הם הדרך, לא הבטחה, ואסור שייראו כזמינים מהיום הראשון.
export function Roadmap() {
  return (
    <Section id="roadmap" eyebrow={ROADMAP.eyebrow} title={ROADMAP.title} intro={ROADMAP.intro}>
      <ol className="grid gap-5 md:grid-cols-3">
        {ROADMAP.stages.map((stage, i) => {
          const isCurrent = i === 0;
          return (
            <li
              key={stage.title}
              aria-current={isCurrent ? "step" : undefined}
              className={`flex flex-col rounded-2xl border p-6 md:p-7 ${
                isCurrent
                  ? "border-accent bg-accent-soft"
                  : "border-border bg-background-secondary"
              }`}
            >
              <span
                className={`self-start rounded-full px-3 py-1 text-xs font-semibold ${
                  isCurrent ? "bg-accent-strong text-white" : "border border-border-strong text-foreground-secondary"
                }`}
              >
                {stage.label}
              </span>
              <h3 className={`mt-5 text-2xl font-extrabold ${isCurrent ? "text-foreground" : "text-foreground/80"}`}>
                {stage.title}
              </h3>
              <p className={`mt-1 text-sm font-semibold ${isCurrent ? "text-accent-light" : "text-foreground-muted"}`}>
                {stage.mode}
              </p>
              <p className={`mt-4 leading-relaxed ${isCurrent ? "text-foreground-secondary" : "text-foreground-muted"}`}>
                {stage.desc}
              </p>
            </li>
          );
        })}
      </ol>
      <p className="mt-10 max-w-2xl font-medium text-foreground">{ROADMAP.note}</p>
    </Section>
  );
}
