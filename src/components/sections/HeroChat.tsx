"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { BrainMark } from "@/components/ui/BrainMark";
import { ChatBubble } from "@/components/ui/ChatBubble";
import { SourceTag } from "@/components/ui/SourceTag";
import { HERO } from "@/lib/content";

type Demo = (typeof HERO.demos)[number];

// שלבי השיחה:
// 0 ריק · 1 שאלה · 2 מקליד… · 3 תשובה ראשונה · 4 מקליד שוב · 5 תשובה שנייה
const LAST = 5;
// כמה זמן כל שלב מוצג לפני הבא. האחרון הוא זמן הקריאה לפני שעוברים לתרחיש הבא.
const STEP_MS = [600, 550, 1500, 900, 1500, 6500] as const;
const TYPING_DOT_DELAYS = ["0ms", "150ms", "300ms"] as const;

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}

function TypingBubble() {
  return (
    <div className="flex animate-bubble-in justify-end">
      <div className="flex items-center gap-1 rounded-2xl rounded-se-sm border border-border-strong bg-surface px-4 py-4">
        {TYPING_DOT_DELAYS.map((delay) => (
          <span
            key={delay}
            className="h-1.5 w-1.5 animate-typing-dot rounded-full bg-accent"
            style={{ animationDelay: delay }}
          />
        ))}
      </div>
    </div>
  );
}

function Answer({ answer }: { answer: Demo["answers"][number] }) {
  return (
    <ChatBubble role="answer" className="animate-bubble-in">
      <p>{answer.text}</p>
      <SourceTag sources={answer.sources} className="mt-2.5" />
    </ChatBubble>
  );
}

function Conversation({ demo, step }: { demo: Demo; step: number }) {
  const [first, second] = demo.answers;
  return (
    <div className="flex flex-col gap-3">
      {step >= 1 && (
        <ChatBubble role="question" className="animate-bubble-in">
          {demo.question}
        </ChatBubble>
      )}
      {step >= 3 && <Answer answer={first} />}
      {step >= 5 && <Answer answer={second} />}
      {(step === 2 || step === 4) && <TypingBubble />}
    </div>
  );
}

// 4.1 — ההדגמה החיה: שאלה, "מקליד…", תשובה, שוב "מקליד…", ועוד תשובה. אחרי
// זמן קריאה עוברים לתרחיש הבא. לחיצה על תרחיש עוצרת את המעבר האוטומטי —
// מי שבחר רוצה לקרוא בקצב שלו.
//
// - בלי layout shift: כל התרחישים מרונדרים במצבם הסופי, בלתי נראים, באותו תא
//   גריד. הם קובעים את הגובה, והשיחה החיה יושבת מעליהם.
// - reduced-motion: מציגים את התשובה המלאה מיד, בלי טיימרים.
// - מחוץ למסך: ההנפשה נעצרת, וממשיכה כשחוזרים.
// - קוראי מסך: השיחה המונפשת מוסתרת מהם, ובמקומה הטקסט המלא של התרחיש הנוכחי.
export function HeroChat() {
  const demos = HERO.demos;
  const [active, setActive] = useState(0);
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(true);
  const [inView, setInView] = useState(true);
  const reduceMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const playing = inView && !reduceMotion;
  const finished = step === LAST && !auto;

  useEffect(() => {
    if (!playing || finished) return;
    const id = window.setTimeout(() => {
      if (step < LAST) {
        setStep(step + 1);
      } else {
        setActive((active + 1) % demos.length);
        setStep(0);
      }
    }, STEP_MS[step]);
    return () => window.clearTimeout(id);
  }, [playing, finished, step, active, demos.length]);

  function choose(i: number) {
    setActive(i);
    setStep(0);
    setAuto(false);
  }

  const current = demos[active];

  return (
    <figure
      ref={ref}
      aria-label="דוגמה לשאלה ותשובה במוח"
      className="rounded-2xl border border-border-strong bg-background-secondary p-4 shadow-2xl shadow-black/40 md:p-5"
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-accent-soft ring-1 ring-accent/30">
          <BrainMark className="h-6 w-6" />
        </span>
        <div className="leading-tight">
          <p className="font-bold text-foreground">מוח</p>
          <p className="mt-0.5 text-xs text-foreground-secondary">מחובר למקורות המידע של העסק</p>
        </div>
      </div>

      <div aria-hidden className="grid rounded-xl border border-border bg-background p-3 md:p-4">
        {demos.map((d) => (
          <div key={d.label} className="invisible col-start-1 row-start-1">
            <Conversation demo={d} step={LAST} />
          </div>
        ))}
        <div className="col-start-1 row-start-1 self-start">
          <Conversation key={active} demo={current} step={reduceMotion ? LAST : step} />
        </div>
      </div>

      <div className="sr-only">
        <p>שאלה: {current.question}</p>
        {current.answers.map((a) => (
          <p key={a.text}>
            תשובה: {a.text} מקור: {a.sources.join(", ")}
          </p>
        ))}
      </div>

      <div role="group" aria-label="דוגמאות נוספות" className="mt-4 flex flex-wrap gap-2">
        {demos.map((d, i) => {
          const isActive = i === active;
          return (
            <button
              key={d.label}
              type="button"
              aria-pressed={isActive}
              onClick={() => choose(i)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "border-accent bg-accent-soft text-accent-light"
                  : "border-border-strong text-foreground-secondary hover:border-accent/50 hover:text-foreground"
              }`}
            >
              {d.label}
            </button>
          );
        })}
      </div>
    </figure>
  );
}
