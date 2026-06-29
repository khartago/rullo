/**
 * Tournament seed registry — loaded from data/pdf-brackets.json (El_RuLO.pdf).
 */
import pdfBrackets from "../../data/pdf-brackets.json";
import type { SeedMatch } from "./seed-matches";
import { buildRound1Matches, buildEmptyBracket } from "./seed-matches";
import type { TeamSlot } from "../lib/bracket-engine";

type JsonTeam = {
  player1: string;
  player2?: string;
  seed?: number;
  isBye?: boolean;
  isWildCard?: boolean;
};

type JsonMatch = {
  round: number;
  position: number;
  teamA: JsonTeam;
  teamB: JsonTeam;
  score?: SeedMatch["score"];
  qualSlot?: string;
};

type PdfBrackets = {
  categories: Record<
    string,
    Record<string, { round1: JsonMatch[] }>
  >;
};

const brackets = pdfBrackets as PdfBrackets;

function jsonTeamToSlot(team: JsonTeam): TeamSlot {
  return {
    player1: team.player1,
    player2: team.player2 ?? "",
    ...(team.seed !== undefined ? { seed: team.seed } : {}),
    ...(team.isBye ? { isBye: true } : {}),
    ...(team.isWildCard ? { isWildCard: true } : {}),
  };
}

function jsonMatchToSeed(match: JsonMatch): SeedMatch {
  return {
    round: match.round,
    position: match.position,
    teamA: jsonTeamToSlot(match.teamA),
    teamB: jsonTeamToSlot(match.teamB),
    ...(match.score ? { score: match.score } : {}),
    ...(match.qualSlot ? { qualSlot: match.qualSlot } : {}),
  };
}

function round1FromJson(slug: string, phase: string): SeedMatch[] | null {
  const phaseData = brackets.categories[slug]?.[phase];
  if (!phaseData?.round1?.length) return null;
  return phaseData.round1.map(jsonMatchToSeed);
}

export type CategorySeedConfig = {
  slug: string;
  phases: Record<string, SeedMatch[] | (() => SeedMatch[])>;
};

export function getMatchesForCategoryPhase(
  slug: string,
  phase: string,
  bracketSize: number,
): SeedMatch[] {
  const empty = buildEmptyBracket(bracketSize).filter((m) => m.round > 1);
  const round1 = round1FromJson(slug, phase);

  if (round1) {
    return [...round1, ...empty];
  }

  return buildEmptyBracket(bracketSize);
}

/** Re-export for scripts that build round-1 from flat team lists. */
export { buildRound1Matches, buildEmptyBracket };
