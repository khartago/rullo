"use client";

import type { Match } from "@prisma/client";
import { useTranslations } from "next-intl";
import { formatScore, formatTeamLabel } from "@/lib/utils";

type MatchDetailModalProps = {
  match: Match;
  onClose: () => void;
};

export function MatchDetailModal({ match, onClose }: MatchDetailModalProps) {
  const t = useTranslations("tournament");
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

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="glass w-full max-w-md rounded-2xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="match-detail-title"
      >
        <div className="flex items-start justify-between gap-4">
          <h3 id="match-detail-title" className="text-lg font-bold">
            {t("matchDetail")}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-white/50 transition hover:bg-white/10 hover:text-white"
            aria-label={t("close")}
          >
            ✕
          </button>
        </div>
        <p className="mt-2 text-xs text-white/50">
          {t("round")} {match.round} · M{match.position}
          {match.court ? ` · ${t("court")} ${match.court}` : ""}
        </p>
        {match.scheduledAt && (
          <p className="mt-1 text-sm text-rullo-mint">
            {t("time")}: {match.scheduledAt.toLocaleString()}
          </p>
        )}
        <div className="mt-4 space-y-2">
          <p className="text-xs uppercase tracking-wider text-white/40">
            {t("players")}
          </p>
          <p className="font-medium">{teamA}</p>
          <p className="text-white/50">vs</p>
          <p className="font-medium">{teamB}</p>
        </div>
        {score && (
          <p className="mt-4 text-center font-mono text-xl text-rullo-bronze">
            {score}
          </p>
        )}
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-white/10 py-2.5 text-sm transition hover:bg-white/20"
        >
          {t("close")}
        </button>
      </div>
    </div>
  );
}
