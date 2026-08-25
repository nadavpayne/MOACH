"use client";

import { useState } from "react";
import { useMotionValueEvent, type MotionValue } from "framer-motion";
import { ScrollStage } from "@/components/ui/ScrollStage";

const CARDS = [
  { title: "קופה ותשלומים", desc: "מסתנכרן עם הקופה שלך בזמן אמת, כולל Tabit ו-Beecom." },
  { title: "שרשרת אספקה", desc: "הזמנות יוצאות ישירות לספקים לפי התחזית, אוטומטית." },
  { title: "משמרות ונוכחות", desc: "שיבוץ וכניסות-יציאות מתעדכנים אוטומטית." },
  { title: "משלוחים", desc: "מזהה עומסים מפלטפורמות המשלוחים לפני שהם קורים." },
  { title: "הנהלת חשבונות", desc: "דוחות ונתונים מוכנים לרואה החשבון, בלי הקלדה כפולה." },
  { title: "לוח שנה ומזג אוויר", desc: "חגים, אירועים ותחזיות מוזנים אוטומטית למודל." },
];

function useRevealedCount(progress: MotionValue<number>, total: number) {
  const [count, setCount] = useState(0);
  useMotionValueEvent(progress, "change", (v) => {
    const next = Math.min(total, Math.max(0, Math.floor(total * (v + 0.08))));
    setCount((prev) => (prev === next ? prev : next));
  });
  return count;
}

function IntegrationCard({
  card,
  revealed,
}: {
  card: (typeof CARDS)[number];
  revealed: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-2 border-2 border-slate-300 bg-white p-6 transition-all duration-500 [@media(max-height:820px)]:p-3 ${
        revealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <h3 className="text-lg font-extrabold text-slate-900">{card.title}</h3>
      <p className="text-sm leading-relaxed text-slate-600">{card.desc}</p>
    </div>
  );
}

function IntegrationsContent({ progress }: { progress: MotionValue<number> }) {
  const revealedCount = useRevealedCount(progress, CARDS.length);

  return (
    <div className="relative flex h-full flex-col bg-white px-6 pt-[100px] pb-10 md:px-16 [@media(max-height:820px)]:pt-[64px] [@media(max-height:820px)]:pb-6">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-8 border-2 border-slate-300 bg-slate-50/60 p-8 md:p-12 [@media(max-height:820px)]:gap-2 [@media(max-height:820px)]:p-4">
          <div>
            <p className="text-xs font-semibold tracking-widest text-accent uppercase">
              אינטגרציות
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl font-extrabold leading-tight text-slate-900 md:text-5xl [@media(max-height:820px)]:mt-1">
              מתחבר למערכות שכבר עובדות אצלך.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 [@media(max-height:820px)]:mt-1">
              מוח לא מחליף את הקופה, את מערכת השכר או את ספקי המזון שלך — הוא מתחבר אליהם. הנתונים
              זורמים אוטומטית משני הכיוונים, בלי הקלדה כפולה ובלי אקסלים באמצע.
            </p>
          </div>

          <div className="grid flex-1 auto-rows-fr grid-cols-1 content-center gap-4 sm:grid-cols-2 md:grid-cols-3 [@media(max-height:820px)]:gap-2">
            {CARDS.map((card, i) => (
              <IntegrationCard key={card.title} card={card} revealed={i < revealedCount} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Integrations() {
  return (
    <section id="integrations" data-header-theme="light">
      <ScrollStage heightVh={260}>
        {(progress) => <IntegrationsContent progress={progress} />}
      </ScrollStage>
    </section>
  );
}
