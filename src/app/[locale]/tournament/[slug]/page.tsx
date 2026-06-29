import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getCategoryBySlug, getMatchesForPhase } from "@/lib/tournament";
import { getPhaseStats } from "@/lib/bracket-layout";
import { CategoryHero } from "@/components/tournament/CategoryHero";
import { CategoryPhaseTabs } from "@/components/tournament/CategoryPhaseTabs";
import { CategorySubNav } from "@/components/tournament/CategorySubNav";
import { BracketPanel } from "@/components/tournament/BracketPanel";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ phase?: string }>;
};

export default async function CategoryPage({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  const { phase: phaseParam } = await searchParams;
  setRequestLocale(locale);

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [t, th] = await Promise.all([
    getTranslations({ locale, namespace: "tournament" }),
    getTranslations({ locale, namespace: "home" }),
  ]);

  const activePhase =
    category.phases.find((p) => p.phase === phaseParam) ?? category.phases[0];

  const matches = await getMatchesForPhase(activePhase.id);
  const stats = getPhaseStats(matches);

  const phaseQuery = `?phase=${activePhase.phase}`;

  return (
    <div className="min-w-0">
      <CategoryHero
        locale={locale}
        category={category}
        phase={activePhase}
        stats={stats}
        labels={{
          back: t("backToCategories"),
          downloadPdf: t("downloadPdf"),
          matchesPlayed: t("matchesPlayed"),
          live: t("live"),
          upcoming: t("scheduled"),
          genderMen: th("genderMen"),
          genderWomen: th("genderWomen"),
          genderMixed: th("genderMixed"),
        }}
      />

      <CategoryPhaseTabs
        slug={slug}
        phases={category.phases}
        activePhaseId={activePhase.id}
        locale={locale}
      />

      <CategorySubNav
        items={[
          {
            href: `/tournament/${slug}${phaseQuery}`,
            label: t("bracket"),
            active: true,
          },
          {
            href: `/schedule?category=${slug}`,
            label: t("schedule"),
            active: false,
          },
          {
            href: `/teams?category=${slug}`,
            label: t("teams"),
            active: false,
          },
          {
            href: `/schedule?category=${slug}&view=results`,
            label: t("results"),
            active: false,
          },
        ]}
      />

      <BracketPanel
        matches={matches}
        labels={{
          bracketTitle: t("bracketLegend"),
          champion: t("champion"),
          championTbd: t("championTbd"),
          liveNow: t("liveNow"),
          legendLive: t("legendLive"),
          legendWinner: t("legendWinner"),
          legendSeed: t("legendSeed"),
          bracketScrollHint: t("bracketScrollHint"),
        }}
      />
    </div>
  );
}
