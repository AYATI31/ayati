import Image from "next/image";
import { ArrowRight, ClipboardCheck, HeartHandshake, HeartPulse, MessageCircle, Search, ShieldCheck, UserRoundCog, UsersRound } from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import { Disclaimer } from "@/components/Disclaimer";

const experienceCards = [
  {
    title: "Patient App",
    body: "Start with a guided assessment, get clinic matches, book the next step, and track the care journey.",
    href: "/patient",
    action: "Continue as patient",
    icon: HeartPulse
  },
  {
    title: "Caregiver App",
    body: "Coordinate care for family members, manage appointments, and keep shared timelines clear.",
    href: "/caregiver",
    action: "Manage dependents",
    icon: UsersRound
  },
  {
    title: "Clinic Admin",
    body: "Work through inquiries, patient pipeline, appointments, follow-ups, referrals, notes, and analytics.",
    href: "/clinic-admin",
    action: "Open clinic workspace",
    icon: UserRoundCog
  }
];

const patientJourneySteps = [
  { label: "Tell us what you need", value: "Share the care area, language, location, insurance, urgency, and preparation needs.", icon: ClipboardCheck },
  { label: "Understand your options", value: "See suitable clinic categories and what each option can help with in plain language.", icon: HeartHandshake },
  { label: "Choose a suitable clinic", value: "Compare care fit by service, language, insurance, location, price visibility, and accessibility notes.", icon: Search },
  { label: "Send a clear inquiry", value: "Prepare a simple summary the clinic can act on before the first call.", icon: MessageCircle }
];

export default function HomePage() {
  return (
    <div className="bg-ayati-warm">
      <section className="bg-white">
        <div className="mx-auto grid min-h-[calc(100vh-112px)] max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-normal text-ayati-teal">Healthcare navigation</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-normal text-ayati-ink sm:text-5xl lg:text-6xl">Find the right care starting point without confusion.</h1>
            <p className="mt-5 text-lg leading-8 text-ayati-muted">
              Compare clinics by service, language, insurance, location, and preparation needs before the first call.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/help-me-choose" icon={HeartPulse}>
                Help me choose
              </ButtonLink>
              <ButtonLink href="/discover" icon={Search} variant="secondary">
                Search clinics
              </ButtonLink>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {["No medical advice", "No public rankings", "Clear next actions"].map((item) => (
                <div key={item} className="rounded-md border border-ayati-line bg-ayati-warm px-4 py-3 text-sm font-semibold text-ayati-ink">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[390px] overflow-hidden rounded-md border border-ayati-line bg-ayati-warm shadow-calm lg:min-h-[560px]">
            <Image
              src="/images/ayati-discover-hero.png"
              alt="Healthcare coordinator helping a patient understand care options"
              fill
              priority
              sizes="(min-width: 1024px) 52vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-x-4 bottom-4 rounded-md border border-white/70 bg-white/90 p-4 shadow-calm backdrop-blur">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-ayati-mint text-ayati-teal">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ayati-ink">Next recommended action</p>
                  <p className="mt-1 text-sm leading-6 text-ayati-muted">
                    Start with Help me choose so AYATI can prepare clinic categories, care-fit options, and a clear inquiry.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {experienceCards.map((card) => {
            const Icon = card.icon;

            return (
              <article key={card.title} className="rounded-md border border-ayati-line bg-white p-6 shadow-sm">
                <Icon className="h-7 w-7 text-ayati-teal" aria-hidden="true" />
                <h2 className="mt-5 text-2xl font-semibold text-ayati-ink">{card.title}</h2>
                <p className="mt-3 text-base leading-7 text-ayati-muted">{card.body}</p>
                <ButtonLink href={card.href} icon={ArrowRight} variant="quiet" className="mt-5 px-0">
                  {card.action}
                </ButtonLink>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="rounded-md border border-ayati-line bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-normal text-ayati-teal">Patient journey</p>
              <h2 className="mt-2 text-3xl font-semibold text-ayati-ink">Four steps before the first call</h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-ayati-muted">
              AYATI is designed around one clear next action at a time. The goal is preparation and navigation, not diagnosis or clinic superiority ranking.
            </p>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-4">
            {patientJourneySteps.map((step) => {
              const Icon = step.icon;

              return (
                <div key={step.label} className="rounded-md bg-ayati-warm p-4">
                  <Icon className="h-5 w-5 text-ayati-teal" aria-hidden="true" />
                  <p className="mt-4 text-lg font-semibold text-ayati-ink">{step.label}</p>
                  <p className="mt-2 text-sm leading-6 text-ayati-muted">{step.value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <Disclaimer />
      </section>
    </div>
  );
}
