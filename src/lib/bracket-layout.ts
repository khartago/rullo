import type { Match } from "@prisma/client";

export const BRACKET_CARD_W = 220;
export const BRACKET_CARD_H = 62;
export const BRACKET_GAP = 16;
export const BRACKET_UNIT = BRACKET_CARD_H + BRACKET_GAP;
export const BRACKET_CONN_W = 48;

export function getRounds(matches: Match[]): number[] {
  return Array.from(new Set(matches.map((m) => m.round))).sort((a, b) => a - b);
}

export function getBracketHeight(matches: Match[]): number {
  const firstRoundCount = matches.filter((m) => m.round === 1).length || 1;
  return firstRoundCount * BRACKET_UNIT;
}

export function matchTop(round: number, position: number): number {
  const slot = BRACKET_UNIT * Math.pow(2, round - 1);
  return (position - 1) * slot + (slot - BRACKET_CARD_H) / 2;
}

export function matchCenterY(round: number, position: number): number {
  return matchTop(round, position) + BRACKET_CARD_H / 2;
}

export function roundLabelKey(
  round: number,
  totalRounds: number,
): "finalRound" | "semifinals" | "quarterfinals" | "round" {
  if (round === totalRounds) return "finalRound";
  if (round === totalRounds - 1) return "semifinals";
  if (round === totalRounds - 2) return "quarterfinals";
  return "round";
}

export function getChampionMatch(matches: Match[]): Match | null {
  if (!matches.length) return null;
  const maxRound = Math.max(...matches.map((m) => m.round));
  const final = matches.find(
    (m) => m.round === maxRound && m.position === 1 && m.winnerSide,
  );
  return final ?? null;
}

export function getPhaseStats(matches: Match[]) {
  return {
    total: matches.length,
    live: matches.filter((m) => m.status === "live").length,
    completed: matches.filter((m) =>
      ["completed", "walkover", "bye"].includes(m.status),
    ).length,
    upcoming: matches.filter((m) =>
      ["scheduled", "postponed"].includes(m.status),
    ).length,
  };
}
