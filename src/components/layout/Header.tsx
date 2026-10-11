"use client";

import { useEffect, useRef, useState } from "react";
import { BrainMark } from "@/components/ui/BrainMark";
import { CONTACT_ANCHOR } from "@/lib/constants";
import { CTA_LABEL, NAV } from "@/lib/content";

// כל האתר כהה, אז אין יותר זיהוי בהיר/כהה לפי סקשן ואין בלר שמנסה לזהות
// מעברים בין סקשנים נעולים. הקו התחתון קבוע; הרקע מופיע רק ברגע שגוללים.
//
// במובייל היא מתחבאת בגלילה למטה וחוזרת בכל גלילה למעלה, כדי לא לכסות טקסט.
function useScrollState(menuOpen: boolean) {
  const [scrolled, setScrolled] = useState(false);
  const [tucked, setTucked] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      setScrolled(y > 8);
      // מספיק קטן כדי להגיב לתנועה הראשונה, מספיק גדול כדי להתעלם מקפיצות מומנטום.
      if (Math.abs(delta) < 4) return;
      lastY.current = y;
      // בחלק העליון אין ממה לזוז הצידה.
      setTucked(y > window.innerHeight * 0.6 && delta > 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // לא מחביאים תפריט פתוח מתחת לאצבע של הקורא.
  return { scrolled, tucked: tucked && !menuOpen };
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrolled, tucked } = useScrollState(menuOpen);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-[72px] border-b border-border transition-[background-color,transform] duration-300 ${
        scrolled || menuOpen ? "bg-background/85 backdrop-blur-md" : ""
      } ${tucked ? "max-md:-translate-y-full" : ""}`}
    >
      <div className="mx-auto flex h-full max-w-6xl items-center gap-10 px-6 md:px-16">
        <a href="#top" className="flex shrink-0 items-center gap-2.5" aria-label="מוח — לראש הדף">
          <BrainMark className="h-[26px] w-[26px]" color="var(--foreground)" />
          <span dir="ltr" className="text-xl font-extrabold tracking-tight text-foreground">
            MOACH
          </span>
        </a>

        <nav aria-label="ניווט ראשי" className="hidden items-center gap-8 md:flex">
          {NAV.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground-secondary transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href={CONTACT_ANCHOR}
          className="ms-auto hidden bg-accent-strong px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-secondary md:inline-flex"
        >
          {CTA_LABEL}
        </a>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "סגירת התפריט" : "פתיחת התפריט"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="ms-auto text-foreground md:hidden"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            {menuOpen ? (
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full border-b border-border bg-background/95 px-6 py-6 backdrop-blur-md md:hidden"
        >
          <nav aria-label="ניווט ראשי" className="flex flex-col gap-5">
            {NAV.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-base font-medium text-foreground-secondary"
              >
                {link.label}
              </a>
            ))}
            <a
              href={CONTACT_ANCHOR}
              onClick={() => setMenuOpen(false)}
              className="mt-2 inline-flex justify-center bg-accent-strong px-5 py-3 text-sm font-semibold text-white"
            >
              {CTA_LABEL}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
