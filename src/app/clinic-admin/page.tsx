import type { Metadata } from "next";
import { ClinicAdminDashboard } from "@/components/ClinicAdminDashboard";
import { Disclaimer } from "@/components/Disclaimer";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Clinic Admin",
  description: "Clinic admin dashboard for inquiry inbox, patient pipeline, appointments, follow-ups, referrals, team notes, and analytics."
};

export default function ClinicAdminPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Clinic workspace" title="Coordinate patient navigation requests">
        <p>
          This workspace helps clinic teams decide what to do next for each patient inquiry, from first contact to booking and follow-up.
        </p>
      </SectionHeading>
      <div className="mt-8">
        <ClinicAdminDashboard />
      </div>
      <div className="mt-8">
        <Disclaimer />
      </div>
    </div>
  );
}
