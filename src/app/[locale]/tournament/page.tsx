import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getCategories } from "@/lib/tournament";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function TournamentPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [categories, t, th] = await Promise.all([
    getCategories(),
    getTranslations({ locale, namespace: "tournament" }),
    getTranslations({ locale, namespace: "home" }),
  ]);

  return (
    <div className="min-w-0">
      <header className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-rullo-blue/30 via-rullo-dark to-rullo-dark" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-sm uppercase tracking-[0.3em] text-rullo-bronze">
            Elrulo Breakthrough Padel Cup
          </p>
          <h1 className="mt-3 text-4xl font-black uppercase tracking-tight md:text-5xl">
            {t("allCategories")}
          </h1>
          <p className="mt-3 max-w-xl text-white/60">{t("selectCategory")}</p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const genderLabel =
              cat.gender === "men"
                ? th("genderMen")
                : cat.gender === "women"
                  ? th("genderWomen")
                  : th("genderMixed");
            const drawLabel =
              cat.phases.length > 1 ? t("qualAndFinal") : t("final");

            return (
              <Link
                key={cat.slug}
                href={`/tournament/${cat.slug}`}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-0.5 hover:border-rullo-mint/40 hover:bg-white/[0.06] hover:shadow-lg hover:shadow-rullo-mint/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xl font-bold text-rullo-mint transition group-hover:text-white">
                    {locale === "fr" ? cat.nameFr : cat.nameEn}
                  </p>
                  <span className="shrink-0 rounded-full border border-rullo-bronze/30 bg-rullo-bronze/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-rullo-bronze">
                    {cat.level}
                  </span>
                </div>
                <p className="mt-2 text-sm text-white/45">{genderLabel}</p>
                <p className="mt-4 text-xs uppercase tracking-wider text-white/35">
                  {drawLabel}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
