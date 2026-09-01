"use client";

import { useEffect, useRef, useState } from "react";
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
  if (!themed) return "dark";
  // Some sections are light on desktop but dark on mobile, and they carry a
  // separate mobile value for it - a media query can restyle a section but
  // cannot change the attribute this reads.
  const mobile = window.matchMedia("(max-width: 767px)").matches
    ? themed.getAttribute("data-header-theme-mobile")
    : null;
  return ((mobile ?? themed.getAttribute("data-header-theme")) as "dark" | "light" | null) ?? "dark";
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

// Each stage is a tall track with a sticky child that pins while the track
// scrolls past. The hero is the track itself; the rest wrap theirs in a
// <section>. Identified by computed position rather than class name, since
// matching on ".sticky" already broke once when it became "md:sticky".
function trackOf(el: Element): HTMLElement | null {
  const first = el.firstElementChild as HTMLElement | null;
  if (first && getComputedStyle(first).position === "sticky") return el as HTMLElement;
  const second = first?.firstElementChild as HTMLElement | null;
  if (second && getComputedStyle(second).position === "sticky") return first;
  return null;
}

// Layout position, which - unlike getBoundingClientRect - is not shifted by
// CSS transforms. That matters because the section arriving after the hero's
// flash is transform-animated into place, and a visual measurement reads that
// as the section moving when it is only sliding into position.
function layoutTop(el: HTMLElement): number {
  let y = 0;
  let node: HTMLElement | null = el;
  while (node) {
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return y;
}

// The blur is only meant to keep the header legible while one section slides
// away and the next arrives. Inside a pinned section the content underneath
// is held still and only animates in place, so blurring there just veils
// copy the reader is trying to read.
//
// Compares scroll position against the stage's track in layout space. Both
// the sticky element's mid-scroll repositioning lag and the arrival
// animation's transform move things visually without moving them in layout,
// so measuring layout is immune to both.
// Asks which track the scroll position currently sits inside, rather than
// asking what happens to be painted under a probe point. Point-probing was
// the bug: while the section after the hero's flash animates into place it
// is shifted down, so the probe landed on the empty track behind it, found
// no pinned stage, and concluded the page was moving.
function isContentMoving(): boolean {
  const main = document.querySelector("main");
  if (!main) return true;
  const y = window.scrollY;
  const vh = window.innerHeight;

  for (const child of Array.from(main.children)) {
    const track = trackOf(child);
    if (!track) continue;
    const top = layoutTop(track);
    if (y >= top && y <= top + track.offsetHeight - vh) return false;
  }
  return true;
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

// Mobile only. The header stays put across the hero - the "first page" - and
// past that it tucks away on downward scroll and returns on any upward
// scroll, so it is never covering copy while reading.
//
// Translates by more than its own 72px height: the blur overlay it contains
// is 140px tall and hangs below it, so a plain -translate-y-full would leave
// a band of blur stranded on screen.
function isPastFirstPage(y: number): boolean {
  const hero = document.querySelector("main")?.firstElementChild as HTMLElement | null;
  if (!hero) return false;
  return y >= layoutTop(hero) + hero.offsetHeight;
}

function useHeaderTucked(menuOpen: boolean) {
  const { scrollY } = useScroll();
  const [tucked, setTucked] = useState(false);
  const lastY = useRef(0);

  // Landing already past the hero (a refresh mid-page, or a #anchor) should
  // start tucked, same as if it had been scrolled to.
  useEffect(() => {
    lastY.current = window.scrollY;
    setTucked(isPastFirstPage(window.scrollY));
  }, []);

  useMotionValueEvent(scrollY, "change", (y) => {
    const delta = y - lastY.current;
    // Small enough to react to the first flick of a scroll, large enough to
    // ignore momentum rubber-banding flapping it on tiny reversals.
    if (Math.abs(delta) < 4) return;
    lastY.current = y;
    // Resting at the very top there is nothing to get out of the way of.
    if (y < 8) {
      setTucked(false);
      return;
    }
    setTucked(delta > 0);
  });

  // Never tuck away an open menu out from under the reader.
  return tucked && !menuOpen;
}

export function Header() {
  const theme = useHeaderTheme();
  const isLight = theme === "light";
  const showBlur = useHeaderBlur();
  const [menuOpen, setMenuOpen] = useState(false);
  const tucked = useHeaderTucked(menuOpen);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-[72px] ${
        tucked ? "[@media(max-width:767px)]:pointer-events-none" : ""
      }`}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-0 h-[140px] backdrop-blur-lg transition-opacity duration-150 ${
          showBlur ? "opacity-100" : "opacity-0"
        }`}
        style={{
          maskImage: "linear-gradient(to bottom, black 0%, black 45%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 45%, transparent 100%)",
        }}
      />

      <div
        className={`relative mx-auto flex h-full max-w-6xl items-center gap-10 px-6 md:px-16 [@media(max-width:767px)]:transition-transform [@media(max-width:767px)]:duration-300 [@media(max-width:767px)]:ease-out ${
          tucked ? "[@media(max-width:767px)]:-translate-y-[150px]" : ""
        }`}
      >
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
