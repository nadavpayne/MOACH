"use client";

import { useActionState } from "react";
import { sendContact, type ContactState } from "@/lib/actions/contact";
import { CONTACT } from "@/lib/content";

const INITIAL: ContactState = { status: "idle" };

const INPUT =
  "w-full border border-border-strong bg-background px-4 py-3 text-foreground placeholder:text-foreground-muted focus:border-accent focus:outline-none aria-invalid:border-red-400";
const LABEL = "flex flex-col gap-1.5 text-sm font-medium text-foreground-secondary";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <span id={id} className="text-sm font-normal text-red-300">
      {message}
    </span>
  );
}

// 4.10 — הטופס. נשלח במייל דרך פעולת שרת (src/lib/actions/contact.ts).
//
// React מאפס טופס אחרי כל שליחה, גם כשהשרת מחזיר שגיאה. השרת מחזיר את מה
// שהוקלד, והוא נכנס כ-defaultValue — כך האיפוס מחזיר בדיוק את מה שהיה.
export function ContactCTA() {
  const [state, formAction, pending] = useActionState(sendContact, INITIAL);
  const v = state.values;
  const err = state.errors ?? {};
  const invalid = (f: keyof typeof err) => (err[f] ? { "aria-invalid": true, "aria-describedby": `${f}-error` } : {});

  return (
    <section id="contact" className="px-6 py-12 md:px-16 md:py-16">
      <div className="mx-auto grid w-full max-w-6xl gap-12 md:grid-cols-2 md:gap-16">
        <div>
          <h2 className="text-3xl leading-tight font-extrabold text-balance text-foreground md:text-5xl">
            {CONTACT.title}
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-foreground-secondary">{CONTACT.subtitle}</p>
        </div>

        {state.status === "success" ? (
          <div role="status" className="self-start rounded-2xl border border-accent/40 bg-accent-soft p-8">
            <p className="text-2xl font-extrabold text-foreground">{CONTACT.success.title}</p>
            <p className="mt-2 text-foreground-secondary">{CONTACT.success.body}</p>
          </div>
        ) : (
          <form action={formAction} className="relative grid gap-4 sm:grid-cols-2">
            <label className={LABEL}>
              {CONTACT.fields.name}
              <input
                name="name"
                type="text"
                autoComplete="name"
                required
                maxLength={100}
                defaultValue={v?.name}
                className={INPUT}
                {...invalid("name")}
              />
              <FieldError id="name-error" message={err.name} />
            </label>
            <label className={LABEL}>
              {CONTACT.fields.company}
              <input
                name="company"
                type="text"
                autoComplete="organization"
                required
                maxLength={120}
                defaultValue={v?.company}
                className={INPUT}
                {...invalid("company")}
              />
              <FieldError id="company-error" message={err.company} />
            </label>
            <label className={LABEL}>
              {CONTACT.fields.phone}
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                dir="ltr"
                maxLength={30}
                defaultValue={v?.phone}
                className={`${INPUT} text-right`}
                {...invalid("phone")}
              />
              <FieldError id="phone-error" message={err.phone} />
            </label>
            <label className={LABEL}>
              {CONTACT.fields.email}
              <input
                name="email"
                type="email"
                autoComplete="email"
                dir="ltr"
                required
                maxLength={200}
                defaultValue={v?.email}
                className={`${INPUT} text-right`}
                {...invalid("email")}
              />
              <FieldError id="email-error" message={err.email} />
            </label>
            <label className={`${LABEL} sm:col-span-2`}>
              {CONTACT.fields.systems}
              <textarea
                name="systems"
                rows={3}
                maxLength={2000}
                placeholder={CONTACT.fields.systemsHint}
                defaultValue={v?.systems}
                className={`${INPUT} resize-y`}
                {...invalid("systems")}
              />
              <FieldError id="systems-error" message={err.systems} />
            </label>

            {/* מלכודת לבוטים: מוסתר מבני אדם ומקוראי מסך, בוטים ממלאים אותו. */}
            <div aria-hidden className="absolute h-px w-px overflow-hidden opacity-0 [clip:rect(0,0,0,0)]">
              <label>
                Website
                <input name="website" type="text" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={pending}
                className="mt-2 bg-accent-strong px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-accent-secondary disabled:cursor-wait disabled:opacity-70 sm:self-start"
              >
                {pending ? CONTACT.sending : CONTACT.submit}
              </button>
              <p aria-live="polite" className="text-sm text-red-300 sm:mt-2">
                {state.status === "error" ? state.message : ""}
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
