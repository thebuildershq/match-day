import { Link } from "react-router";
import { cn } from "../../lib/cn";
import { Logo } from "../../components/Logo";
import { Marquee } from "./Marquee";
import { PredictDemo } from "./PredictDemo";
import { LivePoolCard, useLiveMatchday, ranksByTotal } from "./LivePoolCard";

const C = "mx-auto w-full max-w-[1240px] px-[clamp(20px,5vw,40px)]";

/* ---------- How-it-works step 3: dark mini leaderboard (same live match) ---------- */
const MINI_H = 40;
function MiniBoard() {
  const { players } = useLiveMatchday(3000);
  const rank = ranksByTotal(players);
  const top4 = players.filter((p) => rank[p.id] < 4);

  return (
    <div className="mt-0.5 rounded-[18px] bg-ink px-[18px] pb-4 pt-[18px]">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-bg/45">Standings · live</span>
        <span className="size-[6px] animate-pulse-soft rounded-full bg-accent" />
      </div>
      <div className="relative" style={{ height: 4 * MINI_H }}>
        {top4.map((p) => {
          const idx = rank[p.id];
          return (
            <div
              key={p.id}
              className="absolute inset-x-0 top-0 flex h-10 items-center justify-between transition-transform duration-[650ms] ease-[cubic-bezier(.2,.85,.25,1)]"
              style={{ transform: `translateY(${idx * MINI_H}px)` }}
            >
              <div className="flex items-center gap-2.5">
                <span className={cn("w-[18px] text-[11px] font-extrabold tabular-nums", idx === 0 ? "text-[#ff8c82]" : "text-bg/40")}>
                  {idx + 1}
                </span>
                <span className={cn("text-[13.5px] font-semibold", p.me ? "text-[#ff8c82]" : "text-bg")}>{p.name}</span>
              </div>
              <span className={cn("text-[13.5px] font-extrabold tabular-nums", p.me ? "text-[#ff8c82]" : "text-bg")}>{p.total}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Page ---------- */
export function Landing() {
  return (
    <div data-theme="light" className="overflow-x-hidden bg-bg text-ink">
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-line bg-bg/[0.78] backdrop-blur-md">
        <div className={cn(C, "flex h-[66px] items-center justify-between")}>
          <a href="#top">
            <Logo />
          </a>
          <nav className="flex items-center gap-1 sm:gap-2">
            <a href="#how" className="hidden px-3.5 py-2 text-sm font-semibold text-[#3d382e] md:block">
              How it works
            </a>
            <a href="#try" className="hidden px-3.5 py-2 text-sm font-semibold text-[#3d382e] md:block">
              Try it
            </a>
            <Link to="/login" className="hidden rounded-full px-4 py-2.5 text-sm font-semibold sm:block">
              Log in
            </Link>
            <Link to="/register" className="whitespace-nowrap rounded-full bg-ink px-[18px] py-2.5 text-sm font-semibold text-bg">
              Create a pool
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className={cn(C, "pb-[clamp(28px,4vw,48px)] pt-[clamp(40px,7vw,80px)]")}>
        <div className="flex flex-col gap-[clamp(32px,5vw,64px)] lg:flex-row lg:items-center">
          <div className="flex min-w-0 flex-1 flex-col items-start gap-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d8cdb6] bg-white/50 px-3.5 py-[7px]">
              <span className="size-[7px] rounded-full bg-green" />
              <span className="text-xs font-semibold uppercase tracking-[0.06em] text-muted">Invite-only football pools</span>
            </div>

            <h1 className="text-balance text-hero font-extrabold leading-[0.92] tracking-[-0.035em]">
              Call every
              <br />
              scoreline.
              <br />
              <span className="font-serif font-medium italic text-accent">Win the season.</span>
            </h1>

            <p className="max-w-[30rem] text-[clamp(1.05rem,1.6vw,1.3rem)] leading-relaxed text-muted">
              Start a private pool with your mates. Predict every matchday. Let the table settle who actually knows football —
              and hold it over them until next August.
            </p>

            <div className="flex flex-wrap gap-3 pt-1.5">
              <Link
                to="/register"
                className="inline-flex h-[54px] items-center justify-center rounded-full bg-ink px-[30px] text-base font-bold tracking-[-0.01em] text-bg"
              >
                Create a pool
              </Link>
              <a
                href="#try"
                className="inline-flex h-[54px] items-center justify-center rounded-full border border-line px-7 text-base font-bold"
              >
                Try a prediction →
              </a>
            </div>

            <div className="flex items-center gap-3.5 pt-2.5">
              <div className="flex">
                {["bg-accent", "bg-green", "bg-[#2a64c4]"].map((c) => (
                  <span key={c} className={cn("-mr-2.5 size-[34px] rounded-full ring-[2.5px] ring-bg", c)} />
                ))}
                <span className="grid size-[34px] place-items-center rounded-full bg-ink ring-[2.5px] ring-bg">
                  <span className="text-[11px] font-bold text-bg">+9</span>
                </span>
              </div>
              <span className="text-[13.5px] leading-snug text-muted">
                Pools running across the
                <br />
                Premier League, La Liga &amp; UCL
              </span>
            </div>
          </div>

          <div className="w-full min-w-0 lg:max-w-[480px] lg:flex-1">
            <LivePoolCard />
          </div>
        </div>
      </section>

      <Marquee />

      {/* HOW IT WORKS */}
      <section id="how" className={cn(C, "py-[clamp(64px,9vw,120px)]")}>
        <div className="mb-[clamp(40px,6vw,72px)] max-w-[40rem]">
          <div className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-faint">How it works</div>
          <h2 className="text-display font-extrabold leading-[1.02] tracking-[-0.03em]">
            Three steps.
            <br />
            <span className="font-serif font-medium italic">One winner.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-[clamp(24px,3vw,40px)] sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-3.5">
            <div className="text-[13px] font-extrabold tabular-nums text-accent">01</div>
            <h3 className="text-[clamp(1.3rem,2vw,1.65rem)] font-bold tracking-[-0.02em]">Create a pool</h3>
            <p className="text-[15.5px] leading-relaxed text-muted">
              Name it, pick a league, drop one invite link in the group chat. Friends only — no strangers, no money.
            </p>
          </div>
          <div className="flex flex-col gap-3.5">
            <div className="text-[13px] font-extrabold tabular-nums text-accent">02</div>
            <h3 className="text-[clamp(1.3rem,2vw,1.65rem)] font-bold tracking-[-0.02em]">Predict every matchday</h3>
            <p className="text-[15.5px] leading-relaxed text-muted">
              Call the exact scoreline for every fixture before kickoff. Predictions lock the second the whistle blows.
            </p>
          </div>
          <div className="flex flex-col gap-3.5">
            <div className="text-[13px] font-extrabold tabular-nums text-accent">03</div>
            <h3 className="text-[clamp(1.3rem,2vw,1.65rem)] font-bold tracking-[-0.02em]">Watch the table move</h3>
            <MiniBoard />
          </div>
        </div>
      </section>

      {/* PREDICT DEMO */}
      <section id="try" className="border-y border-line bg-surface">
        <div className={cn(C, "py-[clamp(64px,9vw,120px)]")}>
          <div className="mx-auto mb-[clamp(36px,5vw,56px)] max-w-[38rem] text-center">
            <div className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-faint">Try it · no signup</div>
            <h2 className="text-display font-extrabold leading-[1.04] tracking-[-0.03em]">Call this one.</h2>
            <p className="mt-3.5 text-[clamp(1rem,1.5vw,1.2rem)] leading-relaxed text-muted">
              Set a scoreline, lock it in, and see what you'd have banked last weekend.
            </p>
          </div>
          <PredictDemo />
        </div>
      </section>

      {/* MOBILE SHOWCASE */}
      <section className={cn(C, "py-[clamp(64px,9vw,120px)]")}>
        <div className="flex flex-col items-center gap-[clamp(40px,6vw,80px)] lg:flex-row">
          <div className="min-w-0 flex-1">
            <div className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-faint">In your pocket</div>
            <h2 className="mb-5 text-display font-extrabold leading-[1.02] tracking-[-0.03em]">
              Predict from the
              <br />
              stands, the sofa,
              <br />
              <span className="font-serif font-medium italic">the group chat.</span>
            </h2>
            <p className="mb-7 max-w-[28rem] text-[clamp(1rem,1.5vw,1.2rem)] leading-relaxed text-muted">
              Push notifications before deadline. Live table the moment full-time hits. The whole season, in your pocket.
            </p>
            <div className="flex flex-col gap-4">
              {[
                ["Deadline pings.", "Never miss a matchday again."],
                ["Live rank flips", "as scores roll in."],
                ["Banter built in", "— react to every call."],
              ].map(([b, rest]) => (
                <div key={b} className="flex items-start gap-3.5">
                  <span className="text-lg font-extrabold leading-[1.3] text-accent">↳</span>
                  <span className="text-[15.5px] leading-snug text-[#3d382e]">
                    <b className="text-ink">{b}</b> {rest}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* phone mock */}
          <div className="relative flex min-w-0 flex-1 justify-center">
            <div className="absolute right-[8%] top-[18px] z-[3] max-w-[180px] animate-[sp-float_5s_ease-in-out_infinite] rounded-[14px] bg-ink px-4 py-[11px] text-bg shadow-[0_16px_30px_-12px_rgba(24,21,15,0.5)]">
              <div className="mb-0.5 text-[11px] font-bold tracking-[0.04em] text-[#7ee2a6]">▲ +3 BANKED</div>
              <div className="text-[12.5px] leading-snug">You called Madrid 2–1. You're up to 2nd.</div>
            </div>

            <div className="relative aspect-[300/620] w-[300px] max-w-[84vw] rounded-[44px] bg-ink p-[11px] shadow-[0_40px_80px_-30px_rgba(24,21,15,0.55)]">
              <div className="absolute left-1/2 top-[22px] z-[4] h-[26px] w-24 -translate-x-1/2 rounded-full bg-ink" />
              <div className="flex h-full flex-col overflow-hidden rounded-[34px] bg-bg">
                <div className="flex items-center justify-between px-5 pb-2.5 pt-4">
                  <span className="text-xs font-bold">9:41</span>
                  <span className="text-[11px] font-semibold text-faint">●●● ▮</span>
                </div>
                <div className="px-5 pb-3.5 pt-1.5">
                  <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-faint">The Group Chat XI</div>
                  <div className="mt-0.5 text-[22px] font-extrabold tracking-[-0.02em]">Matchday 24</div>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="size-[6px] animate-pulse-soft rounded-full bg-accent" />
                    <span className="text-xs font-semibold text-muted">3 fixtures live</span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-2.5 px-3.5">
                  <div className="rounded-[16px] border border-hair bg-surface px-3.5 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[13.5px] font-bold">Madrid</span>
                      <span className="flex gap-1.5">
                        <span className="grid h-[30px] w-[26px] place-items-center rounded-[7px] bg-ink text-[15px] font-extrabold text-bg">2</span>
                        <span className="grid h-[30px] w-[26px] place-items-center rounded-[7px] bg-ink text-[15px] font-extrabold text-bg">1</span>
                      </span>
                      <span className="text-[13.5px] font-bold">Arsenal</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-green">● Locked · live</span>
                      <span className="text-[11px] text-faint">78&apos;</span>
                    </div>
                  </div>
                  <div className="rounded-[16px] border border-hair bg-surface px-3.5 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[13.5px] font-bold">Bayern</span>
                      <span className="flex gap-1.5">
                        <span className="grid h-[30px] w-[26px] place-items-center rounded-[7px] border border-line bg-bg text-[15px] font-extrabold">1</span>
                        <span className="grid h-[30px] w-[26px] place-items-center rounded-[7px] border border-line bg-bg text-[15px] font-extrabold">1</span>
                      </span>
                      <span className="text-[13.5px] font-bold">PSG</span>
                    </div>
                    <div className="mt-2 text-[11px] font-semibold text-faint">Locks in 2h 14m</div>
                  </div>
                  <div className="flex items-center justify-between rounded-[16px] bg-ink px-[15px] py-3">
                    <span className="text-[13px] font-semibold text-bg">Your rank</span>
                    <span className="text-[15px] font-extrabold text-bg">
                      2<span className="align-super text-[11px]">nd</span> <span className="text-[12px] text-[#7ee2a6]">▲ +3</span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-hair px-[30px] pb-4 pt-3">
                  <span className="text-[11px] font-bold text-ink">Predict</span>
                  <span className="text-[11px] font-semibold text-faint">Table</span>
                  <span className="text-[11px] font-semibold text-faint">Pools</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RIVALRY */}
      <section className="bg-ink text-bg">
        <div className={cn(C, "py-[clamp(72px,11vw,150px)] text-center")}>
          <div className="mb-6 text-xs font-bold uppercase tracking-[0.14em] text-bg/40">Friendly rivalry</div>
          <h2 className="mx-auto max-w-[18ch] text-balance text-[clamp(2.6rem,8vw,6rem)] font-extrabold leading-[0.94] tracking-[-0.04em]">
            Talk is cheap. <span className="font-serif font-medium italic text-[#ff8c82]">The table doesn't lie.</span>
          </h2>
          <p className="mx-auto mb-[38px] mt-6 max-w-[34rem] text-[clamp(1.1rem,2vw,1.4rem)] leading-relaxed text-bg/60">
            Settle every argument. Win every gameweek. Then hold it over them until next August.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/register"
              className="inline-flex h-14 items-center justify-center rounded-full bg-bg px-8 text-base font-bold text-ink"
            >
              Create a pool — it's free
            </Link>
            <a
              href="#how"
              className="inline-flex h-14 items-center justify-center rounded-full border border-bg/25 px-7 text-base font-bold text-bg"
            >
              See how it works
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-bg pb-[clamp(32px,4vw,48px)] pt-[clamp(48px,7vw,80px)]">
        <div className={C}>
          <div className="mb-12 flex flex-wrap justify-between gap-[clamp(32px,5vw,64px)]">
            <div className="max-w-[22rem] flex-1 basis-[280px]">
              <a href="#top" className="mb-3.5 inline-flex">
                <Logo />
              </a>
              <p className="max-w-[20rem] text-[14.5px] leading-relaxed text-muted">
                Private football prediction pools. For the rivalry, not the money.
              </p>
            </div>
            <div className="flex flex-wrap gap-[clamp(32px,5vw,72px)]">
              <FooterCol
                title="Product"
                links={[
                  ["How it works", "#how"],
                  ["Try it", "#try"],
                ]}
              />
              <FooterCol
                title="Company"
                links={[
                  ["About", "#"],
                  ["Contact", "#"],
                ]}
              />
              <FooterCol
                title="Legal"
                links={[
                  ["Privacy", "#"],
                  ["Terms", "#"],
                ]}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-7">
            <span className="text-[13.5px] text-faint">© 2026 Scorepact. All rights reserved.</span>
            <span className="font-serif text-[14.5px] italic text-muted">Made for football fans.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.1em] text-faint">{title}</div>
      <div className="flex flex-col items-start gap-2.5">
        {links.map(([label, href]) => (
          <a key={label} href={href} className="text-[14.5px] font-medium">
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}