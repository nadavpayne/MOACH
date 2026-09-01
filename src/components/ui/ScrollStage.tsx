"use client";

import { useRef, type ReactNode } from "react";
import { useScroll, useMotionValue, type MotionValue } from "framer-motion";
import { useIsMobile } from "@/lib/useIsMobile";

export function ScrollStage({
  children,
  heightVh = 250,
  staticOnMobile = false,
}: {
  children: (progress: MotionValue<number>) => ReactNode;
  heightVh?: number;
  // On mobile these sections are not pinned, so a scroll-linked reveal has
  // only the section's own height to play out in and is usually caught
  // half-finished. Handing the section a progress that is simply pinned at 1
  // puts every reveal in its finished state instead.
  staticOnMobile?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const isMobile = useIsMobile();
  const settled = useMotionValue(1);
  const progress = staticOnMobile && isMobile ? settled : scrollYProgress;

  return (
    <div
      ref={ref}
      style={{ "--stage-height": `${heightVh}vh` } as React.CSSProperties}
      className="relative md:h-[var(--stage-height)]"
    >
      <div className="md:sticky md:top-0 md:h-screen md:overflow-hidden">
        {children(progress)}
      </div>
    </div>
  );
}
