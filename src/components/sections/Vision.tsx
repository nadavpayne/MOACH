"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { ScrollStage } from "@/components/ui/ScrollStage";

const NODES = [
  { x: 18, y: 10, label: "תל אביב" },
  { x: 122, y: 14, label: "חיפה" },
  { x: 12, y: 82, label: "ירושלים" },
  { x: 128, y: 78, label: "באר שבע" },
  { x: 70, y: 96, label: "הסניף הבא" },
];

const HUB = { x: 70, y: 46 };

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
      strokeWidth={0.4}
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
  const radius = useTransform(progress, [segStart, segEnd - 0.05, segEnd], [0.6, 2.6, 2.1]);
  const opacity = useTransform(progress, [segStart, segStart + 0.02], [0, 1]);

  return <motion.circle cx={node.x} cy={node.y} r={radius} fill="var(--accent)" style={{ opacity }} />;
}

function NodeLabel({
  node,
  index,
  progress,
}: {
  node: (typeof NODES)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  const segEnd = (index + 1) / NODES.length;
  const opacity = useTransform(progress, [segEnd - 0.1, segEnd], [0, 1]);

  return (
    <motion.text
      x={node.x}
      y={node.y + 8}
      textAnchor="middle"
      style={{ opacity, fontSize: "4.4px", fontWeight: 600 }}
      className="fill-foreground/70"
    >
      {node.label}
    </motion.text>
  );
}

function NetworkVisual({ progress }: { progress: MotionValue<number> }) {
  const hubGlowScale = useTransform(progress, [0, 1], [0.6, 1.5]);
  const hubGlowOpacity = useTransform(progress, [0, 0.5, 1], [0.15, 0.4, 0.3]);
  const hubRadius = useTransform(progress, [0, 1], [4, 6.5]);

  return (
    <div className="relative h-full w-full">
      <motion.div
        aria-hidden
        style={{ scale: hubGlowScale, opacity: hubGlowOpacity }}
        className="absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent blur-[70px]"
      />
      <svg viewBox="0 0 140 100" className="relative h-full w-full" preserveAspectRatio="xMaxYMid meet">
        {NODES.map((node, i) => (
          <NetworkLine key={node.label} node={node} index={i} progress={progress} />
        ))}
        {NODES.map((node, i) => (
          <NetworkNode key={node.label} node={node} index={i} progress={progress} />
        ))}
        {NODES.map((node, i) => (
          <NodeLabel key={node.label} node={node} index={i} progress={progress} />
        ))}
        <motion.circle cx={HUB.x} cy={HUB.y} r={hubRadius} fill="var(--accent)" />
      </svg>
    </div>
  );
}

function VisionContent({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="relative flex h-full flex-col bg-background px-6 pt-[100px] pb-10 md:px-16 [@media(max-height:820px)]:pt-[72px] [@media(max-height:820px)]:pb-6">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-10 border-2 border-white/15 bg-white/[0.03] p-8 md:p-12 [@media(max-height:820px)]:gap-3 [@media(max-height:820px)]:p-5">
          <div className="flex flex-1 flex-col gap-10 md:flex-row md:items-center [@media(max-height:820px)]:gap-4">
            <div className="flex-1">
              <p className="text-xs font-semibold tracking-widest text-accent uppercase">
                חזון השירות
              </p>
              <h2 className="mt-4 max-w-xl text-3xl font-extrabold leading-tight text-foreground md:text-5xl [@media(max-height:820px)]:mt-2">
                כל סניף שמצטרף, הופך את כל הרשת לחכמה יותר.
              </h2>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-foreground-secondary [@media(max-height:820px)]:mt-3">
                מוח לא מתחיל מאפס בכל סניף חדש. כל תחזית שהתבררה נכונה וכל תיקון שנעשה בשטח
                הופכים לחלק מהמודל המשותף — כך שסניף חדש לא לומד לבד, אלא יורש את הניסיון שכל
                הרשת צברה, מהיום הראשון.
              </p>
            </div>
            <div className="hidden h-[320px] flex-1 md:block [@media(max-height:820px)]:h-[200px]">
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
    <section id="vision" data-header-theme="dark">
      <ScrollStage heightVh={340}>
        {(progress) => <VisionContent progress={progress} />}
      </ScrollStage>
    </section>
  );
}
