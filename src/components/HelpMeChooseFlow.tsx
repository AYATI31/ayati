"use client";

import { useMemo, useState } from "react";
import { ArrowRight, HelpCircle, RotateCcw } from "lucide-react";
import { ClinicCard } from "@/components/ClinicCard";
import { availableInsurances, availableLanguages, availableLocations } from "@/data/seed";
import { generatePreVisitSummary, getSuggestedCareCategories, recommendClinics, type ChoiceAnswers } from "@/lib/clinic-utils";

const defaultAnswers: ChoiceAnswers = {
  need: "",
  patientFor: "For me",
  location: "",
  language: "",
  insuranceProvider: "",
  budgetPreference: "",
  urgency: "Routine",
  accessibilityNeeds: ""
};

function FieldLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-ayati-ink">
      {label}
      {children}
    </label>
  );
}

export function HelpMeChooseFlow() {
  const [answers, setAnswers] = useState<ChoiceAnswers>(defaultAnswers);
  const [submitted, setSubmitted] = useState(false);

  const recommendations = useMemo(() => recommendClinics(answers), [answers]);
  const suggestedCategories = useMemo(() => getSuggestedCareCategories(answers.need), [answers.need]);
  const summary = useMemo(() => generatePreVisitSummary(answers), [answers]);

  const update = (key: keyof ChoiceAnswers, value: string) => {
    setAnswers((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <form
        className="h-fit rounded-md border border-ayati-line bg-white p-5 lg:sticky lg:top-28"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
      >
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-ayati-teal" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-ayati-ink">Answer simple non-clinical questions</h2>
        </div>

        <div className="mt-5 grid gap-4">
          <FieldLabel label="What are you looking for?">
            <input
              value={answers.need}
              onChange={(event) => update("need", event.target.value)}
              placeholder="Example: acne, IVF, eye check, dentist"
              className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm text-ayati-ink"
              required
            />
          </FieldLabel>

          <FieldLabel label="Is this for you or someone else?">
            <select
              value={answers.patientFor}
              onChange={(event) => update("patientFor", event.target.value)}
              className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm text-ayati-ink"
            >
              <option>For me</option>
              <option>For someone else</option>
            </select>
          </FieldLabel>

          <FieldLabel label="Preferred language">
            <select
              value={answers.language}
              onChange={(event) => update("language", event.target.value)}
              className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm text-ayati-ink"
            >
              <option value="">Any language</option>
              {availableLanguages.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </FieldLabel>

          <FieldLabel label="Emirate / location">
            <select
              value={answers.location}
              onChange={(event) => update("location", event.target.value)}
              className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm text-ayati-ink"
            >
              <option value="">Any UAE location</option>
              {availableLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </FieldLabel>

          <FieldLabel label="Insurance provider">
            <select
              value={answers.insuranceProvider}
              onChange={(event) => update("insuranceProvider", event.target.value)}
              className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm text-ayati-ink"
            >
              <option value="">Not sure yet</option>
              <option value="Cash/self-pay">Cash/self-pay</option>
              {availableInsurances
                .filter((insurance) => insurance !== "Self-pay")
                .map((insurance) => (
                  <option key={insurance} value={insurance}>
                    {insurance}
                  </option>
                ))}
            </select>
          </FieldLabel>

          <FieldLabel label="Budget / price visibility preference">
            <select
              value={answers.budgetPreference}
              onChange={(event) => update("budgetPreference", event.target.value)}
              className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm text-ayati-ink"
            >
              <option value="">No preference yet</option>
              <option value="Prefer visible prices">Prefer visible prices</option>
              <option value="Insurance-first">Insurance-first</option>
              <option value="Self-pay friendly">Self-pay friendly</option>
            </select>
          </FieldLabel>

          <FieldLabel label="Urgency level">
            <select
              value={answers.urgency}
              onChange={(event) => update("urgency", event.target.value)}
              className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm text-ayati-ink"
            >
              <option value="Routine">Routine</option>
              <option value="Soon">Soon</option>
              <option value="Urgent">Urgent</option>
            </select>
          </FieldLabel>

          <FieldLabel label="Any accessibility needs?">
            <input
              value={answers.accessibilityNeeds}
              onChange={(event) => update("accessibilityNeeds", event.target.value)}
              placeholder="Example: wheelchair access, caregiver support, quiet waiting area"
              className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm text-ayati-ink"
            />
          </FieldLabel>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <button
            type="submit"
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-ayati-teal px-4 py-3 text-sm font-semibold text-white hover:bg-[#0B5552]"
          >
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            Generate starting points
          </button>
          <button
            type="button"
            onClick={() => {
              setAnswers(defaultAnswers);
              setSubmitted(false);
            }}
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-ayati-line bg-ayati-paper px-4 py-3 text-sm font-semibold text-ayati-ink hover:border-ayati-teal"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Start over
          </button>
        </div>
      </form>

      <section>
        {!submitted ? (
          <div className="rounded-md border border-ayati-line bg-white p-6">
            <h2 className="text-2xl font-semibold text-ayati-ink">Your recommendations will appear here</h2>
            <p className="mt-3 text-base leading-7 text-ayati-muted">
              This guide helps narrow provider options. It does not diagnose symptoms, decide medical urgency, or replace emergency care.
            </p>
            <div className="mt-5 rounded-md bg-ayati-warm p-4">
              <p className="text-sm font-semibold text-ayati-ink">What should you do next?</p>
              <p className="mt-1 text-sm leading-6 text-ayati-muted">Answer the questions on the left, then review suggested clinic categories and care-fit options.</p>
            </div>
          </div>
        ) : null}

        {submitted ? (
          <div>
            <div className="rounded-md border border-ayati-line bg-white p-6">
              <h2 className="text-2xl font-semibold text-ayati-ink">Recommended starting points</h2>
              <p className="mt-3 text-sm leading-6 text-ayati-muted">
                These are based on service fit, location, language, payment preference, accessibility notes, and available clinic information. They are not a medical ranking or diagnosis.
              </p>
              <div className="mt-5 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
                <div className="rounded-md bg-ayati-warm p-4">
                  <p className="text-sm font-semibold text-ayati-ink">Suitable clinic categories</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {suggestedCategories.map((category) => (
                      <span key={category} className="rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-ayati-teal">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-md bg-ayati-warm p-4">
                  <p className="text-sm font-semibold text-ayati-ink">Plain-language pre-visit summary</p>
                  <p className="mt-2 text-sm leading-6 text-ayati-muted">{summary}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              {recommendations.map(({ clinic, reasons }) => (
                <ClinicCard key={clinic.id} clinic={clinic} reason={reasons.length ? `Why this may fit: ${reasons.join(", ")}.` : undefined} />
              ))}
            </div>

            {recommendations.length === 0 ? (
              <div className="mt-5 rounded-md border border-ayati-line bg-white p-6 text-center">
                <h3 className="text-lg font-semibold text-ayati-ink">No strong match yet</h3>
                <p className="mt-2 text-sm leading-6 text-ayati-muted">
                  Try a broader care area such as dental, skin, eye, fertility, women&apos;s health, or general clinic.
                </p>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>
    </div>
  );
}
