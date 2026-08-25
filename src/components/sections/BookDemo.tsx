"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, type MotionValue } from "framer-motion";
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
    <div className="relative flex gap-5 pb-10 last:pb-0 [@media(max-height:960px)]:pb-1">
      {!isLast && (
        <div
          className={`absolute right-5 top-10 bottom-0 w-px transition-colors duration-500 [@media(max-height:960px)]:top-8 ${
            active ? "bg-accent/40" : "bg-white/10"
          }`}
        />
      )}
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center border text-sm font-bold transition-all duration-500 [@media(max-height:960px)]:h-8 [@media(max-height:960px)]:w-8 [@media(max-height:960px)]:text-xs ${
          active ? "border-accent bg-accent text-foreground" : "border-white/15 text-foreground-secondary"
        }`}
      >
        {index + 1}
      </div>
      <div className={`transition-opacity duration-500 ${active ? "opacity-100" : "opacity-35"}`}>
        <h3 className="text-lg font-extrabold text-foreground md:text-xl [@media(max-height:960px)]:text-base">
          {step.title}
        </h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-foreground-secondary [@media(max-height:960px)]:mt-0.5 [@media(max-height:960px)]:text-xs">
          {step.desc}
        </p>
        {step.cta && (
          <a
            href="#demo"
            className="mt-5 inline-flex items-center gap-2 bg-accent px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent-secondary [@media(max-height:960px)]:mt-2 [@media(max-height:960px)]:py-1.5"
          >
            קבעו דמו
            <span aria-hidden>←</span>
          </a>
        )}
      </div>
    </div>
  );
}

const BRAIN_LAYERS = 18;
const BRAIN_LAYER_DEPTH = 3;

function DottedBrain() {
  return (
    <div
      className="relative flex h-full w-full -translate-y-6 items-center justify-center [@media(max-height:960px)]:-translate-y-3"
      style={{ perspective: "1200px" }}
    >
      <motion.div
        aria-hidden
        animate={{ opacity: [0.15, 0.32, 0.15] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="absolute h-64 w-64 rounded-full bg-accent blur-[100px]"
      />
      <motion.div
        initial={{ rotate: 0, rotateX: 0, rotateY: 0 }}
        animate={{ rotate: 0, rotateX: 0, rotateY: 360 }}
        transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
        style={{ scale: 2.6, transformStyle: "preserve-3d" }}
        className="relative h-[55%] w-[55%] max-h-[340px] max-w-[340px] [@media(max-height:960px)]:max-h-[190px] [@media(max-height:960px)]:max-w-[190px]"
      >
        {Array.from({ length: BRAIN_LAYERS }).map((_, i) => (
          <div
            key={i}
            aria-hidden={i > 0}
            style={{
              position: "absolute",
              inset: 0,
              transform: `translateZ(${-i * BRAIN_LAYER_DEPTH}px)`,
              opacity: 1 - (i / BRAIN_LAYERS) * 0.55,
              backgroundImage: "radial-gradient(var(--accent) 0.9px, transparent 0.9px)",
              backgroundSize: "4px 4px",
              WebkitMaskImage: "url(/logo/moach-mark.png)",
              maskImage: "url(/logo/moach-mark.png)",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          />
        ))}
      </motion.div>
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
              <DottedBrain />
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
