"use client";

import { useState } from "react";
import type { Match } from "@prisma/client";
import { useTranslations } from "next-intl";
import { formatScore, formatTeamLabel, cn } from "@/lib/utils";
import { MatchDetailModal } from "./MatchDetailModal";

type MatchCardProps = {
  match: Match;
  compact?: boolean;
  interactive?: boolean;
};

export function MatchCard({
  match,
  compact,
  interactive = true,
}: MatchCardProps) {
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

  const card = (
    <div
      className={cn(
        "glass rounded-xl p-3 transition",
        isLive && "border-rullo-pink/50 shadow-lg shadow-rullo-pink/10",
        interactive && "cursor-pointer hover:border-rullo-mint/30",
        compact ? "text-xs" : "text-sm",
      )}
      onClick={interactive ? () => setOpen(true) : undefined}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-[10px] uppercase tracking-wider text-white/40">
          R{match.round} · M{match.position}
          {match.court ? ` · ${t("court")} ${match.court}` : ""}
        </span>
        {isLive && (
          <span className="live-pulse rounded-full bg-rullo-pink px-2 py-0.5 text-[10px] font-bold">
            {t("live")}
          </span>
        )}
        {match.status === "completed" && (
          <span className="text-[10px] text-rullo-mint">{t("completed")}</span>
        )}
      </div>
      <div className="space-y-1">
        <TeamRow name={teamA ?? "TBD"} seed={match.teamASeed} isWc={match.isTeamAWc} winner={match.winnerSide === "A"} />
        <TeamRow name={teamB ?? "TBD"} seed={match.teamBSeed} isWc={match.isTeamBWc} winner={match.winnerSide === "B"} />
      </div>
      {score && <p className="mt-2 text-center font-mono text-rullo-bronze">{score}</p>}
    </div>
  );

  return (
    <>
      {card}
      {open && <MatchDetailModal match={match} onClose={() => setOpen(false)} />}
    </>
  );
}

function TeamRow({ name, seed, isWc, winner }: { name: string; seed?: number | null; isWc?: boolean; winner?: boolean }) {
  return (
    <div className={cn("flex items-center justify-between rounded-lg px-2 py-1.5", winner ? "bg-rullo-mint/15 text-rullo-mint" : "bg-white/5", name === "BYE" && "opacity-40")}>
      <span className="truncate font-medium">{name}</span>
      <span className="ml-2 flex shrink-0 gap-1 text-[10px]">
        {seed && <span className="text-white/40">[{seed}]</span>}
        {isWc && <span className="text-rullo-bronze">WC</span>}
      </span>
    </div>
  );
}
