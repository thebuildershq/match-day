import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { Nav } from '../components/landing/Nav'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'

interface Fixture {
  id: string
  homeTeam: string; homeCode: string; homeColor: string
  awayTeam: string; awayCode: string; awayColor: string
  kickoff: string
}

const fixtures: Fixture[] = [
  { id: '1', homeTeam: 'Arsenal',     homeCode: 'ARS', homeColor: 'bg-accent',     awayTeam: 'Chelsea',    awayCode: 'CHE', awayColor: 'bg-[#0052A5]',  kickoff: 'Sat 15:00' },
  { id: '2', homeTeam: 'Man City',    homeCode: 'MCI', homeColor: 'bg-sky-400',    awayTeam: 'Tottenham',  awayCode: 'TOT', awayColor: 'bg-slate-700',  kickoff: 'Sat 17:30' },
  { id: '3', homeTeam: 'Liverpool',   homeCode: 'LIV', homeColor: 'bg-red-700',    awayTeam: 'Newcastle',  awayCode: 'NEW', awayColor: 'bg-ink',         kickoff: 'Sun 14:00' },
  { id: '4', homeTeam: 'Aston Villa', homeCode: 'AVL', homeColor: 'bg-purple-900', awayTeam: 'Brighton',   awayCode: 'BHA', awayColor: 'bg-blue-500',    kickoff: 'Sun 16:30' },
  { id: '5', homeTeam: 'Man United',  homeCode: 'MUN', homeColor: 'bg-red-600',    awayTeam: 'Brentford',  awayCode: 'BRE', awayColor: 'bg-red-500',     kickoff: 'Sun 16:30' },
]

interface Prediction { home: number; away: number }

export default function Predict() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [predictions, setPredictions] = useState<Record<string, Prediction>>({})
  const [saving, setSaving] = useState(false)

  const poolName = slug
    ? slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : 'Your Pool'

  const predictedCount = Object.keys(predictions).length
  const totalCount = fixtures.length
  const progress = (predictedCount / totalCount) * 100
  const canSave = predictedCount === totalCount

  function setPrediction(id: string, home: number, away: number) {
    setPredictions(prev => ({ ...prev, [id]: { home, away } }))
  }

  function handleSave() {
    if (!canSave) return
    setSaving(true)
    setTimeout(() => navigate(`/pools/${slug}`), 600)
  }

  return (
    <div className="min-h-screen bg-canvas pb-32">
      <Nav />

      <section className="pt-12 pb-12 md:pt-20 md:pb-16 border-b border-line/60">
        <Container>
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Badge>{poolName}</Badge>
              <Badge>Matchday 24</Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-ink leading-[0.95] mb-4">
              Lock in your<br />predictions.
            </h1>
            <p className="text-lg text-muted">
              Five fixtures. Predict every scoreline. Locks Saturday at 14:00.
            </p>
          </div>
        </Container>
      </section>

      <div className="sticky top-16 z-40 bg-canvas/80 backdrop-blur-xl border-b border-line/60">
        <Container>
          <div className="py-4 flex items-center justify-between gap-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="text-sm font-semibold text-ink tabular-nums">
                {predictedCount} <span className="text-muted font-normal">of {totalCount}</span>
              </div>
              <div className="flex-1 max-w-xs h-1.5 bg-line rounded-full overflow-hidden">
                <div className="h-full bg-ink rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <Button
              variant={canSave ? 'primary' : 'secondary'}
              size="sm"
              disabled={!canSave || saving}
              onClick={handleSave}
            >
              {saving ? 'Saving...' : canSave ? 'Lock in all' : 'Predict all to lock'}
            </Button>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-12 md:py-16 flex flex-col gap-4 max-w-3xl mx-auto">
          {fixtures.map(fixture => (
            <FixturePredictCard
              key={fixture.id}
              fixture={fixture}
              prediction={predictions[fixture.id]}
              onChange={(h, a) => setPrediction(fixture.id, h, a)}
            />
          ))}
        </div>
      </Container>
    </div>
  )
}

function FixturePredictCard({ fixture, prediction, onChange }: {
  fixture: Fixture
  prediction?: Prediction
  onChange: (home: number, away: number) => void
}) {
  const [home, setHome] = useState(prediction?.home ?? 0)
  const [away, setAway] = useState(prediction?.away ?? 0)
  const hasPrediction = prediction !== undefined

  function update(h: number, a: number) {
    setHome(h); setAway(a); onChange(h, a)
  }

  return (
    <div className={`bg-surface rounded-2xl border ${hasPrediction ? 'border-ink/20' : 'border-line'} p-6 md:p-8 transition-colors`}>
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs uppercase tracking-wider text-muted font-medium">{fixture.kickoff}</span>
        {hasPrediction && <span className="text-xs font-semibold text-success">Predicted</span>}
      </div>

      <div className="flex items-center justify-between gap-3 md:gap-6">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`w-10 h-10 md:w-12 md:h-12 ${fixture.homeColor} rounded-full flex items-center justify-center shrink-0`}>
            <span className="text-canvas text-[10px] font-bold">{fixture.homeCode}</span>
          </div>
          <span className="font-semibold text-ink text-sm md:text-base truncate">{fixture.homeTeam}</span>
        </div>

        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <ScoreStepper value={home} onChange={(v) => update(v, away)} />
          <span className="text-2xl md:text-3xl font-bold text-muted">–</span>
          <ScoreStepper value={away} onChange={(v) => update(home, v)} />
        </div>

        <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
          <span className="font-semibold text-ink text-sm md:text-base truncate text-right">{fixture.awayTeam}</span>
          <div className={`w-10 h-10 md:w-12 md:h-12 ${fixture.awayColor} rounded-full flex items-center justify-center shrink-0`}>
            <span className="text-canvas text-[10px] font-bold">{fixture.awayCode}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ScoreStepper({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <button type="button" onClick={() => onChange(Math.min(value + 1, 9))}
        className="w-7 h-7 rounded-full bg-canvas border border-line text-ink text-sm font-medium hover:bg-ink hover:text-canvas transition">
        +
      </button>
      <div className="text-3xl md:text-4xl font-bold tabular-nums text-ink w-10 text-center leading-none py-1">{value}</div>
      <button type="button" onClick={() => onChange(Math.max(value - 1, 0))}
        className="w-7 h-7 rounded-full bg-canvas border border-line text-ink text-sm font-medium hover:bg-ink hover:text-canvas transition">
        −
      </button>
    </div>
  )
}