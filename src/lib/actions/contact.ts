"use server";

import { CONTACT } from "@/lib/content";

// הטופס של 4.10: שולח את הליד במייל דרך Resend.
//
// משתני סביבה (ב-Vercel, לא בריפו):
//   RESEND_API_KEY     — מפתח מ-resend.com.
//   CONTACT_TO_EMAIL   — לאן הלידים מגיעים.
//   CONTACT_FROM_EMAIL — אופציונלי. עד שהדומיין moach.co מאומת ב-Resend,
//                        השולח הוא onboarding@resend.dev, ו-Resend מרשה לו
//                        לשלוח רק לכתובת שאיתה נפתח החשבון.
//
// כל מי שיודע לשלוח POST יכול לקרוא לפעולה הזו, אז הכול נבדק כאן מחדש —
// הבדיקות בדפדפן הן רק נוחות.

const FIELDS = ["name", "company", "phone", "email", "systems"] as const;
type Field = (typeof FIELDS)[number];
type Values = Record<Field, string>;

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<Field, string>>;
  // חוזר לדפדפן כדי שהטופס לא יתרוקן אחרי שגיאה.
  values?: Values;
};

const MAX_LENGTH: Record<Field, number> = { name: 100, company: 120, phone: 30, email: 200, systems: 2000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[0-9+\-\s()]{7,20}$/;

function read(formData: FormData, key: string) {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function validate(v: Values) {
  const errors: Partial<Record<Field, string>> = {};
  if (!v.name) errors.name = CONTACT.errors.name;
  if (!v.company) errors.company = CONTACT.errors.company;
  if (!EMAIL_RE.test(v.email)) errors.email = CONTACT.errors.email;
  if (v.phone && !PHONE_RE.test(v.phone)) errors.phone = CONTACT.errors.phone;
  for (const f of FIELDS) {
    if (v[f].length > MAX_LENGTH[f]) errors[f] = CONTACT.errors.tooLong;
  }
  return errors;
}

// שם וחברה נכנסים לשורת הנושא — בלי שבירות שורה.
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ");

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // מלכודת לבוטים: שדה שבן אדם לא רואה. בוט שממלא אותו מקבל "הצלחה" ולא נשלח כלום.
  if (read(formData, "website")) return { status: "success" };

  const values = Object.fromEntries(FIELDS.map((f) => [f, read(formData, f)])) as Values;
  const errors = validate(values);
  if (Object.keys(errors).length > 0) {
    return { status: "error", message: CONTACT.errors.fix, errors, values };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error("[contact] RESEND_API_KEY או CONTACT_TO_EMAIL חסרים — הליד לא נשלח");
    return { status: "error", message: CONTACT.errors.send, values };
  }

  const text = [
    "ליד חדש מ-moach.co",
    "",
    `שם: ${values.name}`,
    `חברה: ${values.company}`,
    `טלפון: ${values.phone || "—"}`,
    `מייל: ${values.email}`,
    "",
    "מערכות:",
    values.systems || "—",
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "MOACH <onboarding@resend.dev>",
        to: [to],
        // "השב" במייל עונה ישר לפונה.
        reply_to: values.email,
        subject: `ליד חדש מהאתר: ${oneLine(values.name)} · ${oneLine(values.company)}`,
        text,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error("[contact] Resend החזיר", res.status, await res.text().catch(() => ""));
      return { status: "error", message: CONTACT.errors.send, values };
    }
  } catch (err) {
    console.error("[contact] השליחה ל-Resend נכשלה", err);
    return { status: "error", message: CONTACT.errors.send, values };
  }

  return { status: "success" };
}
