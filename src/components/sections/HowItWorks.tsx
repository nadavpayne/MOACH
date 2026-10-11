import { BrainMark } from "@/components/ui/BrainMark";
import { Section } from "@/components/ui/Section";
import { HOW } from "@/lib/content";

// 4.3 — שלושה צעדים. מספור כאן מוצדק: זה רצף אמיתי (מחברים → מסדרים → שואלים).
// הוויזואל של "האיים מתחברים למוח" נכנס בשלב ג. בינתיים המוח במרכז, בגדול.
export function HowItWorks() {
  return (
    <Section id="how-it-works" eyebrow={HOW.eyebrow} title={HOW.title} className="bg-band">
      <div className="grid items-center gap-14 md:grid-cols-[1fr_auto] md:gap-20">
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
          <div className="relative flex h-72 w-72 items-center justify-center md:h-[24rem] md:w-[24rem]">
            <div aria-hidden className="absolute inset-0 rounded-full bg-accent/20 blur-3xl" />
            <BrainMark className="relative h-48 w-48 md:h-64 md:w-64" />
          </div>
        </div>
      </div>
    </Section>
  );
}
