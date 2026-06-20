import {  type Score } from "./scoring";

export interface WorldFixture {
  id: string;
  home: string;
  homeAbbr: string;
  homeColor: string;
  homeText: string;
  away: string;
  awayAbbr: string;
  awayColor: string;
  awayText: string;
  kickoff: string;
  lockInHours: number;
  actual: Score | null; // null = not played yet
}

export interface WorldPlayer {
  id: string;
  name: string;
  color: string;
  base: number; // season points before this matchday
  me?: boolean;
}

export const MATCHDAY = 24;

export const WORLD_FIXTURES: WorldFixture[] = [
  { id: "f1", home: "Liverpool", homeAbbr: "LIV", homeColor: "#c8102e", homeText: "#fff", away: "Man City", awayAbbr: "MCI", awayColor: "#6cabdd", awayText: "#0a2240", kickoff: "Sat 12:30", lockInHours: 28, actual: [2, 1] },
  { id: "f2", home: "Arsenal", homeAbbr: "ARS", homeColor: "#e8311f", homeText: "#fff", away: "Tottenham", awayAbbr: "TOT", awayColor: "#fff", awayText: "#132257", kickoff: "Sat 15:00", lockInHours: 30.5, actual: [1, 0] },
  { id: "f3", home: "Chelsea", homeAbbr: "CHE", homeColor: "#034694", homeText: "#fff", away: "Newcastle", awayAbbr: "NEW", awayColor: "#18150f", awayText: "#fff", kickoff: "Sat 15:00", lockInHours: 30.5, actual: [2, 2] },
  { id: "f4", home: "Man Utd", homeAbbr: "MUN", homeColor: "#da291c", homeText: "#fff", away: "Aston Villa", awayAbbr: "AVL", awayColor: "#670e36", awayText: "#fff", kickoff: "Sat 17:30", lockInHours: 33, actual: [0, 1] },
  { id: "f5", home: "Brighton", homeAbbr: "BHA", homeColor: "#0057b8", homeText: "#fff", away: "West Ham", awayAbbr: "WHU", awayColor: "#7a263a", awayText: "#fff", kickoff: "Sun 14:00", lockInHours: 53.5, actual: [3, 1] },
  { id: "f6", home: "Everton", homeAbbr: "EVE", homeColor: "#003399", homeText: "#fff", away: "Wolves", awayAbbr: "WOL", awayColor: "#fdb913", awayText: "#231f20", kickoff: "Sun 16:30", lockInHours: 56, actual: null },
];

export const WORLD_PLAYERS: WorldPlayer[] = [
  { id: "p1", name: "Dela", color: "#2a64c4", base: 41 },
  { id: "p2", name: "Ama", color: "#1f8a4d", base: 38 },
  { id: "p3", name: "Kojo", color: "#c8102e", base: 36 },
  { id: "me", name: "You", color: "#e8311f", base: 32, me: true },
  { id: "p5", name: "Tunde", color: "#6b3fa0", base: 30 },
  { id: "p6", name: "Zainab", color: "#d98a00", base: 27 },
  { id: "p7", name: "Femi", color: "#0a7d7d", base: 24 },
  { id: "p8", name: "Chidi", color: "#444", base: 21 },
];

// Authored matchday gains for everyone EXCEPT you (your points are computed from
// your real predictions). Values are 3 (exact) or 1 (right result) — scheme-coherent.
export const OTHER_GAINS: Record<string, Record<string, number>> = {
  f1: { p1: 1, p3: 3, p7: 1 },
  f2: { p2: 3, p5: 1, p8: 1 },
  f3: { p1: 3, p6: 1 },
  f4: { p3: 1, p5: 3, p7: 1 },
  f5: { p2: 1, p1: 1, p6: 3 },
};

/** Fixtures with a final score, in play order — drives the live settle. */
export const PLAYED = WORLD_FIXTURES.filter((f) => f.actual !== null);