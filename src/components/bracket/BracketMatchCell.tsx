"use client";

import { useState } from "react";
import type { Match } from "@prisma/client";
import { useTranslations } from "next-intl";
import {
  BRACKET_CARD_H,
  BRACKET_CARD_W,
} from "@/lib/bracket-layout";
import { formatScore, formatTeamLabel, cn } from "@/lib/utils";
import { MatchDetailModal } from "./MatchDetailModal";

type BracketMatchCellProps = {
  match: Match;
  isFinal?: boolean;
};

export function BracketMatchCell({ match, isFinal }: BracketMatchCellProps) {
  const t = useTranslations("tournament");
  const [open, setOpen] = useState(false);

  const teamA = formatTeamLabel(
    match.teamAPlayer1,
    match.teamAPlayer2,
    match.isTeamABye,
  );
  const teamB = formatTeamLabel(
    match.teamBPlayer1,
    match.teamBPlayer2,
    match.isTeamBBye,
  );
  const score = formatScore(match);
  const isLive = match.status === "live";

  return (
    <>
      <div className="relative" style={{ width: BRACKET_CARD_W }}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "group w-full overflow-hidden rounded-xl border text-left transition-all duration-200",
            isFinal
              ? "border-rullo-bronze/60 bg-gradient-to-br from-rullo-dark to-rullo-sea/30 shadow-lg shadow-rullo-bronze/10"
              : "border-white/12 bg-rullo-dark/95 shadow-sm",
            "hover:-translate-y-0.5 hover:border-rullo-mint/50 hover:shadow-lg hover:shadow-rullo-mint/10",
            isLive && "border-rullo-pink/70 ring-2 ring-rullo-pink/25",
          )}
          style={{ height: BRACKET_CARD_H }}
        >
          <BracketTeamRow
            name={teamA ?? "TBD"}
            seed={match.teamASeed}
            isWc={match.isTeamAWc}
            winner={match.winnerSide === "A"}
            isBye={match.isTeamABye}
          />
          <div className="mx-2 h-px bg-white/10" />
          <BracketTeamRow
            name={teamB ?? "TBD"}
            seed={match.teamBSeed}
            isWc={match.isTeamBWc}
            winner={match.winnerSide === "B"}
            isBye={match.isTeamBBye}
          />
        </button>
        {isLive && (
          <span className="absolute -right-1.5 -top-1.5 live-pulse rounded-md bg-rullo-pink px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide shadow-lg">
            {t("live")}
          </span>
        )}
        {score && (
          <p className="mt-1 text-center font-mono text-[10px] font-medium text-rullo-bronze">
            {score}
          </p>
        )}
      </div>
      {open && (
        <MatchDetailModal match={match} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

function BracketTeamRow({
  name,
  seed,
  isWc,
  winner,
  isBye,
}: {
  name: string;
  seed?: number | null;
  isWc?: boolean;
  winner?: boolean;
  isBye?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-[30px] items-center gap-2 px-2.5 text-[11px]",
        winner && "bg-rullo-mint/25 font-semibold text-rullo-mint",
        !winner && "text-white/90",
        (isBye || name === "BYE") && "text-white/25 italic",
      )}
    >
      {winner && (
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-rullo-mint" />
      )}
      <span className="min-w-0 flex-1 truncate leading-tight">{name}</span>
      <span className="flex shrink-0 items-center gap-1 text-[9px]">
        {seed != null && (
          <span className="rounded bg-white/8 px-1 text-white/40">{seed}</span>
        )}
        {isWc && (
          <span className="rounded bg-rullo-bronze/20 px-1 text-rullo-bronze">
            WC
          </span>
        )}
      </span>
    </div>
  );
}
