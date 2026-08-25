"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";
import { ScrollStage } from "@/components/ui/ScrollStage";

const STEPS = [
  {
    title: "קובעים שיחת היכרות",
    desc: "נראה לכם איך מוח מריץ תחזית, הזמנות, שיבוץ והכנה משכבת נתונים אחת, מותאם בדיוק לתפעול שלכם.",
    cta: true,
  },
  {
    title: "מאמנים את המודל על העסק שלכם",
    desc: "מתחברים לקופה ולהיסטוריית המכירות. המודל לומד את התפריט, מזג האוויר והאירועים המקומיים של הסניף שלכם.",
  },
  {
    title: "מתחילים בחלק אחד מהתפעול",
    desc: "עולים לאוויר קודם במקום שבו הרווח דולף הכי הרבה — למשל תחזית ביקוש או הזמנות.",
  },
  {
    title: "מרחיבים לכל התפעול",
    desc: "ברגע שזה עובד, מרחיבים לשאר החלקים — שיבוץ, הכנה, שרשרת אספקה — על אותה שכבת נתונים.",
  },
];

function useActiveCount(progress: MotionValue<number>, total: number) {
  const [count, setCount] = useState(1);
  useMotionValueEvent(progress, "change", (v) => {
    const next = Math.min(total, Math.max(1, Math.ceil(v * total)));
    setCount((prev) => (prev === next ? prev : next));
  });
  return count;
}

function StepRow({
  index,
  step,
  active,
  isLast,
}: {
  index: number;
  step: (typeof STEPS)[number];
  active: boolean;
  isLast: boolean;
}) {
  return (
    <div className="relative flex gap-5 pb-10 last:pb-0 [@media(max-height:960px)]:pb-2">
      {!isLast && (
        <div
          className={`absolute right-5 top-10 bottom-0 w-px transition-colors duration-500 ${
            active ? "bg-accent/40" : "bg-white/10"
          }`}
        />
      )}
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center border text-sm font-bold transition-all duration-500 ${
          active ? "border-accent bg-accent text-background" : "border-white/15 text-foreground-secondary"
        }`}
      >
        {index + 1}
      </div>
      <div className={`transition-opacity duration-500 ${active ? "opacity-100" : "opacity-35"}`}>
        <h3 className="text-lg font-extrabold text-foreground md:text-xl">{step.title}</h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-foreground-secondary">
          {step.desc}
        </p>
        {step.cta && (
          <a
            href="#demo"
            className="mt-5 inline-flex items-center gap-2 bg-accent px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-accent-secondary"
          >
            קבעו דמו
            <span aria-hidden>←</span>
          </a>
        )}
      </div>
    </div>
  );
}

function DottedBrain({ progress }: { progress: MotionValue<number> }) {
  const scale = useTransform(progress, [0, 1], [0.4, 1.3]);
  const glowOpacity = useTransform(progress, [0, 0.5, 1], [0.1, 0.3, 0.2]);

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <motion.div
        aria-hidden
        style={{ opacity: glowOpacity }}
        className="absolute h-64 w-64 rounded-full bg-accent blur-[100px]"
      />
      <motion.div
        style={{
          scale,
          backgroundImage: "radial-gradient(var(--accent) 1.4px, transparent 1.4px)",
          backgroundSize: "7px 7px",
          WebkitMaskImage: "url(/logo/moach-mark.png)",
          maskImage: "url(/logo/moach-mark.png)",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
        className="relative h-[70%] w-[70%] max-h-[320px] max-w-[320px]"
      />
    </div>
  );
}

function BookDemoContent({ progress }: { progress: MotionValue<number> }) {
  const activeCount = useActiveCount(progress, STEPS.length);

  return (
    <div className="relative flex h-full flex-col bg-background px-6 pt-[100px] pb-10 md:px-16 [@media(max-height:960px)]:pt-[64px] [@media(max-height:960px)]:pb-6">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-8 border-2 border-white/15 bg-white/[0.03] p-8 md:p-12 [@media(max-height:960px)]:gap-3 [@media(max-height:960px)]:p-5">
          <div className="max-w-xl">
            <p className="text-xs font-semibold tracking-widest text-accent uppercase">
              בואו נתחיל
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-foreground md:text-5xl [@media(max-height:960px)]:mt-2">
              ככה זה מתחיל.
            </h2>
          </div>

          <div className="flex flex-1 flex-col gap-8 md:flex-row md:items-center">
            <div className="flex flex-1 flex-col justify-center">
              {STEPS.map((step, i) => (
                <StepRow
                  key={step.title}
                  index={i}
                  step={step}
                  active={i < activeCount}
                  isLast={i === STEPS.length - 1}
                />
              ))}
            </div>
            <div className="hidden h-[360px] flex-1 md:block [@media(max-height:960px)]:h-[220px]">
              <DottedBrain progress={progress} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BookDemo() {
  return (
    <section id="demo" data-header-theme="dark">
      <ScrollStage heightVh={300}>
        {(progress) => <BookDemoContent progress={progress} />}
      </ScrollStage>
    </section>
  );
}
