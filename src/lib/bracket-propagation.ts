import type { PrismaClient } from "@prisma/client";
import {
  determineWinner,
  getParentPosition,
  getParentSlot,
  getWinnerTeamData,
  teamDataToSlotUpdate,
  type MatchTeams,
} from "./bracket-engine";

type MatchWithWinner = MatchTeams & {
  id: string;
  round: number;
  position: number;
  bracketPhaseId: string;
  winnerSide: string | null;
  status: string;
  isTeamABye: boolean;
  isTeamBBye: boolean;
  qualSlot: string | null;
  set1A: number | null;
  set1B: number | null;
  set2A: number | null;
  set2B: number | null;
  set3A: number | null;
  set3B: number | null;
  superTbA: number | null;
  superTbB: number | null;
};

export function resolveWinnerSide(match: MatchWithWinner): "A" | "B" | null {
  if (match.winnerSide === "A" || match.winnerSide === "B") {
    return match.winnerSide;
  }

  const fromScore = determineWinner({
    set1A: match.set1A ?? undefined,
    set1B: match.set1B ?? undefined,
    set2A: match.set2A ?? undefined,
    set2B: match.set2B ?? undefined,
    set3A: match.set3A ?? undefined,
    set3B: match.set3B ?? undefined,
    superTbA: match.superTbA ?? undefined,
    superTbB: match.superTbB ?? undefined,
    status: match.status,
    winnerSide: match.winnerSide as "A" | "B" | null,
  });
  if (fromScore) return fromScore;

  if (match.isTeamABye && !match.isTeamBBye) return "B";
  if (match.isTeamBBye && !match.isTeamABye) return "A";

  return null;
}

export async function propagateWithinPhase(
  prisma: PrismaClient,
  match: MatchWithWinner,
  winnerSide: "A" | "B",
) {
  const nextRound = match.round + 1;
  const nextPosition = getParentPosition(match.position);
  const destSlot = getParentSlot(match.position);

  const nextMatch = await prisma.match.findFirst({
    where: {
      bracketPhaseId: match.bracketPhaseId,
      round: nextRound,
      position: nextPosition,
    },
  });

  if (!nextMatch) return;

  const winner = getWinnerTeamData(winnerSide, match);
  await prisma.match.update({
    where: { id: nextMatch.id },
    data: teamDataToSlotUpdate(destSlot, winner),
  });
}

export async function propagateQualToFinal(
  prisma: PrismaClient,
  categoryId: string,
  qualSlot: string,
  winnerSide: "A" | "B",
  match: MatchTeams,
) {
  const finalPhase = await prisma.bracketPhase.findFirst({
    where: { categoryId, phase: "final" },
  });
  if (!finalPhase) return;

  const finalMatches = await prisma.match.findMany({
    where: { bracketPhaseId: finalPhase.id },
  });

  const qualMatch = finalMatches.find((m) => {
    const slots = [
      m.teamAPlayer1,
      m.teamAPlayer2,
      m.teamBPlayer1,
      m.teamBPlayer2,
    ];
    return slots.some((s) => s?.toUpperCase() === qualSlot.toUpperCase());
  });

  if (!qualMatch) return;

  const winner = getWinnerTeamData(winnerSide, match);
  let destSlot: "A" | "B" = "A";

  if (qualMatch.teamAPlayer2?.toUpperCase() === qualSlot.toUpperCase()) {
    destSlot = "A";
  } else if (qualMatch.teamBPlayer2?.toUpperCase() === qualSlot.toUpperCase()) {
    destSlot = "B";
  } else if (qualMatch.teamAPlayer1?.toUpperCase() === qualSlot.toUpperCase()) {
    destSlot = "A";
  } else if (qualMatch.teamBPlayer1?.toUpperCase() === qualSlot.toUpperCase()) {
    destSlot = "B";
  }

  await prisma.match.update({
    where: { id: qualMatch.id },
    data: teamDataToSlotUpdate(destSlot, winner),
  });
}

export async function propagateMatchWinner(
  prisma: PrismaClient,
  match: MatchWithWinner & {
    bracketPhase: { phase: string; categoryId: string };
  },
  winnerSide: "A" | "B",
) {
  await propagateWithinPhase(prisma, match, winnerSide);

  if (match.qualSlot && match.bracketPhase.phase === "qualification") {
    await propagateQualToFinal(
      prisma,
      match.bracketPhase.categoryId,
      match.qualSlot,
      winnerSide,
      match,
    );
  }
}

/** Replay winner propagation for every decided match in a phase (seed / repair). */
export async function reconcilePhaseBracket(
  prisma: PrismaClient,
  bracketPhaseId: string,
) {
  const phase = await prisma.bracketPhase.findUnique({
    where: { id: bracketPhaseId },
    include: { category: true },
  });
  if (!phase) return;

  const matches = await prisma.match.findMany({
    where: { bracketPhaseId },
    orderBy: [{ round: "asc" }, { position: "asc" }],
  });

  for (const match of matches) {
    const winnerSide = resolveWinnerSide(match);
    if (!winnerSide) continue;

    await propagateMatchWinner(prisma, { ...match, bracketPhase: phase }, winnerSide);
  }
}
