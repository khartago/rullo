export const CATEGORIES = [
  {
    slug: "p50",
    nameFr: "P50 Hommes",
    nameEn: "P50 Men",
    gender: "men",
    level: "P50",
    bracketSize: 32,
    sortOrder: 1,
    phases: [
      { phase: "qualification", labelFr: "Qualification", labelEn: "Qualification" },
      { phase: "final", labelFr: "Tableau final", labelEn: "Main Draw" },
    ],
  },
  {
    slug: "p100",
    nameFr: "P100 Hommes",
    nameEn: "P100 Men",
    gender: "men",
    level: "P100",
    bracketSize: 32,
    sortOrder: 2,
    phases: [
      { phase: "qualification", labelFr: "Qualification", labelEn: "Qualification" },
      { phase: "final", labelFr: "Tableau final", labelEn: "Main Draw" },
    ],
  },
  {
    slug: "p250",
    nameFr: "P250 Hommes",
    nameEn: "P250 Men",
    gender: "men",
    level: "P250",
    bracketSize: 32,
    sortOrder: 3,
    phases: [{ phase: "final", labelFr: "Tableau final", labelEn: "Main Draw" }],
  },
  {
    slug: "p500",
    nameFr: "P500 Hommes",
    nameEn: "P500 Men",
    gender: "men",
    level: "P500",
    bracketSize: 16,
    sortOrder: 4,
    phases: [{ phase: "final", labelFr: "Tableau final", labelEn: "Main Draw" }],
  },
  {
    slug: "p1000",
    nameFr: "P1000 Hommes",
    nameEn: "P1000 Men",
    gender: "men",
    level: "P1000",
    bracketSize: 16,
    sortOrder: 5,
    phases: [{ phase: "final", labelFr: "Tableau final", labelEn: "Main Draw" }],
  },
  {
    slug: "p50f",
    nameFr: "P50 Femmes",
    nameEn: "P50 Women",
    gender: "women",
    level: "P50",
    bracketSize: 16,
    sortOrder: 6,
    phases: [{ phase: "final", labelFr: "Tableau final", labelEn: "Main Draw" }],
  },
  {
    slug: "p100f",
    nameFr: "P100 Femmes",
    nameEn: "P100 Women",
    gender: "women",
    level: "P100",
    bracketSize: 16,
    sortOrder: 7,
    phases: [{ phase: "final", labelFr: "Tableau final", labelEn: "Main Draw" }],
  },
  {
    slug: "p500f",
    nameFr: "P500 Femmes",
    nameEn: "P500 Women",
    gender: "women",
    level: "P500",
    bracketSize: 16,
    sortOrder: 8,
    phases: [{ phase: "final", labelFr: "Tableau final", labelEn: "Main Draw" }],
  },
  {
    slug: "p1000f",
    nameFr: "P1000 Femmes",
    nameEn: "P1000 Women",
    gender: "women",
    level: "P1000",
    bracketSize: 16,
    sortOrder: 9,
    phases: [{ phase: "final", labelFr: "Tableau final", labelEn: "Main Draw" }],
  },
  {
    slug: "p100-mixte",
    nameFr: "P100 Mixte",
    nameEn: "P100 Mixed",
    gender: "mixed",
    level: "P100",
    bracketSize: 16,
    sortOrder: 10,
    phases: [{ phase: "final", labelFr: "Tableau final", labelEn: "Main Draw" }],
  },
] as const;

export const FTT_URL =
  "https://fttlp.com/tournoi/17eme-etape-ftt-el-rulo-padel-club";

export const LINKEDIN_RYNEX =
  "https://www.linkedin.com/in/rayane-bouzir-594a09274/";

export const TOURNAMENT_DATES = {
  start: new Date("2026-06-27"),
  end: new Date("2026-07-05"),
};
