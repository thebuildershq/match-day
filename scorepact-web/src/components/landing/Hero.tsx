import { Button } from "../ui/Button";
import { Container } from "../ui/Container";
import { Badge } from "../ui/Badge";

export function Hero() {
    return (
        <section className="relative pt-16 pb-20 md:pt-24 md:pb-28">
            <Container>
                {/* <div className="grid md:grid-cols-2 gap-16 items-center"> */}
                <div className="grid md:grid-cols-[1.3fr_1fr] gap-12 items-center">
                    {/* Left: copy */}
                    <div className="flex flex-col items-start gap-6">
                        <Badge>Private leagues · Friends only</Badge>
                        {/* <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-ink leading-[0.95]"> */}
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-ink leading-[0.95]">
                            Predict the score.
                            <br />
                            Win the season.
                        </h1>
                        <p className="text-lg md:text-xl text-muted max-w-md leading-relaxed">
                            Create a private football pool with your friends.
                            Compete every matchday. See who actually knows the
                            game when the season ends.
                        </p>
                        <div className="flex gap-3 pt-2">
                            <Button size="lg">Create a pool</Button>
                            <Button variant="secondary" size="lg">
                                How it works
                            </Button>
                        </div>
                    </div>

                    {/* Right: hero card */}
                    <div className="relative">
                        <PoolCard />
                    </div>
                </div>
            </Container>
        </section>
    );
}

function PoolCard() {
    return (
        <div className="bg-surface rounded-3xl border border-line shadow-xl shadow-ink/5 overflow-hidden">
            <div className="px-6 py-5 flex items-center justify-between border-b border-line">
                <div>
                    <div className="text-xs uppercase tracking-wider text-muted font-medium">
                        Pool
                    </div>
                    <div className="text-lg font-semibold text-ink mt-0.5">
                        The Real Premier League
                    </div>
                </div>
                <Badge>GW 24</Badge>
            </div>

            <div className="px-6 py-6 bg-canvas">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-accent rounded-full flex items-center justify-center">
                            <span className="text-canvas text-[10px] font-bold">
                                ARS
                            </span>
                        </div>
                        <span className="font-semibold text-ink">Arsenal</span>
                    </div>
                    <div className="text-3xl font-bold tracking-tight text-ink tabular-nums">
                        2 – 1
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="font-semibold text-ink">Chelsea</span>
                        <div className="w-9 h-9 bg-[#0052A5] rounded-full flex items-center justify-center">
                            <span className="text-canvas text-[10px] font-bold">
                                CHE
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-6 py-5">
                <div className="text-xs uppercase tracking-wider text-muted font-medium mb-3">
                    Leaderboard
                </div>
                <div className="space-y-3">
                    <LeaderRow rank={1} name="Dela K." points={41} />
                    <LeaderRow rank={2} name="Ama M." points={38} />
                    <LeaderRow rank={3} name="Kojo A." points={34} />
                    <LeaderRow rank={5} name="You" points={26} highlight />
                </div>
            </div>
        </div>
    );
}

function LeaderRow({
    rank,
    name,
    points,
    highlight = false,
}: {
    rank: number;
    name: string;
    points: number;
    highlight?: boolean;
}) {
    return (
        <div
            className={`flex items-center justify-between ${highlight ? "text-accent font-semibold" : "text-ink"}`}
        >
            <div className="flex items-center gap-3">
                <span
                    className={`text-sm tabular-nums w-4 ${highlight ? "text-accent" : "text-muted"}`}
                >
                    {rank}
                </span>
                <span className="text-sm font-medium">{name}</span>
            </div>
            <span className="text-sm font-semibold tabular-nums">{points}</span>
        </div>
    );
}
