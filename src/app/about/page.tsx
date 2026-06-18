import type { Metadata } from "next";
import { ClipboardPenLine, HeartHandshake, Languages, ShieldCheck } from "lucide-react";
import { Disclaimer } from "@/components/Disclaimer";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "About",
  description: "About AYATI and its healthcare navigation philosophy for patients, caregivers, and clinics."
};

const principles = [
  {
    title: "Simple before clever",
    body: "Patients should understand the next step without training, jargon, or overloaded dashboards.",
    icon: HeartHandshake
  },
  {
    title: "Connected by role",
    body: "Patients, caregivers, and clinic teams each get a focused workspace with the next action clearly visible.",
    icon: Languages
  },
  {
    title: "Guided preparation",
    body: "Pre-visit summaries help patients organize concerns before arriving, while avoiding diagnosis.",
    icon: ClipboardPenLine
  },
  {
    title: "Trusted boundaries",
    body: "AYATI is not an EMR, not a review marketplace, and not a medical advice product.",
    icon: ShieldCheck
  }
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="About AYATI" title="Design is how the care journey works">
        <p>
          AYATI helps UAE patients, caregivers, and clinics coordinate healthcare next steps with less confusion.
        </p>
      </SectionHeading>

      <section className="mt-8 rounded-md border border-ayati-line bg-white p-6">
        <blockquote className="text-2xl font-semibold leading-9 text-ayati-ink">
          &quot;Design is not just what it looks and feels like. Design is how it works.&quot;
        </blockquote>
        <p className="mt-4 text-base leading-7 text-ayati-muted">
          AYATI follows that idea by making the next step visible: what the patient needs, who can help, what to prepare, who should follow up, and where the journey stands.
        </p>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        {principles.map((principle) => {
          const Icon = principle.icon;
          return (
            <article key={principle.title} className="rounded-md border border-ayati-line bg-white p-5">
              <Icon className="h-6 w-6 text-ayati-blue" aria-hidden="true" />
              <h2 className="mt-4 text-lg font-semibold text-ayati-ink">{principle.title}</h2>
              <p className="mt-2 text-sm leading-6 text-ayati-muted">{principle.body}</p>
            </article>
          );
        })}
      </section>

      <section className="mt-8 rounded-md border border-ayati-line bg-white p-6">
        <h2 className="text-2xl font-semibold text-ayati-ink">Future-ready, deliberately focused</h2>
        <p className="mt-3 text-base leading-7 text-ayati-muted">
          This version prepares the structure for verified feedback, appointment integrations, WhatsApp automation, medical tourism journeys, deeper family access, report explanation, and a multilingual AI assistant. Those are not active in the first build.
        </p>
      </section>

      <div className="mt-8">
        <Disclaimer />
      </div>
    </div>
  );
}
