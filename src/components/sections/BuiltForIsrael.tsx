"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";
import { ScrollStage } from "@/components/ui/ScrollStage";

const FEATURES = [
  {
    title: "לוח שנה עברי מובנה",
    desc: "חגים, ערבי חג וחול המועד נכנסים לתחזית לפני שהם משפיעים על התור.",
  },
  {
    title: "חוק שעות עבודה ומנוחה",
    desc: "125% על השעתיים הנוספות הראשונות, 150% אחריהן — מחושב אוטומטית בכל שיבוץ.",
  },
  {
    title: "מילואים",
    desc: "שיבוץ מתעדכן אוטומטית כשעובד יוצא, כדי שהמשמרת לא תישאר חסרה.",
  },
  {
    title: "תעודות כשרות",
    desc: "מעקב תוקף לכל סניף, עם התראה לפני שאישור עומד לפוג.",
  },
];

const ISRAEL_PATH =
  "M42,2 L58,12 L56,35 L66,55 L58,70 L56,82 L46,135 L39,172 L36,182 L32,170 L22,130 L16,95 L13,65 L16,42 L10,22 L24,6 Z";

const CITIES = [
  { x: 16, y: 40, label: "תל אביב" },
  { x: 12, y: 20, label: "חיפה" },
  { x: 33, y: 62, label: "ירושלים" },
  { x: 27, y: 118, label: "באר שבע" },
];

function useRevealedCount(progress: MotionValue<number>, total: number) {
  const [count, setCount] = useState(0);
  useMotionValueEvent(progress, "change", (v) => {
    const next = Math.min(total, Math.max(0, Math.floor(total * (v + 0.08))));
    setCount((prev) => (prev === next ? prev : next));
  });
  return count;
}

function FeatureRow({
  feature,
  revealed,
}: {
  feature: (typeof FEATURES)[number];
  revealed: boolean;
}) {
  return (
    <div
      className={`flex items-start gap-5 border-t-2 border-white/15 py-6 transition-all duration-500 first:border-t-0 [@media(max-height:960px)]:py-0.5 ${
        revealed ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <h3 className="text-lg font-extrabold text-foreground">{feature.title}</h3>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-foreground-secondary">
          {feature.desc}
        </p>
      </div>
    </div>
  );
}

function GrowingIsrael({ progress }: { progress: MotionValue<number> }) {
  const scale = useTransform(progress, [0, 1], [0.625, 3.125]);
  const glowScale = useTransform(progress, [0, 1], [1, 3.5]);
  const glowOpacity = useTransform(progress, [0, 0.5, 1], [0.15, 0.35, 0.25]);
  const revealedCities = useRevealedCount(progress, CITIES.length);

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <motion.div
        aria-hidden
        style={{ scale: glowScale, opacity: glowOpacity }}
        className="absolute h-56 w-56 rounded-full bg-accent blur-[90px]"
      />
      <motion.div style={{ scale }} className="relative h-[75%] w-auto">
        <svg
          viewBox="0 0 100 200"
          className="relative h-full w-auto overflow-visible"
          preserveAspectRatio="xMidYMid meet"
        >
          <path d={ISRAEL_PATH} fill="var(--accent)" fillOpacity={0.9} />
          {CITIES.map((city, i) => (
            <circle
              key={city.label}
              cx={city.x}
              cy={city.y}
              r={3.2}
              fill="var(--background)"
              className={`transition-opacity duration-500 ${
                i < revealedCities ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </svg>
      </motion.div>
    </div>
  );
}

function BuiltForIsraelContent({ progress }: { progress: MotionValue<number> }) {
  const revealedCount = useRevealedCount(progress, FEATURES.length);

  return (
    <div className="relative flex h-full flex-col bg-background px-6 pt-[100px] pb-10 md:px-16 [@media(max-height:960px)]:pt-[52px] [@media(max-height:960px)]:pb-3">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-8 border-2 border-white/15 bg-white/[0.03] p-8 md:p-12 [@media(max-height:960px)]:gap-1 [@media(max-height:960px)]:p-2">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-widest text-accent uppercase">
              בנוי לישראל
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-foreground md:text-5xl [@media(max-height:960px)]:mt-1">
              לא תרגום של מוצר גלובלי. נבנה מההתחלה בשביל מסעדות בישראל.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-foreground-secondary [@media(max-height:960px)]:mt-1">
              לוח שנה עברי, חוק העבודה הישראלי, מילואים ותעודות כשרות אינם &quot;תוספת&quot; — הם
              חלק מהמודל מהיום הראשון.
            </p>
          </div>

          <div className="flex flex-1 flex-col gap-8 md:flex-row md:items-center">
            <div className="flex flex-1 flex-col justify-center">
              {FEATURES.map((feature, i) => (
                <FeatureRow key={feature.title} feature={feature} revealed={i < revealedCount} />
              ))}
            </div>
            <div className="hidden h-[320px] flex-1 md:block [@media(max-height:960px)]:h-[200px]">
              <GrowingIsrael progress={progress} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BuiltForIsrael() {
  return (
    <section id="built-for-israel" data-header-theme="dark">
      <ScrollStage heightVh={280}>
        {(progress) => <BuiltForIsraelContent progress={progress} />}
      </ScrollStage>
    </section>
  );
}
