import Link from "next/link";
import { Languages, MessageCircle } from "lucide-react";

export function NeedLanguageHelp() {
  return (
    <section className="rounded-md border border-ayati-line bg-ayati-mint p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <Languages className="mt-1 h-5 w-5 shrink-0 text-ayati-teal" aria-hidden="true" />
          <div>
            <h2 className="text-base font-semibold text-ayati-ink">Need help in your language?</h2>
            <p className="mt-1 text-sm leading-6 text-ayati-muted">
              English is live. Arabic and Hindi/Urdu content are structured for launch as the directory grows.
            </p>
          </div>
        </div>
        <Link
          href="/pre-visit"
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-semibold text-ayati-teal shadow-sm hover:text-ayati-ink"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Prepare a summary
        </Link>
      </div>
    </section>
  );
}
