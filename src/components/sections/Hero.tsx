import { CONTACT_ANCHOR } from "@/lib/constants";
import { CTA_LABEL, HERO } from "@/lib/content";
import { HeroChat } from "./HeroChat";

// 4.1 — הסקשן עצמו נשאר Server Component; רק הצ'אט המונפש הוא client.
export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-6 pt-[120px] pb-20 md:px-16 md:pt-[160px] md:pb-28"
    >
      {/* זוהר כחול עדין מאחורי ההדגמה — הדבר היחיד שמושך את העין חוץ מהטקסט */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-0 h-[520px] w-[520px] rounded-full bg-accent/10 blur-[120px]"
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 md:grid-cols-2 md:gap-16">
        <div>
          <h1 className="text-4xl leading-[1.08] font-extrabold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
            {HERO.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground-secondary">
            {HERO.subtitle}
          </p>
          <a
            href={CONTACT_ANCHOR}
            className="mt-10 inline-flex items-center gap-2 bg-accent-strong px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-accent-secondary"
          >
            {CTA_LABEL}
            <span aria-hidden>←</span>
          </a>
        </div>

        {/* ההדגמה. לא צילום מסך של מערכת אמיתית — ממשק מינימלי שמראה את הרעיון. */}
        <HeroChat />
      </div>

      <p className="relative mx-auto mt-16 w-full max-w-6xl text-sm text-foreground-muted">
        {HERO.tagline}
      </p>
    </section>
  );
}
