import { setRequestLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { formatTeamLabel } from "@/lib/utils";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
};

export default async function TeamsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { category: categorySlug } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "nav" });

  const categories = await prisma.category.findMany({
    where: categorySlug ? { slug: categorySlug } : undefined,
    orderBy: { sortOrder: "asc" },
    include: {
      phases: {
        include: {
          matches: { where: { round: 1 }, orderBy: { position: "asc" } },
        },
      },
    },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">{t("teams")}</h1>
      <div className="mt-8 space-y-10">
        {categories.map((cat) => {
          const teams = new Set<string>();

          for (const phase of cat.phases) {
            phase.matches.forEach((m) => {
              const a = formatTeamLabel(
                m.teamAPlayer1,
                m.teamAPlayer2,
                m.isTeamABye,
              );
              const b = formatTeamLabel(
                m.teamBPlayer1,
                m.teamBPlayer2,
                m.isTeamBBye,
              );
              if (a && a !== "BYE" && a !== "TBD" && !/^Q\d$/i.test(a))
                teams.add(a);
              if (b && b !== "BYE" && b !== "TBD" && !/^Q\d$/i.test(b))
                teams.add(b);
            });
          }

          return (
            <section key={cat.id}>
              <h2 className="text-xl font-bold text-rullo-mint">
                {locale === "fr" ? cat.nameFr : cat.nameEn}
              </h2>
              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from(teams).sort().map((team) => (
                  <div key={team} className="glass rounded-xl px-4 py-3 text-sm">
                    {team}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
