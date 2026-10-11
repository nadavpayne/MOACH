import { ChatBubble } from "@/components/ui/ChatBubble";
import { Section } from "@/components/ui/Section";
import { HANDOVER } from "@/lib/content";

// 4.4 — השאלות האמיתיות. זה החומר הכי משכנע שיש: בלי קייס סטאדי ובלי
// מספרים, אבל כל בעל חברת הפצה יזהה את עצמו בשאלות האלה.
export function HandoverDay() {
  return (
    <Section id="handover" eyebrow={HANDOVER.eyebrow} title={HANDOVER.title}>
      <ul className="grid gap-4 md:grid-cols-2">
        {HANDOVER.questions.map((q) => (
          <li key={q}>
            <ChatBubble role="question" className="[&>div]:max-w-full">
              {q}
            </ChatBubble>
          </li>
        ))}
      </ul>
      <p className="mt-10 max-w-2xl text-foreground-secondary">{HANDOVER.note}</p>
    </Section>
  );
}
