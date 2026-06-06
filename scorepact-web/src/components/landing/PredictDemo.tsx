import { useState } from "react";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";

export function PredictDemo() {
    const [home, setHome] = useState(0);
    const [away, setAway] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    const actualHome = 2;
    const actualAway = 1;
    const points = calculatePoints(home, away, actualHome, actualAway);

    return (
        <section className="py-24 md:py-32 bg-canvas">
            <Container>
                {/* <div className="max-w-2xl mb-12 md:mb-16"> */}
                <div className="max-w-2xl mx-auto text-center mb-12 md:mb-16">
                    <div className="text-xs uppercase tracking-wider text-muted font-medium mb-4">
                        Try it
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-ink leading-[1.05]">
                        Predict the fixture.
                    </h2>
                    <p className="text-lg text-muted mt-4 max-w-xl">
                        No signup. Just feel how it works.
                    </p>
                </div>

                <div className="bg-surface rounded-3xl border border-line shadow-xl shadow-ink/5 max-w-3xl mx-auto p-8 md:p-12">
                    <div className="flex items-center justify-between mb-10">
                        <Badge>Premier League · Saturday</Badge>
                        <span className="text-sm text-muted">
                            15:00 kick-off
                        </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 md:gap-8 mb-10">
                        <TeamSide team="Arsenal" code="ARS" color="bg-accent" />

                        <div className="flex items-center gap-3 md:gap-4">
                            <ScoreStepper
                                value={home}
                                onChange={setHome}
                                disabled={submitted}
                            />
                            <span className="text-3xl font-bold text-muted">
                                –
                            </span>
                            <ScoreStepper
                                value={away}
                                onChange={setAway}
                                disabled={submitted}
                            />
                        </div>

                        <TeamSide
                            team="Chelsea"
                            code="CHE"
                            color="bg-[#0052A5]"
                            reverse
                        />
                    </div>

                    {!submitted ? (
                        <Button
                            size="lg"
                            className="w-full"
                            onClick={() => setSubmitted(true)}
                        >
                            Lock in prediction
                        </Button>
                    ) : (
                        <div className="text-center">
                            <div className="text-xs uppercase tracking-wider text-muted font-medium mb-2">
                                If the match ends {actualHome}–{actualAway}
                            </div>
                            <div className="text-6xl font-bold text-accent mb-4 tabular-nums">
                                +{points}
                            </div>
                            <p className="text-muted mb-6">
                                {points === 2 &&
                                    "Exact scoreline. Maximum points."}
                                {points === 1 &&
                                    "Right outcome, wrong scoreline. Half a win."}
                                {points === 0 &&
                                    "Wrong outcome. There's always next matchday."}
                            </p>
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setSubmitted(false);
                                    setHome(0);
                                    setAway(0);
                                }}
                            >
                                Try another
                            </Button>
                        </div>
                    )}
                </div>
            </Container>
        </section>
    );
}

function TeamSide({
    team,
    code,
    color,
    reverse = false,
}: {
    team: string;
    code: string;
    color: string;
    reverse?: boolean;
}) {
    return (
        <div
            className={`flex items-center gap-3 flex-1 ${reverse ? "flex-row-reverse text-right" : ""}`}
        >
            <div
                className={`w-12 h-12 ${color} rounded-full flex items-center justify-center shrink-0`}
            >
                <span className="text-canvas text-[10px] font-bold">
                    {code}
                </span>
            </div>
            <span className="font-semibold text-ink text-lg hidden sm:block">
                {team}
            </span>
        </div>
    );
}

function ScoreStepper({
    value,
    onChange,
    disabled,
}: {
    value: number;
    onChange: (n: number) => void;
    disabled?: boolean;
}) {
    return (
        <div className="flex flex-col items-center gap-2">
            <button
                onClick={() => onChange(Math.min(value + 1, 9))}
                disabled={disabled}
                className="w-10 h-10 rounded-full bg-canvas border border-line text-ink text-xl font-medium hover:bg-ink hover:text-canvas transition disabled:opacity-30 disabled:pointer-events-none"
            >
                +
            </button>
            <div className="text-5xl md:text-6xl font-bold tabular-nums text-ink w-16 text-center">
                {value}
            </div>
            <button
                onClick={() => onChange(Math.max(value - 1, 0))}
                disabled={disabled}
                className="w-10 h-10 rounded-full bg-canvas border border-line text-ink text-xl font-medium hover:bg-ink hover:text-canvas transition disabled:opacity-30 disabled:pointer-events-none"
            >
                −
            </button>
        </div>
    );
}

function calculatePoints(
    predH: number,
    predA: number,
    actualH: number,
    actualA: number,
): number {
    if (predH === actualH && predA === actualA) return 2;
    const predOutcome = Math.sign(predH - predA);
    const actualOutcome = Math.sign(actualH - actualA);
    if (predOutcome === actualOutcome) return 1;
    return 0;
}
