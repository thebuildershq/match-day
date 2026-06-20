import { useState } from "react";
import { useNavigate } from "react-router";
import { cn } from "../../lib/cn";
import { Logo } from "../../components/Logo";
import { LEAGUES, leagueById, type LeagueId } from "../../lib/leagues";
import { useStore } from "../../lib/store";

type Scoring = "3 / 1" | "5 / 2";
const SCORING: { key: Scoring; sub: string }[] = [
  { key: "3 / 1", sub: "Exact / result · the classic" },
  { key: "5 / 2", sub: "Steeper stakes" },
];

function makeCode(name: string) {
  const slug =
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 10) || "pool";
  return `${slug}-${Math.random().toString(36).slice(2, 6)}`;
}

export function CreatePool() {
  const navigate = useNavigate();
  const { createPool } = useStore();
  const [name, setName] = useState("");
  const [leagueId, setLeagueId] = useState<LeagueId>("epl");
  const [scoring, setScoring] = useState<Scoring>("3 / 1");
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const lg = leagueById(leagueId);
  const previewName = name.trim() || "The Group Chat XI";
  const created = code !== null;
  const inviteUrl = code ? `scorepact.app/j/${code}` : "";

  function create() {
    if (!name.trim()) return;
    createPool({ name, leagueId }); // adds to store + makes active
    setCode(makeCode(name));
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(`https://${inviteUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — ignore in UI-only mode */
    }
  }

  return (
    <div data-theme="light" className="flex min-h-dvh flex-col bg-bg text-ink">
      {/* top bar */}
      <div className="flex h-[62px] shrink-0 items-center justify-between border-b border-line px-[clamp(20px,4vw,38px)]">
        <Logo />
        <span className="text-xs font-bold uppercase tracking-[0.1em] text-faint">New pool</span>
      </div>

      {/* body */}
      <div className="sp-scroll flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row">
        {/* form */}
        <div className="flex flex-1 flex-col gap-[30px] p-[clamp(28px,4.5vw,56px)] lg:basis-[55%]">
          <div>
            <div className="mb-1.5 font-serif text-[15px] italic text-accent">Step into the season</div>
            <h1 className="text-[clamp(1.9rem,3.6vw,2.7rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">Start a pool.</h1>
            <p className="mt-2.5 max-w-[26rem] text-[15px] leading-relaxed text-muted">
              Name it, pick a competition, set the rules. One link invites the whole group chat.
            </p>
          </div>

          {/* name */}
          <div>
            <label htmlFor="poolName" className="mb-2.5 block text-xs font-bold uppercase tracking-[0.08em] text-faint">
              Pool name
            </label>
            <input
              id="poolName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="The Group Chat XI"
              maxLength={40}
              className="h-[52px] w-full rounded-[14px] border border-line bg-surface px-[18px] text-base font-semibold outline-none transition-colors placeholder:font-medium placeholder:text-faint focus:border-ink"
            />
          </div>

          {/* league */}
          <div>
            <label className="mb-2.5 block text-xs font-bold uppercase tracking-[0.08em] text-faint">Competition</label>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-2.5">
              {LEAGUES.map((l) => {
                const on = l.id === leagueId;
                return (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setLeagueId(l.id)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-[13px] border-[1.5px] bg-surface p-[13px] text-left transition-all",
                      on ? "border-ink shadow-[0_4px_14px_-8px_rgba(24,21,15,0.4)]" : "border-line",
                    )}
                  >
                    <span className="grid size-[26px] shrink-0 place-items-center rounded-[7px]" style={{ background: l.color }}>
                      <span className="text-[10px] font-extrabold text-white">{l.tag}</span>
                    </span>
                    <span className="text-[13.5px] font-bold leading-tight">{l.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* scoring */}
          <div>
            <label className="mb-2.5 block text-xs font-bold uppercase tracking-[0.08em] text-faint">Scoring</label>
            <div className="flex flex-wrap gap-2.5">
              {SCORING.map((o) => {
                const on = o.key === scoring;
                return (
                  <button
                    key={o.key}
                    type="button"
                    onClick={() => setScoring(o.key)}
                    className={cn(
                      "min-w-[150px] flex-1 rounded-[13px] border-[1.5px] bg-surface px-4 py-3.5 text-left transition-all",
                      on ? "border-ink shadow-[0_4px_14px_-8px_rgba(24,21,15,0.4)]" : "border-line",
                    )}
                  >
                    <div className="text-base font-extrabold">{o.key}</div>
                    <div className={cn("mt-0.5 text-[12.5px]", on ? "text-muted" : "text-faint")}>{o.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* live preview */}
        <div className="flex flex-col justify-center gap-5 bg-ink p-[clamp(28px,4.5vw,56px)] lg:basis-[45%]">
          <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-bg/40">Preview</span>
          <div className="overflow-hidden rounded-[20px] bg-bg shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between border-b border-line px-[22px] py-[18px]">
              <div className="min-w-0">
                <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-faint">Pool</div>
                <div className="mt-0.5 truncate text-lg font-extrabold tracking-[-0.02em]">{previewName}</div>
              </div>
              <span className="grid size-[34px] shrink-0 place-items-center rounded-[9px]" style={{ background: lg.color }}>
                <span className="text-xs font-extrabold text-white">{lg.tag}</span>
              </span>
            </div>
            <div className="px-[22px] py-[18px]">
              <div className="mb-3.5 flex items-center justify-between">
                <span className="text-[12.5px] text-muted">{lg.name}</span>
                <span className="text-[12.5px] font-bold text-ink">{scoring} pts</span>
              </div>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-5 place-items-center rounded-md bg-accent text-[10px] font-extrabold text-white">1</span>
                    <span className="text-sm font-semibold">You</span>
                  </div>
                  <span className="text-sm font-extrabold">—</span>
                </div>
                <div className="flex items-center justify-between opacity-45">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-5 place-items-center rounded-md bg-sand text-[10px] font-extrabold text-faint">2</span>
                    <span className="text-sm font-semibold">Invite your mates…</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="font-serif text-[15px] italic leading-relaxed text-bg/55">
            This is what your crew will see when they tap your link.
          </p>
        </div>
      </div>

      {/* footer */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-t border-line bg-surface px-[clamp(20px,4vw,38px)] py-4">
        {created ? (
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="whitespace-nowrap text-xs font-bold text-green">● Pool created</span>
            <div className="flex min-w-0 items-center gap-2 rounded-[10px] border border-line bg-bg px-3 py-2">
              <span className="truncate text-[13px] text-muted">{inviteUrl}</span>
              <button type="button" onClick={copy} className="whitespace-nowrap text-xs font-bold text-accent">
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        ) : (
          <span className="text-[13px] text-faint">Free · friends only · no money</span>
        )}

        {created ? (
          <button
            type="button"
            onClick={() => navigate("/app/predict")}
            className="h-[50px] whitespace-nowrap rounded-full bg-accent px-7 text-[15px] font-bold text-white"
          >
            Enter pool →
          </button>
        ) : (
          <button
            type="button"
            onClick={create}
            disabled={!name.trim()}
            className="h-[50px] whitespace-nowrap rounded-full bg-ink px-7 text-[15px] font-bold text-bg transition-opacity disabled:opacity-40"
          >
            Create pool →
          </button>
        )}
      </div>
    </div>
  );
}