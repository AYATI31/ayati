import { ArrowRight, BadgeCheck, Languages, MapPin, ShieldCheck, Sparkles, WalletCards } from "lucide-react";
import type { Clinic } from "@/types";
import { ButtonLink } from "@/components/ButtonLink";

export function ClinicCard({ clinic, reason }: { clinic: Clinic; reason?: string }) {
  return (
    <article className="surface rounded-md p-5">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-normal text-ayati-teal">{clinic.specialties[0]}</p>
            <h2 className="mt-2 text-xl font-semibold tracking-normal text-ayati-ink">{clinic.name}</h2>
            <p className="mt-2 text-sm leading-6 text-ayati-muted">{clinic.description}</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-ayati-line bg-ayati-paper px-2.5 py-1 text-xs font-semibold text-ayati-muted">
            <BadgeCheck className="h-3.5 w-3.5 text-ayati-teal" aria-hidden="true" />
            {clinic.profileControlled ? "Profile-controlled" : clinic.status}
          </span>
        </div>

        {reason ? <p className="rounded-md bg-ayati-mint px-3 py-2 text-sm font-medium text-ayati-ink">{reason}</p> : null}

        <div className="rounded-md border border-ayati-line bg-ayati-warm p-3">
          <div className="flex items-start gap-2">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-ayati-teal" aria-hidden="true" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-normal text-ayati-muted">Best for</p>
              <p className="mt-1 text-sm font-semibold leading-6 text-ayati-ink">{clinic.bestForTag}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 text-sm text-ayati-muted sm:grid-cols-2">
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-ayati-blue" aria-hidden="true" />
            {clinic.area}, {clinic.emirate}
          </span>
          <span className="flex items-center gap-2">
            <Languages className="h-4 w-4 text-ayati-blue" aria-hidden="true" />
            {clinic.languages.slice(0, 3).join(", ")}
          </span>
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-ayati-blue" aria-hidden="true" />
            {clinic.insurance.slice(0, 3).join(", ")}
          </span>
          <span className="flex items-center gap-2">
            <WalletCards className="h-4 w-4 text-ayati-blue" aria-hidden="true" />
            {clinic.priceRange}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {clinic.specialties.slice(0, 3).map((specialty) => (
            <span key={specialty} className="rounded-md bg-ayati-paper px-2.5 py-1 text-xs font-medium text-ayati-muted">
              {specialty}
            </span>
          ))}
        </div>

        <ButtonLink href={`/clinics/${clinic.slug}`} icon={ArrowRight} variant="secondary" className="w-full sm:w-fit">
          View care fit
        </ButtonLink>
      </div>
    </article>
  );
}
