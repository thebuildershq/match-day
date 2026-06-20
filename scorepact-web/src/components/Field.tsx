import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  /** right-aligned node beside the label (e.g. a "Forgot?" link) */
  labelAside?: ReactNode;
  /** node rendered inside the input on the right (e.g. password toggle) */
  trailing?: ReactNode;
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, id, error, labelAside, trailing, className, ...props },
  ref,
) {
  return (
    <div className="mb-[18px]">
      <div className="mb-[9px] flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-bold uppercase tracking-[0.08em] text-faint">
          {label}
        </label>
        {labelAside}
      </div>
      <div className="relative">
        <input
          ref={ref}
          id={id}
          aria-invalid={!!error}
          className={cn(
            "h-[52px] w-full rounded-[13px] border bg-surface px-[18px] text-[15px] font-semibold outline-none transition-colors placeholder:font-medium placeholder:text-faint focus:border-ink",
            error ? "border-accent" : "border-line",
            trailing && "pr-[52px]",
            className,
          )}
          {...props}
        />
        {trailing && <div className="absolute inset-y-0 right-2 flex items-center">{trailing}</div>}
      </div>
      {error && <p className="mt-1.5 text-[12.5px] font-semibold text-accent">{error}</p>}
    </div>
  );
});