import { type ReactNode } from "react";
import { Link } from "react-router";
import { cn } from "../../lib/cn";
import { Logo } from "../../components/Logo";

function AuthNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/[0.82] backdrop-blur-md">
      <div className="mx-auto flex h-[66px] max-w-[1180px] items-center justify-between px-[clamp(20px,5vw,40px)]">
        <Link to="/" aria-label="Scorepact home">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          <Link to="/#how" className="px-3.5 py-2 text-sm font-semibold text-[#3d382e]">
            How it works
          </Link>
          <Link to="/#try" className="px-3.5 py-2 text-sm font-semibold text-[#3d382e]">
            Try it
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login" className="rounded-full px-4 py-2.5 text-sm font-semibold">
            Log in
          </Link>
          <Link to="/register" className="rounded-full bg-ink px-[18px] py-2.5 text-sm font-semibold text-bg">
            Create a pool
          </Link>
        </div>
      </div>
    </header>
  );
}

export function AuthLayout({ children, aside }: { children: ReactNode; aside: ReactNode }) {
  return (
    <div data-theme="light" className="flex min-h-dvh flex-col bg-bg text-ink">
      <AuthNav />
      <main className="flex flex-1 flex-col lg:flex-row">
        <div className="flex flex-1 items-center justify-center px-[clamp(24px,5vw,56px)] py-[clamp(40px,6vw,72px)]">
          <div className="w-full max-w-[400px]">{children}</div>
        </div>
        <aside className="flex flex-col justify-center gap-7 bg-ink px-[clamp(28px,5vw,64px)] py-[clamp(44px,7vw,64px)] text-bg lg:basis-[42%]">
          {aside}
        </aside>
      </main>
    </div>
  );
}

/** Eye toggle for password inputs. */
export function PasswordToggle({ shown, onToggle }: { shown: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={shown ? "Hide password" : "Show password"}
      className="grid size-9 place-items-center rounded-full text-faint transition-colors hover:text-ink"
    >
      {shown ? (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8" />
          <path d="M9.4 5.2A9.6 9.6 0 0112 5c5 0 9 4.5 9 7-.4 1-1.2 2.2-2.3 3.2M6.1 6.6C3.8 8 2.4 9.9 2 12c.7 1.7 4 7 10 7 1.4 0 2.7-.3 3.9-.8" />
        </svg>
      ) : (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  );
}

const socialBtn =
  "flex h-[50px] flex-1 items-center justify-center gap-2 rounded-[13px] border border-line bg-surface text-sm font-bold transition-colors hover:bg-sand";

/** OAuth buttons — UI only. At wiring time these call Clerk's signIn.authenticateWithRedirect. */
export function SocialButtons({ onPick }: { onPick: (provider: "google" | "apple") => void }) {
  return (
    <div className="flex gap-2.5">
      <button type="button" className={socialBtn} onClick={() => onPick("google")}>
        <span className="text-[15px] font-black text-[#4285F4]">G</span> Google
      </button>
      <button type="button" className={socialBtn} onClick={() => onPick("apple")}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M16.4 12.8c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.8-.8-3-.8c-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.2 0 2-1.1 2.8-2.2.9-1.3 1.2-2.5 1.3-2.6-.1 0-2.5-1-2.5-3.8zM14.2 5.9c.6-.8 1.1-1.9 1-3-1 0-2.1.6-2.8 1.4-.6.7-1.1 1.8-1 2.9 1.1.1 2.2-.5 2.8-1.3z" />
        </svg>
        Apple
      </button>
    </div>
  );
}

export function Divider({ label }: { label: string }) {
  return (
    <div className="my-6 flex items-center gap-3.5">
      <div className="h-px flex-1 bg-line" />
      <span className="text-xs font-semibold text-faint">{label}</span>
      <div className="h-px flex-1 bg-line" />
    </div>
  );
}

export const primaryBtn = (variant: "ink" | "accent") =>
  cn(
    "flex h-[54px] w-full items-center justify-center rounded-full text-base font-bold transition-opacity hover:opacity-90 disabled:opacity-50",
    variant === "ink" ? "bg-ink text-bg" : "bg-accent text-white",
  );