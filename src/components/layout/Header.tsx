"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { BOOKING_URL } from "@/lib/constants";

const NAV_LINKS = [
  { href: "#how-it-works", label: "איך זה עובד" },
  { href: "#operations", label: "הצד התפעולי" },
  { href: "#vision", label: "חזון השירות" },
  { href: "#integrations", label: "אינטגרציות" },
  { href: "#built-for-israel", label: "בנוי לישראל" },
];

function detectTheme(): "dark" | "light" {
  const el = document.elementFromPoint(window.innerWidth / 2, 80);
  const themed = el?.closest("[data-header-theme]");
  return (themed?.getAttribute("data-header-theme") as "dark" | "light" | null) ?? "dark";
}

function useHeaderTheme() {
  const { scrollY } = useScroll();
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    setTheme(detectTheme());
  }, []);

  useMotionValueEvent(scrollY, "change", () => {
    const next = detectTheme();
    setTheme((prev) => (prev === next ? prev : next));
  });

  return theme;
}

// Look for a pinned stage by its actual computed position rather than by
// class name - matching on ".sticky" silently broke the moment the class
// became "md:sticky", which left the blur stuck on during every scroll.
function findPinnedStage(el: Element | null): HTMLElement | null {
  let node = el as HTMLElement | null;
  while (node && node !== document.body) {
    if (getComputedStyle(node).position === "sticky") return node;
    node = node.parentElement;
  }
  return null;
}

// The blur is only meant to keep the header legible while one section slides
// away and the next arrives. Inside a pinned section the content underneath
// is held still and only animates in place, so blurring there just veils
// copy the reader is trying to read.
function isContentMoving(): boolean {
  const el = document.elementFromPoint(window.innerWidth / 2, 80);
  const stage = findPinnedStage(el);
  if (!stage) return true;
  return Math.abs(stage.getBoundingClientRect().top) > 1;
}

function useHeaderBlur() {
  const { scrollY } = useScroll();
  const [blur, setBlur] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const unsubscribe = scrollY.on("change", () => {
      if (isContentMoving()) {
        setBlur(true);
        clearTimeout(timeout);
        timeout = setTimeout(() => setBlur(false), 350);
      } else {
        clearTimeout(timeout);
        setBlur(false);
      }
    });
    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, [scrollY]);

  return blur;
}

export function Header() {
  const theme = useHeaderTheme();
  const isLight = theme === "light";
  const showBlur = useHeaderBlur();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[72px]">
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-0 h-[140px] backdrop-blur-lg transition-opacity duration-300 ${
          showBlur ? "opacity-100" : "opacity-0"
        }`}
        style={{
          maskImage: "linear-gradient(to bottom, black 0%, black 45%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 45%, transparent 100%)",
        }}
      />

      <div className="relative mx-auto flex h-full max-w-6xl items-center gap-10 px-6 md:px-16">
        <a href="#" className="flex shrink-0 items-center gap-2.5">
          <Image
            src="/logo/moach-mark.png"
            alt="מוח"
            width={26}
            height={26}
            className={`transition-all duration-300 ${isLight ? "" : "invert"}`}
          />
          <span
            dir="ltr"
            className={`text-xl font-extrabold tracking-tight transition-colors duration-300 ${
              isLight ? "text-slate-900" : "text-white"
            }`}
          >
            MOACH
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors duration-300 ${
                isLight ? "text-slate-600 hover:text-slate-900" : "text-white/70 hover:text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="ms-auto hidden bg-accent px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent-secondary md:inline-flex"
        >
          קבעו דמו
        </a>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="תפריט"
          className={`ms-auto transition-colors duration-300 md:hidden ${
            isLight ? "text-slate-900" : "text-white"
          }`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="absolute inset-x-0 top-full border-b border-border bg-background/95 px-6 py-6 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-5">
            {NAV_LINKS.map((link) => (
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
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="mt-2 inline-flex justify-center bg-accent px-5 py-2.5 text-sm font-semibold text-foreground"
            >
              קבעו דמו
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
