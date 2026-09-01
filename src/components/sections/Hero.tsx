"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useTransform,
  useMotionValueEvent,
  useSpring,
  type MotionValue,
} from "framer-motion";
import { ScrollStage } from "@/components/ui/ScrollStage";
import { BOOKING_URL } from "@/lib/constants";

// One frame's worth of slack (~30fps) - below this we treat the video as
// already at the target time and skip issuing a redundant seek.
const SEEK_EPSILON = 1 / 30;

function HeroContent({ progress }: { progress: MotionValue<number> }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const seekState = useRef<{
    seeking: boolean;
    pendingTime: number | null;
    safetyTimeout: ReturnType<typeof setTimeout> | undefined;
  }>({ seeking: false, pendingTime: null, safetyTimeout: undefined });
  const smoothProgress = useSpring(progress, { stiffness: 400, damping: 30, mass: 0.5 });

  const contentOpacity = useTransform(smoothProgress, [0, 0.75, 1], [1, 1, 0]);
  const imageScale = useTransform(smoothProgress, [0, 1], [1, 1.12]);
  const imageBrightness = useTransform(smoothProgress, [0, 1], [0.45, 0.15]);

  // Video seeks are async - if we set currentTime faster than the browser
  // can finish decoding to the new spot, requests pile up and the video
  // appears to freeze while it works through a backlog of stale targets.
  // Only ever keep one seek in flight, and always jump straight to the
  // latest requested time once it completes (never play through the queue).
  const runSeek = (time: number) => {
    const video = videoRef.current;
    if (!video) return;
    seekState.current.seeking = true;
    video.currentTime = time;
    clearTimeout(seekState.current.safetyTimeout);
    seekState.current.safetyTimeout = setTimeout(() => {
      seekState.current.seeking = false;
    }, 300);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleSeeked = () => {
      clearTimeout(seekState.current.safetyTimeout);
      seekState.current.seeking = false;
      const next = seekState.current.pendingTime;
      if (next !== null) {
        seekState.current.pendingTime = null;
        runSeek(next);
      }
    };

    video.addEventListener("seeked", handleSeeked);
    return () => {
      video.removeEventListener("seeked", handleSeeked);
      clearTimeout(seekState.current.safetyTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMotionValueEvent(smoothProgress, "change", (v) => {
    const video = videoRef.current;
    if (!video || video.readyState < 1 || !Number.isFinite(video.duration)) return;
    const target = v * video.duration;
    if (Math.abs(video.currentTime - target) < SEEK_EPSILON) return;

    if (seekState.current.seeking) {
      seekState.current.pendingTime = target;
      return;
    }
    runSeek(target);
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
        style={{ opacity: contentOpacity }}
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
