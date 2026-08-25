"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { ScrollStage } from "@/components/ui/ScrollStage";

const ITEMS = [
  {
    title: "ביקוש",
    desc: "מזג אוויר, אירועים מקומיים והיסטוריית מכירות, נקראים שעה אחר שעה כדי שכל עומס ייראה מראש.",
  },
  {
    title: "כוח אדם",
    desc: "משמרות בגודל מדויק לפי התחזית. רזה בפתיחה, מאויש במלואו בשיא, מתעדכן כשהביקוש זז.",
  },
  {
    title: "מלאי",
    desc: "ספירות מתעדכנות מהמדף, נקודות הזמנה חוזרת עוקבות אחר הביקוש, וההזמנות יוצאות ישירות לספקים.",
  },
  {
    title: "מיקומים",
    desc: "כל סניף מתאמן על המודל שלו, מבט אחד על כל הרשת. סניפים חדשים לומדים מהוותיקים.",
  },
];

function ListItem({
  item,
  index,
  progress,
}: {
  item: (typeof ITEMS)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  const segStart = index / ITEMS.length;
  const segEnd = (index + 1) / ITEMS.length;
  const isLast = index === ITEMS.length - 1;
  const borderColor = useTransform(
    progress,
    isLast
      ? [segStart, segStart + 0.02]
      : [segStart, segStart + 0.02, segEnd - 0.02, segEnd],
    isLast ? ["#b6bec7", "#3d7fe0"] : ["#b6bec7", "#3d7fe0", "#3d7fe0", "#b6bec7"]
  );

  return (
    <motion.div
      className="relative border-t-4 py-6 first:border-t-0"
      style={{ borderColor }}
    >
      <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-600">{item.desc}</p>
    </motion.div>
  );
}

function GrowingBrain({ progress }: { progress: MotionValue<number> }) {
  const scale = useTransform(progress, [0, 1], [0.15, 1.15]);
  const glowScale = useTransform(progress, [0, 1], [0.3, 1.3]);
  const glowOpacity = useTransform(progress, [0, 0.5, 1], [0.15, 0.35, 0.25]);

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <motion.div
        aria-hidden
        style={{ scale: glowScale, opacity: glowOpacity }}
        className="absolute h-64 w-64 rounded-full bg-accent blur-[90px]"
      />
      <motion.div
        style={{
          scale,
          backgroundColor: "var(--accent)",
          WebkitMaskImage: "url(/logo/moach-mark.png)",
          maskImage: "url(/logo/moach-mark.png)",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
        className="relative h-[320px] w-[320px]"
      />
    </div>
  );
}

function VisualPanel({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="relative hidden min-h-[480px] items-center justify-center overflow-hidden rounded-xl border-2 border-slate-300 bg-slate-50 md:flex">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: "radial-gradient(circle, #b6bec7 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      <GrowingBrain progress={progress} />
    </div>
  );
}

function HowItWorksContent({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="flex h-full flex-col justify-center bg-white px-6 md:px-16">
      <div className="mx-auto w-full max-w-6xl">
        <div className="rounded-2xl border-2 border-slate-300 bg-slate-50/60 p-8 md:p-12">
          <div className="flex flex-col gap-6 border-b-2 border-slate-300 pb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-widest text-accent uppercase">
                איך זה עובד
              </p>
              <h2 className="mt-3 max-w-lg text-3xl font-extrabold leading-tight text-slate-900 md:text-4xl">
                לומדים את התפעול שלך, ואז מריצים אותו.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-slate-600">
              מוח מתחבר למערכות שלך ובונה מודל מותאם לכל סניף. מזג אוויר, אירועים והיסטוריית
              מכירות מניעים הזמנות, הכנה, שיבוץ ושרשרת אספקה מתוך המודל הזה, עם ההיגיון מאחורי כל
              מספר.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 pt-2 md:grid-cols-2">
            <div>
              {ITEMS.map((item, i) => (
                <ListItem key={item.title} item={item} index={i} progress={progress} />
              ))}
            </div>
            <VisualPanel progress={progress} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" data-header-theme="light">
      <ScrollStage heightVh={320}>
        {(progress) => <HowItWorksContent progress={progress} />}
      </ScrollStage>
    </section>
  );
}
