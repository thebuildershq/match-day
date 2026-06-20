import { useState } from "react";
import { cn } from "../../lib/cn";
import { settle, SCHEME, type Score } from "./LivePoolCard";

interface Fixture {
  comp: string;
  kickoff: string;
  home: string;
  away: string;
  ha: string; // home abbr
  aa: string; // away abbr
  hc: string; // home badge bg
  ht: string; // home badge text
  ac: string;
  at: string;
}

const FIXTURES: Fixture[] = [
  { comp: "Premier League · Sat", kickoff: "17:30 kick-off", home: "Liverpool", away: "Man City", ha: "LIV", aa: "MCI", hc: "#c8102e", ht: "#fff", ac: "#6cabdd", at: "#0a2240" },
  { comp: "La Liga · Sun", kickoff: "21:00 kick-off", home: "Real Madrid", away: "Barcelona", ha: "RMA", aa: "FCB", hc: "#e9e9ea", ht: "#0a2240", ac: "#a50044", at: "#fff" },
  { comp: "Champions League · Wed", kickoff: "21:00 kick-off", home: "Bayern", away: "PSG", ha: "BAY", aa: "PSG", hc: "#dc052d", ht: "#fff", ac: "#0a2845", at: "#fff" },
  { comp: "Serie A · Sun", kickoff: "20:45 kick-off", home: "Inter", away: "Juventus", ha: "INT", aa: "JUV", hc: "#0068a8", ht: "#fff", ac: "#111", at: "#fff" },
  { comp: "Bundesliga · Sat", kickoff: "18:30 kick-off", home: "Dortmund", away: "Leipzig", ha: "BVB", aa: "RBL", hc: "#fde100", ht: "#111", ac: "#dd0741", at: "#fff" },
  { comp: "Ligue 1 · Sun", kickoff: "20:45 kick-off", home: "Marseille", away: "Monaco", ha: "OM", aa: "ASM", hc: "#2faee0", ht: "#06283d", ac: "#e63312", at: "#fff" },
];

// Low-biased goal counts → realistic, varied results.
const GOAL_BAG = [0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 3, 3, 4];
const rollGoal = () => GOAL_BAG[Math.floor(Math.random() * GOAL_BAG.length)];

const COPY = {
  exact: [
    "Exact scoreline. Nobody in the pool touches you this week.",
    "On the nose. That's how you win a season.",
    "Called it to the goal. Insufferable, but earned.",
  ],
  outcome: [
    "Right result, wrong score. Still on the board.",
    "You read the winner — the scoreline got greedy.",
    "Outcome banked. The exact score was always a long shot.",
  ],
  wrong: [
    "Wrong call. The table giveth, the table taketh.",
    "Nope. Football, name a more chaotic sport.",
    "Missed it. There's always next matchday.",
  ],
  wrongDraw: [
    "It finished level — and you didn't see it coming.",
    "A draw. The one result nobody ever predicts.",
  ],
};

export function PredictDemo() {
  const [fixIdx, setFixIdx] = useState(() => Math.floor(Math.random() * FIXTURES.length));
  const [h, setH] = useState(0);
  const [a, setA] = useState(0);
  const [actual, setActual] = useState<Score | null>(null);

  const f = FIXTURES[fixIdx];

  function submit() {
    setActual([rollGoal(), rollGoal()]);
  }
  function another() {
    // New fixture, never the same one twice in a row.
    let next = fixIdx;
    while (next === fixIdx) next = Math.floor(Math.random() * FIXTURES.length);
    setFixIdx(next);
    setActual(null);
    setH(0);
    setA(0);
  }

  const pts = actual ? settle([h, a], actual, SCHEME) : 0;
  const isDraw = actual ? actual[0] === actual[1] : false;
  const copy = actual
    ? pts === SCHEME.exact
      ? COPY.exact
      : pts === SCHEME.outcome
        ? COPY.outcome
        : isDraw
          ? COPY.wrongDraw
          : COPY.wrong
    : COPY.wrong;
  // Roll the line once per reveal: tie it to the actual scoreline so it's stable.
  const line = actual ? copy[(actual[0] * 7 + actual[1] * 3) % copy.length] : "";
  const verdict = actual
    ? actual[0] > actual[1]
      ? `${f.home} win`
      : actual[1] > actual[0]
        ? `${f.away} win`
        : "Draw"
    : "";

  return (
    <div className="mx-auto max-w-[46rem] rounded-3xl border border-line bg-bg p-[clamp(24px,4vw,48px)]">
      <div className="mb-[clamp(28px,4vw,40px)] flex items-center justify-between">
        <span className="inline-flex items-center rounded-full bg-ink px-[13px] py-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-bg">
          {f.comp}
        </span>
        <span className="font-serif text-[15px] italic text-muted">{f.kickoff}</span>
      </div>

      <div className="mb-[clamp(28px,4vw,40px)] flex items-center justify-between gap-[clamp(12px,3vw,32px)]">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="grid size-[clamp(44px,7vw,56px)] shrink-0 place-items-center rounded-full" style={{ background: f.hc }}>
            <span className="text-xs font-extrabold" style={{ color: f.ht }}>{f.ha}</span>
          </div>
          <span className="truncate text-[clamp(1rem,1.6vw,1.25rem)] font-bold tracking-[-0.01em]">{f.home}</span>
        </div>

        <div className="flex shrink-0 items-center gap-[clamp(8px,1.5vw,18px)]">
          <Stepper value={h} onInc={() => setH((v) => Math.min(v + 1, 9))} onDec={() => setH((v) => Math.max(v - 1, 0))} disabled={!!actual} />
          <span className="text-[clamp(1.6rem,3vw,2.2rem)] font-light text-[#c3b9a3]">–</span>
          <Stepper value={a} onInc={() => setA((v) => Math.min(v + 1, 9))} onDec={() => setA((v) => Math.max(v - 1, 0))} disabled={!!actual} />
        </div>

        <div className="flex min-w-0 flex-1 flex-row-reverse items-center gap-3">
          <div className="grid size-[clamp(44px,7vw,56px)] shrink-0 place-items-center rounded-full" style={{ background: f.ac }}>
            <span className="text-xs font-extrabold" style={{ color: f.at }}>{f.aa}</span>
          </div>
          <span className="truncate text-right text-[clamp(1rem,1.6vw,1.25rem)] font-bold tracking-[-0.01em]">{f.away}</span>
        </div>
      </div>

      {!actual ? (
        <button
          type="button"
          onClick={submit}
          className="h-[58px] w-full rounded-full bg-ink text-base font-bold tracking-[-0.01em] text-bg"
        >
          Lock in prediction
        </button>
      ) : (
        <div className="text-center">
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-faint">
            It ended {actual[0]}–{actual[1]} — {verdict}
          </div>
          <div
            className={cn(
              "mb-3.5 text-[clamp(3.4rem,9vw,5rem)] font-extrabold leading-none tabular-nums",
              pts === 0 ? "text-faint" : "text-accent",
            )}
          >
            {pts === 0 ? "0" : `+${pts}`}
          </div>
          <p className="mx-auto mb-[22px] max-w-[24rem] font-serif text-[clamp(1.1rem,2vw,1.4rem)] italic text-[#3d382e]">{line}</p>
          <button
            type="button"
            onClick={another}
            className="h-12 rounded-full border border-line px-[26px] text-[15px] font-bold text-ink"
          >
            Try another →
          </button>
        </div>
      )}

      <div className="mt-[clamp(24px,3vw,32px)] flex flex-wrap justify-center gap-5 border-t border-line pt-5 text-[13.5px] text-muted">
        <span><span className="font-extrabold text-ink">+{SCHEME.exact}</span> exact scoreline</span>
        <span><span className="font-extrabold text-ink">+{SCHEME.outcome}</span> right result</span>
        <span><span className="font-extrabold text-ink">0</span> wrong call</span>
      </div>
    </div>
  );
}

const stepBtn =
  "grid size-[38px] place-items-center rounded-full border border-line bg-bg text-xl font-medium leading-none text-ink transition-colors hover:bg-sand disabled:opacity-35 disabled:hover:bg-bg";

function Stepper({
  value,
  onInc,
  onDec,
  disabled,
}: {
  value: number;
  onInc: () => void;
  onDec: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <button type="button" aria-label="increment" onClick={onInc} disabled={disabled} className={stepBtn}>
        +
      </button>
      <div className="w-[clamp(40px,9vw,60px)] text-center text-[clamp(2.6rem,7vw,3.6rem)] font-extrabold leading-none tabular-nums">
        {value}
      </div>
      <button type="button" aria-label="decrement" onClick={onDec} disabled={disabled} className={stepBtn}>
        −
      </button>
    </div>
  );
}