import { Link } from "@/i18n/routing";
import type { BracketPhase } from "@prisma/client";
import { cn } from "@/lib/utils";

type CategoryPhaseTabsProps = {
  slug: string;
  phases: BracketPhase[];
  activePhaseId: string;
  locale: string;
};

export function CategoryPhaseTabs({
  slug,
  phases,
  activePhaseId,
  locale,
}: CategoryPhaseTabsProps) {
  if (phases.length <= 1) return null;

  return (
    <div className="border-b border-white/10 bg-rullo-dark/50">
      <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
        {phases.map((phase) => {
          const active = phase.id === activePhaseId;
          return (
            <Link
              key={phase.id}
              href={`/tournament/${slug}?phase=${phase.phase}`}
              className={cn(
                "shrink-0 rounded-full px-5 py-2 text-sm font-medium transition",
                active
                  ? "bg-gradient-to-r from-rullo-pink to-rullo-blue text-white shadow-lg shadow-rullo-pink/20"
                  : "text-white/60 hover:bg-white/10 hover:text-white",
              )}
            >
              {locale === "fr" ? phase.labelFr : phase.labelEn}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
