import { PrismaClient } from "@prisma/client";
import { updateMatchScore } from "../src/lib/tournament";
import { getParentSlot } from "../src/lib/bracket-engine";

const prisma = new PrismaClient();

async function main() {
  await prisma.match.deleteMany();
  await prisma.bracketPhase.deleteMany();
  await prisma.category.deleteMany();
  const { execSync } = await import("child_process");
  execSync("npm run db:seed", { stdio: "inherit", cwd: process.cwd() });

  const pos2 = await prisma.match.findFirst({
    where: {
      bracketPhase: { phase: "final", category: { slug: "p50" } },
      round: 1,
      position: 2,
    },
  });
  console.log("Final pos2 before:", pos2?.teamAPlayer1, pos2?.teamAPlayer2, "|", pos2?.teamBPlayer1, pos2?.teamBPlayer2);

  const qualMatch = await prisma.match.findFirst({
    where: {
      qualSlot: "Q1",
      round: 1,
      bracketPhase: { phase: "qualification", category: { slug: "p50" } },
    },
  });

  if (!qualMatch) {
    console.log("FAIL: No Q1 qual match");
    return;
  }

  await updateMatchScore(qualMatch.id, {
    set1A: 2,
    set1B: 6,
    set2A: 3,
    set2B: 6,
    status: "completed",
  });

  const parent = await prisma.match.findFirst({
    where: {
      bracketPhaseId: qualMatch.bracketPhaseId,
      round: 2,
      position: Math.ceil(qualMatch.position / 2),
    },
  });

  const slot = getParentSlot(qualMatch.position);
  const parentWinner =
    slot === "A"
      ? `${parent?.teamAPlayer1} / ${parent?.teamAPlayer2}`
      : `${parent?.teamBPlayer1} / ${parent?.teamBPlayer2}`;

  const finalR1 = await prisma.match.findMany({
    where: {
      bracketPhase: { phase: "final", category: { slug: "p50" } },
      round: 1,
    },
    select: {
      position: true,
      teamAPlayer1: true,
      teamAPlayer2: true,
      teamBPlayer1: true,
      teamBPlayer2: true,
    },
  });
  const qSlots = finalR1.filter(
    (m) =>
      [m.teamAPlayer1, m.teamAPlayer2, m.teamBPlayer1, m.teamBPlayer2].some(
        (s) => s && /^Q\d$/i.test(s),
      ),
  );
  console.log(
    "Q placeholders in final:",
    qSlots.map((m) => ({
      pos: m.position,
      a: `${m.teamAPlayer1}/${m.teamAPlayer2}`,
      b: `${m.teamBPlayer1}/${m.teamBPlayer2}`,
    })),
  );

  const finalWithWinner = await prisma.match.findFirst({
    where: {
      bracketPhase: { phase: "final", category: { slug: "p50" } },
      OR: [
        { teamAPlayer1: "MAHJOUB Anis" },
        { teamBPlayer1: "MAHJOUB Anis" },
      ],
    },
  });

  console.log("Q placeholders count:", qSlots.length);
  console.log("Final with MAHJOUB:", !!finalWithWinner, finalWithWinner?.teamAPlayer2);

  const finalFilled = !!finalWithWinner;

  console.log("Qual pos", qualMatch.position, "→ parent slot", slot);
  console.log("Parent filled:", parentWinner);
  console.log("Final Q1 filled:", finalFilled);

  if (!parentWinner || parentWinner.includes("TBD") || parentWinner.includes("BYE")) {
    console.log("FAIL: within-phase propagation");
    process.exit(1);
  }
  if (!finalFilled) {
    console.log("FAIL: qual→final propagation");
    process.exit(1);
  }
  console.log("OK: propagation verified");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
