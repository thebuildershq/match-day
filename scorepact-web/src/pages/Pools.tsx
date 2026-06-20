import { useNavigate } from 'react-router'
import { Nav } from '../components/landing/Nav'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { useApiQuery } from '../hooks/useApi'

interface PoolSummary {
  slug: string
  name: string
  competition_name: string
  is_admin: boolean
  member_count: number
  your_rank: number
  your_points: number
  matchday_status: 'pending' | 'predicted' | 'no-fixtures'
  recent_form: (number | null)[]
}

export default function Pools() {
  const navigate = useNavigate()
  const { data: pools, isLoading } = useApiQuery<PoolSummary[]>(['pools'], '/pools')

  return (
    <div className="min-h-screen bg-canvas">
      <Nav />
      <Container>
        <div className="py-16 md:py-20">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted font-medium mb-3">
                Your pools
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ink leading-[1.05]">
                {isLoading
                  ? 'Loading…'
                  : `${pools?.length ?? 0} ${pools?.length === 1 ? 'pool' : 'pools'}.`}
              </h1>
            </div>
            <Button size="lg" onClick={() => navigate('/pools/new')}>
              Create new pool
            </Button>
          </div>

          {!isLoading && pools && pools.length === 0 && (
            <EmptyState onCreate={() => navigate('/pools/new')} />
          )}

          {pools && pools.length > 0 && (
            <div className="grid md:grid-cols-2 gap-4">
              {pools.map(pool => (
                <PoolCard
                  key={pool.slug}
                  pool={pool}
                  onClick={() => navigate(`/pools/${pool.slug}`)}
                />
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="bg-surface rounded-2xl border border-line p-10 md:p-16 text-center">
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-ink mb-3 leading-[1.05]">
        No pools yet.
      </h2>
      <p className="text-muted mb-8 max-w-md mx-auto">
        Start your first pool, name it, invite friends, and outpredict them all season.
      </p>
      <Button size="lg" onClick={onCreate}>Create your first pool</Button>
    </div>
  )
}

function PoolCard({ pool, onClick }: { pool: PoolSummary; onClick: () => void }) {
  const statusColor = {
    pending: 'text-accent',
    predicted: 'text-success',
    'no-fixtures': 'text-muted',
  }[pool.matchday_status]

  const statusText = {
    pending: 'Predictions due',
    predicted: 'All predicted',
    'no-fixtures': 'No fixtures yet',
  }[pool.matchday_status]

  return (
    <button
      onClick={onClick}
      className="text-left bg-surface rounded-2xl border border-line p-6 md:p-8 hover:border-ink/20 transition-all hover:shadow-lg hover:shadow-ink/5 group"
    >
      <div className="flex items-start justify-between mb-6 gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge>{pool.competition_name}</Badge>
          {pool.is_admin && <Badge>Admin</Badge>}
        </div>
        <span className={`text-xs font-semibold whitespace-nowrap ${statusColor}`}>
          {statusText}
        </span>
      </div>

      <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-ink leading-[1.05] mb-6">
        {pool.name}
      </h3>

      <div className="flex items-center gap-8 mb-6">
        <StatCol label="Your rank" value={ordinal(pool.your_rank)} sub={`of ${pool.member_count}`} />
        <StatCol label="Points" value={pool.your_points.toString()} />
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-line">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-wider text-muted font-medium">Form</span>
          <div className="flex gap-1.5">
            {pool.recent_form.length === 0
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full border border-line" />
                ))
              : pool.recent_form.map((p, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      p === 2 ? 'bg-success' :
                      p === 1 ? 'bg-amber-400' :
                      p === 0 ? 'bg-line' :
                      'border border-line'
                    }`}
                  />
                ))}
          </div>
        </div>
        <div className="text-muted group-hover:text-ink group-hover:translate-x-1 transition-all text-lg leading-none">
          →
        </div>
      </div>
    </button>
  )
}

function StatCol({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-bold tracking-tight text-ink tabular-nums">{value}</span>
        {sub && <span className="text-xs text-muted tabular-nums">{sub}</span>}
      </div>
      <div className="text-xs uppercase tracking-wider text-muted font-medium mt-0.5">{label}</div>
    </div>
  )
}

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}