import type { SourceKey } from "@/lib/content";

// אייקונים גנריים בלבד. הבריף אוסר לוגואים של מוצרים אמיתיים (פריוריטי, SAP,
// וואטסאפ) — לוגו של מותג רומז על שותפות או חיבור רשמי שאין לנו.
// SVG ידני ולא ספרייה: שמונה אייקונים לא מצדיקים תלות חדשה.

const PATHS: Record<SourceKey, React.ReactNode> = {
  // מסד נתונים
  erp: (
    <>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
      <path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
    </>
  ),
  // סיכה במפה — ביקורים ומסלולים
  field: (
    <>
      <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  // חנות — רשתות
  chains: (
    <>
      <path d="M4 10v10h16V10" />
      <path d="M2 10l2-6h16l2 6z" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  // מעטפה
  email: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  // בועת שיחה — גנרית, לא הלוגו של וואטסאפ
  chat: <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />,
  // שפופרת
  phone: (
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  ),
  // מכולה
  shipping: (
    <>
      <path d="M3 7l9-4 9 4v10l-9 4-9-4z" />
      <path d="M3 7l9 4 9-4" />
      <path d="M12 11v10" />
    </>
  ),
  // מסמך
  files: (
    <>
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <path d="M14 3v6h6" />
      <path d="M8 13h8M8 17h5" />
    </>
  ),
};

export function SourceIcon({ name, className = "" }: { name: SourceKey; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {PATHS[name]}
    </svg>
  );
}
