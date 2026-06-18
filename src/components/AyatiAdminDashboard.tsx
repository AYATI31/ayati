"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Building2, Download, FileWarning, Languages, Pencil, Plus, Search, Trash2, Users } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { clinics as seedClinics, commonConfusionReasons, inquiries } from "@/data/seed";
import { getDemoInquiries, getDemoStorageServerSnapshot, getDemoStorageSnapshot, subscribeDemoStorage } from "@/lib/demo-storage";
import { exportInquiriesCsv, getAdminMetrics } from "@/lib/clinic-utils";
import type { Clinic, Inquiry } from "@/types";

function DownloadCsvButton({ rows }: { rows: Inquiry[] }) {
  return (
    <button
      type="button"
      onClick={() => {
        const csv = exportInquiriesCsv(rows);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "ayati-inquiries.csv";
        anchor.click();
        URL.revokeObjectURL(url);
      }}
      className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-ayati-teal px-4 py-3 text-sm font-semibold text-white hover:bg-[#0B5552]"
    >
      <Download className="h-4 w-4" aria-hidden="true" />
      Export inquiries CSV
    </button>
  );
}

export function AyatiAdminDashboard() {
  const metrics = getAdminMetrics();
  const [clinics, setClinics] = useState<Clinic[]>(seedClinics);
  const storageSnapshot = useSyncExternalStore(subscribeDemoStorage, getDemoStorageSnapshot, getDemoStorageServerSnapshot);
  const allInquiries = storageSnapshot === "" ? inquiries : getDemoInquiries(inquiries);
  const inquiryVolumeByClinic = clinics.map((clinic) => ({
    clinic,
    count: allInquiries.filter((inquiry) => inquiry.clinicSlug === clinic.slug).length
  }));

  const approveClinic = (slug: string) => {
    setClinics((current) =>
      current.map((clinic) =>
        clinic.slug === slug
          ? {
              ...clinic,
              status: "Approved",
              approvedAt: new Date().toISOString().slice(0, 10)
            }
          : clinic
      )
    );
  };

  const removeClinic = (slug: string) => {
    setClinics((current) => current.filter((clinic) => clinic.slug !== slug));
  };

  return (
    <div className="grid min-w-0 gap-6">
      <div className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total clinics" value={clinics.length} icon={Building2} helper="Connected clinic profiles" />
        <StatCard label="Total inquiries" value={allInquiries.length} icon={Users} helper="Operational inquiry records" />
        <StatCard label="Pending approvals" value={clinics.filter((clinic) => clinic.status !== "Approved").length} icon={FileWarning} helper="Profiles needing admin action" />
        <StatCard label="Missing info" value={clinics.filter((clinic) => clinic.missingInformation.length > 0).length} icon={Search} helper="Profiles to improve" />
      </div>

      <section className="min-w-0 overflow-hidden rounded-md border border-ayati-line bg-white p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-ayati-ink">AYATI operator review</h2>
            <p className="mt-2 text-sm leading-6 text-ayati-muted">Approve profiles, flag missing fields, verify claims, and inspect profiles before they appear as trusted patient-facing options.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <DownloadCsvButton rows={allInquiries} />
            <Link
              href="/ayati-admin/clinics/new"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-ayati-line bg-ayati-paper px-4 py-3 text-sm font-semibold text-ayati-ink hover:border-ayati-teal"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add clinic
            </Link>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[860px] border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr className="text-ayati-muted">
                <th className="border-b border-ayati-line pb-3 font-semibold">Clinic</th>
                <th className="border-b border-ayati-line pb-3 font-semibold">Location</th>
                <th className="border-b border-ayati-line pb-3 font-semibold">Specialties</th>
                <th className="border-b border-ayati-line pb-3 font-semibold">Status</th>
                <th className="border-b border-ayati-line pb-3 font-semibold">Missing</th>
                <th className="border-b border-ayati-line pb-3 font-semibold">Claims to verify</th>
                <th className="border-b border-ayati-line pb-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clinics.map((clinic) => (
                <tr key={clinic.id} className="align-top">
                  <td className="border-b border-ayati-line py-4 font-semibold text-ayati-ink">{clinic.name}</td>
                  <td className="border-b border-ayati-line py-4 text-ayati-muted">
                    {clinic.area}, {clinic.emirate}
                  </td>
                  <td className="border-b border-ayati-line py-4 text-ayati-muted">{clinic.specialties.join(", ")}</td>
                  <td className="border-b border-ayati-line py-4 text-ayati-muted">{clinic.status}</td>
                  <td className="border-b border-ayati-line py-4 text-ayati-muted">{clinic.missingInformation.length}</td>
                  <td className="border-b border-ayati-line py-4 text-ayati-muted">{clinic.claimsToVerify.length}</td>
                  <td className="border-b border-ayati-line py-4">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/ayati-admin/clinics/${clinic.slug}/edit`}
                        className="focus-ring inline-flex items-center gap-1 rounded-md border border-ayati-line bg-white px-2.5 py-2 text-xs font-semibold text-ayati-ink hover:border-ayati-teal"
                      >
                        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                        Edit
                      </Link>
                      {clinic.status !== "Approved" ? (
                        <button
                          type="button"
                          onClick={() => approveClinic(clinic.slug)}
                          className="focus-ring rounded-md border border-ayati-line bg-ayati-mint px-2.5 py-2 text-xs font-semibold text-ayati-teal hover:border-ayati-teal"
                        >
                          Approve
                        </button>
                      ) : null}
                      <Link
                        href={`/ayati-admin/clinics/${clinic.slug}/edit`}
                        className="focus-ring rounded-md border border-ayati-line bg-ayati-paper px-2.5 py-2 text-xs font-semibold text-ayati-muted hover:border-ayati-teal"
                      >
                        Flag fields
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeClinic(clinic.slug)}
                        className="focus-ring inline-flex items-center gap-1 rounded-md border border-ayati-line bg-white px-2.5 py-2 text-xs font-semibold text-rose-700 hover:border-rose-300"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {clinics.length === 0 ? (
          <div className="mt-5 rounded-md border border-dashed border-ayati-line bg-ayati-paper p-5">
            <h3 className="font-semibold text-ayati-ink">No clinic profiles yet</h3>
            <p className="mt-2 text-sm leading-6 text-ayati-muted">Dummy records have been removed. Add real clinic profiles before publishing patient-facing matching.</p>
          </div>
        ) : null}
      </section>

      <section className="grid min-w-0 gap-4 lg:grid-cols-3">
        <div className="rounded-md border border-ayati-line bg-white p-5">
          <h2 className="text-lg font-semibold text-ayati-ink">Approve clinic profile</h2>
          <p className="mt-2 text-sm leading-6 text-ayati-muted">Profiles should be approved only after service scope, language support, insurance wording, and price visibility are reviewed.</p>
          <div className="mt-4 grid gap-3">
            {clinics.filter((clinic) => clinic.status !== "Approved").slice(0, 3).map((clinic) => (
              <div key={clinic.slug} className="rounded-md bg-ayati-paper p-3">
                <p className="font-semibold text-ayati-ink">{clinic.name}</p>
                <p className="mt-1 text-sm text-ayati-muted">{clinic.status}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-ayati-line bg-white p-5">
          <h2 className="text-lg font-semibold text-ayati-ink">Verify claims</h2>
          <p className="mt-2 text-sm leading-6 text-ayati-muted">Operator review should catch healthcare claims, insurance promises, and package wording before publication.</p>
          <div className="mt-4 grid gap-3">
            {clinics.flatMap((clinic) => clinic.claimsToVerify.map((claim) => ({ clinic, claim }))).slice(0, 5).map(({ clinic, claim }) => (
              <div key={`${clinic.slug}-${claim}`} className="rounded-md bg-ayati-paper p-3">
                <p className="font-semibold text-ayati-ink">{claim}</p>
                <p className="mt-1 text-sm text-ayati-muted">{clinic.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-ayati-line bg-white p-5">
          <h2 className="text-lg font-semibold text-ayati-ink">Inquiry volume</h2>
          <p className="mt-2 text-sm leading-6 text-ayati-muted">Used to understand operational load, not to rank medical quality.</p>
          <div className="mt-4 grid gap-3">
            {inquiryVolumeByClinic.map(({ clinic, count }) => (
              <div key={clinic.slug} className="flex items-center justify-between gap-3 rounded-md bg-ayati-paper p-3 text-sm">
                <span className="font-semibold text-ayati-ink">{clinic.name}</span>
                <span className="text-ayati-muted">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid min-w-0 gap-4 lg:grid-cols-3">
        <div className="rounded-md border border-ayati-line bg-white p-5">
          <h2 className="text-lg font-semibold text-ayati-ink">Most searched specialties</h2>
          <div className="mt-4 grid gap-3">
            {metrics.topSearches.specialties.length > 0 ? metrics.topSearches.specialties.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-ayati-muted">{item.label}</span>
                <span className="font-semibold text-ayati-ink">{item.count}</span>
              </div>
            )) : <p className="text-sm leading-6 text-ayati-muted">No search data yet.</p>}
          </div>
        </div>

        <div className="rounded-md border border-ayati-line bg-white p-5">
          <div className="flex items-center gap-2">
            <Languages className="h-5 w-5 text-ayati-teal" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-ayati-ink">Top languages requested</h2>
          </div>
          <div className="mt-4 grid gap-3">
            {metrics.topSearches.languages.length > 0 ? metrics.topSearches.languages.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-ayati-muted">{item.label}</span>
                <span className="font-semibold text-ayati-ink">{item.count}</span>
              </div>
            )) : <p className="text-sm leading-6 text-ayati-muted">No language request data yet.</p>}
          </div>
        </div>

        <div className="rounded-md border border-ayati-line bg-white p-5">
          <h2 className="text-lg font-semibold text-ayati-ink">Top locations searched</h2>
          <div className="mt-4 grid gap-3">
            {metrics.topSearches.locations.length > 0 ? metrics.topSearches.locations.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-ayati-muted">{item.label}</span>
                <span className="font-semibold text-ayati-ink">{item.count}</span>
              </div>
            )) : <p className="text-sm leading-6 text-ayati-muted">No location search data yet.</p>}
          </div>
        </div>
      </section>

      <section className="min-w-0 rounded-md border border-ayati-line bg-white p-6">
        <h2 className="text-xl font-semibold text-ayati-ink">Common patient confusion reasons</h2>
        <p className="mt-2 text-sm leading-6 text-ayati-muted">
          These reasons help AYATI improve navigation copy, clinic data completeness, and inquiry quality. They are not clinical conclusions.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {commonConfusionReasons.map((reason) => (
            <div key={reason.label} className="flex items-center justify-between gap-3 rounded-md bg-ayati-paper p-4">
              <p className="font-semibold text-ayati-ink">{reason.label}</p>
              <span className="rounded-md bg-white px-3 py-1 text-sm font-semibold text-ayati-teal">{reason.count}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="min-w-0 rounded-md border border-ayati-line bg-white p-6">
        <h2 className="text-xl font-semibold text-ayati-ink">Clinics with missing information</h2>
        <div className="mt-5 grid gap-3">
          {clinics.filter((clinic) => clinic.missingInformation.length > 0).length > 0 ? (
            clinics
              .filter((clinic) => clinic.missingInformation.length > 0)
              .map((clinic) => (
              <div key={clinic.slug} className="rounded-md border border-ayati-line bg-ayati-paper p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-semibold text-ayati-ink">{clinic.name}</p>
                    <p className="mt-1 text-sm text-ayati-muted">{clinic.missingInformation.join(", ")}</p>
                  </div>
                  <Link href={`/ayati-admin/clinics/${clinic.slug}/edit`} className="focus-ring rounded-md text-sm font-semibold text-ayati-teal hover:text-ayati-ink">
                    Fix profile
                  </Link>
                </div>
              </div>
              ))
          ) : (
            <p className="rounded-md bg-ayati-paper p-4 text-sm leading-6 text-ayati-muted">No missing-information records yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
