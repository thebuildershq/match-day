import { cn } from "../lib/cn";

export interface Fixture {
  id: string;
  home: string;
  homeAbbr: string;
  homeColor: string;
  homeText: string;
  away: string;
  awayAbbr: string;
  awayColor: string;
  awayText: string;
  kickoff: string; // display label e.g. "Sat 12:30"
  lockInHours: number; // hours from app open until this fixture locks (demo)
}

export interface Prediction {
  h: number;
  a: number;
}

function Crest({ color, text, abbr }: { color: string; text: string; abbr: string }) {
  return (
    <span
      className="grid size-[42px] shrink-0 place-items-center rounded-full shadow-[inset_0_0_0_1px_rgba(24,21,15,0.1)]"
      style={{ background: color }}
    >
      <span className="text-[11px] font-extrabold" style={{ color: text }}>
        {abbr}
      </span>
    </span>
  );
}

const miniBtn =
  "grid size-[30px] place-items-center rounded-full border border-line bg-surface text-[17px] font-medium leading-none text-ink transition-colors hover:bg-sand disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-surface";

function ScoreColumn({
  value,
  locked,
  onInc,
  onDec,
}: {
  value: number | null;
  locked: boolean;
  onInc: () => void;
  onDec: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      {!locked && (
        <button type="button" aria-label="increment" onClick={onInc} className={miniBtn}>
          +
        </button>
      )}
      <span
        className={cn("w-[30px] text-center text-[30px] font-extrabold leading-none tabular-nums", value === null ? "text-[#c3b9a3]" : "text-ink")}
      >
        {value === null ? "–" : value}
      </span>
      {!locked && (
        <button type="button" aria-label="decrement" onClick={onDec} className={miniBtn}>
          −
        </button>
      )}
    </div>
  );
}

export function FixtureCard({
  fx,
  pred,
  locked,
  onScore,
}: {
  fx: Fixture;
  pred?: Prediction;
  locked: boolean;
  onScore: (side: "h" | "a", delta: number) => void;
}) {
  const predicted = !!pred;
  return (
    <div
      className={cn(
        "rounded-[18px] border-[1.5px] bg-surface px-[18px] pb-5 pt-[18px] transition-colors",
        locked ? "border-line opacity-90" : predicted ? "border-ink" : "border-line",
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[11px] font-bold text-faint">{fx.kickoff}</span>
        {locked ? (
          <span className="text-[10px] font-extrabold uppercase tracking-[0.05em] text-faint">🔒 Locked</span>
        ) : predicted ? (
          <span className="text-[10px] font-extrabold uppercase tracking-[0.05em] text-green">● Predicted</span>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-2.5">
        <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
          <Crest color={fx.homeColor} text={fx.homeText} abbr={fx.homeAbbr} />
          <span className="text-center text-[12.5px] font-bold leading-tight">{fx.home}</span>
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          <ScoreColumn value={pred ? pred.h : null} locked={locked} onInc={() => onScore("h", 1)} onDec={() => onScore("h", -1)} />
          <span className="text-xl font-light text-[#c3b9a3]">:</span>
          <ScoreColumn value={pred ? pred.a : null} locked={locked} onInc={() => onScore("a", 1)} onDec={() => onScore("a", -1)} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
          <Crest color={fx.awayColor} text={fx.awayText} abbr={fx.awayAbbr} />
          <span className="text-center text-[12.5px] font-bold leading-tight">{fx.away}</span>
        </div>
      </div>
    </div>
  );
}