"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export function SponsorWall() {
  const t = useTranslations("home");

  return (
    <section className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden bg-rullo-dark">
      <h2 className="sr-only">{t("sponsorsTitle")}</h2>
      <Image
        src="/images/tournament-poster.png"
        alt={t("sponsorsPosterAlt")}
        width={1920}
        height={1012}
        className="h-auto w-full object-cover object-center"
        sizes="100vw"
      />
    </section>
  );
}
