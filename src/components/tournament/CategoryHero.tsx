import { Link } from "@/i18n/routing";
import type { Category, BracketPhase } from "@prisma/client";

const PDF_URL =
  "https://fttlp.com/tournoi/17eme-etape-ftt-el-rulo-padel-club/tableaux";

type CategoryHeroProps = {
  locale: string;
  category: Category;
  phase: BracketPhase;
  stats: { total: number; live: number; completed: number; upcoming: number };
  labels: {
    back: string;
    downloadPdf: string;
    matchesPlayed: string;
    live: string;
    upcoming: string;
    genderMen: string;
    genderWomen: string;
    genderMixed: string;
  };
};

export function CategoryHero({
  locale,
  category,
  phase,
  stats,
  labels,
}: CategoryHeroProps) {
  const name = locale === "fr" ? category.nameFr : category.nameEn;
  const phaseName = locale === "fr" ? phase.labelFr : phase.labelEn;
  const genderLabel =
    category.gender === "men"
      ? labels.genderMen
      : category.gender === "women"
        ? labels.genderWomen
        : labels.genderMixed;

  return (
    <header className="relative overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 bg-gradient-to-br from-rullo-sea/40 via-rullo-dark to-rullo-dark" />
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-rullo-pink/10 blur-3xl" />
      <div className="absolute -bottom-16 left-1/4 h-48 w-48 rounded-full bg-rullo-mint/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/tournament"
          className="inline-flex items-center gap-1.5 text-sm text-white/50 transition hover:text-rullo-mint"
        >
          <span aria-hidden>←</span>
          {labels.back}
        </Link>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-rullo-bronze/40 bg-rullo-bronze/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-rullo-bronze">
                {category.level}
              </span>
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70">
                {genderLabel}
              </span>
              <span className="rounded-full border border-rullo-mint/30 bg-rullo-mint/10 px-3 py-1 text-xs text-rullo-mint">
                {phaseName}
              </span>
            </div>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-tight text-white md:text-5xl">
              {name}
            </h1>
          </div>

          <a
            href={PDF_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium transition hover:border-rullo-mint/40 hover:bg-white/10"
          >
            {labels.downloadPdf}
          </a>
        </div>

        <dl className="mx-auto mt-8 grid w-full max-w-lg grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
          <StatItem label={labels.matchesPlayed} value={stats.completed} />
          <StatItem
            label={labels.live}
            value={stats.live}
            accent={stats.live > 0}
          />
          <StatItem label={labels.upcoming} value={stats.upcoming} />
        </dl>
      </div>
    </header>
  );
}

function StatItem({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="bg-rullo-dark/80 px-4 py-3 text-center">
      <dt className="text-[10px] uppercase tracking-wider text-white/45">
        {label}
      </dt>
      <dd
        className={`mt-1 text-2xl font-bold tabular-nums ${accent ? "text-rullo-pink live-pulse" : "text-white"}`}
      >
        {value}
      </dd>
    </div>
  );
}
