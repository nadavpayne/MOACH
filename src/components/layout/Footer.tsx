import { BrainMark } from "@/components/ui/BrainMark";
import { CONTACT_EMAIL } from "@/lib/constants";
import { FOOTER, NAV } from "@/lib/content";

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-14 md:px-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-3">
          <a href="#top" className="flex items-center gap-2.5" aria-label="מוח — לראש הדף">
            <BrainMark className="h-6 w-6" color="var(--foreground)" />
            <span dir="ltr" className="text-lg font-extrabold tracking-tight text-foreground">
              MOACH
            </span>
          </a>
          <p className="text-sm text-foreground-secondary">{FOOTER.tagline}</p>
          {/* מוצג רק כשיש כתובת אמיתית — לא ממציאים אחת. */}
          {CONTACT_EMAIL && (
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              dir="ltr"
              className="text-sm text-foreground-secondary transition-colors hover:text-foreground"
            >
              {CONTACT_EMAIL}
            </a>
          )}
        </div>

        <nav aria-label="קישורי תחתית" className="flex flex-wrap gap-x-8 gap-y-3">
          {NAV.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-foreground-secondary transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <p className="mx-auto mt-12 w-full max-w-6xl text-xs text-foreground-muted">
        © {new Date().getFullYear()} מוח
      </p>
    </footer>
  );
}
