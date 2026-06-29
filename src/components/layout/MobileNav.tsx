"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", icon: "🏠", key: "home" },
  { href: "/tournament", icon: "🏆", key: "tournament" },
  { href: "/schedule", icon: "📅", key: "schedule" },
  { href: "/teams", icon: "👥", key: "teams" },
] as const;

export function MobileNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-rullo-dark/95 backdrop-blur md:hidden">
      <div className="grid grid-cols-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 py-3 text-[10px]",
              pathname === item.href || pathname.startsWith(item.href + "/")
                ? "text-rullo-mint"
                : "text-white/50",
            )}
          >
            <span className="text-lg">{item.icon}</span>
            {t(item.key)}
          </Link>
        ))}
      </div>
    </nav>
  );
}
