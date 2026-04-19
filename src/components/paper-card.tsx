import { ReactNode } from "react";

type PaperCardProps = {
  title?: string;
  description?: string;
  tone?: "paper" | "rose" | "sage" | "sand" | "blush";
  className?: string;
  children: ReactNode;
};

const toneClassMap: Record<NonNullable<PaperCardProps["tone"]>, string> = {
  paper: "bg-[var(--paper)]",
  rose: "bg-[var(--paper-rose)]",
  sage: "bg-[var(--paper-sage)]",
  sand: "bg-[var(--paper-sand)]",
  blush: "bg-[var(--paper-blush)]",
};

export function PaperCard({
  title,
  description,
  tone = "paper",
  className = "",
  children,
}: PaperCardProps) {
  return (
    <section
      className={`rounded-[32px] border border-white/70 p-6 shadow-[var(--shadow-soft)] backdrop-blur-sm sm:p-7 ${toneClassMap[tone]} ${className}`}
    >
      {(title || description) && (
        <header className="mb-5">
          {title && <h2 className="text-2xl font-semibold tracking-tight text-[var(--ink)]">{title}</h2>}
          {description && <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--ink-soft)]">{description}</p>}
        </header>
      )}
      {children}
    </section>
  );
}
