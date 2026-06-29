import { prisma } from "./prisma";
import {
  determineWinner,
} from "./bracket-engine";
import { propagateMatchWinner } from "./bracket-propagation";

export async function getTournamentStats() {
  const [played, live, upcoming] = await Promise.all([
    prisma.match.count({ where: { status: "completed" } }),
    prisma.match.count({ where: { status: "live" } }),
    prisma.match.count({
      where: { status: { in: ["scheduled", "postponed"] } },
    }),
  ]);
  return { played, live, upcoming };
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { phases: true },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: { phases: { orderBy: { phase: "asc" } } },
  });
}

export async function getMatchesForPhase(bracketPhaseId: string) {
  return prisma.match.findMany({
    where: { bracketPhaseId },
    orderBy: [{ round: "asc" }, { position: "asc" }],
  });
}

export async function getAllMatches(filters?: {
  categorySlug?: string;
  court?: number;
  date?: string;
  status?: string;
}) {
  return prisma.match.findMany({
    where: {
      status: filters?.status,
      court: filters?.court,
      ...(filters?.date
        ? {
            scheduledAt: {
              gte: new Date(`${filters.date}T00:00:00`),
              lt: new Date(`${filters.date}T23:59:59`),
            },
          }
        : {}),
      ...(filters?.categorySlug
        ? {
            bracketPhase: {
              category: { slug: filters.categorySlug },
            },
          }
        : {}),
    },
    include: {
      bracketPhase: {
        include: { category: true },
      },
    },
    orderBy: [{ scheduledAt: "asc" }, { round: "asc" }],
  });
}

export async function updateMatchScore(
  matchId: string,
  data: {
    set1A?: number | null;
    set1B?: number | null;
    set2A?: number | null;
    set2B?: number | null;
    set3A?: number | null;
    set3B?: number | null;
    superTbA?: number | null;
    superTbB?: number | null;
    status?: string;
    winnerSide?: "A" | "B" | null;
    court?: number | null;
    scheduledAt?: string | null;
  },
) {
  const existing = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      bracketPhase: { include: { category: true } },
    },
  });
  if (!existing) throw new Error("Match not found");

  const winnerSide =
    data.winnerSide ??
    determineWinner({
      set1A: data.set1A ?? undefined,
      set1B: data.set1B ?? undefined,
      set2A: data.set2A ?? undefined,
      set2B: data.set2B ?? undefined,
      set3A: data.set3A ?? undefined,
      set3B: data.set3B ?? undefined,
      superTbA: data.superTbA ?? undefined,
      superTbB: data.superTbB ?? undefined,
      status: data.status,
      winnerSide: data.winnerSide,
    });

  const status =
    data.status ?? (winnerSide ? "completed" : existing.status);

  const updated = await prisma.match.update({
    where: { id: matchId },
    data: {
      set1A: data.set1A,
      set1B: data.set1B,
      set2A: data.set2A,
      set2B: data.set2B,
      set3A: data.set3A,
      set3B: data.set3B,
      superTbA: data.superTbA,
      superTbB: data.superTbB,
      status,
      winnerSide,
      court: data.court,
      ...(data.scheduledAt !== undefined
        ? {
            scheduledAt: data.scheduledAt
              ? new Date(data.scheduledAt)
              : null,
          }
        : {}),
    },
    include: {
      bracketPhase: { include: { category: true } },
    },
  });

  if (winnerSide) {
    await propagateMatchWinner(prisma, updated, winnerSide);
  }

  return updated;
}
