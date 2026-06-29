export type SponsorTier = "premium" | "partner" | "local" | "institutional";

export type Sponsor = {
  name: string;
  tier: SponsorTier;
  logo?: string;
  url?: string;
};

export const SPONSORS: Sponsor[] = [
  { name: "Nouvelair", tier: "premium", logo: "/sponsors/nouvelair.svg", url: "https://www.nouvelair.com" },
  { name: "KBAYER Meubles", tier: "premium", logo: "/sponsors/kbayer.svg" },
  { name: "Toyota", tier: "premium", logo: "/sponsors/toyota.svg", url: "https://www.toyota.tn" },
  { name: "Magic Hotels", tier: "premium", logo: "/sponsors/magic-hotels.svg" },
  { name: "Bullpadel", tier: "partner", logo: "/sponsors/bullpadel.svg", url: "https://www.bullpadel.com" },
  { name: "Padup", tier: "partner", logo: "/sponsors/padup.svg" },
  { name: "Pristine", tier: "partner", logo: "/sponsors/pristine.svg" },
  { name: "FTT", tier: "institutional", logo: "/sponsors/ftt.svg", url: "https://fttlp.com" },
  { name: "Crêpes Factory", tier: "local" },
  { name: "Tamaris", tier: "local" },
];

export function sponsorsByTier(tier: SponsorTier) {
  return SPONSORS.filter((s) => s.tier === tier);
}
