import Image from "next/image";

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-background px-6 pt-24 pb-16 md:px-16">
      <Image
        src="/images/hero-kitchen.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[70%_35%] opacity-90 grayscale blur-sm contrast-110 brightness-[0.85] md:blur-md"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/35 to-background" />
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

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <h1 className="max-w-3xl text-5xl leading-[1.05] font-extrabold tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
          המוח התפעולי של המסעדה שלך
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground-secondary md:text-xl">
          מוח קורא את כל נתוני התפעול של המסעדה שלך — POS, מלאי, שיבוץ, מזג אוויר ולוח שנה עברי —
          ומריץ עבורך תחזית, שיבוץ, הזמנות ושכר.
        </p>

        <div className="mt-10">
          <a
            href="#demo"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-base font-semibold text-background transition-colors hover:bg-accent-secondary"
          >
            ראו את המוח בפעולה
            <span aria-hidden>←</span>
          </a>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-20 flex w-full max-w-6xl items-center justify-end gap-4">
        <div className="h-0.5 w-24 bg-foreground-secondary/60" />
        <p className="text-sm text-foreground-secondary">נתונים חיים, כל משמרת</p>
      </div>
    </section>
  );
}
