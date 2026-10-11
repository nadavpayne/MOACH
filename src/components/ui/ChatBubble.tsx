import type { ReactNode } from "react";

// בועת צ'אט משותפת ל-Hero ולהדגמת יום המסירה.
// "question" = מה שהמשתמש שואל, "answer" = מה שהמוח עונה.
//
// ב-RTL השאלה יושבת בצד ימין (הצד של "אני"), והתשובה משמאל — הכיוון ההפוך
// מממשקי צ'אט באנגלית. justify-start/end כבר מתהפכים לבד תחת dir="rtl".
export function ChatBubble({
  role,
  children,
  className = "",
}: {
  role: "question" | "answer";
  children: ReactNode;
  className?: string;
}) {
  const isQuestion = role === "question";
  return (
    <div className={`flex ${isQuestion ? "justify-start" : "justify-end"} ${className}`}>
      <div
        className={`max-w-[88%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed md:max-w-[80%] ${
          isQuestion
            ? "rounded-ss-sm bg-accent-strong text-white"
            : "rounded-se-sm border border-border-strong bg-surface text-foreground"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
