import type { Metadata } from "next";
import { Disclaimer } from "@/components/Disclaimer";
import { PatientNavigationApp } from "@/components/PatientNavigationApp";

export const metadata: Metadata = {
  title: "Patient App",
  description: "AYATI patient healthcare navigation app for needs assessment, clinic matching, booking, reminders, and secure messaging."
};

export default function PatientPage() {
  return (
    <div className="bg-ayati-warm">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <PatientNavigationApp />
        <div className="mt-8">
          <Disclaimer />
        </div>
      </div>
    </div>
  );
}
