import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { LeagueId } from "./leagues";

export interface Pool {
  id: string;
  name: string;
  leagueId: LeagueId;
  players: number;
}

export type PredMap = Record<string, { h: number; a: number }>;

export interface PoolState {
  pool: Pool;
  hasWorld: boolean; // seeded demo pool has fixtures/results; fresh pools don't yet
  predictions: PredMap;
  locked: boolean;
}

interface Store {
  pools: PoolState[];
  active: PoolState;
  setActive: (id: string) => void;
  createPool: (input: { name: string; leagueId: LeagueId }) => string;
  setPrediction: (fixtureId: string, side: "h" | "a", delta: number) => void;
  lockActive: () => void;
}

const SEED: PoolState[] = [
  {
    pool: { id: "gcxi", name: "The Group Chat XI", leagueId: "epl", players: 8 },
    hasWorld: true,
    predictions: {},
    locked: false,
  },
];

function slugify(name: string) {
  return (
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 12) || "pool"
  );
}

const Ctx = createContext<Store | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [pools, setPools] = useState<PoolState[]>(SEED);
  const [activeId, setActiveId] = useState("gcxi");

  const value = useMemo<Store>(() => {
    const active = pools.find((p) => p.pool.id === activeId) ?? pools[0];

    function update(id: string, fn: (p: PoolState) => PoolState) {
      setPools((ps) => ps.map((p) => (p.pool.id === id ? fn(p) : p)));
    }

    return {
      pools,
      active,
      setActive: setActiveId,
      createPool({ name, leagueId }) {
        let id = slugify(name);
        let n = 1;
        while (pools.some((p) => p.pool.id === id)) id = `${slugify(name)}-${n++}`;
        const np: PoolState = {
          pool: { id, name: name.trim(), leagueId, players: 1 },
          hasWorld: false,
          predictions: {},
          locked: false,
        };
        setPools((ps) => [...ps, np]);
        setActiveId(id);
        return id;
      },
      setPrediction(fixtureId, side, delta) {
        update(activeId, (p) => {
          if (p.locked) return p;
          const cur = p.predictions[fixtureId] ?? { h: 0, a: 0 };
          const nextVal = Math.max(0, Math.min(9, cur[side] + delta));
          return { ...p, predictions: { ...p.predictions, [fixtureId]: { ...cur, [side]: nextVal } } };
        });
      },
      lockActive() {
        update(activeId, (p) => ({ ...p, locked: true }));
      },
    };
  }, [pools, activeId]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used within AppStoreProvider");
  return ctx;
}