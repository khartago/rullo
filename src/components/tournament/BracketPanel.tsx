import type { ReactNode } from "react";
import type { Match } from "@prisma/client";
import { getChampionMatch } from "@/lib/bracket-layout";
import { formatTeamLabel } from "@/lib/utils";
import { BracketView } from "@/components/bracket/BracketView";
import { LiveRefresh } from "@/components/tournament/LiveRefresh";

type BracketPanelProps = {
  matches: Match[];
  labels: {
    bracketTitle: string;
    champion: string;
    championTbd: string;
    liveNow: string;
    legendLive: string;
    legendWinner: string;
    legendSeed: string;
    bracketScrollHint: string;
  };
};

export function BracketPanel({ matches, labels }: BracketPanelProps) {
  const championMatch = getChampionMatch(matches);
  const liveMatches = matches.filter((m) => m.status === "live");

  const championName = championMatch?.winnerSide
    ? formatTeamLabel(
        championMatch.winnerSide === "A"
          ? championMatch.teamAPlayer1
          : championMatch.teamBPlayer1,
        championMatch.winnerSide === "A"
          ? championMatch.teamAPlayer2
          : championMatch.teamBPlayer2,
      )
    : null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <LiveRefresh />

      <div className="grid gap-8 xl:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="order-2 space-y-4 xl:order-1">
          <SidebarCard title={labels.champion}>
            {championName ? (
              <p className="text-lg font-bold text-rullo-bronze">{championName}</p>
            ) : (
              <p className="text-sm text-white/40">{labels.championTbd}</p>
            )}
          </SidebarCard>

          {liveMatches.length > 0 && (
            <SidebarCard title={labels.liveNow}>
              <ul className="space-y-2">
                {liveMatches.map((m) => (
                  <li
                    key={m.id}
                    className="rounded-lg border border-rullo-pink/30 bg-rullo-pink/5 px-3 py-2 text-xs"
                  >
                    <span className="live-pulse font-bold text-rullo-pink">
                      LIVE
                    </span>
                    <p className="mt-1 truncate text-white/80">
                      {formatTeamLabel(m.teamAPlayer1, m.teamAPlayer2)} vs{" "}
                      {formatTeamLabel(m.teamBPlayer1, m.teamBPlayer2)}
                    </p>
                  </li>
                ))}
              </ul>
            </SidebarCard>
          )}

          <SidebarCard title={labels.bracketTitle}>
            <ul className="space-y-2 text-xs text-white/55">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-rullo-pink live-pulse" />
                {labels.legendLive}
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-rullo-mint" />
                {labels.legendWinner}
              </li>
              <li className="flex items-center gap-2">
                <span className="rounded bg-white/10 px-1 text-[10px]">1</span>
                {labels.legendSeed}
              </li>
            </ul>
            <p className="mt-3 hidden text-[11px] text-white/35 xl:block">
              {labels.bracketScrollHint}
            </p>
          </SidebarCard>
        </aside>

        <div className="order-1 min-w-0 xl:order-2">
          <BracketView matches={matches} />
        </div>
      </div>
    </section>
  );
}

function SidebarCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-rullo-bronze">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}
