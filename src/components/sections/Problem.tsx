import { Section } from "@/components/ui/Section";
import { PROBLEM } from "@/lib/content";

// 4.2 — איים מפוזרים, בלי קשר ביניהם. בשלב ג הם יקבלו תזוזה עדינה, ובסקשן
// הבא (איך זה עובד) הם מתחברים למוח אחד במרכז.
//
// הסיבובים וההזחות קבועים ולא אקראיים: אקראיות הייתה משתנה בין השרת ללקוח
// ושוברת את ה-hydration, וגם הייתה נראית אחרת בכל טעינה.
const SCATTER = [
  "rotate-[-3deg] translate-y-2",
  "rotate-[2deg] -translate-y-3",
  "rotate-[-1deg] translate-y-4",
  "rotate-[3deg] -translate-y-1",
  "rotate-[-2deg] translate-y-1",
  "rotate-[1deg] -translate-y-4",
];

export function Problem() {
  return (
    <Section id="problem" eyebrow={PROBLEM.eyebrow} title={PROBLEM.title}>
      <div className="grid items-center gap-14 md:grid-cols-2 md:gap-16">
        <div className="flex max-w-xl flex-col gap-5 text-lg leading-relaxed text-foreground-secondary">
          {PROBLEM.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <ul
          aria-label="מערכות שלא מדברות ביניהן"
          className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3"
        >
          {PROBLEM.islands.map((name, i) => (
            <li
              key={name}
              className={`rounded-xl border border-dashed border-border-strong bg-background-secondary px-4 py-5 text-center text-sm font-medium text-foreground-secondary ${SCATTER[i]}`}
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
