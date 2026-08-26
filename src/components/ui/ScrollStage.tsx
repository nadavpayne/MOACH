"use client";

import { useRef, type ReactNode } from "react";
import { useScroll, type MotionValue } from "framer-motion";

export function ScrollStage({
  children,
  heightVh = 250,
}: {
  children: (progress: MotionValue<number>) => ReactNode;
  heightVh?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <div
      ref={ref}
      style={{ "--stage-height": `${heightVh}vh` } as React.CSSProperties}
      className="relative md:h-[var(--stage-height)]"
    >
      <div className="md:sticky md:top-0 md:h-screen md:overflow-hidden">
        {children(scrollYProgress)}
      </div>
    </div>
  );
}
