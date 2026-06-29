"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { FTT_URL } from "@/data/categories";
import { cn } from "@/lib/utils";

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const links = [
    { href: "/", label: t("home") },
    { href: "/tournament", label: t("tournament") },
    { href: "/schedule", label: t("schedule") },
    { href: "/teams", label: t("teams") },
  ];

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full">
            <Image
              src="/brand/logo.png"
              alt="El Rulo Padel Club"
              width={48}
              height={48}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold tracking-wide">EL RULO</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-rullo-mint">
              Padel Club
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm transition-colors hover:text-rullo-mint",
                pathname === link.href || pathname.startsWith(`${link.href}/`)
                  ? "text-rullo-mint"
                  : "text-white/70",
              )}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={FTT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-rullo-bronze/40 px-3 py-1 text-xs text-rullo-bronze transition hover:bg-rullo-bronze/10"
          >
            {t("fttOfficial")}
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitch />
          <a
            href="/admin"
            className="rounded-lg bg-white/10 px-3 py-1.5 text-xs hover:bg-white/20"
          >
            {t("admin")}
          </a>
        </div>
      </div>
    </header>
  );
}

function LocaleSwitch() {
  const pathname = usePathname();
  const activeLocale = useLocale();

  return (
    <div className="flex rounded-lg bg-white/5 p-0.5 text-xs">
      {(["fr", "en"] as const).map((locale) => (
        <Link
          key={locale}
          href={pathname}
          locale={locale}
          className={cn(
            "rounded-md px-2 py-1 uppercase transition hover:text-white",
            activeLocale === locale
              ? "bg-rullo-pink text-white"
              : "text-white/60",
          )}
        >
          {locale}
        </Link>
      ))}
    </div>
  );
}
