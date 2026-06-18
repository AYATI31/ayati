import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarPlus, Mail, MapPin, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import { Disclaimer } from "@/components/Disclaimer";
import { ExperienceSignals } from "@/components/ExperienceSignals";
import { NeedLanguageHelp } from "@/components/NeedLanguageHelp";
import { clinics } from "@/data/seed";
import { getClinicBySlug } from "@/lib/clinic-utils";

type ClinicPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return clinics.map((clinic) => ({ slug: clinic.slug }));
}

export async function generateMetadata({ params }: ClinicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const clinic = getClinicBySlug(slug);

  if (!clinic) {
    return { title: "Clinic not found" };
  }

  return {
    title: clinic.name,
    description: clinic.description
  };
}

export default async function ClinicProfilePage({ params }: ClinicPageProps) {
  const { slug } = await params;
  const clinic = getClinicBySlug(slug);

  if (!clinic) {
    notFound();
  }

  return (
    <div className="bg-ayati-paper">
      <section className="border-b border-ayati-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-ayati-teal">
              {clinic.area}, {clinic.emirate}
            </p>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md border border-ayati-line bg-ayati-mint text-2xl font-semibold text-ayati-teal">
                {clinic.name
                  .split(" ")
                  .slice(0, 2)
                  .map((word) => word[0])
                  .join("")}
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-normal text-ayati-ink sm:text-5xl">{clinic.name}</h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-ayati-muted">{clinic.description}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {clinic.specialties.map((specialty) => (
                <span key={specialty} className="rounded-md bg-ayati-paper px-3 py-1.5 text-sm font-medium text-ayati-ink">
                  {specialty}
                </span>
              ))}
              <span className="rounded-md bg-ayati-mint px-3 py-1.5 text-sm font-semibold text-ayati-teal">
                {clinic.profileControlled ? "Verified profile-controlled" : clinic.status}
              </span>
            </div>
          </div>

          <aside className="rounded-md border border-ayati-line bg-ayati-paper p-5">
            <p className="text-sm font-semibold text-ayati-ink">Start here</p>
            <div className="mt-4 grid gap-3">
              <a
                href={`tel:${clinic.phone.replaceAll(" ", "")}`}
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-ayati-teal px-4 py-3 text-sm font-semibold text-white hover:bg-[#0B5552]"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Contact clinic
              </a>
              <ButtonLink href={`/pre-visit?clinic=${clinic.slug}`} icon={CalendarPlus} variant="secondary">
                Send inquiry
              </ButtonLink>
              <ButtonLink href={`/pre-visit?clinic=${clinic.slug}&channel=whatsapp-placeholder`} icon={MessageCircle} variant="secondary">
                WhatsApp placeholder
              </ButtonLink>
            </div>
            <p className="mt-4 text-xs leading-5 text-ayati-muted">
              WhatsApp automation is intentionally not built yet. This button reserves the patient journey for a future integration.
            </p>
          </aside>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <div className="grid gap-6">
          <section className="rounded-md border border-ayati-line bg-white p-6">
            <h2 className="text-2xl font-semibold text-ayati-ink">What this clinic helps with</h2>
            <p className="mt-3 text-sm leading-6 text-ayati-muted">
              This is a navigation summary, not a diagnosis or a statement that this clinic is medically superior.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {clinic.helpsWith.map((item) => (
                <div key={item} className="rounded-md border border-ayati-line bg-ayati-warm p-4 text-sm font-semibold text-ayati-ink">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-md border border-ayati-line bg-white p-6">
            <h2 className="text-2xl font-semibold text-ayati-ink">Services explained in plain language</h2>
            <div className="mt-5 grid gap-4">
              {clinic.services.map((service) => (
                <article key={service.id} className="rounded-md border border-ayati-line bg-ayati-paper p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-semibold text-ayati-ink">{service.name}</h3>
                      <p className="mt-1 text-sm leading-6 text-ayati-muted">{service.description}</p>
                    </div>
                    {service.priceFrom ? (
                      <p className="text-sm font-semibold text-ayati-teal">
                        AED {service.priceFrom}
                        {service.priceTo ? ` - ${service.priceTo}` : "+"}
                      </p>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-md border border-ayati-line bg-white p-6">
              <h2 className="text-2xl font-semibold text-ayati-ink">What to prepare before visit</h2>
              <ul className="mt-5 grid gap-3 text-sm leading-6 text-ayati-muted">
                {clinic.preparationNotes.map((note) => (
                  <li key={note} className="rounded-md bg-ayati-warm p-3">{note}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-md border border-ayati-line bg-white p-6">
              <h2 className="text-2xl font-semibold text-ayati-ink">Who this clinic may be suitable for</h2>
              <ul className="mt-5 grid gap-3 text-sm leading-6 text-ayati-muted">
                {clinic.suitableFor.map((note) => (
                  <li key={note} className="rounded-md bg-ayati-warm p-3">{note}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="rounded-md border border-ayati-line bg-white p-6">
            <h2 className="text-2xl font-semibold text-ayati-ink">Doctors and practitioners</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {clinic.doctors.map((doctor) => (
                <article key={doctor.id} className="rounded-md border border-ayati-line bg-ayati-paper p-4">
                  <h3 className="font-semibold text-ayati-ink">{doctor.name}</h3>
                  <p className="mt-1 text-sm font-medium text-ayati-teal">{doctor.title}</p>
                  <p className="mt-3 text-sm text-ayati-muted">Languages: {doctor.languages.join(", ")}</p>
                  <p className="mt-2 text-sm text-ayati-muted">Focus: {doctor.focusAreas.join(", ")}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-md border border-ayati-line bg-white p-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-ayati-teal" aria-hidden="true" />
              <h2 className="text-2xl font-semibold text-ayati-ink">Patient experience signals</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-ayati-muted">
              These are manually controlled by AYATI admin. They are not public reviews and do not rank medical superiority.
            </p>
            <div className="mt-5">
              <ExperienceSignals signals={clinic.experienceSignals} />
            </div>
          </section>

          <NeedLanguageHelp />
          <Disclaimer />
        </div>

        <aside className="grid h-fit gap-5 lg:sticky lg:top-28">
          <section className="rounded-md border border-ayati-line bg-white p-5">
            <h2 className="text-lg font-semibold text-ayati-ink">Clinic details</h2>
            <div className="mt-4 grid gap-4 text-sm text-ayati-muted">
              <p className="flex gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ayati-blue" aria-hidden="true" />
                <span>{clinic.address}</span>
              </p>
              <p className="flex gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-ayati-blue" aria-hidden="true" />
                <span>{clinic.phone}</span>
              </p>
              <p className="flex gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-ayati-blue" aria-hidden="true" />
                <span>{clinic.email}</span>
              </p>
            </div>
          </section>

          <section className="rounded-md border border-ayati-line bg-white p-5">
            <h2 className="text-lg font-semibold text-ayati-ink">Languages spoken</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {clinic.languages.map((language) => (
                <span key={language} className="rounded-md bg-ayati-mint px-2.5 py-1 text-xs font-semibold text-ayati-teal">
                  {language}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-md border border-ayati-line bg-white p-5">
            <h2 className="text-lg font-semibold text-ayati-ink">Insurance accepted</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {clinic.insurance.map((insurance) => (
                <span key={insurance} className="rounded-md bg-ayati-paper px-2.5 py-1 text-xs font-semibold text-ayati-muted">
                  {insurance}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm leading-6 text-ayati-muted">{clinic.paymentNotes}</p>
          </section>

          <section className="rounded-md border border-ayati-line bg-white p-5">
            <h2 className="text-lg font-semibold text-ayati-ink">Price visibility</h2>
            <p className="mt-3 text-2xl font-semibold text-ayati-ink">{clinic.priceRange}</p>
            <p className="mt-3 text-sm leading-6 text-ayati-muted">
              Prices are guidance only. The clinic must confirm final fees, insurance eligibility, and pre-approval requirements.
            </p>
          </section>

          <section className="rounded-md border border-ayati-line bg-white p-5">
            <h2 className="text-lg font-semibold text-ayati-ink">Operating hours</h2>
            <dl className="mt-4 grid gap-3 text-sm">
              {clinic.operatingHours.map((hour) => (
                <div key={hour.label} className="flex justify-between gap-4">
                  <dt className="text-ayati-muted">{hour.label}</dt>
                  <dd className="text-right font-medium text-ayati-ink">{hour.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-md border border-ayati-line bg-white p-5">
            <h2 className="text-lg font-semibold text-ayati-ink">Location map</h2>
            <div className="mt-4 flex aspect-[4/3] items-center justify-center rounded-md border border-dashed border-ayati-line bg-[linear-gradient(90deg,#F7F9F8_24px,transparent_1px),linear-gradient(#F7F9F8_24px,transparent_1px)] bg-[length:25px_25px]">
              <div className="rounded-md bg-white px-4 py-3 text-center text-sm font-medium text-ayati-muted shadow-sm">
                Map placeholder for {clinic.area}
              </div>
            </div>
          </section>

          <section className="rounded-md border border-ayati-line bg-white p-5">
            <h2 className="text-lg font-semibold text-ayati-ink">Accessibility notes</h2>
            <ul className="mt-3 grid gap-2 text-sm text-ayati-muted">
              {clinic.accessibilityNotes.map((note) => (
                <li key={note}>- {note}</li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
