import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { cn } from "../../lib/cn";
import { useStore } from "../../lib/store";
import { settle, type Score } from "../../lib/scoring";
import { WORLD_PLAYERS, WORLD_FIXTURES, OTHER_GAINS, PLAYED, MATCHDAY } from "../../lib/world";
import { StandingsBoard, type StandingRow } from "../../components/StandingsBoard";
import { EmptyState } from "../../components/states";

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const ordinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export function Table() {
  const location = useLocation();
  const { active } = useStore();
  const [banner, setBanner] = useState(Boolean((location.state as { justLocked?: boolean } | null)?.justLocked));
  const [view, setView] = useState<"season" | "matchday">("season");
  const [settled, setSettled] = useState(0); // played fixtures applied so far

  useEffect(() => {
    if (reduced()) {
      setSettled(PLAYED.length);
      return;
    }
    if (settled >= PLAYED.length) return;
    const id = setTimeout(() => setSettled((n) => n + 1), settled === 0 ? 900 : 2800);
    return () => clearTimeout(id);
  }, [settled]);

  useEffect(() => {
    if (!banner) return;
    const id = setTimeout(() => setBanner(false), 6000);
    return () => clearTimeout(id);
  }, [banner]);

  if (!active.hasWorld) {
    return (
      <EmptyState
        title="The table's empty — for now"
        body={`Once ${active.pool.name} plays its first matchday, results settle here automatically.`}
        action={
          <Link to="/app/predict" className="h-11 rounded-full bg-ink px-6 text-sm font-bold leading-[2.75rem] text-bg">
            Make your predictions
          </Link>
        }
      />
    );
  }

  const myPreds = active.predictions;
  const applied = PLAYED.slice(0, settled);

  // Your gain for a played fixture = your real prediction settled against the actual.
  const myGain = (id: string, actual: Score) => {
    const p = myPreds[id];
    return p ? settle([p.h, p.a], actual) : 0;
  };

  const mdGain: Record<string, number> = {};
  const lastForm: Record<string, number> = {};
  for (const fx of applied) {
    const actual = fx.actual!;
    for (const pl of WORLD_PLAYERS) {
      const g = pl.me ? myGain(fx.id, actual) : OTHER_GAINS[fx.id]?.[pl.id] ?? 0;
      if (g) {
        mdGain[pl.id] = (mdGain[pl.id] ?? 0) + g;
        lastForm[pl.id] = g;
      }
    }
  }

  const enriched = WORLD_PLAYERS.map((p) => {
    const season = p.base + (mdGain[p.id] ?? 0);
    const md = mdGain[p.id] ?? 0;
    return { ...p, season, md, value: view === "season" ? season : md };
  });
  const sorted = [...enriched].sort((a, b) => b.value - a.value || b.season - a.season);
  const rankById: Record<string, number> = {};
  sorted.forEach((p, i) => (rankById[p.id] = i));

  const rows: StandingRow[] = enriched.map((p) => ({
    id: p.id,
    name: p.name,
    color: p.color,
    initials: p.name === "You" ? "YO" : p.name.slice(0, 2).toUpperCase(),
    rank: rankById[p.id],
    value: p.value,
    form: lastForm[p.id] ? `+${lastForm[p.id]}` : "–",
    me: p.me,
  }));

  const me = enriched.find((p) => p.me)!;
  const myRank = rankById["me"];
  const leaderSeason = Math.max(...enriched.map((p) => p.season));
  const gap = leaderSeason - me.season;
  const myExacts = applied.filter((fx) => myGain(fx.id, fx.actual!) === 3).length;
  const live = settled < PLAYED.length;
  const noPicks = Object.keys(myPreds).length === 0;

  return (
    <div className="px-[clamp(22px,4vw,44px)] pb-12 pt-[clamp(24px,3.5vw,40px)]">
      {banner && (
        <div className="mb-6 flex items-center gap-3 rounded-[14px] bg-ink px-[18px] py-3.5 text-bg">
          <span className="size-2 shrink-0 animate-pulse-soft rounded-full bg-accent" />
          <span className="text-sm font-semibold">Predictions locked. Results are rolling in — watch the table move.</span>
        </div>
      )}
      {!banner && noPicks && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-line bg-surface px-[18px] py-3">
          <span className="text-sm text-muted">You haven't predicted Matchday {MATCHDAY} yet — that's why you're not on the board.</span>
          <Link to="/app/predict" className="text-sm font-bold text-accent">
            Predict now →
          </Link>
        </div>
      )}

      <div className="mb-2 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.1em] text-faint">{active.pool.name}</div>
          <h1 className="text-[clamp(1.7rem,3.2vw,2.5rem)] font-extrabold leading-none tracking-[-0.03em]">The table doesn't lie.</h1>
        </div>
        <div className="flex gap-1.5 rounded-[11px] bg-sand p-1">
          {(["season", "matchday"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={cn(
                "h-[34px] rounded-lg px-4 text-[13px] font-bold transition-shadow",
                view === v ? "bg-surface text-ink shadow-[0_1px_3px_rgba(0,0,0,0.12)]" : "bg-transparent text-muted",
              )}
            >
              {v === "season" ? "Season" : `Matchday ${MATCHDAY}`}
            </button>
          ))}
        </div>
      </div>

      <div className="my-[22px] grid grid-cols-[repeat(auto-fit,minmax(135px,1fr))] gap-3.5">
        <StatCard dark label="Your rank">
          <span className="text-[38px] font-extrabold leading-none tracking-[-0.02em]">{ordinal(myRank + 1)}</span>
          <span className="text-[13px] font-bold text-[#7ee2a6]">{live ? "▲ live" : myRank === 0 ? "top" : "final"}</span>
        </StatCard>
        <StatCard label="Points">
          <span className="text-[38px] font-extrabold leading-none tracking-[-0.02em] text-accent">{me.season}</span>
        </StatCard>
        <StatCard label="Exact calls">
          <span className="text-[38px] font-extrabold leading-none tracking-[-0.02em]">{myExacts}</span>
        </StatCard>
        <StatCard label="To 1st">
          <span className="text-[38px] font-extrabold leading-none tracking-[-0.02em]">{gap === 0 ? "—" : `−${gap}`}</span>
        </StatCard>
      </div>

      <div className="mb-4 flex items-center gap-2.5 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
        <span className="shrink-0 text-[11px] font-bold uppercase tracking-[0.1em] text-faint">Results</span>
        {WORLD_FIXTURES.map((fx, i) => {
          const isSettled = fx.actual !== null && i < settled;
          return (
            <span
              key={fx.id}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-bold transition-colors",
                isSettled ? "border-ink/15 bg-surface text-ink" : "border-line bg-transparent text-faint",
                i === settled - 1 && "border-accent",
              )}
            >
              {isSettled && <span className="text-[9px] font-extrabold uppercase tracking-[0.05em] text-green">FT</span>}
              {fx.homeAbbr} <span className="tabular-nums">{fx.actual && isSettled ? `${fx.actual[0]}–${fx.actual[1]}` : "–"}</span> {fx.awayAbbr}
            </span>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-[18px] border border-line bg-surface">
        <div className="flex items-center justify-between border-b border-hair px-[22px] py-[15px]">
          <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-faint">Standings</span>
          <span className={cn("inline-flex items-center gap-[7px] text-[11px] font-bold", live ? "text-accent" : "text-faint")}>
            {live && <span className="size-1.5 animate-pulse-soft rounded-full bg-accent" />}
            {live ? "LIVE" : "FINAL"}
          </span>
        </div>
        <div className="py-2">
          <StandingsBoard rows={rows} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, children, dark }: { label: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <div className={cn("rounded-2xl px-5 py-[18px]", dark ? "bg-ink text-bg" : "border border-line bg-surface")}>
      <div className={cn("mb-2 text-[11px] font-bold uppercase tracking-[0.08em]", dark ? "text-bg/45" : "text-faint")}>{label}</div>
      <div className="flex items-baseline gap-2">{children}</div>
    </div>
  );
}