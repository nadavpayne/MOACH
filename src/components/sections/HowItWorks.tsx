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
  const opacity = useTransform(
    progress,
    [Math.max(0, segStart - 0.08), segStart, segEnd, Math.min(1, segEnd + 0.08)],
    [0.7, 1, 1, 0.7]
  );
  const borderColor = useTransform(
    progress,
    [segStart, segStart + 0.02, segEnd - 0.02, segEnd],
    ["#232527", "#3d7fe0", "#3d7fe0", "#232527"]
  );

  return (
    <motion.div className="relative border-t py-6 first:border-t-0" style={{ borderColor }}>
      <motion.div style={{ opacity }}>
        <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-foreground">{item.desc}</p>
      </motion.div>
    </motion.div>
  );
}

const LAYERS = [
  { size: 110, rotateTo: -6, border: "border-foreground/25", bg: "bg-transparent" },
  { size: 210, rotateTo: 10, border: "border-accent/40", bg: "bg-accent/5" },
  { size: 310, rotateTo: -14, border: "border-accent/60", bg: "bg-accent/10" },
  { size: 410, rotateTo: 18, border: "border-accent", bg: "bg-accent/15" },
];

function GrowingLayer({
  layer,
  index,
  progress,
}: {
  layer: (typeof LAYERS)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  const trigger = index / LAYERS.length;
  const scale = useTransform(progress, [Math.max(0, trigger - 0.03), trigger + 0.04], [0, 1]);
  const rotate = useTransform(progress, [0, 1], [0, layer.rotateTo]);

  return (
    <motion.div
      style={{ scale, rotate, width: layer.size, height: layer.size }}
      className={`absolute rounded-[28px] border ${layer.border} ${layer.bg}`}
    />
  );
}

function VisualPanel({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="relative hidden min-h-[480px] items-center justify-center overflow-hidden rounded-xl border border-border md:flex">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--foreground-secondary) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      {LAYERS.map((layer, i) => (
        <GrowingLayer key={layer.size} layer={layer} index={i} progress={progress} />
      ))}
    </div>
  );
}

function HowItWorksContent({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="flex h-full flex-col justify-center bg-background px-6 md:px-16">
      <div className="mx-auto w-full max-w-6xl">
        <div className="rounded-2xl border border-border bg-background-secondary/40 p-8 md:p-12">
          <div className="flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-widest text-accent uppercase">
                איך זה עובד
              </p>
              <h2 className="mt-3 max-w-lg text-3xl font-extrabold leading-tight text-foreground md:text-4xl">
                לומדים את התפעול שלך, ואז מריצים אותו.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-foreground">
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
    <section id="how-it-works">
      <ScrollStage heightVh={280}>
        {(progress) => <HowItWorksContent progress={progress} />}
      </ScrollStage>
    </section>
  );
}
