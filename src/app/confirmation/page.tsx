import type { Metadata } from "next";
import { CalendarCheck, Search } from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import { Disclaimer } from "@/components/Disclaimer";
import { InquiryConfirmationDetails } from "@/components/InquiryConfirmationDetails";
import { getClinicBySlug } from "@/lib/clinic-utils";

type ConfirmationProps = {
  searchParams?: Promise<{ ref?: string; clinic?: string }>;
};

export const metadata: Metadata = {
  title: "Inquiry Confirmation",
  description: "Confirmation for an AYATI patient navigation inquiry."
};

export default async function ConfirmationPage({ searchParams }: ConfirmationProps) {
  const params = await searchParams;
  const reference = params?.ref ?? "AYATI-DEMO";
  const clinic = params?.clinic ? getClinicBySlug(params.clinic) : undefined;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="rounded-md border border-ayati-line bg-white p-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-md bg-ayati-mint text-ayati-teal">
          <CalendarCheck className="h-7 w-7" aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-3xl font-semibold text-ayati-ink">Inquiry received</h1>
        <p className="mt-3 text-base leading-7 text-ayati-muted">
          Your reference is <span className="font-semibold text-ayati-ink">{reference}</span>. The current version stores demo inquiries locally until Supabase is connected.
        </p>
        {clinic ? <p className="mt-2 text-sm font-medium text-ayati-teal">Selected clinic: {clinic.name}</p> : null}
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/discover" icon={Search} variant="secondary">
            Continue searching
          </ButtonLink>
          <ButtonLink href="/help-me-choose" icon={CalendarCheck}>
            Start another guided search
          </ButtonLink>
        </div>
      </section>
      <div className="mt-6">
        <InquiryConfirmationDetails reference={reference} />
      </div>
      <div className="mt-6">
        <Disclaimer />
      </div>
    </div>
  );
}
