"use client";

import { useSyncExternalStore } from "react";
import { ClipboardCheck } from "lucide-react";
import { inquiries } from "@/data/seed";
import { getClinicBySlug } from "@/lib/clinic-utils";
import {
  getDemoInquiries,
  getDemoStorageServerSnapshot,
  getDemoStorageSnapshot,
  subscribeDemoStorage
} from "@/lib/demo-storage";

export function InquiryConfirmationDetails({ reference }: { reference: string }) {
  const storageSnapshot = useSyncExternalStore(
    subscribeDemoStorage,
    getDemoStorageSnapshot,
    getDemoStorageServerSnapshot
  );

  const availableInquiries = storageSnapshot === "" ? inquiries : getDemoInquiries(inquiries);
  const inquiry = availableInquiries.find((row) => row.id === reference);

  if (!inquiry) {
    return (
      <section className="rounded-md border border-ayati-line bg-white p-5">
        <h2 className="text-lg font-semibold text-ayati-ink">Inquiry details</h2>
        <p className="mt-2 text-sm leading-6 text-ayati-muted">
          The reference was created, but detailed local storage data is not available in this browser session.
        </p>
      </section>
    );
  }

  const clinic = getClinicBySlug(inquiry.clinicSlug);

  return (
    <section className="rounded-md border border-ayati-line bg-white p-5">
      <div className="flex items-center gap-2">
        <ClipboardCheck className="h-5 w-5 text-ayati-teal" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-ayati-ink">Saved inquiry details</h2>
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-md bg-ayati-warm p-3">
          <dt className="font-medium text-ayati-muted">Clinic</dt>
          <dd className="mt-1 font-semibold text-ayati-ink">{clinic?.name ?? "Not sure yet"}</dd>
        </div>
        <div className="rounded-md bg-ayati-warm p-3">
          <dt className="font-medium text-ayati-muted">Status</dt>
          <dd className="mt-1 font-semibold text-ayati-ink">{inquiry.status}</dd>
        </div>
        <div className="rounded-md bg-ayati-warm p-3">
          <dt className="font-medium text-ayati-muted">Language</dt>
          <dd className="mt-1 font-semibold text-ayati-ink">{inquiry.preferredLanguage}</dd>
        </div>
        <div className="rounded-md bg-ayati-warm p-3">
          <dt className="font-medium text-ayati-muted">Urgency</dt>
          <dd className="mt-1 font-semibold text-ayati-ink">{inquiry.urgency}</dd>
        </div>
        <div className="rounded-md bg-ayati-warm p-3">
          <dt className="font-medium text-ayati-muted">Insurance/payment</dt>
          <dd className="mt-1 font-semibold text-ayati-ink">{inquiry.insuranceProvider ?? "Not stated"}</dd>
        </div>
        <div className="rounded-md bg-ayati-warm p-3">
          <dt className="font-medium text-ayati-muted">Budget preference</dt>
          <dd className="mt-1 font-semibold text-ayati-ink">{inquiry.budgetPreference ?? "Not stated"}</dd>
        </div>
      </dl>

      <div className="mt-4 rounded-md bg-ayati-mint p-4">
        <p className="text-sm font-semibold text-ayati-teal">Clinic-ready summary</p>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-ayati-ink">{inquiry.summary}</p>
      </div>
    </section>
  );
}
