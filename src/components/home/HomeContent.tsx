import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getCategories, getTournamentStats } from "@/lib/tournament";
import { SponsorWall } from "@/components/sponsors/SponsorWall";
import { FadeIn } from "@/components/ui/FadeIn";

export async function HomeContent({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "home" });
  const meta = await getTranslations({ locale, namespace: "meta" });
  const [stats, categories] = await Promise.all([
    getTournamentStats(),
    getCategories(),
  ]);

  return (
    <>
      <section className="relative min-h-[85vh] overflow-hidden">
        <Image
          src="/images/hero.png"
          alt="Padel Monastir"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-rullo-dark/70 via-rullo-sea/60 to-rullo-dark" />
        <FadeIn className="relative mx-auto flex min-h-[85vh] max-w-6xl flex-col justify-center px-4 py-20">
          <p className="text-sm uppercase tracking-[0.35em] text-rullo-bronze">
            17ème Étape FTT · {meta("prize")}
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black uppercase leading-tight md:text-6xl">
            <span className="text-gradient">{meta("title")}</span>
          </h1>
          <p className="mt-2 text-xl font-light tracking-[0.25em] text-white/80 md:text-2xl">
            {meta("subtitle")}
          </p>
          <p className="mt-6 text-white/70">{meta("dates")} · {meta("location")}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/tournament"
              className="rounded-full bg-gradient-to-r from-rullo-pink to-rullo-blue px-8 py-3 text-sm font-bold uppercase tracking-wider transition hover:scale-105"
            >
              {t("heroCta")}
            </Link>
          </div>
        </FadeIn>
      </section>

      <section className="border-y border-white/10 bg-white/5">
        <div className="mx-auto grid max-w-6xl grid-cols-3 divide-x divide-white/10">
          <Stat label={t("statsPlayed")} value={stats.played} />
          <Stat label={t("statsLive")} value={stats.live} accent />
          <Stat label={t("statsUpcoming")} value={stats.upcoming} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold">{t("categoriesTitle")}</h2>
        <p className="mt-2 text-white/60">{t("categoriesSubtitle")}</p>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/tournament/${cat.slug}`}
              className="glass rounded-2xl p-4 text-center transition hover:border-rullo-mint/40 hover:bg-white/10"
            >
              <p className="text-lg font-bold text-rullo-mint">{cat.level}</p>
              <p className="text-xs uppercase tracking-wider text-white/60">
                {locale === "fr"
                  ? cat.gender === "men"
                    ? t("genderMen")
                    : cat.gender === "women"
                      ? t("genderWomen")
                      : t("genderMixed")
                  : cat.gender === "men"
                    ? t("genderMen")
                    : cat.gender === "women"
                      ? t("genderWomen")
                      : t("genderMixed")}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold">{t("galleryTitle")}</h2>
          <p className="mt-2 text-white/60">{t("gallerySubtitle")}</p>
        </div>
        <div className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-4 px-4 sm:grid-cols-3">
          {[
            {
              src: "/images/gallery/el-rulo-courts-ribat.png",
              alt: t("galleryCourtsRibat"),
            },
            {
              src: "/images/gallery/el-rulo-courts-day.png",
              alt: t("galleryCourtsDay"),
            },
            {
              src: "/images/gallery/el-rulo-match.png",
              alt: t("galleryMatch"),
            },
          ].map((img) => (
            <div
              key={img.src}
              className="relative h-48 overflow-hidden rounded-2xl md:h-64"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition duration-500 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-rullo-dark/80 to-transparent" />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-rullo-blue/20 to-rullo-pink/20 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold">{t("aboutTitle")}</h2>
          <p className="mt-4 text-lg leading-relaxed text-white/70">
            {t("aboutText")}
          </p>
        </div>
      </section>

      <SponsorWall />
    </>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="px-4 py-8 text-center">
      <p
        className={`text-4xl font-black ${accent ? "text-rullo-pink live-pulse" : "text-white"}`}
      >
        {value}
      </p>
      <p className="mt-2 text-xs uppercase tracking-wider text-white/50">
        {label}
      </p>
    </div>
  );
}
