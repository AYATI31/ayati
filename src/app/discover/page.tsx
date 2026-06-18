import type { Metadata } from "next";
import { Disclaimer } from "@/components/Disclaimer";
import { SearchPanel } from "@/components/SearchPanel";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Search Clinics",
  description: "Search UAE clinics by specialty, service, location, language, insurance, and price visibility."
};

export default function DiscoverPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Search clinics" title="Compare care-fit details before the first call">
        <p>
          Use simple filters to narrow clinic options by practical fit. AYATI does not rank clinics by medical superiority and does not publish open public reviews.
        </p>
      </SectionHeading>
      <div className="mt-8">
        <SearchPanel />
      </div>
      <div className="mt-8">
        <Disclaimer />
      </div>
    </div>
  );
}
