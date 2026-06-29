export type TeamSlot = {
  player1: string;
  player2: string;
  seed?: number;
  isBye?: boolean;
  isWildCard?: boolean;
};

export type ScoreInput = {
  set1A?: number;
  set1B?: number;
  set2A?: number;
  set2B?: number;
  set3A?: number;
  set3B?: number;
  superTbA?: number;
  superTbB?: number;
  status?: string;
  winnerSide?: "A" | "B" | null;
};

export type MatchTeams = {
  teamAPlayer1: string | null;
  teamAPlayer2: string | null;
  teamASeed: number | null;
  isTeamAWc: boolean;
  teamBPlayer1: string | null;
  teamBPlayer2: string | null;
  teamBSeed: number | null;
  isTeamBWc: boolean;
};

export function getRoundCount(bracketSize: number) {
  return Math.log2(bracketSize);
}

export function getParentPosition(matchPosition: number) {
  return Math.ceil(matchPosition / 2);
}

/** Odd positions feed teamA of parent; even positions feed teamB */
export function getParentSlot(matchPosition: number): "A" | "B" {
  return matchPosition % 2 === 1 ? "A" : "B";
}

export function determineWinner(score: ScoreInput): "A" | "B" | null {
  if (score.status === "walkover" && score.winnerSide) {
    return score.winnerSide;
  }

  let setsA = 0;
  let setsB = 0;

  if (score.set1A != null && score.set1B != null) {
    if (score.set1A > score.set1B) setsA++;
    else if (score.set1B > score.set1A) setsB++;
  }
  if (score.set2A != null && score.set2B != null) {
    if (score.set2A > score.set2B) setsA++;
    else if (score.set2B > score.set2A) setsB++;
  }
  if (score.set3A != null && score.set3B != null) {
    if (score.set3A > score.set3B) setsA++;
    else if (score.set3B > score.set3A) setsB++;
  }

  if (setsA >= 2) return "A";
  if (setsB >= 2) return "B";
  if (score.superTbA != null && score.superTbB != null) {
    if (score.superTbA > score.superTbB) return "A";
    if (score.superTbB > score.superTbA) return "B";
  }

  return score.winnerSide ?? null;
}

export function getWinnerTeamData(
  winnerSide: "A" | "B",
  match: MatchTeams,
) {
  if (winnerSide === "A") {
    return {
      player1: match.teamAPlayer1,
      player2: match.teamAPlayer2,
      seed: match.teamASeed,
      isWildCard: match.isTeamAWc,
    };
  }
  return {
    player1: match.teamBPlayer1,
    player2: match.teamBPlayer2,
    seed: match.teamBSeed,
    isWildCard: match.isTeamBWc,
  };
}

export function teamDataToSlotUpdate(
  slot: "A" | "B",
  team: {
    player1: string | null;
    player2: string | null;
    seed: number | null;
    isWildCard: boolean;
  },
) {
  if (slot === "A") {
    return {
      teamAPlayer1: team.player1,
      teamAPlayer2: team.player2,
      teamASeed: team.seed,
      isTeamAWc: team.isWildCard,
    };
  }
  return {
    teamBPlayer1: team.player1,
    teamBPlayer2: team.player2,
    teamBSeed: team.seed,
    isTeamBWc: team.isWildCard,
  };
}

export function splitTeamName(fullName: string): { p1: string; p2: string } {
  if (!fullName || fullName === "BYE" || fullName === "TBD") {
    return { p1: fullName, p2: "" };
  }
  const parts = fullName.split(" / ");
  if (parts.length >= 2) {
    return { p1: parts[0], p2: parts.slice(1).join(" / ") };
  }
  return { p1: fullName, p2: "" };
}

export function isQualPlaceholder(name: string | null | undefined) {
  return !!name && /^Q\d+$/i.test(name);
}
