import { Button } from '../ui/Button'
import { Container } from '../ui/Container'

export function Nav() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-canvas/70 border-b border-line/50">
      <Container>
        <div className="h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-ink rounded-md flex items-center justify-center">
              <span className="text-canvas text-sm font-bold">S</span>
            </div>
            <span className="font-semibold text-ink tracking-tight">Scorepact</span>
          </a>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">Log in</Button>
            <Button variant="primary" size="sm">Create a pool</Button>
          </div>
        </div>
      </Container>
    </header>
  )
}