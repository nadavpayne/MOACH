"use client";

import { useState } from "react";
import { useMotionValueEvent, type MotionValue } from "framer-motion";
import { ScrollStage } from "@/components/ui/ScrollStage";
import { useIsMobile } from "@/lib/useIsMobile";

const STEPS = [
  {
    number: "01",
    title: "תחזית ביקוש",
    desc: "מזג אוויר, אירועים מקומיים ולוח השנה העברי — ערבי חג, חול המועד וסופי שבוע — נכנסים למודל לפני שהם משפיעים על התור.",
  },
  {
    number: "02",
    title: "הזמנות מלאי אוטומטיות",
    desc: "הזמנות יוצאות ישירות לספקים לפי התחזית, בהתבסס על נתוני המכירות מהקופה — Tabit, Beecom וכל קופה אפשרית — כדי שהמדף לא יתרוקן באמצע משמרת ולא יתמלא בסחורה שתיזרק.",
  },
  {
    number: "03",
    title: "שיבוץ לפי חוק ישראלי",
    desc: "המערכת מכירה את חוק שעות עבודה ומנוחה — 125% על השעתיים הנוספות הראשונות, 150% אחריהן — ומתעדכנת אוטומטית כשעובד יוצא למילואים.",
  },
  {
    number: "04",
    title: "ספקים ותעודות בבקרה",
    desc: "מעקב אחר ספקים ותוקף תעודות כשרות לכל סניף, עם התראה לפני שאישור עומד לפוג — לפני שזה הופך לבעיה.",
  },
];

function useActiveStep(progress: MotionValue<number>, total: number) {
  const [active, setActive] = useState(0);
  useMotionValueEvent(progress, "change", (v) => {
    const idx = Math.min(total - 1, Math.max(0, Math.floor(v * total)));
    if (idx !== active) setActive(idx);
  });
  return active;
}

function StepText({ step, active }: { step: (typeof STEPS)[number]; active: boolean }) {
  return (
    <div
      className={`absolute inset-0 transition-all duration-300 ${
        active ? "opacity-100 translate-y-0" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <span className="text-4xl font-extrabold text-slate-900/10 [@media(max-width:767px)]:text-white/10 [@media(min-width:821px)]:text-7xl md:text-8xl">
        {step.number}
      </span>
      <h3 className="mt-2 text-lg font-extrabold text-slate-900 [@media(max-width:767px)]:text-foreground [@media(min-width:821px)]:mt-4 [@media(min-width:821px)]:text-2xl md:text-3xl">
        {step.title}
      </h3>
      <p className="mt-1 max-w-md text-xs leading-relaxed text-slate-600 [@media(max-width:767px)]:text-foreground-secondary [@media(min-width:821px)]:mt-4 [@media(min-width:821px)]:text-base">
        {step.desc}
      </p>
    </div>
  );
}

function StepDot({ active }: { active: boolean }) {
  return (
    <div
      className={`h-1 w-10 rounded-full bg-accent transition-opacity duration-300 ${
        active ? "opacity-100" : "opacity-25"
      }`}
    />
  );
}

function DemandMockup() {
  const heights = [30, 45, 38, 62, 50, 90, 55];
  return (
    <div className="flex h-full flex-col justify-center p-8 [@media(max-width:767px)]:p-4">
      <p className="mb-6 text-xs font-semibold tracking-widest text-slate-500 [@media(max-width:767px)]:text-foreground-secondary uppercase [@media(max-width:767px)]:mb-3">
        תחזית שבועית
      </p>
      <div className="flex h-40 gap-3 [@media(max-width:767px)]:mt-4 [@media(max-width:767px)]:h-[76px] [@media(max-width:767px)]:gap-1.5">
        {heights.map((h, i) => (
          <div key={i} className="relative flex flex-1 flex-col items-center justify-end gap-2">
            <div
              className={`w-full rounded-t ${i === 5 ? "bg-accent" : "bg-slate-300 [@media(max-width:767px)]:bg-white/20"}`}
              style={{ height: `${h}%` }}
            />
            {i === 5 && (
              <span className="text-[10px] font-semibold text-accent [@media(max-width:767px)]:absolute [@media(max-width:767px)]:-top-4 [@media(max-width:767px)]:left-1/2 [@media(max-width:767px)]:-translate-x-1/2 [@media(max-width:767px)]:whitespace-nowrap">
                ערב חג
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function OrdersMockup() {
  const rows = [
    { name: 'בשר טחון · 12 ק"ג', status: "נשלח לספק" },
    { name: "לחמניות · 300 יח'", status: "אושר ויוצא" },
    { name: 'ירקות טריים · 40 ק"ג', status: "בהמתנה לספק" },
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-8">
      {rows.map((row) => (
        <div
          key={row.name}
          className="flex items-center justify-between border border-slate-200 [@media(max-width:767px)]:border-white/10 bg-slate-100/50 [@media(max-width:767px)]:bg-white/[0.04] px-4 py-3"
        >
          <span className="text-sm font-medium text-slate-900 [@media(max-width:767px)]:text-foreground">{row.name}</span>
          <span className="text-xs text-accent">{row.status}</span>
        </div>
      ))}
    </div>
  );
}

function WorkforceMockup() {
  const shifts = [
    { name: "נועה כ׳", tag: null },
    { name: "איתי ל׳", tag: "125%" },
    { name: "דניאל ר׳", tag: "מילואים" },
    { name: "מאיה ש׳", tag: null },
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-8">
      {shifts.map((shift) => (
        <div
          key={shift.name}
          className="flex items-center justify-between border border-slate-200 [@media(max-width:767px)]:border-white/10 bg-slate-100/50 [@media(max-width:767px)]:bg-white/[0.04] px-4 py-3"
        >
          <span className="text-sm font-medium text-slate-900 [@media(max-width:767px)]:text-foreground">{shift.name}</span>
          {shift.tag && (
            <span className="rounded bg-accent/15 px-2 py-1 text-xs font-semibold text-accent">
              {shift.tag}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function SupplyChainMockup() {
  const suppliers = [
    { name: 'מרכזי בשר בע"מ', days: "כשרות · 82 ימים" },
    { name: "מאפיית הכרם", days: "כשרות · 12 ימים" },
    { name: "ירקות השדה", days: "כשרות · 5 ימים ⚠" },
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-8">
      {suppliers.map((s) => (
        <div
          key={s.name}
          className="flex items-center justify-between border border-slate-200 [@media(max-width:767px)]:border-white/10 bg-slate-100/50 [@media(max-width:767px)]:bg-white/[0.04] px-4 py-3"
        >
          <span className="text-sm font-medium text-slate-900 [@media(max-width:767px)]:text-foreground">{s.name}</span>
          <span className="text-xs text-slate-500 [@media(max-width:767px)]:text-foreground-secondary">{s.days}</span>
        </div>
      ))}
    </div>
  );
}

const MOCKUPS = [DemandMockup, OrdersMockup, WorkforceMockup, SupplyChainMockup];

function StepMockup({ index, active }: { index: number; active: boolean }) {
  const Mockup = MOCKUPS[index];
  return (
    <div
      className={`absolute inset-0 transition-all duration-300 ${
        active ? "opacity-100 translate-y-0" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <Mockup />
    </div>
  );
}

function StepArrow({
  label,
  onClick,
  flip,
}: {
  label: string;
  onClick: () => void;
  flip?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="hidden h-8 w-8 items-center justify-center rounded-full border border-white/20 text-foreground-secondary [@media(max-width:767px)]:flex"
    >
      {/* RTL: going back points right, going forward points left */}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d={flip ? "M9 5l7 7-7 7" : "M15 5l-7 7 7 7"}
        />
      </svg>
    </button>
  );
}

function OperationalSideContent({ progress }: { progress: MotionValue<number> }) {
  const isMobile = useIsMobile();
  const scrolledStep = useActiveStep(progress, STEPS.length);
  const [pickedStep, setPickedStep] = useState(0);
  // Mobile has no pinning to drive a carousel off, so it is paged by hand.
  const active = isMobile ? pickedStep : scrolledStep;
  const step = (delta: number) =>
    setPickedStep((i) => (i + delta + STEPS.length) % STEPS.length);

  return (
    <div className="relative flex h-full flex-col bg-white [@media(max-width:767px)]:bg-background px-6 pt-[100px] pb-10 md:px-16 [@media(max-height:820px)]:pt-[64px] [@media(max-height:820px)]:pb-4 [@media(max-width:820px)]:pt-[36px] [@media(max-width:820px)]:pb-4">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col">
        <div className="relative flex flex-1 flex-col justify-center gap-6 border-2 border-slate-300 [@media(max-width:767px)]:border-white/15 bg-slate-50/60 [@media(max-width:767px)]:bg-white/[0.03] p-8 md:p-12 [@media(max-height:820px)]:gap-3 [@media(max-height:820px)]:p-5 [@media(max-width:820px)]:gap-3 [@media(max-width:820px)]:p-5">
          <p className="text-xs font-semibold tracking-widest text-accent uppercase">
            הצד התפעולי
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
            <div className="relative h-[170px] md:h-[260px]">
              {STEPS.map((step, i) => (
                <StepText key={step.number} step={step} active={i === active} />
              ))}
            </div>

            <div className="relative h-[150px] overflow-hidden border-2 border-slate-300 [@media(max-width:767px)]:border-white/15 bg-white [@media(max-width:767px)]:bg-background md:h-[260px]">
              {STEPS.map((_, i) => (
                <StepMockup key={i} index={i} active={i === active} />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <StepArrow label="השלב הקודם" onClick={() => step(-1)} flip />
            <div className="flex gap-2">
              {STEPS.map((s, i) => (
                <StepDot key={s.number} active={i === active} />
              ))}
            </div>
            <StepArrow label="השלב הבא" onClick={() => step(1)} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function OperationalSide() {
  return (
    <section id="operations" data-header-theme="light" data-header-theme-mobile="dark" className="scroll-mt-[90px]">
      <ScrollStage heightVh={340}>
        {(progress) => <OperationalSideContent progress={progress} />}
      </ScrollStage>
    </section>
  );
}
