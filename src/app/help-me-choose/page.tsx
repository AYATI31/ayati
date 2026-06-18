import type { Metadata } from "next";
import { Disclaimer } from "@/components/Disclaimer";
import { HelpMeChooseFlow } from "@/components/HelpMeChooseFlow";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Help Me Choose",
  description: "A simple guided flow that helps patients find practical clinic options without giving medical advice."
};

export default function HelpMeChoosePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Help me choose" title="Not sure where to start? Build a clear care inquiry.">
        <p>
          AYATI uses non-clinical preferences to suggest practical starting categories and care-fit options. If symptoms feel severe or life-threatening, contact local emergency services.
        </p>
      </SectionHeading>
      <div className="mt-8">
        <HelpMeChooseFlow />
      </div>
      <div className="mt-8">
        <Disclaimer />
      </div>
    </div>
  );
}
