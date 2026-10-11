import { SourceIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/Section";
import { SOURCES } from "@/lib/content";

// 4.5 — שמונה מקורות. בלי מספור: זו רשימה, לא רצף.
// גריד של 4 עמודות בדסקטופ = שתי שורות מלאות, בלי פריט בודד שנשאר לבד.
export function Sources() {
  return (
    <Section id="sources" eyebrow={SOURCES.eyebrow} title={SOURCES.title}>
      <ul className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {SOURCES.items.map((item) => (
          <li key={item.key} className="flex flex-col gap-3 bg-background-secondary p-6">
            <SourceIcon name={item.key} className="h-7 w-7 text-accent" />
            <h3 className="font-bold text-foreground">{item.name}</h3>
            <p className="text-sm leading-relaxed text-foreground-secondary">{item.desc}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
