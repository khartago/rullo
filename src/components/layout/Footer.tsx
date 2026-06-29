import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { FTT_URL, LINKEDIN_RYNEX } from "@/data/categories";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=El+Rulo+Padel+Club+Monastir";

export async function Footer() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");

  return (
    <footer className="mt-auto border-t border-white/10 bg-rullo-dark">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-lg font-bold">El Rulo Padel Club</p>
            <p className="mt-2 text-sm text-white/60">Monastir, Tunisia</p>
            <p className="text-sm text-white/60">Beyond the Ribat</p>
          </div>
          <div className="text-sm text-white/60">
            <a
              href={FTT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-rullo-mint"
            >
              {t("contact")} · FTTLP
            </a>
            <a
              href="tel:+21671844144"
              className="mt-2 block hover:text-rullo-mint"
            >
              {t("phone")}
            </a>
            <a
              href="mailto:padel@ftt.tn"
              className="mt-2 block hover:text-rullo-mint"
            >
              padel@ftt.tn
            </a>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block hover:text-rullo-mint"
            >
              {t("maps")}
            </a>
            <a
              href={`${FTT_URL}/fact-sheet`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block hover:text-rullo-mint"
            >
              {t("factSheet")}
            </a>
            <a
              href="https://www.instagram.com/elrulo_padel_club/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block hover:text-rullo-mint"
            >
              {t("instagram")}
            </a>
          </div>
          <div className="text-sm text-white/60">
            <Link href="/tournament" className="block hover:text-rullo-mint">
              {t("liveBrackets")}
            </Link>
            <Link href="/schedule" className="mt-2 block hover:text-rullo-mint">
              {nav("schedule")}
            </Link>
            <Link href="/teams" className="mt-2 block hover:text-rullo-mint">
              {nav("teams")}
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row">
          <p>{t("rights")}</p>
          <a
            href={LINKEDIN_RYNEX}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 transition hover:text-rullo-mint"
          >
            <LinkedInIcon />
            {t("builtBy")}
          </a>
        </div>
      </div>
    </footer>
  );
}

function LinkedInIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
