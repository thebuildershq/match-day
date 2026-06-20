export type LeagueId = "epl" | "laliga" | "ucl" | "seriea" | "bundes" | "ligue1";

export interface League {
  id: LeagueId;
  code: string; // football-data.org v4 competition code (used when wiring)
  name: string;
  tag: string;
  color: string;
}

export const LEAGUES: League[] = [
  { id: "epl",    code: "PL",  name: "Premier League",   tag: "PL", color: "#3d195b" },
  { id: "laliga", code: "PD",  name: "La Liga",          tag: "LL", color: "#e8311f" },
  { id: "ucl",    code: "CL",  name: "Champions League", tag: "CL", color: "#0a2240" },
  { id: "seriea", code: "SA",  name: "Serie A",          tag: "SA", color: "#0b7d3e" },
  { id: "bundes", code: "BL1", name: "Bundesliga",       tag: "BL", color: "#d20515" },
  { id: "ligue1", code: "FL1", name: "Ligue 1",          tag: "L1", color: "#1a2c50" },
];

export const leagueById = (id: string): League =>
  LEAGUES.find((l) => l.id === id) ?? LEAGUES[0];