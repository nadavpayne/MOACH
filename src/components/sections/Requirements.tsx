import { Section } from "@/components/ui/Section";
import { REQUIREMENTS } from "@/lib/content";

// 4.9 — שלושה פריטים קצרים ו"זה בערך הכול". הקלילות היא המסר.
export function Requirements() {
  return (
    <Section id="requirements" eyebrow={REQUIREMENTS.eyebrow} title={REQUIREMENTS.title} className="bg-band">
      <ul className="grid gap-6 md:grid-cols-3">
        {REQUIREMENTS.items.map((item) => (
          <li key={item.title} className="rounded-2xl border border-border bg-background p-6">
            <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
            <p className="mt-2 text-foreground-secondary">{item.desc}</p>
          </li>
        ))}
      </ul>
      <p className="mt-10 text-xl font-bold text-accent-light">{REQUIREMENTS.closer}</p>
    </Section>
  );
}
