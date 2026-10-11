import type { ReactNode } from "react";

// מעטפת אחידה לכל הסקשנים: אותו ריווח, אותו רוחב ואותה היררכיית כותרת.
// Server Component — אין בה שום אינטראקטיביות.
export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className = "",
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`px-6 py-12 md:px-16 md:py-16 ${className}`}>
      <div className="mx-auto w-full max-w-6xl">
        <header className="max-w-3xl">
          {eyebrow && (
            <p className="text-sm font-semibold tracking-wide text-accent-light">{eyebrow}</p>
          )}
          <h2 className="mt-3 text-3xl leading-tight font-extrabold text-balance text-foreground md:text-5xl">
            {title}
          </h2>
          {intro && (
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-foreground-secondary">
              {intro}
            </p>
          )}
        </header>
        {children && <div className="mt-10 md:mt-12">{children}</div>}
      </div>
    </section>
  );
}
