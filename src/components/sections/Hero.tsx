"use client";

import { useRef } from "react";
import {
  motion,
  useTransform,
  useMotionValueEvent,
  useSpring,
  type MotionValue,
} from "framer-motion";
import { ScrollStage } from "@/components/ui/ScrollStage";
import { BOOKING_URL } from "@/lib/constants";

function HeroContent({ progress }: { progress: MotionValue<number> }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const smoothProgress = useSpring(progress, { stiffness: 400, damping: 30, mass: 0.5 });

  const contentOpacity = useTransform(smoothProgress, [0, 0.75, 1], [1, 1, 0]);
  const contentY = useTransform(smoothProgress, [0, 1], [0, -60]);
  const imageScale = useTransform(smoothProgress, [0, 1], [1, 1.12]);
  const imageBrightness = useTransform(smoothProgress, [0, 1], [0.45, 0.15]);

  useMotionValueEvent(smoothProgress, "change", (v) => {
    const video = videoRef.current;
    if (!video || video.readyState < 1 || !Number.isFinite(video.duration)) return;
    video.currentTime = v * video.duration;
  });

  return (
    <section
      data-header-theme="dark"
      className="relative flex h-full flex-col justify-center overflow-hidden bg-background px-6 pb-16 md:px-16"
    >
      <motion.div style={{ scale: imageScale }} className="absolute inset-0">
        <video
          ref={videoRef}
          src="/images/hero-drone-flythrough.mp4"
          poster="/images/hero-drone-start.jpg"
          muted
          playsInline
          preload="auto"
          aria-hidden
          className="h-full w-full object-cover object-center opacity-90 grayscale blur-[2px] contrast-110"
        />
      </motion.div>
      <motion.div
        aria-hidden
        style={{ opacity: imageBrightness }}
        className="absolute inset-0 bg-background"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/15 via-background/10 to-background/40" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--foreground-secondary) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-1/3 left-1/4 h-[600px] w-[600px] rounded-full bg-accent/10 blur-[120px]"
      />

      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 mx-auto w-full max-w-6xl pt-24"
      >
        <h1 className="max-w-3xl text-5xl leading-[1.05] font-extrabold tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
          המוח התפעולי של המסעדה שלך
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground-secondary md:text-xl">
          מוח קורא את כל נתוני התפעול של המסעדה שלך — POS, מלאי, שיבוץ, מזג אוויר ולוח שנה עברי —
          ומריץ עבורך תחזית, שיבוץ, הזמנות ושכר.
        </p>

        <div className="mt-10">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-accent px-6 py-3.5 text-base font-semibold text-foreground transition-colors hover:bg-accent-secondary"
          >
            ראו את המוח בפעולה
            <span aria-hidden>←</span>
          </a>
        </div>
      </motion.div>

      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 mx-auto mt-20 flex w-full max-w-6xl items-center justify-end gap-4"
      >
        <div className="h-0.5 w-24 bg-foreground-secondary/60" />
        <p className="text-sm text-foreground-secondary">נתונים חיים, כל משמרת</p>
      </motion.div>
    </section>
  );
}

export function Hero() {
  return (
    <ScrollStage heightVh={180}>{(progress) => <HeroContent progress={progress} />}</ScrollStage>
  );
}
