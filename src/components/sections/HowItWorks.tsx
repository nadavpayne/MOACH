import { BrainMark } from "@/components/ui/BrainMark";
import { Section } from "@/components/ui/Section";
import { HOW } from "@/lib/content";

// 4.3 — שלושה צעדים. מספור כאן מוצדק: זה רצף אמיתי (מחברים → מסדרים → שואלים).
// המוח "פועם" כמו לב — פעימה כפולה, והזוהר מאחוריו נדלק איתה. שתי עמודות רק
// מ-lg: בין md ל-lg המוח הגדול היה דוחק את הטקסט לעמודה צרה מדי.
export function HowItWorks() {
  return (
    <Section id="how-it-works" eyebrow={HOW.eyebrow} title={HOW.title} className="bg-band">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
        <ol className="flex flex-col gap-8">
          {HOW.steps.map((step, i) => (
            <li key={step.title} className="flex gap-5">
              <span
                aria-hidden
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/40 text-sm font-bold text-accent-light tabular-nums"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                <p className="mt-2 max-w-md leading-relaxed text-foreground-secondary">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="flex justify-center">
          <div className="relative flex h-80 w-80 items-center justify-center lg:h-[28rem] lg:w-[28rem]">
            <div aria-hidden className="absolute inset-0 animate-heartbeat-glow rounded-full bg-accent/25 blur-3xl" />
            <BrainMark className="relative h-56 w-56 animate-heartbeat lg:h-80 lg:w-80" />
          </div>
        </div>
      </div>
    </Section>
  );
}
