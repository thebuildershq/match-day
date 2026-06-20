import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { cn } from "../../lib/cn";
import { useStore } from "../../lib/store";
import { leagueById } from "../../lib/leagues";
import { WORLD_FIXTURES, MATCHDAY } from "../../lib/world";
import { FixtureCard } from "../../components/FixtureCard";
import { EmptyState } from "../../components/states";

function fmtCountdown(ms: number): string {
  if (ms <= 0) return "Locked";
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m ${String(s % 60).padStart(2, "0")}s`;
}

export function Predict() {
  const navigate = useNavigate();
  const { active, setActive, setPrediction, lockActive } = useStore();
  const openedAt = useRef(Date.now());
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const lockAt = useMemo(
    () => Object.fromEntries(WORLD_FIXTURES.map((f) => [f.id, openedAt.current + f.lockInHours * 3_600_000])),
    [],
  );

  // Fresh pool: no fixtures loaded yet.
  if (!active.hasWorld) {
    return (
      <EmptyState
        title="No fixtures yet"
        body={`Fixtures for ${active.pool.name} load when the next matchday opens. Meanwhile, the demo pool is live.`}
        action={
          <button
            type="button"
            onClick={() => setActive("gcxi")}
            className="h-11 rounded-full bg-ink px-6 text-sm font-bold text-bg"
          >
            Open The Group Chat XI
          </button>
        }
      />
    );
  }

  const league = leagueById(active.pool.leagueId);
  const locked = active.locked;
  const isLocked = (id: string) => locked || now >= lockAt[id];

  const predictedCount = Object.keys(active.predictions).length;
  const total = WORLD_FIXTURES.length;
  const progress = Math.round((predictedCount / total) * 100);
  const canLock = predictedCount === total;

  const nextLock = Math.min(...WORLD_FIXTURES.filter((f) => !isLocked(f.id)).map((f) => lockAt[f.id] - now), Infinity);
  const countdown = locked ? "Locked" : nextLock === Infinity ? "Locked" : fmtCountdown(nextLock);

  function onScore(id: string, side: "h" | "a", delta: number) {
    if (isLocked(id)) return; // server returns 409; client refuses too
    setPrediction(id, side, delta);
  }
  function lockIn() {
    if (predictedCount === 0) return;
    lockActive();
    navigate("/app/table", { state: { justLocked: true } });
  }

  return (
    <div className="flex min-h-full flex-col">
      <div className="px-[clamp(22px,4vw,44px)] pt-[clamp(24px,3.5vw,40px)]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 text-xs font-bold uppercase tracking-[0.1em] text-faint">
              {league.name} · Matchday {MATCHDAY}
            </div>
            <h1 className="text-[clamp(1.7rem,3.2vw,2.5rem)] font-extrabold leading-none tracking-[-0.03em]">
              {locked ? "Locked in." : "Call the weekend."}
            </h1>
          </div>
          <div className="flex items-center gap-2.5 rounded-[13px] border border-line bg-surface px-[15px] py-2.5">
            <span className={cn("size-[7px] rounded-full bg-accent", countdown !== "Locked" && "animate-pulse-soft")} />
            <span className="text-[13px] text-muted">
              {countdown === "Locked" ? "Predictions" : "Locks in"}{" "}
              <span className="font-extrabold tabular-nums text-ink">{countdown}</span>
            </span>
          </div>
        </div>
        <div className="mt-[18px] h-1.5 overflow-hidden rounded-full bg-[#e7dfce]">
          <div className="h-full rounded-full bg-accent transition-[width] duration-300" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-2 text-[13px] text-muted">
          <span className="font-extrabold text-ink">{predictedCount}</span> of {total} predicted
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-3.5 px-[clamp(22px,4vw,44px)] pb-[120px] pt-[22px]">
        {WORLD_FIXTURES.map((fx) => (
          <FixtureCard key={fx.id} fx={fx} pred={active.predictions[fx.id]} locked={isLocked(fx.id)} onScore={(side, delta) => onScore(fx.id, side, delta)} />
        ))}
      </div>

      <div className="sticky bottom-0 mt-auto flex items-center justify-between gap-4 border-t border-line bg-surface/[0.92] px-[clamp(22px,4vw,44px)] py-3.5 backdrop-blur-md">
        {locked ? (
          <>
            <span className="text-sm font-semibold text-green">● All predictions locked</span>
            <Link to="/app/table" className="h-12 whitespace-nowrap rounded-full bg-ink px-[30px] text-[15px] font-bold leading-[3rem] text-bg">
              View the table →
            </Link>
          </>
        ) : (
          <>
            <span className="text-sm text-muted">
              <span className="font-extrabold text-ink">{predictedCount}</span> of {total} ready to lock
            </span>
            <button
              type="button"
              onClick={lockIn}
              disabled={predictedCount === 0}
              className={cn(
                "h-12 whitespace-nowrap rounded-full px-[30px] text-[15px] font-bold transition-colors disabled:opacity-40",
                canLock ? "bg-accent text-white" : "bg-ink text-bg",
              )}
            >
              {canLock ? `Lock in all ${total} →` : `Lock in ${predictedCount} →`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}