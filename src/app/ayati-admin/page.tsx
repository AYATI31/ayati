import type { Metadata } from "next";
import { AyatiAdminDashboard } from "@/components/AyatiAdminDashboard";
import { Disclaimer } from "@/components/Disclaimer";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "AYATI Admin",
  description: "AYATI admin dashboard for clinic quality, approvals, search insights, and inquiry exports."
};

export default function AyatiAdminPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="AYATI operator admin" title="Keep care-navigation data clear, complete, and trusted">
        <p>
          Review clinic completeness, approve profiles, verify claims, monitor inquiry volume, and identify patient confusion patterns.
        </p>
      </SectionHeading>
      <div className="mt-8">
        <AyatiAdminDashboard />
      </div>
      <div className="mt-8">
        <Disclaimer />
      </div>
    </div>
  );
}
