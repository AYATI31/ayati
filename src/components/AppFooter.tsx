import Link from "next/link";

export function AppFooter() {
  return (
    <footer className="border-t border-ayati-line bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-ayati-muted sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p>AYATI helps patients, caregivers, and clinics coordinate healthcare next steps. It is not an EMR.</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/privacy" className="focus-ring rounded-sm hover:text-ayati-ink">
            Privacy & disclaimer
          </Link>
          <Link href="/login" className="focus-ring rounded-sm hover:text-ayati-ink">
            Login placeholder
          </Link>
          <Link href="/ayati-admin" className="focus-ring rounded-sm hover:text-ayati-ink">
            AYATI admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
