import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "700", "800", "900"],
});

// זמני לשלב א — הנוסח המלא, OG ותמונת שיתוף בשלב ב. הוחלף כבר עכשיו כי
// "המסעדה שלך" בכותרת הטאב היה סותר את כל העמוד.
export const metadata: Metadata = {
  title: "מוח — מוח אחד שיודע הכול על העסק",
  description:
    "מוח מחבר את כל מקורות המידע של העסק למקום אחד, ומעליהם ממשק שבו שואלים שאלה בעברית ומקבלים תשובה מבוססת נתונים עם הפניה למקור.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} h-full scroll-smooth antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
