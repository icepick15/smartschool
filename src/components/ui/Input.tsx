"use client";

import { forwardRef } from "react";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  label?: string;
  error?: string;
  hint?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, prefix, suffix, className = "", id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    const hasError = !!error;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-ink-3 text-xs font-medium tracking-wide uppercase"
            style={{ fontFamily: "var(--font-dm-mono)" }}
          >
            {label}
          </label>
        )}

        <div
          className={[
            "flex items-center gap-2",
            "h-12 px-4 rounded-xl",
            "bg-elevated border",
            "transition-colors duration-150",
            "focus-within:border-primary",
            hasError ? "border-danger" : "border-border",
          ].join(" ")}
        >
          {prefix && (
            <span className="text-ink-4 shrink-0">{prefix}</span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={[
              "flex-1 bg-transparent outline-none",
              "text-ink text-sm placeholder:text-ink-5",
              className,
            ].join(" ")}
            style={{ fontFamily: "var(--font-dm-sans)" }}
            {...props}
          />

          {suffix && (
            <span className="text-ink-4 shrink-0">{suffix}</span>
          )}
        </div>

        {(error || hint) && (
          <p
            className={["text-xs", hasError ? "text-danger" : "text-ink-4"].join(" ")}
            style={{ fontFamily: "var(--font-dm-mono)" }}
          >
            {error ?? hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
