import { Container } from '../ui/Container'

const steps = [
  {
    n: '01',
    title: 'Create a pool',
    body: 'Name it, pick a competition, invite your friends with one link.',
  },
  {
    n: '02',
    title: 'Predict scores',
    body: 'Before each matchday, submit a scoreline for every fixture. Locks at kickoff.',
  },
  {
    n: '03',
    title: 'Win the season',
    body: 'Points calculate automatically. The table updates live. Last one standing wins.',
  },
]

export function HowItWorks() {
  return (
    // <section className="py-32 md:py-40 bg-surface border-y border-line/60">
    <section className="py-24 md:py-32">
      <Container>
        <div className="max-w-2xl mb-16 md:mb-24">
          <div className="text-xs uppercase tracking-wider text-muted font-medium mb-4">
            How it works
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-ink leading-[1.05]">
            Three steps. One winner.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-12 md:gap-16">
          {steps.map((step) => (
            <div key={step.n} className="flex flex-col gap-4">
              <div className="text-sm font-semibold text-accent tabular-nums">
                {step.n}
              </div>
              <h3 className="text-2xl font-semibold tracking-tight text-ink">
                {step.title}
              </h3>
              <p className="text-base text-muted leading-relaxed">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}