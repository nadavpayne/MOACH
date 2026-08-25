"use client";

import { useState } from "react";
import { useMotionValueEvent, type MotionValue } from "framer-motion";
import { ScrollStage } from "@/components/ui/ScrollStage";

const STEPS = [
  {
    number: "01",
    title: "תחזית ביקוש",
    desc: "מזג אוויר, אירועים מקומיים ולוח השנה העברי — ערבי חג, חול המועד וסופי שבוע — נכנסים למודל לפני שהם משפיעים על התור.",
  },
  {
    number: "02",
    title: "הזמנות מלאי אוטומטיות",
    desc: "הזמנות יוצאות ישירות לספקים לפי התחזית, מסונכרנות עם Tabit, Beecom וכל נותן שירות אפשרי, כדי שהמדף לא יתרוקן באמצע משמרת ולא יתמלא בסחורה שתיזרק.",
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
      <span className="text-7xl font-extrabold text-slate-900/10 md:text-8xl">
        {step.number}
      </span>
      <h3 className="mt-4 text-2xl font-extrabold text-slate-900 md:text-3xl">{step.title}</h3>
      <p className="mt-4 max-w-md text-base leading-relaxed text-slate-600">{step.desc}</p>
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
    <div className="flex h-full flex-col justify-center p-8">
      <p className="mb-6 text-xs font-semibold tracking-widest text-slate-500 uppercase">
        תחזית שבועית
      </p>
      <div className="flex h-40 gap-3">
        {heights.map((h, i) => (
          <div key={i} className="flex flex-1 flex-col items-center justify-end gap-2">
            <div
              className={`w-full rounded-t ${i === 5 ? "bg-accent" : "bg-slate-300"}`}
              style={{ height: `${h}%` }}
            />
            {i === 5 && <span className="text-[10px] font-semibold text-accent">ערב חג</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function OrdersMockup() {
  const rows = [
    { name: 'בשר טחון · 12 ק"ג', status: "נשלח ל-Tabit" },
    { name: "לחמניות · 300 יח'", status: "מסונכרן עם Beecom" },
    { name: 'ירקות טריים · 40 ק"ג', status: "בהמתנה לספק" },
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-8">
      {rows.map((row) => (
        <div
          key={row.name}
          className="flex items-center justify-between border border-slate-200 bg-slate-100/50 px-4 py-3"
        >
          <span className="text-sm font-medium text-slate-900">{row.name}</span>
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
          className="flex items-center justify-between border border-slate-200 bg-slate-100/50 px-4 py-3"
        >
          <span className="text-sm font-medium text-slate-900">{shift.name}</span>
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
          className="flex items-center justify-between border border-slate-200 bg-slate-100/50 px-4 py-3"
        >
          <span className="text-sm font-medium text-slate-900">{s.name}</span>
          <span className="text-xs text-slate-500">{s.days}</span>
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

function OperationalSideContent({ progress }: { progress: MotionValue<number> }) {
  const active = useActiveStep(progress, STEPS.length);

  return (
    <div className="relative flex h-full flex-col justify-start bg-white px-6 pt-[100px] md:px-16">
      <div className="mx-auto w-full max-w-6xl">
        <div className="relative overflow-hidden border-2 border-slate-300 bg-slate-50/60 p-8 md:p-12">
          <p className="text-xs font-semibold tracking-widest text-accent uppercase">
            הצד התפעולי
          </p>

          <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2">
            <div className="relative min-h-[280px]">
              {STEPS.map((step, i) => (
                <StepText key={step.number} step={step} active={i === active} />
              ))}
            </div>

            <div className="relative hidden min-h-[360px] overflow-hidden border-2 border-slate-300 bg-white md:block">
              {STEPS.map((_, i) => (
                <StepMockup key={i} index={i} active={i === active} />
              ))}
            </div>
          </div>

          <div className="mt-10 flex justify-end gap-2">
            {STEPS.map((step, i) => (
              <StepDot key={step.number} active={i === active} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function OperationalSide() {
  return (
    <section id="operations" data-header-theme="light">
      <ScrollStage heightVh={340}>
        {(progress) => <OperationalSideContent progress={progress} />}
      </ScrollStage>
    </section>
  );
}
