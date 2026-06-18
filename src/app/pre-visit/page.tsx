import type { Metadata } from "next";
import { Suspense } from "react";
import { Disclaimer } from "@/components/Disclaimer";
import { PreVisitForm } from "@/components/PreVisitForm";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Pre-Visit Form",
  description: "Prepare a simple clinic-ready summary before your first appointment inquiry."
};

export default function PreVisitPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Connected care preparation" title="Tell the clinic what you need help with">
        <p>
          Share the concern, duration, worries, reports, and preferred language so the clinic can respond with less back-and-forth.
        </p>
      </SectionHeading>
      <div className="mt-8">
        <Suspense fallback={<div className="rounded-md border border-ayati-line bg-white p-6 text-ayati-muted">Loading form...</div>}>
          <PreVisitForm />
        </Suspense>
      </div>
      <div className="mt-8">
        <Disclaimer />
      </div>
    </div>
  );
}
