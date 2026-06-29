"use client";

import type { Match } from "@prisma/client";
import { useTranslations } from "next-intl";
import {
  BRACKET_CARD_W,
  getBracketHeight,
  getRounds,
  matchTop,
  roundLabelKey,
} from "@/lib/bracket-layout";
import { BracketConnectors } from "./BracketConnectors";
import { BracketMatchCell } from "./BracketMatchCell";

type BracketViewProps = {
  matches: Match[];
};

export function BracketView({ matches }: BracketViewProps) {
  const t = useTranslations("tournament");

  if (!matches.length) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 px-6 py-16 text-center">
        <p className="text-white/50">{t("noMatches")}</p>
      </div>
    );
  }

  const rounds = getRounds(matches);
  const totalRounds = rounds.length;
  const bracketHeight = getBracketHeight(matches);

  return (
    <div className="bracket-shell">
      <p className="mb-4 flex items-center gap-2 text-xs text-white/40 lg:hidden">
        <span aria-hidden>←</span>
        {t("bracketScrollHint")}
      </p>

      <div className="custom-scrollbar bracket-scroll overflow-x-auto overscroll-x-contain">
        <div
          className="relative flex min-w-max px-2 pb-4 pt-12"
          style={{ height: bracketHeight + 48 }}
        >
          {rounds.map((round, ri) => {
            const roundMatches = matches
              .filter((m) => m.round === round)
              .sort((a, b) => a.position - b.position);
            const labelKey = roundLabelKey(round, totalRounds);

            return (
              <div key={round} className="relative flex shrink-0">
                {ri > 0 && (
                  <BracketConnectors
                    round={round}
                    roundMatches={roundMatches}
                    height={bracketHeight}
                  />
                )}

                <div
                  className="relative shrink-0"
                  style={{ width: BRACKET_CARD_W, height: bracketHeight }}
                >
                  <div className="absolute -top-11 left-0 right-0 flex flex-col items-center">
                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-rullo-bronze">
                      {labelKey === "round"
                        ? `${t("round")} ${round}`
                        : t(labelKey)}
                    </span>
                    <span className="mt-1 h-px w-8 bg-rullo-bronze/40" />
                  </div>

                  {roundMatches.map((match) => (
                    <div
                      key={match.id}
                      className="absolute left-0"
                      style={{
                        top: matchTop(round, match.position),
                        width: BRACKET_CARD_W,
                      }}
                    >
                      <BracketMatchCell
                        match={match}
                        isFinal={round === totalRounds}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
