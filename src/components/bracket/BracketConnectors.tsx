import type { Match } from "@prisma/client";
import {
  BRACKET_CONN_W,
  matchCenterY,
} from "@/lib/bracket-layout";

type BracketConnectorsProps = {
  round: number;
  roundMatches: Match[];
  height: number;
};

export function BracketConnectors({
  round,
  roundMatches,
  height,
}: BracketConnectorsProps) {
  const prevRound = round - 1;
  const xMid = BRACKET_CONN_W / 2;

  return (
    <svg
      className="shrink-0 overflow-visible"
      width={BRACKET_CONN_W}
      height={height}
      aria-hidden
    >
      {roundMatches.map((match) => {
        const childA = match.position * 2 - 1;
        const childB = match.position * 2;
        const yParent = matchCenterY(round, match.position);
        const yA = matchCenterY(prevRound, childA);
        const yB = matchCenterY(prevRound, childB);
        const yTop = Math.min(yA, yB);
        const yBottom = Math.max(yA, yB);

        return (
          <g key={match.id}>
            <path
              d={`M 0 ${yA} H ${xMid}`}
              fill="none"
              stroke="rgba(97,203,176,0.35)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d={`M 0 ${yB} H ${xMid}`}
              fill="none"
              stroke="rgba(97,203,176,0.35)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d={`M ${xMid} ${yTop} V ${yBottom}`}
              fill="none"
              stroke="rgba(97,203,176,0.35)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d={`M ${xMid} ${yParent} H ${BRACKET_CONN_W}`}
              fill="none"
              stroke="rgba(97,203,176,0.35)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle
              cx={xMid}
              cy={yParent}
              r="2.5"
              fill="rgba(97,203,176,0.5)"
            />
          </g>
        );
      })}
    </svg>
  );
}
