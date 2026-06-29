import type { TeamSlot } from "../lib/bracket-engine";

export type SeedMatch = {
  round: number;
  position: number;
  teamA: TeamSlot;
  teamB: TeamSlot;
  score?: {
    set1A?: number;
    set1B?: number;
    set2A?: number;
    set2B?: number;
    set3A?: number;
    set3B?: number;
    superTbA?: number;
    superTbB?: number;
    status?: string;
    winnerSide?: "A" | "B";
  };
  qualSlot?: string;
  court?: number;
  scheduledAt?: string;
  status?: string;
};

function team(
  p1: string,
  p2 = "",
  opts: Partial<TeamSlot> = {},
): TeamSlot {
  return { player1: p1, player2: p2, ...opts };
}

function bye(): TeamSlot {
  return { player1: "BYE", player2: "", isBye: true };
}

export const P50_QUALIFICATION: SeedMatch[] = [
  { round: 1, position: 1, teamA: team("BEN SLAMA Mohamed ali", "MAHDI Ben slama", { seed: 1 }), teamB: bye() },
  { round: 1, position: 2, teamA: bye(), teamB: team("MAHJOUB Anis", "CHARFEDDINE Anis", { seed: 3 }) },
  { round: 1, position: 3, teamA: team("BOUATAY Montassar", "SKIK Yahia", { seed: 4 }), teamB: bye() },
  { round: 1, position: 4, teamA: bye(), teamB: team("BEN SALEM Oussama", "ZOUARI Achref", { seed: 8 }), score: { set1A: 6, set1B: 4, set2A: 6, set2B: 3, winnerSide: "B", status: "completed" } },
  { round: 1, position: 5, teamA: team("AROUA Hamza", "ABDELMALEK Houssem eddin", { seed: 3 }), teamB: bye() },
  { round: 1, position: 6, teamA: bye(), teamB: team("SOUISSI Slim", "AYEDI Momtez", { seed: 12 }), score: { set1A: 3, set1B: 6, set2A: 6, set2B: 4, superTbA: 10, superTbB: 8, winnerSide: "B", status: "completed" } },
  { round: 1, position: 7, teamA: team("HADJ AMMAR Raif", "KHAYECHE Slim", { seed: 15 }), teamB: bye() },
  { round: 1, position: 8, teamA: bye(), teamB: team("BEN HSSAN Mohamed", "TALHA MZALI Taoufik", { seed: 16 }) },
  { round: 1, position: 9, teamA: team("BELHADJ Skander selim", "GUERMAZI Nassim", { seed: 5 }), teamB: bye() },
  { round: 1, position: 10, teamA: bye(), teamB: team("ACHOUR Fethi", "ACHOUR Racem", { seed: 13 }), score: { set1A: 7, set1B: 5, set2A: 3, set2B: 6, superTbA: 10, superTbB: 6, winnerSide: "B", status: "completed" } },
  { round: 1, position: 11, teamA: team("BOUZIR Mohamed khalil", "BOUZIR Mahdi", { seed: 6 }), teamB: bye() },
  { round: 1, position: 12, teamA: bye(), teamB: team("FEHMI Kacem", "TRABELSI Aymen", { seed: 12 }), score: { set1A: 6, set1B: 2, set2A: 7, set2B: 5, winnerSide: "B", status: "completed" } },
  { round: 1, position: 13, teamA: team("GLISSA Laith", "LAARIF Ali", { seed: 7 }), teamB: bye() },
  { round: 1, position: 14, teamA: team("GZARA Mohamed amer", "AHMED Zayen", { seed: 18 }), teamB: team("DAHMANI Nabil", "SEGNI Youssef", { seed: 4 }), score: { set1A: 6, set1B: 1, set2A: 6, set2B: 4, winnerSide: "A", status: "completed" } },
  { round: 1, position: 15, teamA: team("BOUGHZALA Anas", "CHNEN Khalil", { seed: 29 }), teamB: bye() },
  { round: 1, position: 16, teamA: team("BEN AMMAR Najd", "BEN AMMAR Fahd", { seed: 15 }), teamB: team("DEBBABI Hassen", "BEN ABDALLAH Salem", { seed: 16 }), score: { status: "walkover", winnerSide: "B" } },
];

export const P50_FINAL_TEAMS: TeamSlot[] = [
  team("ABDELLATIF Haykel", "GALAI Mohamed", { seed: 1 }),
  team("AROUA Hamza", "ABDELMALEK Houssem eddin", { seed: 27 }),
  team("MOTAMRI Ismail", "GUELLIM Mohamed ilyess"),
  team("TBD", "Q1"),
  team("EL HANI Youssef", "MEHDWI Mohamed hamza", { seed: 11 }),
  team("SAHBANI Mehdi", "BELHADJ Yassine", { seed: 14, isWildCard: true }),
  team("HIZEM Mourad", "YASSINE Baoueb", { seed: 9 }),
  team("HAFSA Marouen", "KALEL Wael", { seed: 8 }),
  team("ZAOUI Mondher", "CHENITI Wajdi", { seed: 4 }),
  team("BASSEM Bennani", "ROUATBI Mohamed", { seed: 17 }),
  team("TBD", "Q4"),
  team("KRID Mounir", "BEN GHORBAL Anas", { seed: 9 }),
  team("BOURKHIS Oussama", "KANTAOUI Nessim", { seed: 10 }),
  team("GZARA Mohamed amer", "AHMED Zayen", { seed: 31 }),
  team("MOATEMRI Mehdi", "HALILA Ahmed", { isWildCard: true }),
  team("SAFTA Souhaiel", "ALLEGUE Selim", { seed: 5 }),
  team("MASMOUDI Nizar", "KAMOUN Mohamed amin", { seed: 6 }),
  team("YOUSSEF Mkaouar", "HAFSA Malek", { seed: 13 }),
  team("BEN SALEM Oussama", "ZOUARI Achref", { seed: 26 }),
  team("WERDA Mohamed", "BEN MOULAY HSSAN Omar", { seed: 16 }),
  team("MANAA Mohamed", "SLAMA Mohamed aziz", { seed: 19 }),
  team("SAIES Ahmed nawfel", "ABDERRAZEK Ghazi", { seed: 16 }),
  team("ACHOUR Fethi", "ACHOUR Racem", { seed: 29 }),
  team("DOUDECH Mohamed", "BELKHIRIA Mehdi", { seed: 28 }),
  team("SAFTA Salaheddine", "BROUR Bassem", { seed: 7 }),
  team("REMADY Haykel", "FRIGUI Achraf", { seed: 18 }),
  team("CHAMLI Mohamed youssef", "GUEN Nizar", { seed: 10 }),
  team("FEHMI Kacem", "TRABELSI Aymen", { seed: 30 }),
  team("GONGI Tarek", "JEBALI Badreddine", { seed: 11, isWildCard: true }),
  team("BOUSLAMA Mohamed amine", "TARMIZ Amine", { seed: 13 }),
  team("BOUGHZALA Anas", "CHNEN Khalil", { seed: 32 }),
  team("MAJDOUB Salem", "KENZIZI Aziz", { seed: 2 }),
];

export const P1000_FINAL_TEAMS: TeamSlot[] = [
  team("REDONDO Javier", "ELLOUMI Mehdi", { seed: 1 }),
  team("BECHEUR Rami", "LAADHARI Sedki", { seed: 7 }),
  team("CHEBLI Achraf", "HAOUAS Alaa", { seed: 10 }),
  team("FREIXAS Albert", "KALLEL Riadh", { seed: 4, isWildCard: true }),
  team("BEN JEDDOU Amine", "ALOUINI Youssef", { seed: 9 }),
  team("GONGI Hedi", "MLIKA Fedi", { seed: 8 }),
  team("EL AROUI Selim", "HELALI Aziz", { seed: 6 }),
  team("BEN DHIAF Youssef", "OUALI Chiheb", { seed: 5 }),
  team("BOUGUERRA Maher", "FREIXAS Josep", { seed: 3 }),
  team("DERBEL Youssef", "MEHDI Abdennebi", { seed: 11 }),
  team("BADRI Hichem", "TRIKI Arbi", { seed: 12, isWildCard: true }),
  team("DABBABI Youssef", "CHOUAIEB Yassine", { seed: 2 }),
];

export const P50F_FINAL_TEAMS: TeamSlot[] = [
  team("BOUSSAADIA Asma", "DRISS Leila", { seed: 1 }),
  team("CHIKHAOUI Ines", "BEN KAHLA Nawrass", { seed: 5 }),
  team("BEN ABDESSLEM Aroua", "GHARBI Emna", { seed: 10, isWildCard: true }),
  team("MOKNI Sirine", "COLAS Léa", { seed: 3 }),
  team("NADA Toumi", "BARHOUMI Nada", { seed: 7 }),
  team("BOUZRARA Emna", "BEN ALI Nourhene", { seed: 6 }),
  team("DJOMAA Zahra", "MOKNI Farah", { isWildCard: true }),
  team("BENZARTI Nour el houda", "HAGGUI Eya", { seed: 8 }),
  team("MANI Imen", "MANI Ines", { seed: 12 }),
  team("STAMBOULI Imen", "STAMBOULI Sahar"),
  team("AMAMOU Rania", "CHTIOUI Ameni", { seed: 4 }),
  team("ZHIR Rihem", "BATBOUT Olfa"),
  team("MASMOUDI Razane", "JALLOULI Fatma", { seed: 11 }),
  team("SASSY Salma", "LAARIF Cyrine", { seed: 9 }),
  team("YAZIDI Nadia", "LIMEM Olfa", { seed: 2 }),
  team("TBD", "TBD"),
];

export const P100_MIXTE_TEAMS: TeamSlot[] = [
  team("BEN MAHMOUD Mehdi", "HABBEJ Farah", { seed: 1 }),
  team("GUELLIM Yasmine", "GUELLIM Mohamed ilyess"),
  team("KNANI Latifa", "ZOUARI Achref", { seed: 15 }),
  team("ZHIR Yasmine", "GALAI Mohamed", { seed: 5 }),
  team("MOUSSA Marwen", "STAMBOULI Sahar", { seed: 4 }),
  team("MASMOUDI Nizar", "SELLAMI Noura", { seed: 6 }),
  team("FETNI Fadhl", "BEN ABDALLAH Asma", { seed: 7 }),
  team("MOATEMRI Mehdi", "LAARIF Khadija"),
  team("AHMED Zayen", "ZIDI Zeineb", { seed: 10 }),
  team("GAALOUL Majdi", "KRIFA Helene", { seed: 8 }),
  team("FATNASSI Sirine", "SLAMA Mohamed aziz", { seed: 11 }),
  team("YOUSSEF Mkaouar", "HAJJAJI Mejda", { seed: 3 }),
  team("DAHMANI Nabil", "SASSY Salma", { seed: 4 }),
  team("MANI Mariem", "LASMER Ahmed Amine", { seed: 18, isWildCard: true }),
  team("MASMOUDI Mohamed", "MASMOUDI Razane", { seed: 14 }),
  team("EL BEHI Mohamed", "BARHOUMI Nada", { seed: 2 }),
];

export function buildRound1Matches(teams: TeamSlot[]): SeedMatch[] {
  const matches: SeedMatch[] = [];
  const matchCount = teams.length / 2;
  for (let i = 0; i < matchCount; i++) {
    matches.push({
      round: 1,
      position: i + 1,
      teamA: teams[i * 2],
      teamB: teams[i * 2 + 1],
    });
  }
  return matches;
}

export function buildEmptyBracket(bracketSize: number): SeedMatch[] {
  const matches: SeedMatch[] = [];
  const rounds = Math.log2(bracketSize);
  for (let round = 1; round <= rounds; round++) {
    const count = bracketSize / Math.pow(2, round);
    for (let position = 1; position <= count; position++) {
      matches.push({
        round,
        position,
        teamA: team("TBD", ""),
        teamB: team("TBD", ""),
      });
    }
  }
  return matches;
}
