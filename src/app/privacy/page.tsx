import type { Metadata } from "next";
import { AlertTriangle, Database, FileText, Shield } from "lucide-react";
import { Disclaimer } from "@/components/Disclaimer";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Privacy & Disclaimer",
  description: "Privacy, disclaimer, and product boundary notes for AYATI healthcare navigation."
};

const boundaries = [
  "AYATI is not an EMR.",
  "It does not store clinical records.",
  "It does not give medical advice, diagnosis, or treatment.",
  "It does not rank clinics by medical superiority.",
  "It helps patients and caregivers navigate options, coordinate next steps, and prepare for visits."
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Privacy & disclaimer" title="Clear boundaries help patients trust the product">
        <p>
          This page describes the intended product boundary for AYATI and the first-version data posture.
        </p>
      </SectionHeading>

      <section className="mt-8 rounded-md border border-ayati-line bg-white p-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-ayati-coral" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-ayati-ink">Medical disclaimer</h2>
        </div>
        <div className="mt-4">
          <Disclaimer />
        </div>
      </section>

      <section className="mt-6 rounded-md border border-ayati-line bg-white p-6">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-ayati-teal" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-ayati-ink">Product boundaries</h2>
        </div>
        <ul className="mt-4 grid gap-3 text-base leading-7 text-ayati-muted">
          {boundaries.map((boundary) => (
            <li key={boundary} className="rounded-md bg-ayati-paper px-4 py-3">
              {boundary}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="rounded-md border border-ayati-line bg-white p-5">
          <Database className="h-6 w-6 text-ayati-blue" aria-hidden="true" />
          <h2 className="mt-4 text-lg font-semibold text-ayati-ink">First-version data</h2>
          <p className="mt-2 text-sm leading-6 text-ayati-muted">
            The demo build uses local mock data and browser storage for submitted form demos. A production build should connect Supabase/PostgreSQL before collecting real patient data.
          </p>
        </article>
        <article className="rounded-md border border-ayati-line bg-white p-5">
          <FileText className="h-6 w-6 text-ayati-blue" aria-hidden="true" />
          <h2 className="mt-4 text-lg font-semibold text-ayati-ink">Pre-visit forms</h2>
          <p className="mt-2 text-sm leading-6 text-ayati-muted">
            Pre-visit summaries are intended to help communication with clinics. They should not become a clinical record unless AYATI later builds proper EMR-grade controls.
          </p>
        </article>
      </section>
    </div>
  );
}
