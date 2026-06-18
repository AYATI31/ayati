import Link from "next/link";
import { HeartPulse, HelpCircle, Info, Search, ShieldCheck, UserRoundCog, UsersRound } from "lucide-react";

const navItems = [
  { href: "/help-me-choose", label: "Help me choose", icon: HelpCircle },
  { href: "/discover", label: "Search clinics", icon: Search },
  { href: "/patient", label: "Patient app", icon: HeartPulse },
  { href: "/caregiver", label: "Caregiver", icon: UsersRound },
  { href: "/clinic-admin", label: "Clinic admin", icon: UserRoundCog },
  { href: "/ayati-admin", label: "AYATI admin", icon: ShieldCheck },
  { href: "/about", label: "About", icon: Info },
];

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-ayati-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link href="/" className="flex w-fit items-center gap-3 focus-ring rounded-md">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-ayati-teal text-white">
            <HeartPulse className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-lg font-semibold tracking-normal text-ayati-ink">AYATI</span>
            <span className="block text-xs font-medium text-ayati-muted">Healthcare navigation</span>
          </span>
        </Link>

        <nav aria-label="Primary navigation" className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="focus-ring inline-flex shrink-0 items-center gap-2 rounded-md border border-transparent px-3 py-2 text-sm font-medium text-ayati-muted transition hover:border-ayati-line hover:bg-ayati-paper hover:text-ayati-ink"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
