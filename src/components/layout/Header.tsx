"use client";

import { useEffect, useRef, useState } from "react";
import { BrainMark } from "@/components/ui/BrainMark";
import { CONTACT_ANCHOR } from "@/lib/constants";
import { CTA_LABEL, FOOTER, NAV } from "@/lib/content";

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

// הכותרת: המבורגר מימין, הלוגו במרכז, הכפתור משמאל. הניווט כולו במגירה
// שנפתחת מימין.
//
// המגירה מרונדרת מחוץ ל-<header> בכוונה: ל-header יש backdrop-blur ו-transform,
// ושניהם הופכים אותו ל"מכל" של אלמנטים fixed — המגירה הייתה נכלאת בגובה 72px.
export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrolled, tucked } = useScrollState(menuOpen);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  // סגירה ב-Escape או ב-X מחזירה את הפוקוס להמבורגר. סגירה בלחיצה על קישור
  // לא — שם הדפדפן ממשיך מהסקשן שאליו קפצו.
  const returnFocus = useRef(false);

  function close(restoreFocus: boolean) {
    returnFocus.current = restoreFocus;
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) {
      if (returnFocus.current) burgerRef.current?.focus();
      returnFocus.current = false;
      return;
    }
    closeRef.current?.focus();
    const root = document.documentElement;
    root.style.overflow = "hidden";
    // הגלילה ננעלת, פס הגלילה נעלם, והמקום השמור לו (scrollbar-gutter ב-globals.css)
    // נשאר ריק ונצבע ברקע של html. בצבע המגירה הוא נראה כהמשך שלה.
    root.style.backgroundColor = "var(--background-secondary)";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        returnFocus.current = true;
        setMenuOpen(false);
        return;
      }
      // מלכודת פוקוס: Tab מסתובב בתוך המגירה ולא בורח לעמוד שמאחוריה.
      if (e.key !== "Tab" || !drawerRef.current) return;
      const items = drawerRef.current.querySelectorAll<HTMLElement>("a[href], button");
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = "";
      root.style.backgroundColor = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 h-[72px] border-b border-border transition-[background-color,transform] duration-300 ${
          scrolled || menuOpen ? "bg-background/85 backdrop-blur-md" : ""
        } ${tucked ? "max-md:-translate-y-full" : ""}`}
      >
        <div className="mx-auto grid h-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-6 md:px-16">
          <button
            ref={burgerRef}
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="פתיחת התפריט"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            className="-ms-2.5 grid h-11 w-11 place-items-center justify-self-start text-foreground transition-colors hover:text-accent-light"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <a href="#top" className="flex items-center gap-2.5" aria-label="מוח — לראש הדף">
            <BrainMark className="h-[26px] w-[26px]" color="var(--foreground)" />
            <span dir="ltr" className="text-xl font-extrabold tracking-tight text-foreground">
              MOACH
            </span>
          </a>

          <a
            href={CONTACT_ANCHOR}
            className="hidden justify-self-end rounded-full border border-accent bg-accent-soft px-5 py-2 text-sm font-semibold text-accent-light transition-colors hover:bg-accent/25 hover:text-foreground md:inline-flex"
          >
            {CTA_LABEL}
          </a>
        </div>
      </header>

      <div
        aria-hidden
        onClick={() => close(true)}
        className={`fixed inset-0 z-[60] bg-black/55 transition-opacity duration-300 ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        ref={drawerRef}
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="תפריט"
        inert={!menuOpen}
        className={`fixed inset-y-0 start-0 z-[70] flex w-[min(22rem,85vw)] flex-col border-e border-border-strong bg-background-secondary px-6 shadow-2xl shadow-black/50 transition-transform duration-300 ease-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* באותו גובה ובאותו מקום כמו ההמבורגר, כך שה-X מחליף אותו במקום */}
        <div className="flex h-[72px] shrink-0 items-center">
          <button
            ref={closeRef}
            type="button"
            onClick={() => close(true)}
            aria-label="סגירת התפריט"
            className="-ms-2.5 grid h-11 w-11 place-items-center text-foreground transition-colors hover:text-accent-light"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <nav aria-label="ניווט ראשי" className="mt-4">
          <ul>
            {NAV.map((link) => (
              <li key={link.href} className="border-b border-border">
                <a
                  href={link.href}
                  onClick={() => close(false)}
                  className="block py-4 text-xl font-bold text-foreground transition-colors hover:text-accent-light"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto pb-8">
          <a
            href={CONTACT_ANCHOR}
            onClick={() => close(false)}
            className="flex justify-center bg-accent-strong px-5 py-3.5 text-base font-semibold text-white transition-colors hover:bg-accent-secondary"
          >
            {CTA_LABEL}
          </a>
          <p className="mt-4 text-center text-sm text-foreground-muted">{FOOTER.tagline}</p>
        </div>
      </div>
    </>
  );
}
