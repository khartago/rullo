import { PrismaClient } from "@prisma/client";
import { CATEGORIES } from "../src/data/categories";
import { getMatchesForCategoryPhase } from "../src/data/category-seeds";
import type { SeedMatch } from "../src/data/seed-matches";
import { reconcilePhaseBracket } from "../src/lib/bracket-propagation";

const prisma = new PrismaClient();

async function seedPhase(
  bracketPhaseId: string,
  matches: SeedMatch[],
  bracketSize: number,
) {
  const rounds = Math.log2(bracketSize);

  for (let round = 1; round <= rounds; round++) {
    const count = bracketSize / Math.pow(2, round);
    for (let position = 1; position <= count; position++) {
      const seed = matches.find((m) => m.round === round && m.position === position);
      const teamA = seed?.teamA ?? { player1: "TBD", player2: "" };
      const teamB = seed?.teamB ?? { player1: "TBD", player2: "" };

      await prisma.match.create({
        data: {
          bracketPhaseId,
          round,
          position,
          court: seed?.court,
          scheduledAt: seed?.scheduledAt ? new Date(seed.scheduledAt) : null,
          status: seed?.score?.status ?? seed?.status ?? "scheduled",
          qualSlot: seed?.qualSlot,
          teamAPlayer1: teamA.player1,
          teamAPlayer2: teamA.player2 || null,
          teamASeed: teamA.seed ?? null,
          isTeamAWc: teamA.isWildCard ?? false,
          isTeamABye: teamA.isBye ?? false,
          teamBPlayer1: teamB.player1,
          teamBPlayer2: teamB.player2 || null,
          teamBSeed: teamB.seed ?? null,
          isTeamBWc: teamB.isWildCard ?? false,
          isTeamBBye: teamB.isBye ?? false,
          set1A: seed?.score?.set1A,
          set1B: seed?.score?.set1B,
          set2A: seed?.score?.set2A,
          set2B: seed?.score?.set2B,
          set3A: seed?.score?.set3A,
          set3B: seed?.score?.set3B,
          superTbA: seed?.score?.superTbA,
          superTbB: seed?.score?.superTbB,
          winnerSide: seed?.score?.winnerSide,
        },
      });
    }
  }
}

async function main() {
  const existing = await prisma.category.count();
  if (existing > 0) {
    console.log("Database already seeded — skipping.");
    return;
  }

  await prisma.match.deleteMany();
  await prisma.bracketPhase.deleteMany();
  await prisma.category.deleteMany();

  for (const cat of CATEGORIES) {
    const category = await prisma.category.create({
      data: {
        slug: cat.slug,
        nameFr: cat.nameFr,
        nameEn: cat.nameEn,
        gender: cat.gender,
        level: cat.level,
        bracketSize: cat.bracketSize,
        sortOrder: cat.sortOrder,
        phases: {
          create: cat.phases.map((p) => ({
            phase: p.phase,
            labelFr: p.labelFr,
            labelEn: p.labelEn,
          })),
        },
      },
      include: { phases: true },
    });

    for (const phase of category.phases) {
      const matches = getMatchesForCategoryPhase(
        cat.slug,
        phase.phase,
        category.bracketSize,
      );
      await seedPhase(phase.id, matches, category.bracketSize);
      await reconcilePhaseBracket(prisma, phase.id);
    }
  }

  console.log("Seed completed — 10 categories.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
