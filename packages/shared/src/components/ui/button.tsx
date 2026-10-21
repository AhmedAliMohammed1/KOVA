import * as React from "react";
import { cn } from "@/lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outline" | "ghost" | "secondary" | "destructive";
};

export function Button({ className, variant = "solid", ...props }: Props) {
  return (
    <button
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-xs border px-6 text-[11px] font-bold uppercase tracking-[.14em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-700)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45 active:scale-[0.99]",
        variant === "solid" &&
          "border-[var(--brand-950)] bg-[var(--brand-950)] text-white hover:border-[var(--brand-700)] hover:bg-[var(--brand-700)]",
        variant === "secondary" &&
          "border-[var(--border-subtle)] bg-white text-[var(--brand-950)] hover:border-[var(--brand-700)] hover:bg-[var(--brand-surface)]",
        variant === "outline" &&
          "border-current bg-transparent hover:bg-black/5",
        variant === "ghost" &&
          "border-transparent bg-transparent hover:bg-black/5",
        variant === "destructive" &&
          "border-[#a5472f] bg-[#a5472f] text-white hover:bg-[#813320]",
        className,
      )}
      {...props}
    />
  );
}
