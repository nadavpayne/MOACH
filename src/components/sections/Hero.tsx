"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useTransform,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  type MotionValue,
} from "framer-motion";
import { ScrollStage } from "@/components/ui/ScrollStage";
import { BOOKING_URL } from "@/lib/constants";

// One frame's worth of slack (~30fps) - below this we treat the video as
// already at the target time and skip issuing a redundant seek.
const SEEK_EPSILON = 1 / 30;

// The video finishes, and the flash fires, at this point in the scroll -
// the last sliver of the stage is just runway for the transition.
const FLASH_AT = 0.94;
// Scrolling back up past this re-arms the flash, so it can fire again on the
// next pass down but never on the way up.
const REARM_AT = 0.6;

function HeroContent({ progress }: { progress: MotionValue<number> }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const seekState = useRef<{
    seeking: boolean;
    pendingTime: number | null;
    safetyTimeout: ReturnType<typeof setTimeout> | undefined;
  }>({ seeking: false, pendingTime: null, safetyTimeout: undefined });
  const armedRef = useRef(false);
  const flashOpacity = useMotionValue(0);
  const smoothProgress = useSpring(progress, { stiffness: 400, damping: 30, mass: 0.5 });

  const contentOpacity = useTransform(smoothProgress, [0, 0.75, FLASH_AT], [1, 1, 0]);
  const imageScale = useTransform(smoothProgress, [0, 1], [1, 1.12]);
  const imageBrightness = useTransform(smoothProgress, [0, 1], [0.45, 0.15]);
  // A faint glow builds just before the flash, so the burst reads as
  // deliberate rather than as a rendering glitch.
  const preGlow = useTransform(smoothProgress, [0.72, FLASH_AT], [0, 0.16]);

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
    // Map the clip so its last frame lands exactly on the flash, not on the
    // very end of the stage - otherwise the ending is never actually seen.
    const target = Math.min(v / FLASH_AT, 1) * video.duration;
    if (Math.abs(video.currentTime - target) < SEEK_EPSILON) return;

    if (seekState.current.seeking) {
      seekState.current.pendingTime = target;
      return;
    }
    runSeek(target);
  });

  // Flash out, cut to the next section while the screen is white, then fade
  // the flash away - so the next section is simply *there* when sight
  // returns, with no scrolling seen in between.
  useMotionValueEvent(progress, "change", (v) => {
    if (v < REARM_AT) {
      armedRef.current = true;
      return;
    }
    if (v < FLASH_AT || !armedRef.current) return;
    // Only where the stage is actually pinned; on mobile it scrolls normally
    // and a surprise jump would just feel broken.
    if (!window.matchMedia("(min-width: 768px)").matches) return;
    const next = document.getElementById("how-it-works");
    if (!next) return;

    armedRef.current = false;
    animate(flashOpacity, 1, {
      duration: 0.14,
      ease: "easeIn",
      onComplete: () => {
        window.scrollTo({
          top: next.getBoundingClientRect().top + window.scrollY,
          behavior: "instant",
        });
        // Ride up into place rather than blinking into existence. Native
        // WAAPI without fill:forwards, so the transform is dropped by the
        // browser once it ends and can't linger over the sticky pinning.
        next.animate(
          [
            { transform: `translateY(${Math.round(window.innerHeight * 0.16)}px)` },
            { transform: "translateY(0px)" },
          ],
          { duration: 620, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "backwards" }
        );
        animate(flashOpacity, 0, { duration: 0.55, ease: "easeOut" });
      },
    });
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

      <motion.div
        aria-hidden
        style={{ opacity: preGlow }}
        className="pointer-events-none absolute inset-0 z-20 bg-white"
      />
      {/* Fixed, so it still covers the viewport after the scroll cut - by
          then the hero itself is far above the fold. */}
      <motion.div
        aria-hidden
        style={{ opacity: flashOpacity }}
        className="pointer-events-none fixed inset-0 z-50 bg-white"
      />
    </section>
  );
}

export function Hero() {
  // Long on purpose: the clip has to unfold over enough scroll distance that
  // each wheel notch nudges it a few frames instead of leaping half a second,
  // which is what made it feel jumpy (and made every seek expensive).
  return (
    <ScrollStage heightVh={520}>{(progress) => <HeroContent progress={progress} />}</ScrollStage>
  );
}
