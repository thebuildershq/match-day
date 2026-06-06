import { Button } from '../ui/Button'
import { Container } from '../ui/Container'

export function Rivalry() {
  return (
    <section className="py-24 md:py-32 bg-ink">
      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-xs uppercase tracking-wider text-canvas/50 font-medium mb-6">
            Friendly rivalry
          </div>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-canvas leading-[0.95] mb-6">
            Talk is cheap.<br />The table doesn't lie.
          </h2>
          <p className="text-xl text-canvas/60 max-w-xl mx-auto mb-10 leading-relaxed">
            Settle every argument. Win every gameweek. Hold it over them until next August.
          </p>
          <div className="flex gap-3 justify-center">
            <Button size="lg" className="bg-canvas text-ink hover:bg-canvas/90">
              Create a pool
            </Button>
            <Button variant="ghost" size="lg" className="text-canvas hover:bg-canvas/10">
              See how it works
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}