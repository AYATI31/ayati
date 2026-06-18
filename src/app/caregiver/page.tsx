import type { Metadata } from "next";
import { CaregiverExperience } from "@/components/CaregiverExperience";
import { Disclaimer } from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "Caregiver App",
  description: "AYATI caregiver app for managing dependents, booking on behalf of patients, shared timelines, and care coordination."
};

export default function CaregiverPage() {
  return (
    <div className="bg-ayati-warm">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <CaregiverExperience />
        <div className="mt-8">
          <Disclaimer />
        </div>
      </div>
    </div>
  );
}
