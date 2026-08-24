"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

const NAV_LINKS = [
  { href: "#how-it-works", label: "איך זה עובד" },
  { href: "#operations", label: "הצד התפעולי" },
  { href: "#vision", label: "חזון השירות" },
];

export function Header() {
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 120], [0, 1]);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[72px]">
      <motion.div
        aria-hidden
        style={{ opacity: bgOpacity }}
        className="absolute inset-0 border-b border-border bg-background/90 backdrop-blur-md"
      />

      <div className="relative mx-auto flex h-full max-w-6xl items-center gap-10 px-6 md:px-16">
        <a href="#" className="flex shrink-0 items-center gap-2.5">
          <Image
            src="/logo/moach-mark.png"
            alt="מוח"
            width={26}
            height={26}
            className="invert"
          />
          <span dir="ltr" className="text-xl font-extrabold tracking-tight text-foreground">
            MOACH
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
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
          href="#demo"
          className="ms-auto hidden rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-accent-secondary md:inline-flex"
        >
          קבעו דמו
        </a>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="תפריט"
          className="ms-auto text-foreground md:hidden"
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
              href="#demo"
              onClick={() => setMenuOpen(false)}
              className="mt-2 inline-flex justify-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-background"
            >
              קבעו דמו
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
