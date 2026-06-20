import { cn } from "../lib/cn";

export interface StandingRow {
  id: string;
  name: string;
  color: string;
  initials: string;
  rank: number; // 0 = top
  value: number; // points shown in current view
  form: string; // recent delta, e.g. "+3" or "–"
  me?: boolean;
}

export function StandingsBoard({ rows, rowHeight = 58 }: { rows: StandingRow[]; rowHeight?: number }) {
  return (
    <div className="relative" style={{ height: rows.length * rowHeight + 16 }}>
      {rows.map((p) => (
        <div
          key={p.id}
          className={cn(
            "absolute inset-x-0 top-2 flex items-center justify-between px-[22px] transition-transform duration-700 ease-[cubic-bezier(.2,.85,.25,1)] will-change-transform",
            p.me && "bg-accent/[0.04]",
          )}
          style={{ height: rowHeight, transform: `translateY(${p.rank * rowHeight}px)` }}
        >
          <div className="flex min-w-0 items-center gap-3.5">
            <span
              className={cn(
                "w-6 text-center text-[13px] font-extrabold tabular-nums",
                p.rank === 0 ? "text-accent" : "text-faint",
              )}
            >
              {p.rank + 1}
            </span>
            <span className="grid size-[34px] shrink-0 place-items-center rounded-full" style={{ background: p.color }}>
              <span className="text-[11px] font-extrabold text-white">{p.initials}</span>
            </span>
            <span className="truncate text-[15px] font-bold">{p.name}</span>
            {p.me && (
              <span className="shrink-0 rounded-full border border-[#f3c9c4] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.05em] text-accent">
                You
              </span>
            )}
          </div>
          <div className="flex items-center gap-[18px]">
            <span className={cn("w-[34px] text-right text-xs font-bold", p.form === "–" ? "text-faint" : "text-green")}>{p.form}</span>
            <span className={cn("w-10 text-right text-[17px] font-extrabold tabular-nums", p.me ? "text-accent" : "text-ink")}>{p.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}