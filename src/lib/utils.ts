import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTeamLabel(
  p1?: string | null,
  p2?: string | null,
  isBye?: boolean,
) {
  if (isBye) return "BYE";
  const name = [p1, p2].filter(Boolean).join(" / ");
  return name || "TBD";
}

export function formatScore(match: {
  set1A?: number | null;
  set1B?: number | null;
  set2A?: number | null;
  set2B?: number | null;
  set3A?: number | null;
  set3B?: number | null;
  superTbA?: number | null;
  superTbB?: number | null;
  status: string;
  winnerSide?: string | null;
}) {
  if (match.status === "walkover") return "WO";
  if (match.status === "bye") return "";
  if (match.winnerSide == null && match.set1A == null) return "";

  const parts: string[] = [];
  if (match.set1A != null && match.set1B != null) {
    parts.push(`${match.set1A}-${match.set1B}`);
  }
  if (match.set2A != null && match.set2B != null) {
    parts.push(`${match.set2A}-${match.set2B}`);
  }
  if (match.set3A != null && match.set3B != null) {
    parts.push(`${match.set3A}-${match.set3B}`);
  }
  if (match.superTbA != null && match.superTbB != null) {
    parts.push(`[${match.superTbA}-${match.superTbB}]`);
  }
  return parts.join(" ");
}
