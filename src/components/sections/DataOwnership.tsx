import { Section } from "@/components/ui/Section";
import { DATA } from "@/lib/content";

// 4.7 — סקשן אמון קצר. שלוש נקודות, בלי מספור.
export function DataOwnership() {
  return (
    <Section id="data" eyebrow={DATA.eyebrow} title={DATA.title} className="bg-band">
      <ul className="grid gap-8 md:grid-cols-3 md:gap-10">
        {DATA.points.map((point) => (
          <li key={point.title} className="border-t-2 border-accent/60 pt-6">
            <h3 className="text-lg font-bold text-foreground">{point.title}</h3>
            <p className="mt-2 leading-relaxed text-foreground-secondary">{point.desc}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
