import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { Nav } from '../components/landing/Nav'
import { Container } from '../components/ui/Container'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useApiMutation } from '../hooks/useApi'

const competitions = [
  { id: 'premier-league',     apiId: 39,  name: 'Premier League' },
  { id: 'la-liga',            apiId: 140, name: 'La Liga' },
  { id: 'serie-a',            apiId: 135, name: 'Serie A' },
  { id: 'bundesliga',         apiId: 78,  name: 'Bundesliga' },
  { id: 'ligue-1',            apiId: 61,  name: 'Ligue 1' },
  { id: 'champions-league',   apiId: 2,   name: 'UEFA Champions League' },
]

interface PoolCreatePayload {
  name: string
  competition_id: number
  competition_name: string
}

interface PoolResponse {
  id: string
  slug: string
  name: string
}



export default function CreatePool() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [competitionId, setCompetitionId] = useState(competitions[0].id)
  const [submitting, setSubmitting] = useState(false)
  const createPool = useApiMutation<PoolResponse, PoolCreatePayload>('/pools', 'POST')


  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    const comp = competitions.find(c => c.id === competitionId)!
    setSubmitting(true)
    try {
      const pool = await createPool.mutateAsync({
        name: name.trim(),
        competition_id: comp.apiId,
        competition_name: comp.name
      })
      navigate(`/pools/${pool.slug}`)
    } catch (err) {
      console.error('Create pool failed:', err)
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Nav />
      <Container>
        <div className="max-w-xl mx-auto py-20 md:py-28">
          <div className="text-xs uppercase tracking-wider text-muted font-medium mb-4">
            New pool
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ink mb-3 leading-[1.05]">
            Create a pool.
          </h1>
          <p className="text-lg text-muted mb-10">
            Name your pool, pick a competition. Invite friends in the next step.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Input
              id="pool-name"
              label="Pool name"
              placeholder="The Real Premier League"
              value={name}
              onChange={(e) => setName(e.target.value)}
              hint="Make it personal. Your friends will see this."
              required
            />

            <div className="flex flex-col gap-2">
              <label htmlFor="competition" className="text-sm font-medium text-ink">
                Competition
              </label>
              <div className="relative">
                <select
                  id="competition"
                  value={competitionId}
                  onChange={(e) => setCompetitionId(e.target.value)}
                  className="appearance-none w-full h-11 px-4 pr-10 bg-surface border border-line rounded-xl text-ink focus:outline-none focus:border-ink focus:ring-2 focus:ring-ink/10 transition"
                >
                  {competitions.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <p className="text-xs text-muted">All fixtures from this competition will appear in your pool.</p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" size="lg" disabled={submitting || !name.trim()}>
                {submitting ? 'Creating...' : 'Create pool'}
              </Button>
              <Button type="button" variant="secondary" size="lg" onClick={() => navigate('/pools')}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  )
}