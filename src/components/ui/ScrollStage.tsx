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
    <div ref={ref} style={{ height: `${heightVh}vh` }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden">{children(scrollYProgress)}</div>
    </div>
  );
}
