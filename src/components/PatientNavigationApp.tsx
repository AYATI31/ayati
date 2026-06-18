"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Bell, CalendarCheck, CheckCircle2, ClipboardCheck, HeartPulse, Languages, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { clinics } from "@/data/seed";

const needs = ["Dental pain", "Skin concern", "Fertility guidance", "Eye check", "Weight and metabolic care", "Women's health"];
const languages = ["English", "Arabic", "Hindi", "Urdu", "Malayalam"];
const locations = ["Dubai", "Abu Dhabi", "Sharjah", "Ras Al Khaimah"];

const journey = [
  { label: "Needs assessment", status: "Complete", detail: "Concern, language, location, and payment context captured." },
  { label: "Clinic match", status: "Ready", detail: "Recommended options are prepared for review." },
  { label: "Appointment request", status: "Next", detail: "Choose a clinic and send a booking request." },
  { label: "Follow-up", status: "Later", detail: "Reminders and messages appear after the visit is scheduled." }
];

function statusClass(status: string) {
  if (status === "Complete") return "bg-ayati-mint text-ayati-teal";
  if (status === "Ready") return "bg-[#EAF1FF] text-ayati-blue";
  if (status === "Next") return "bg-[#FFF0E8] text-ayati-coral";
  return "bg-ayati-paper text-ayati-muted";
}

export function PatientNavigationApp() {
  const [need, setNeed] = useState("Dental pain");
  const [location, setLocation] = useState("Dubai");
  const [language, setLanguage] = useState("English");
  const [payment, setPayment] = useState("Insurance");

  const matches = useMemo(() => {
    const terms = need.toLowerCase().split(" ");

    return clinics
      .filter((clinic) => clinic.status === "Approved")
      .map((clinic) => {
        const specialtyScore = clinic.specialties.some((specialty) => terms.some((term) => specialty.toLowerCase().includes(term))) ? 4 : 0;
        const serviceScore = clinic.services.some((service) => terms.some((term) => service.name.toLowerCase().includes(term) || service.description.toLowerCase().includes(term))) ? 3 : 0;
        const locationScore = clinic.emirate === location ? 2 : 0;
        const languageScore = clinic.languages.includes(language) ? 2 : 0;
        const paymentScore = payment === "Cash" || clinic.insurance.length > 0 ? 1 : 0;

        return {
          clinic,
          score: specialtyScore + serviceScore + locationScore + languageScore + paymentScore,
          reasons: [
            specialtyScore > 0 || serviceScore > 0 ? "service area fit" : null,
            locationScore > 0 ? `location: ${clinic.emirate}` : null,
            languageScore > 0 ? `language: ${language}` : null,
            paymentScore > 0 ? "payment context listed" : null
          ].filter(Boolean) as string[]
        };
      })
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [language, location, need, payment]);

  const primaryMatch = matches[0]?.clinic;

  return (
    <div className="grid gap-6">
      <section className="grid gap-5 rounded-md border border-ayati-line bg-white p-5 shadow-sm lg:grid-cols-[1fr_360px]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-ayati-teal">Patient app</p>
          <h1 className="mt-3 text-4xl font-semibold text-ayati-ink sm:text-5xl">Your guided care journey</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-ayati-muted">
            Answer a few questions, review matched clinics, request an appointment, and track what happens next.
          </p>
        </div>
        <aside className="rounded-md bg-ayati-warm p-4">
          <p className="text-sm font-semibold text-ayati-muted">What should you do next?</p>
          <div className="mt-3 flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-ayati-mint text-ayati-teal">
              <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-semibold text-ayati-ink">Complete the needs assessment</p>
              <p className="mt-1 text-sm leading-6 text-ayati-muted">AYATI uses this context to prepare safe, non-diagnostic navigation options.</p>
            </div>
          </div>
        </aside>
      </section>

      <section className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="rounded-md border border-ayati-line bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-5 w-5 text-ayati-teal" aria-hidden="true" />
            <h2 className="text-xl font-semibold text-ayati-ink">Healthcare needs assessment</h2>
          </div>

          <div className="mt-5 grid gap-4">
            <label className="grid gap-2 text-sm font-semibold text-ayati-ink">
              What do you need help with?
              <select value={need} onChange={(event) => setNeed(event.target.value)} className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm">
                {needs.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-semibold text-ayati-ink">
              Preferred location
              <select value={location} onChange={(event) => setLocation(event.target.value)} className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm">
                {locations.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-semibold text-ayati-ink">
              Preferred language
              <select value={language} onChange={(event) => setLanguage(event.target.value)} className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm">
                {languages.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <div>
              <p className="text-sm font-semibold text-ayati-ink">Payment context</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {["Insurance", "Cash"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPayment(item)}
                    className={clsx(
                      "focus-ring rounded-md border px-3 py-3 text-sm font-semibold",
                      payment === item ? "border-ayati-teal bg-ayati-mint text-ayati-teal" : "border-ayati-line bg-white text-ayati-muted"
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <section className="rounded-md border border-ayati-line bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-ayati-teal" aria-hidden="true" />
                  <h2 className="text-xl font-semibold text-ayati-ink">AI-assisted clinic matching</h2>
                </div>
                <p className="mt-2 text-sm leading-6 text-ayati-muted">Matches are based on service fit, location, language, and payment context. They are not medical rankings.</p>
              </div>
              <span className="rounded-md bg-ayati-mint px-3 py-2 text-sm font-semibold text-ayati-teal">{matches.length} options ready</span>
            </div>

            <div className="mt-5 grid gap-3">
              {matches.length > 0 ? (
                matches.map(({ clinic, reasons }) => (
                  <article key={clinic.id} className="rounded-md border border-ayati-line bg-ayati-warm p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-ayati-ink">{clinic.name}</h3>
                        <p className="mt-1 text-sm leading-6 text-ayati-muted">
                          {clinic.area}, {clinic.emirate} - {clinic.languages.slice(0, 3).join(", ")}
                        </p>
                      </div>
                      <span className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-ayati-ink">Care fit ready</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-ayati-muted">{clinic.bestForTag}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {reasons.map((reason) => (
                        <span key={reason} className="rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-ayati-teal">
                          {reason}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <Link href={`/clinics/${clinic.slug}`} className="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-ayati-line bg-white px-4 py-3 text-sm font-semibold text-ayati-ink hover:border-ayati-teal">
                        View care fit
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                      <Link href={`/pre-visit?clinic=${clinic.slug}`} className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-ayati-teal px-4 py-3 text-sm font-semibold text-white hover:bg-[#0B5552]">
                        Request appointment
                        <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-md border border-ayati-line bg-ayati-warm p-5">
                  <h3 className="text-lg font-semibold text-ayati-ink">No clinic profiles connected yet</h3>
                  <p className="mt-2 text-sm leading-6 text-ayati-muted">
                    Add approved clinic profiles in AYATI Admin before patient matching can return real options.
                  </p>
                  <Link href="/ayati-admin/clinics/new" className="focus-ring mt-4 inline-flex items-center justify-center gap-2 rounded-md bg-ayati-teal px-4 py-3 text-sm font-semibold text-white hover:bg-[#0B5552]">
                    Add first clinic
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              )}
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-md border border-ayati-line bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <CalendarCheck className="h-5 w-5 text-ayati-teal" aria-hidden="true" />
                <h2 className="text-xl font-semibold text-ayati-ink">Appointment booking</h2>
              </div>
              <p className="mt-3 text-sm leading-6 text-ayati-muted">
                {primaryMatch ? `Selected option: ${primaryMatch.name}` : "No clinic option selected yet."}
              </p>
              <div className="mt-4 grid gap-3">
                {["Send pre-visit summary", "Ask clinic to confirm insurance", "Request first available slot"].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-md bg-ayati-warm p-3">
                    <CheckCircle2 className="h-5 w-5 text-ayati-teal" aria-hidden="true" />
                    <span className="text-sm font-medium text-ayati-ink">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-md border border-ayati-line bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-ayati-teal" aria-hidden="true" />
                <h2 className="text-xl font-semibold text-ayati-ink">Follow-up reminders</h2>
              </div>
              <div className="mt-4 grid gap-3 text-sm">
                <p className="rounded-md bg-ayati-warm p-3 text-ayati-ink">Bring Emirates ID and insurance card.</p>
                <p className="rounded-md bg-ayati-warm p-3 text-ayati-ink">Confirm arrival time when the clinic responds.</p>
                <p className="rounded-md bg-ayati-warm p-3 text-ayati-ink">Check messages after the visit for follow-up steps.</p>
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <div className="rounded-md border border-ayati-line bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-ayati-ink">Care journey tracking</h2>
          <div className="mt-5 grid gap-3">
            {journey.map((item) => (
              <div key={item.label} className="grid gap-3 rounded-md border border-ayati-line p-4 sm:grid-cols-[160px_100px_1fr] sm:items-center">
                <p className="font-semibold text-ayati-ink">{item.label}</p>
                <span className={clsx("w-fit rounded-md px-3 py-1 text-xs font-semibold", statusClass(item.status))}>{item.status}</span>
                <p className="text-sm leading-6 text-ayati-muted">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-ayati-line bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-ayati-teal" aria-hidden="true" />
            <h2 className="text-xl font-semibold text-ayati-ink">Secure messaging</h2>
          </div>
          <div className="mt-5 grid gap-3">
            <div className="rounded-md bg-ayati-mint p-4">
              <p className="text-sm font-semibold text-ayati-teal">AYATI Coordinator</p>
              <p className="mt-2 text-sm leading-6 text-ayati-ink">
                {primaryMatch
                  ? `Your clinic match is ready. Review ${primaryMatch.name} and send a pre-visit summary when ready.`
                  : "Clinic matching will appear here after approved clinic profiles are connected."}
              </p>
            </div>
            <div className="rounded-md bg-ayati-warm p-4">
              <div className="flex items-center gap-2">
                <Languages className="h-4 w-4 text-ayati-teal" aria-hidden="true" />
                <p className="text-sm font-semibold text-ayati-ink">Language support</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-ayati-muted">Messages can be routed by preferred language when the clinic supports it.</p>
            </div>
            <div className="rounded-md border border-ayati-line p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-ayati-teal" aria-hidden="true" />
                <p className="text-sm leading-6 text-ayati-muted">This demo does not store clinical records and does not provide diagnosis, treatment, or medical advice.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
