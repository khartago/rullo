/**
 * Regenerates tournament-seed.json from data/pdf-brackets.json (El_RuLO.pdf source).
 * Run: npx tsx scripts/import-el-rulo-pdf.ts
 */
import { CATEGORIES } from "../src/data/categories";
import { getMatchesForCategoryPhase } from "../src/data/category-seeds";
import pdfBrackets from "../data/pdf-brackets.json";
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const output: {
  source: string;
  pdfSource: string;
  generatedAt: string;
  categories: Record<string, unknown>;
} = {
  source: "data/pdf-brackets.json",
  pdfSource: (pdfBrackets as { source?: string }).source ?? "El_RuLO.pdf",
  generatedAt: new Date().toISOString(),
  categories: {},
};

for (const cat of CATEGORIES) {
  output.categories[cat.slug] = {
    nameFr: cat.nameFr,
    bracketSize: cat.bracketSize,
    phases: Object.fromEntries(
      cat.phases.map((p) => [
        p.phase,
        {
          round1Matches: getMatchesForCategoryPhase(
            cat.slug,
            p.phase,
            cat.bracketSize,
          ).filter((m) => m.round === 1),
        },
      ]),
    ),
  };
}

const dataDir = join(__dirname, "../data");
mkdirSync(dataDir, { recursive: true });
const outPath = join(dataDir, "tournament-seed.json");
writeFileSync(outPath, JSON.stringify(output, null, 2));
console.log(`Written ${outPath} from pdf-brackets.json`);
