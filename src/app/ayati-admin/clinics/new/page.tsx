import type { Metadata } from "next";
import { ClinicForm } from "@/components/ClinicForm";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Add Clinic",
  description: "Add a new AYATI clinic profile."
};

export default function NewClinicPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Add clinic" title="Create a clear clinic profile">
        <p>Start with the information patients need before contacting a clinic. Save as a local draft in this demo build.</p>
      </SectionHeading>
      <div className="mt-8">
        <ClinicForm mode="new" />
      </div>
    </div>
  );
}
