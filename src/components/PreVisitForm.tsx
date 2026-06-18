"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ClipboardCheck, Send } from "lucide-react";
import { availableInsurances, clinics } from "@/data/seed";
import { languageOptions } from "@/lib/constants";
import { savePreVisitSubmission } from "@/lib/demo-storage";
import type { Inquiry, PreVisitSubmission } from "@/types";

type FormState = {
  clinicSlug: string;
  patientFor: string;
  concern: string;
  duration: string;
  worry: string;
  hasReports: string;
  preferredLanguage: string;
  urgency: Inquiry["urgency"];
  insuranceProvider: string;
  budgetPreference: string;
  accessibilityNeeds: string;
  name: string;
  contact: string;
};

function TextField({
  label,
  value,
  onChange,
  placeholder,
  required = false
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-ayati-ink">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm text-ayati-ink"
      />
    </label>
  );
}

export function PreVisitForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialClinic = searchParams.get("clinic") ?? "";
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<FormState>({
    clinicSlug: initialClinic,
    patientFor: "For me",
    concern: "",
    duration: "",
    worry: "",
    hasReports: "No",
    preferredLanguage: "English",
    urgency: "Routine",
    insuranceProvider: "",
    budgetPreference: "",
    accessibilityNeeds: "",
    name: "",
    contact: ""
  });

  const selectedClinic = clinics.find((clinic) => clinic.slug === form.clinicSlug);

  const summary = useMemo(() => {
    return [
      form.name ? `Patient name: ${form.name}` : "Patient name: Not provided yet",
      `Inquiry for: ${form.patientFor}`,
      selectedClinic ? `Preferred clinic: ${selectedClinic.name}` : "Preferred clinic: Not selected",
      `Main concern: ${form.concern || "Not provided yet"}`,
      `Duration: ${form.duration || "Not provided yet"}`,
      `Main worry: ${form.worry || "Not provided yet"}`,
      `Urgency described by patient: ${form.urgency}`,
      `Reports or images available: ${form.hasReports}`,
      `Preferred language: ${form.preferredLanguage}`,
      `Insurance/payment: ${form.insuranceProvider || "Not sure yet"}`,
      `Budget preference: ${form.budgetPreference || "No preference stated"}`,
      `Accessibility needs: ${form.accessibilityNeeds || "None mentioned"}`,
      form.contact ? `Preferred contact: ${form.contact}` : "Preferred contact: Not provided yet"
    ].join("\n");
  }, [form, selectedClinic]);

  const update = (key: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const persistSubmission = async (submission: PreVisitSubmission) => {
    savePreVisitSubmission(submission);

    try {
      await fetch("/api/inquiries", {
        body: JSON.stringify(submission),
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      });
    } catch {
      // Local demo storage remains the fallback until Supabase is configured.
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
      <form
        className="rounded-md border border-ayati-line bg-white p-5"
        onSubmit={async (event) => {
          event.preventDefault();
          setIsSubmitting(true);
          const reference = `AYATI-${Date.now().toString().slice(-6)}`;
          const submission: PreVisitSubmission = {
            reference,
            clinicSlug: form.clinicSlug,
            concern: form.concern,
            duration: form.duration,
            worry: form.worry,
            hasReports: form.hasReports === "Yes",
            preferredLanguage: form.preferredLanguage,
            name: form.name,
            contact: form.contact,
            summary,
            patientFor: form.patientFor,
            urgency: form.urgency,
            insuranceProvider: form.insuranceProvider || "Not stated",
            budgetPreference: form.budgetPreference || "No preference stated",
            accessibilityNeeds: form.accessibilityNeeds,
            createdAt: new Date().toISOString()
          };

          await persistSubmission(submission);
          router.push(`/confirmation?ref=${reference}&clinic=${form.clinicSlug}`);
        }}
      >
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-ayati-teal" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-ayati-ink">Prepare your visit</h2>
        </div>

        <div className="mt-5 grid gap-4">
          <TextField label="Your name" value={form.name} onChange={(value) => update("name", value)} placeholder="Full name" required />
          <TextField label="Phone or email" value={form.contact} onChange={(value) => update("contact", value)} placeholder="+971..." required />

          <label className="grid gap-2 text-sm font-medium text-ayati-ink">
            Is this for you or someone else?
            <select
              value={form.patientFor}
              onChange={(event) => update("patientFor", event.target.value)}
              className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm text-ayati-ink"
            >
              <option>For me</option>
              <option>For someone else</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm font-medium text-ayati-ink">
            Preferred clinic
            <select
              value={form.clinicSlug}
              onChange={(event) => update("clinicSlug", event.target.value)}
              className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm text-ayati-ink"
            >
              <option value="">Not sure yet</option>
              {clinics.map((clinic) => (
                <option key={clinic.slug} value={clinic.slug}>
                  {clinic.name}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-medium text-ayati-ink">
            What problem are you facing?
            <textarea
              value={form.concern}
              onChange={(event) => update("concern", event.target.value)}
              required
              rows={4}
              placeholder="Describe the concern in your own words"
              className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm text-ayati-ink"
            />
          </label>

          <TextField label="How long has it been?" value={form.duration} onChange={(value) => update("duration", value)} placeholder="Example: 3 days, 2 weeks, 6 months" required />

          <label className="grid gap-2 text-sm font-medium text-ayati-ink">
            Urgency level
            <select
              value={form.urgency}
              onChange={(event) => update("urgency", event.target.value as Inquiry["urgency"])}
              className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm text-ayati-ink"
            >
              <option value="Routine">Routine</option>
              <option value="Soon">Soon</option>
              <option value="Urgent">Urgent</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm font-medium text-ayati-ink">
            What are you worried about?
            <textarea
              value={form.worry}
              onChange={(event) => update("worry", event.target.value)}
              rows={3}
              placeholder="Example: pain, cost, language, insurance, getting the wrong clinic"
              className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm text-ayati-ink"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-ayati-ink">
            Do you have reports or images?
            <select
              value={form.hasReports}
              onChange={(event) => update("hasReports", event.target.value)}
              className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm text-ayati-ink"
            >
              <option>No</option>
              <option>Yes</option>
              <option>Not sure</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm font-medium text-ayati-ink">
            Preferred language
            <select
              value={form.preferredLanguage}
              onChange={(event) => update("preferredLanguage", event.target.value)}
              className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm text-ayati-ink"
            >
              {languageOptions.map((language) => (
                <option key={language}>{language}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-medium text-ayati-ink">
            Insurance provider
            <select
              value={form.insuranceProvider}
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
          </label>

          <label className="grid gap-2 text-sm font-medium text-ayati-ink">
            Budget / price visibility preference
            <select
              value={form.budgetPreference}
              onChange={(event) => update("budgetPreference", event.target.value)}
              className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm text-ayati-ink"
            >
              <option value="">No preference yet</option>
              <option value="Prefer visible prices">Prefer visible prices</option>
              <option value="Insurance-first">Insurance-first</option>
              <option value="Self-pay friendly">Self-pay friendly</option>
            </select>
          </label>

          <TextField
            label="Any accessibility needs?"
            value={form.accessibilityNeeds}
            onChange={(value) => update("accessibilityNeeds", value)}
            placeholder="Example: wheelchair access, caregiver support, quiet waiting area"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="focus-ring mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-ayati-teal px-4 py-3 text-sm font-semibold text-white hover:bg-[#0B5552]"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          {isSubmitting ? "Submitting inquiry" : "Submit inquiry"}
        </button>
      </form>

      <aside className="h-fit rounded-md border border-ayati-line bg-ayati-mint p-5 lg:sticky lg:top-28">
        <h2 className="text-lg font-semibold text-ayati-ink">Clinic-ready summary</h2>
        <p className="mt-2 text-sm leading-6 text-ayati-muted">
          This summary helps the clinic understand your concern before they contact you. It is not a diagnosis.
        </p>
        <pre className="mt-4 whitespace-pre-wrap rounded-md bg-white p-4 text-sm leading-6 text-ayati-ink">{summary}</pre>
      </aside>
    </div>
  );
}
