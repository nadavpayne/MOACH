import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "מוח — המוח התפעולי של המסעדה שלך",
  description:
    "מוח קורא את כל נתוני התפעול של המסעדה שלך ומריץ עבורך תחזית ביקוש, שיבוץ כוח אדם, הזמנות מלאי ושכר.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} h-full scroll-smooth antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
