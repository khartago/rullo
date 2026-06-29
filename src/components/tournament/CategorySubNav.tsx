import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  active: boolean;
};

type CategorySubNavProps = {
  items: NavItem[];
};

export function CategorySubNav({ items }: CategorySubNavProps) {
  return (
    <nav
      className="sticky top-0 z-30 border-b border-white/10 bg-rullo-dark/90 backdrop-blur-md"
      aria-label="Category navigation"
    >
      <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition",
              item.active
                ? "bg-white/12 text-rullo-mint"
                : "text-white/55 hover:bg-white/8 hover:text-white",
            )}
            aria-current={item.active ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
