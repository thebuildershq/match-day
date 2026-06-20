export type Score = [number, number];

export interface Scheme {
  exact: number;
  outcome: number;
}

export const SCHEME: Scheme = { exact: 3, outcome: 1 };

/** Points a prediction earns against an actual scoreline. */
export function settle(call: Score, actual: Score, s: Scheme = SCHEME): number {
  if (call[0] === actual[0] && call[1] === actual[1]) return s.exact;
  return Math.sign(call[0] - call[1]) === Math.sign(actual[0] - actual[1]) ? s.outcome : 0;
}