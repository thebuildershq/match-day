import { useEffect, useState } from "react";
import { cn } from "../../lib/cn";

export type Score = [number, number];
export interface Scheme {
  exact: number;
  outcome: number;
}
export const SCHEME: Scheme = { exact: 3, outcome: 1 };

/** Points a prediction earns against an actual scoreline. */
export function settle(call: Score, actual: Score, s: Scheme = SCHEME): number {
  if (call[0] === actual[0] && call[1] === actual[1]) return s.exact;
  return Math.sign(call[0] - call[1]) === Math.sign(actual[0] - actual[1]) ? s.outcome : 0;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

interface RosterEntry {
  id: string;
  name: string;
  base: number;
  call: Score;
  me?: boolean;
}

// Fixed roster + calls. Everything on screen derives from these + the live score,
// so the fixture, your points, and the table can never disagree.
const ROSTER: RosterEntry[] = [
  { id: "dela", name: "Dela", base: 31, call: [2, 1] },
  { id: "ama", name: "Ama", base: 30, call: [1, 1] },
  { id: "you", name: "You", base: 28, call: [2, 1], me: true },
  { id: "kojo", name: "Kojo", base: 27, call: [5, 0] },
  { id: "tunde", name: "Tunde", base: 25, call: [0, 0] },
];

// One real match, replayed. 0–0 → 1–0 → 1–1 → 2–1 (full time).
const TIMELINE: { minute: number; score: Score }[] = [
  { minute: 12, score: [0, 0] },
  { minute: 31, score: [1, 0] },
  { minute: 58, score: [1, 1] },
  { minute: 79, score: [2, 1] },
];

export interface LivePlayer extends RosterEntry {
  total: number;
}

export function useLiveMatchday(stepMs = 2600) {
  const [i, setI] = useState(0);
  const finished = i >= TIMELINE.length - 1;

  useEffect(() => {
    if (prefersReducedMotion()) {
      setI(TIMELINE.length - 1);
      return;
    }
    // Hold longer on full time before replaying the same match.
    const wait = finished ? stepMs * 1.8 : stepMs;
    const t = setTimeout(() => setI((p) => (p >= TIMELINE.length - 1 ? 0 : p + 1)), wait);
    return () => clearTimeout(t);
  }, [i, finished, stepMs]);

  const cur = TIMELINE[i];
  const players: LivePlayer[] = ROSTER.map((p) => ({ ...p, total: p.base + settle(p.call, cur.score) }));
  const me = players.find((p) => p.me)!;

  return {
    minute: cur.minute,
    home: cur.score[0],
    away: cur.score[1],
    finished,
    players,
    youCall: me.call,
    youPts: settle(me.call, cur.score),
  };
}

/** id -> rank index (0 = top), sorted by total desc, base as stable tiebreak. */
export function ranksByTotal(players: LivePlayer[]): Record<string, number> {
  const sorted = [...players].sort((a, b) => b.total - a.total || b.base - a.base);
  const map: Record<string, number> = {};
  sorted.forEach((p, idx) => (map[p.id] = idx));
  return map;
}

const ROW_H = 52;

export function LivePoolCard() {
  const { minute, home, away, finished, players, youCall, youPts } = useLiveMatchday();
  const rank = ranksByTotal(players);

  const youLabel = finished
    ? `banked +${youPts}`
    : youPts === SCHEME.exact
      ? "on for +3 ▲"
      : youPts === SCHEME.outcome
        ? "on for +1"
        : "level — needs a Madrid winner";

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-[0_30px_60px_-28px_rgba(24,21,15,0.35)]">
      {/* head */}
      <div className="flex items-center justify-between border-b border-hair px-[22px] py-[18px]">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-faint">Pool</div>
          <div className="mt-0.5 text-[17px] font-bold tracking-[-0.02em]">The Group Chat XI</div>
        </div>
        <span className="font-serif text-sm italic text-muted">UCL · QF</span>
      </div>

      {/* live fixture (always-dark strip) */}
      <div className="bg-ink px-[22px] py-[22px] text-bg">
        <div className="mb-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-[7px] text-[11px] font-bold uppercase tracking-[0.08em] text-[#ff8c82]">
            <span className={cn("size-[7px] rounded-full bg-accent", !finished && "animate-pulse-soft")} />
            {finished ? "Full time" : `Live · ${minute}'`}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-bg/45">Madrid v Arsenal</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-[11px]">
            <div className="grid size-10 shrink-0 place-items-center rounded-full bg-bg">
              <span className="text-[11px] font-extrabold text-ink">RMA</span>
            </div>
            <span className="text-[15px] font-bold">Real Madrid</span>
          </div>
          <div className="text-[34px] font-extrabold tabular-nums tracking-[-0.02em]">
            {home}
            <span className="mx-1.5 text-bg/35">–</span>
            {away}
          </div>
          <div className="flex items-center gap-[11px]">
            <span className="text-[15px] font-bold">Arsenal</span>
            <div className="grid size-10 shrink-0 place-items-center rounded-full bg-accent">
              <span className="text-[11px] font-extrabold text-white">ARS</span>
            </div>
          </div>
        </div>
        <div className="mt-3.5 flex items-center justify-between border-t border-bg/10 pt-[13px]">
          <span className="text-[12.5px] text-bg/55">
            Your call: <span className="font-bold text-bg">{youCall[0]}–{youCall[1]}</span>
          </span>
          <span className={cn("text-[12.5px] font-bold", youPts > 0 ? "text-[#7ee2a6]" : "text-bg/45")}>{youLabel}</span>
        </div>
      </div>

      {/* live table */}
      <div className="px-[22px] pb-[22px] pt-5">
        <div className="mb-3.5 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-faint">Live table</span>
          <span className="text-[11px] font-semibold text-faint">Matchday 24</span>
        </div>
        <div className="relative" style={{ height: players.length * ROW_H }}>
          {players.map((p) => {
            const idx = rank[p.id];
            return (
              <div
                key={p.id}
                className="absolute inset-x-0 top-0 flex h-[52px] items-center justify-between transition-transform duration-[650ms] ease-[cubic-bezier(.2,.85,.25,1)] will-change-transform"
                style={{ transform: `translateY(${idx * ROW_H}px)` }}
              >
                <div className="flex items-center gap-[13px]">
                  <span
                    className={cn(
                      "grid size-[22px] place-items-center rounded-md text-[11px] font-extrabold tabular-nums",
                      idx === 0 ? "bg-accent text-white" : p.me ? "bg-ink text-bg" : "bg-sand text-muted",
                    )}
                  >
                    {idx + 1}
                  </span>
                  <span className="text-[14.5px] font-semibold">{p.name}</span>
                  {p.me && (
                    <span className="rounded-full border border-[#f3c9c4] px-[7px] py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] text-accent">
                      You
                    </span>
                  )}
                </div>
                <span className={cn("text-[15px] font-extrabold tabular-nums", p.me ? "text-accent" : "text-ink")}>
                  {p.total}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}