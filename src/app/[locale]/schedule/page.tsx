import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getAllMatches, getCategories } from "@/lib/tournament";
import { MatchCard } from "@/components/bracket/MatchCard";
import { LiveRefresh } from "@/components/tournament/LiveRefresh";
import { cn } from "@/lib/utils";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    court?: string;
    date?: string;
    category?: string;
    view?: string;
  }>;
};

const DATES = [
  "2026-06-27",
  "2026-06-28",
  "2026-06-29",
  "2026-06-30",
  "2026-07-01",
  "2026-07-02",
  "2026-07-03",
  "2026-07-04",
  "2026-07-05",
];

function buildQuery(
  base: Record<string, string | undefined>,
  patch: Record<string, string | undefined>,
) {
  const q = new URLSearchParams();
  const merged = { ...base, ...patch };
  for (const [k, v] of Object.entries(merged)) {
    if (v) q.set(k, v);
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

export default async function SchedulePage({ params, searchParams }: Props) {
  const { locale } = await params;
  const filters = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tournament" });

  const [matches, categories] = await Promise.all([
    getAllMatches({
      court: filters.court ? Number(filters.court) : undefined,
      date: filters.date,
      categorySlug: filters.category,
    }),
    getCategories(),
  ]);

  const viewResults = filters.view === "results";
  const liveMatches = matches.filter((m) => m.status === "live");
  const otherMatches = matches.filter((m) => m.status !== "live");
  const completed = otherMatches.filter((m) =>
    ["completed", "walkover"].includes(m.status),
  );
  const scheduled = otherMatches.filter(
    (m) => !["completed", "walkover"].includes(m.status),
  );
  const displayMatches = viewResults ? completed : scheduled;

  const qBase = {
    court: filters.court,
    date: filters.date,
    category: filters.category,
    view: filters.view,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <LiveRefresh />
      <h1 className="text-3xl font-bold">{t("schedule")}</h1>

      <div className="mt-6 flex gap-2">
        <Link
          href={`/schedule${buildQuery(qBase, { view: undefined })}`}
          className={cn(
            "rounded-full px-4 py-2 text-sm",
            !viewResults ? "bg-rullo-pink text-white" : "bg-white/10 text-white/70",
          )}
        >
          {t("viewSchedule")}
        </Link>
        <Link
          href={`/schedule${buildQuery(qBase, { view: "results" })}`}
          className={cn(
            "rounded-full px-4 py-2 text-sm",
            viewResults ? "bg-rullo-pink text-white" : "bg-white/10 text-white/70",
          )}
        >
          {t("viewResults")}
        </Link>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        <Link
          href={`/schedule${buildQuery(qBase, { date: undefined })}`}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-xs",
            !filters.date ? "bg-rullo-mint text-rullo-dark" : "bg-white/10",
          )}
        >
          {t("allDates")}
        </Link>
        {DATES.map((d) => (
          <Link
            key={d}
            href={`/schedule${buildQuery(qBase, { date: d })}`}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-xs",
              filters.date === d ? "bg-rullo-mint text-rullo-dark" : "bg-white/10",
            )}
          >
            {new Date(`${d}T12:00:00`).toLocaleDateString(locale, {
              weekday: "short",
              day: "numeric",
              month: "short",
            })}
          </Link>
        ))}
      </div>

      <form className="mt-4 flex flex-wrap gap-3">
        <select
          name="category"
          defaultValue={filters.category ?? ""}
          className="rounded-lg bg-white/10 px-3 py-2 text-sm"
        >
          <option value="">{t("allCategories")}</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {locale === "fr" ? c.nameFr : c.nameEn}
            </option>
          ))}
        </select>
        <select
          name="court"
          defaultValue={filters.court ?? ""}
          className="rounded-lg bg-white/10 px-3 py-2 text-sm"
        >
          <option value="">{t("allCourts")}</option>
          {[1, 2, 3].map((c) => (
            <option key={c} value={c}>
              {t("court")} {c}
            </option>
          ))}
        </select>
        {filters.date && <input type="hidden" name="date" value={filters.date} />}
        {filters.view && <input type="hidden" name="view" value={filters.view} />}
        <button
          type="submit"
          className="rounded-lg bg-rullo-pink px-4 py-2 text-sm font-semibold"
        >
          {t("filter")}
        </button>
      </form>

      {liveMatches.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-rullo-pink">
            <span className="live-pulse">●</span> {t("live")}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {liveMatches.map((m) => (
              <div key={m.id}>
                <p className="mb-1 text-xs text-white/50">
                  {locale === "fr"
                    ? m.bracketPhase.category.nameFr
                    : m.bracketPhase.category.nameEn}
                </p>
                <MatchCard match={m} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {displayMatches.length === 0 ? (
            <p className="text-white/50">{t("noMatches")}</p>
          ) : (
            displayMatches.map((m) => (
              <div key={m.id}>
                <p className="mb-1 text-xs text-white/50">
                  {locale === "fr"
                    ? m.bracketPhase.category.nameFr
                    : m.bracketPhase.category.nameEn}
                  {m.scheduledAt &&
                    ` · ${m.scheduledAt.toLocaleString(locale)}`}
                </p>
                <MatchCard match={m} />
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
