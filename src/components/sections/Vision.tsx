"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";
import { ScrollStage } from "@/components/ui/ScrollStage";

const VIEWBOX_WIDTH = 340;
const VIEWBOX_HEIGHT = 280;

const NODES = [
  { x: 53, y: 39, label: "תל אביב" },
  { x: 287, y: 48, label: "חיפה" },
  { x: 40, y: 201, label: "ירושלים" },
  { x: 300, y: 192, label: "באר שבע" },
  { x: 170, y: 233, label: "הסניף הבא" },
];

const HUB = { x: 170, y: 120 };

function NetworkLine({
  node,
  index,
  progress,
}: {
  node: (typeof NODES)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  const segStart = index / NODES.length;
  const segEnd = segStart + 1 / NODES.length;
  const dashoffset = useTransform(progress, [segStart, segEnd - 0.03], [1, 0]);

  return (
    <motion.line
      x1={HUB.x}
      y1={HUB.y}
      x2={node.x}
      y2={node.y}
      pathLength={1}
      strokeDasharray={1}
      style={{ strokeDashoffset: dashoffset }}
      stroke="var(--accent)"
      strokeWidth={1.1}
      strokeLinecap="round"
    />
  );
}

function NetworkNode({
  node,
  index,
  progress,
}: {
  node: (typeof NODES)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  const segStart = index / NODES.length;
  const segEnd = segStart + 1 / NODES.length;
  const radius = useTransform(progress, [segStart, segEnd - 0.05, segEnd], [1.6, 7.2, 5.9]);
  const opacity = useTransform(progress, [segStart, segStart + 0.02], [0, 1]);

  return <motion.circle cx={node.x} cy={node.y} r={radius} fill="var(--accent)" style={{ opacity }} />;
}

function NodeLabel({
  node,
  revealed,
}: {
  node: (typeof NODES)[number];
  revealed: boolean;
}) {
  return (
    <div
      style={{
        left: `${(node.x / VIEWBOX_WIDTH) * 100}%`,
        top: `${(node.y / VIEWBOX_HEIGHT) * 100}%`,
      }}
      className={`pointer-events-none absolute -translate-x-1/2 translate-y-3 text-sm font-semibold whitespace-nowrap text-foreground/80 transition-opacity duration-300 md:text-base ${
        revealed ? "opacity-100" : "opacity-0"
      }`}
    >
      {node.label}
    </div>
  );
}

function useRevealedCount(progress: MotionValue<number>, total: number) {
  const [count, setCount] = useState(0);
  useMotionValueEvent(progress, "change", (v) => {
    const next = Math.min(total, Math.max(0, Math.floor(total * (v + 0.1))));
    setCount((prev) => (prev === next ? prev : next));
  });
  return count;
}

function NetworkVisual({ progress }: { progress: MotionValue<number> }) {
  const hubGlowScale = useTransform(progress, [0, 1], [0.6, 1.5]);
  const hubGlowOpacity = useTransform(progress, [0, 0.5, 1], [0.15, 0.4, 0.3]);
  const hubRadius = useTransform(progress, [0, 1], [7, 11]);
  const revealedCount = useRevealedCount(progress, NODES.length);

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <motion.div
        aria-hidden
        style={{ scale: hubGlowScale, opacity: hubGlowOpacity }}
        className="absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent blur-[70px]"
      />
      <div
        className="relative max-h-full max-w-full"
        style={{ aspectRatio: `${VIEWBOX_WIDTH} / ${VIEWBOX_HEIGHT}`, height: "100%" }}
      >
        <svg
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
        >
          {NODES.map((node, i) => (
            <NetworkLine key={node.label} node={node} index={i} progress={progress} />
          ))}
          {NODES.map((node, i) => (
            <NetworkNode key={node.label} node={node} index={i} progress={progress} />
          ))}
          <motion.circle cx={HUB.x} cy={HUB.y} r={hubRadius} fill="var(--accent)" />
        </svg>
        {NODES.map((node, i) => (
          <NodeLabel key={node.label} node={node} revealed={i < revealedCount} />
        ))}
      </div>
    </div>
  );
}

function VisionContent({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="relative flex h-full flex-col bg-background px-6 pt-[100px] pb-10 md:px-16 [@media(max-height:820px)]:pt-[72px] [@media(max-height:820px)]:pb-6 [@media(max-width:820px)]:pt-[36px] [@media(max-width:820px)]:pb-4">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-10 border-2 border-white/15 bg-white/[0.03] p-8 md:p-12 [@media(max-height:820px)]:gap-3 [@media(max-height:820px)]:p-5 [@media(max-width:820px)]:gap-3 [@media(max-width:820px)]:p-4">
          <div className="flex flex-col gap-10 md:flex-1 md:flex-row md:items-center [@media(max-height:820px)]:gap-4 [@media(max-width:820px)]:gap-3">
            <div className="md:flex-1">
              <p className="text-xs font-semibold tracking-widest text-accent uppercase">
                חזון השירות
              </p>
              <h2 className="mt-4 max-w-xl text-3xl font-extrabold leading-tight text-foreground md:text-5xl [@media(max-height:820px)]:mt-2 [@media(max-width:820px)]:mt-2 [@media(max-width:820px)]:text-xl">
                כל סניף שמצטרף, הופך את כל הרשת לחכמה יותר.
              </h2>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-foreground-secondary [@media(max-height:820px)]:mt-3 [@media(max-width:820px)]:mt-2 [@media(max-width:820px)]:text-xs">
                מוח לא מתחיל מאפס בכל סניף חדש. כל תחזית שהתבררה נכונה וכל תיקון שנעשה בשטח
                הופכים לחלק מהמודל המשותף — כך שסניף חדש לא לומד לבד, אלא יורש את הניסיון שכל
                הרשת צברה, מהיום הראשון.
              </p>
            </div>
            <div className="relative h-[160px] overflow-hidden md:h-[320px] md:flex-1 [@media(max-height:820px)]:h-[200px] [@media(max-width:820px)]:h-[130px]">
              <NetworkVisual progress={progress} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Vision() {
  return (
    <section id="vision" data-header-theme="dark" className="scroll-mt-[90px]">
      <ScrollStage heightVh={340}>
        {(progress) => <VisionContent progress={progress} />}
      </ScrollStage>
    </section>
  );
}
