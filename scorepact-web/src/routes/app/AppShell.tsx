import { useEffect, useRef, useState, type ReactElement } from "react";
import { NavLink, Link, Outlet, useNavigate } from "react-router";
import { cn } from "../../lib/cn";
import { Logo } from "../../components/Logo";
import { useAuth } from "../../lib/auth";
import { useStore, type PoolState } from "../../lib/store";
import { leagueById } from "../../lib/leagues";

/* ---------- icons ---------- */
const ic = "shrink-0";
const IconPredict = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={ic}
    >
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3.5" />
    </svg>
);
const IconTable = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className={ic}
    >
        <path d="M4 6h16M4 12h16M4 18h10" />
    </svg>
);
const IconFixtures = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className={ic}
    >
        <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
        <path d="M3 9h18M8 2.5v4M16 2.5v4" />
    </svg>
);
const IconBanter = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={ic}
    >
        <path d="M21 12a8 8 0 0 1-11.5 7.2L4 20l1-4.5A8 8 0 1 1 21 12z" />
    </svg>
);
const IconPlus = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        className={ic}
    >
        <path d="M12 5v14M5 12h14" />
    </svg>
);
const IconChevron = () => (
    <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={ic}
    >
        <path d="M6 9l6 6 6-6" />
    </svg>
);
type Icon = ReactElement;

/** Close on outside-click or Escape. */
function useMenu(onClose: () => void) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function onDown(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node))
                onClose();
        }
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [onClose]);
    return ref;
}

/* ---------- pool switcher ---------- */
function PoolSwitcher({
    active,
    pools,
    onPick,
}: {
    active: PoolState;
    pools: PoolState[];
    onPick: (id: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useMenu(() => setOpen(false));
    const lg = leagueById(active.pool.leagueId);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
                className="flex w-full items-center gap-2.5 rounded-[13px] border border-line bg-bg px-3 py-2.5 text-left transition-colors hover:border-ink/30"
            >
                <span
                    className="grid size-[30px] shrink-0 place-items-center rounded-lg"
                    style={{ background: lg.color }}
                >
                    <span className="text-[11px] font-extrabold text-white">
                        {lg.tag}
                    </span>
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-bold tracking-[-0.01em]">
                        {active.pool.name}
                    </span>
                    <span className="block text-[11px] text-faint">
                        {active.pool.players} players
                    </span>
                </span>
                <span className="text-faint">
                    <IconChevron />
                </span>
            </button>

            {open && (
                <div
                    role="menu"
                    className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-[14px] border border-line bg-elev shadow-[0_20px_40px_-20px_rgba(24,21,15,0.4)]"
                >
                    {pools.map((p) => {
                        const plg = leagueById(p.pool.leagueId);
                        const isActive = p.pool.id === active.pool.id;
                        return (
                            <button
                                key={p.pool.id}
                                type="button"
                                role="menuitem"
                                onClick={() => {
                                    onPick(p.pool.id);
                                    setOpen(false);
                                }}
                                className={cn(
                                    "flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-sand",
                                    isActive && "bg-sand/60",
                                )}
                            >
                                <span
                                    className="grid size-[26px] shrink-0 place-items-center rounded-md"
                                    style={{ background: plg.color }}
                                >
                                    <span className="text-[10px] font-extrabold text-white">
                                        {plg.tag}
                                    </span>
                                </span>
                                <span className="min-w-0 flex-1 truncate text-[13px] font-semibold">
                                    {p.pool.name}
                                </span>
                                {isActive && (
                                    <span className="text-accent">✓</span>
                                )}
                            </button>
                        );
                    })}
                    <Link
                        to="/app/new"
                        role="menuitem"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 border-t border-line px-3 py-2.5 text-[13px] font-bold text-muted hover:bg-sand"
                    >
                        <IconPlus /> New pool
                    </Link>
                </div>
            )}
        </div>
    );
}

/* ---------- user menu ---------- */
function UserMenu({ compact }: { compact?: boolean }) {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const ref = useMenu(() => setOpen(false));
    const name = user?.name ?? "You";

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label="Account menu"
                onClick={() => setOpen((o) => !o)}
                className={cn(
                    "flex items-center gap-2.5 rounded-full p-1 text-left transition-colors hover:bg-sand",
                    !compact && "w-full px-2 py-1.5",
                )}
            >
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-[12px] font-extrabold text-white">
                    YO
                </span>
                {!compact && (
                    <span className="min-w-0">
                        <span className="block truncate text-[13.5px] font-bold leading-tight">
                            {name}
                        </span>
                        <span className="block text-[11px] text-faint">
                            Signed in
                        </span>
                    </span>
                )}
            </button>
            {open && (
                <div
                    role="menu"
                    className="absolute bottom-full right-0 z-50 mb-2 w-44 overflow-hidden rounded-[14px] border border-line bg-elev shadow-[0_20px_40px_-20px_rgba(24,21,15,0.4)]"
                >
                    <button
                        type="button"
                        role="menuitem"
                        className="block w-full px-4 py-2.5 text-left text-[13px] font-semibold hover:bg-sand"
                    >
                        Profile
                    </button>
                    <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                            signOut();
                            navigate("/");
                        }}
                        className="block w-full border-t border-line px-4 py-2.5 text-left text-[13px] font-semibold text-accent hover:bg-sand"
                    >
                        Sign out
                    </button>
                </div>
            )}
        </div>
    );
}

/* ---------- nav items ---------- */
const navBase =
    "flex items-center gap-3 rounded-[11px] px-3.5 text-[14.5px] font-bold transition-colors";
function SideLink({
    to,
    icon,
    label,
}: {
    to: string;
    icon: Icon;
    label: string;
}) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                cn(
                    navBase,
                    "h-[42px]",
                    isActive ? "bg-ink text-bg" : "text-muted hover:bg-sand",
                )
            }
        >
            {icon} {label}
        </NavLink>
    );
}
function SoonLink({ icon, label }: { icon: Icon; label: string }) {
    return (
        <span className={cn(navBase, "h-[42px] cursor-default text-faint")}>
            {icon} {label}
            <span className="ml-auto rounded-full bg-sand px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.05em] text-faint">
                soon
            </span>
        </span>
    );
}

/* ---------- shell ---------- */
export function AppShell() {
    const { pools, active, setActive } = useStore();

    return (
        <div
            data-theme="light"
            className="flex h-dvh flex-col bg-bg text-ink lg:flex-row"
        >
            {/* sidebar (lg+) */}
            <aside className="hidden w-[230px] shrink-0 flex-col border-r border-line bg-surface p-3.5 lg:flex">
                <div className="px-2 pb-[18px] pt-1.5">
                    <Link to="/" aria-label="Scorepact home">
                        <Logo ringClass="ring-surface" />
                    </Link>
                </div>
                <div className="mb-[18px]">
                    <PoolSwitcher
                        active={active}
                        pools={pools}
                        onPick={setActive}
                    />
                </div>
                <nav className="flex flex-col gap-0.5">
                    <SideLink
                        to="/app/predict"
                        icon={<IconPredict />}
                        label="Predict"
                    />
                    <SideLink
                        to="/app/table"
                        icon={<IconTable />}
                        label="Table"
                    />
                    <SoonLink icon={<IconFixtures />} label="Fixtures" />
                    <SoonLink icon={<IconBanter />} label="Banter" />
                </nav>
                <div className="mt-auto flex flex-col gap-2.5">
                    <Link
                        to="/app/new"
                        className="flex h-[42px] items-center justify-center gap-2 rounded-[11px] border border-dashed border-[#c9bda3] text-[13.5px] font-bold text-muted transition-colors hover:bg-sand"
                    >
                        <IconPlus /> New pool
                    </Link>
                    <UserMenu />
                </div>
            </aside>

            {/* mobile top bar */}
            <header className="flex items-center gap-3 border-b border-line bg-surface px-4 py-2.5 lg:hidden">
                <Link to="/" aria-label="Scorepact home" className="shrink-0">
                    <Logo withWordmark={false} ringClass="ring-surface" />
                </Link>
                <div className="min-w-0 flex-1">
                    <PoolSwitcher
                        active={active}
                        pools={pools}
                        onPick={setActive}
                    />
                </div>
                <UserMenu compact />
            </header>

            {/* main scroll area (only scroller) */}
            <main className="sp-scroll min-w-0 flex-1 overflow-y-auto">
                <Outlet />
            </main>

            {/* mobile bottom tabs */}
            <nav className="flex shrink-0 items-stretch border-t border-line bg-surface lg:hidden">
                <TabLink
                    to="/app/predict"
                    icon={<IconPredict />}
                    label="Predict"
                />
                <TabLink to="/app/table" icon={<IconTable />} label="Table" />
                <TabLink to="/app/new" icon={<IconPlus />} label="New" />
            </nav>
        </div>
    );
}

function TabLink({
    to,
    icon,
    label,
}: {
    to: string;
    icon: Icon;
    label: string;
}) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                cn(
                    "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-bold transition-colors",
                    isActive ? "text-accent" : "text-faint",
                )
            }
        >
            {icon}
            {label}
        </NavLink>
    );
}
