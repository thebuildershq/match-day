import { useRouteError, useNavigate } from "react-router";
import type { ReactNode } from "react";

export function Loading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="grid min-h-[40vh] place-items-center text-faint">
      <div className="flex flex-col items-center gap-3">
        <span className="size-7 animate-spin rounded-full border-2 border-line border-t-accent" />
        <span className="text-sm font-semibold">{label}</span>
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="grid min-h-[40vh] place-items-center px-6 text-center">
      <div className="max-w-[26rem]">
        <div className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-sand text-xl">⚑</div>
        <h2 className="mb-2 text-xl font-extrabold tracking-[-0.02em]">{title}</h2>
        {body && <p className="text-[15px] leading-relaxed text-muted">{body}</p>}
        {action && <div className="mt-5 flex justify-center">{action}</div>}
      </div>
    </div>
  );
}

export function ErrorState({ title, body, onRetry }: { title: string; body?: string; onRetry?: () => void }) {
  return (
    <div className="grid min-h-[40vh] place-items-center px-6 text-center">
      <div className="max-w-[26rem]">
        <div className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-accent/10 text-xl text-accent">!</div>
        <h2 className="mb-2 text-xl font-extrabold tracking-[-0.02em]">{title}</h2>
        {body && <p className="text-[15px] leading-relaxed text-muted">{body}</p>}
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-5 h-11 rounded-full bg-ink px-6 text-sm font-bold text-bg"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}

/** Catches render/loader errors for the whole route tree. */
export function RouteError() {
  const error = useRouteError();
  const navigate = useNavigate();
  const message = error instanceof Error ? error.message : "Something went sideways.";
  return (
    <div data-theme="light" className="grid min-h-dvh place-items-center bg-bg text-ink">
      <ErrorState title="Off the rails" body={message} onRetry={() => navigate(0)} />
    </div>
  );
}