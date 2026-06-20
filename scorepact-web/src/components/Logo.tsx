import { cn } from "../lib/cn";

interface LogoProps {
  withWordmark?: boolean;
  className?: string;
  /** ring color around the accent dot — match the surface it sits on */
  ringClass?: string;
}

export function Logo({ withWordmark = true, className, ringClass = "ring-bg" }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative grid size-[30px] shrink-0 place-items-center rounded-lg bg-ink">
        <span className="text-base font-black leading-none text-bg">S</span>
        <span className={cn("absolute -right-[3px] -top-[3px] size-[9px] rounded-full bg-accent ring-2", ringClass)} />
      </span>
      {withWordmark && <span className="text-lg font-extrabold tracking-[-0.03em]">Scorepact</span>}
    </span>
  );
}