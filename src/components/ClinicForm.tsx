"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Save, Sparkles } from "lucide-react";
import type { Clinic } from "@/types";

type ClinicFormProps = {
  clinic?: Clinic;
  mode: "new" | "edit";
};

const emptyClinic = {
  name: "",
  slug: "",
  emirate: "",
  area: "",
  address: "",
  description: "",
  specialties: "",
  bestForTag: "",
  helpsWith: "",
  services: "",
  doctors: "",
  languages: "English, Arabic",
  insurance: "Self-pay",
  priceRange: "",
  phone: "",
  whatsapp: "",
  email: "",
  accessibilityNotes: "",
  preparationNotes: "",
  suitableFor: "",
  claimsToVerify: "",
  missingInformation: ""
};

export function ClinicForm({ clinic, mode }: ClinicFormProps) {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState(() => ({
    name: clinic?.name ?? emptyClinic.name,
    slug: clinic?.slug ?? emptyClinic.slug,
    emirate: clinic?.emirate ?? emptyClinic.emirate,
    area: clinic?.area ?? emptyClinic.area,
    address: clinic?.address ?? emptyClinic.address,
    description: clinic?.description ?? emptyClinic.description,
    specialties: clinic?.specialties.join(", ") ?? emptyClinic.specialties,
    bestForTag: clinic?.bestForTag ?? emptyClinic.bestForTag,
    helpsWith: clinic?.helpsWith.join("\n") ?? emptyClinic.helpsWith,
    services: clinic?.services.map((service) => `${service.name} - ${service.description}`).join("\n") ?? emptyClinic.services,
    doctors: clinic?.doctors.map((doctor) => `${doctor.name} - ${doctor.title} - ${doctor.languages.join("/")}`).join("\n") ?? emptyClinic.doctors,
    languages: clinic?.languages.join(", ") ?? emptyClinic.languages,
    insurance: clinic?.insurance.join(", ") ?? emptyClinic.insurance,
    priceRange: clinic?.priceRange ?? emptyClinic.priceRange,
    phone: clinic?.phone ?? emptyClinic.phone,
    whatsapp: clinic?.whatsapp ?? emptyClinic.whatsapp,
    email: clinic?.email ?? emptyClinic.email,
    accessibilityNotes: clinic?.accessibilityNotes.join("\n") ?? emptyClinic.accessibilityNotes,
    preparationNotes: clinic?.preparationNotes.join("\n") ?? emptyClinic.preparationNotes,
    suitableFor: clinic?.suitableFor.join("\n") ?? emptyClinic.suitableFor,
    claimsToVerify: clinic?.claimsToVerify.join("\n") ?? emptyClinic.claimsToVerify,
    missingInformation: clinic?.missingInformation.join("\n") ?? emptyClinic.missingInformation
  }));

  const preview = useMemo(
    () => ({
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      location: [form.area, form.emirate].filter(Boolean).join(", "),
      bestForTag: form.bestForTag,
      specialties: form.specialties.split(",").map((item) => item.trim()).filter(Boolean),
      languages: form.languages.split(",").map((item) => item.trim()).filter(Boolean),
      insurance: form.insurance.split(",").map((item) => item.trim()).filter(Boolean)
    }),
    [form]
  );

  const update = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <form
        className="rounded-md border border-ayati-line bg-white p-6"
        onSubmit={(event) => {
          event.preventDefault();
          const drafts = JSON.parse(window.localStorage.getItem("ayati_clinic_drafts") ?? "[]");
          window.localStorage.setItem(
            "ayati_clinic_drafts",
            JSON.stringify([
              ...drafts.filter((draft: { slug: string }) => draft.slug !== preview.slug),
              {
                ...form,
                slug: preview.slug,
                savedAt: new Date().toISOString(),
                mode
              }
            ])
          );
          setSaved(true);
        }}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-ayati-teal" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-ayati-ink">{mode === "new" ? "Add clinic" : "Edit clinic"}</h2>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            ["Clinic name", "name"],
            ["Slug", "slug"],
            ["Emirate", "emirate"],
            ["Area", "area"],
            ["Address", "address"],
            ["Price range", "priceRange"],
            ["Phone", "phone"],
            ["WhatsApp", "whatsapp"],
            ["Email", "email"]
          ].map(([label, key]) => (
            <label key={key} className="grid gap-2 text-sm font-medium text-ayati-ink">
              {label}
              <input
                value={form[key as keyof typeof form]}
                onChange={(event) => update(key as keyof typeof form, event.target.value)}
                className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm text-ayati-ink"
              />
            </label>
          ))}
        </div>

        <div className="mt-4 grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-ayati-ink">
            Description
            <textarea
              rows={4}
              value={form.description}
              onChange={(event) => update("description", event.target.value)}
              className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm text-ayati-ink"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-ayati-ink">
            Best-for tag
            <input
              value={form.bestForTag}
              onChange={(event) => update("bestForTag", event.target.value)}
              placeholder="Dental pain, routine checks, family support"
              className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm text-ayati-ink"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-ayati-ink">
            Specialties
            <input
              value={form.specialties}
              onChange={(event) => update("specialties", event.target.value)}
              placeholder="Dental, Pediatric dental"
              className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm text-ayati-ink"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-ayati-ink">
            What this clinic helps with
            <textarea
              rows={4}
              value={form.helpsWith}
              onChange={(event) => update("helpsWith", event.target.value)}
              placeholder="One help area per line"
              className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm text-ayati-ink"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-ayati-ink">
            Services
            <textarea
              rows={5}
              value={form.services}
              onChange={(event) => update("services", event.target.value)}
              placeholder="One service per line"
              className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm text-ayati-ink"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-ayati-ink">
            Doctors / practitioners
            <textarea
              rows={5}
              value={form.doctors}
              onChange={(event) => update("doctors", event.target.value)}
              placeholder="One doctor per line"
              className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm text-ayati-ink"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-ayati-ink">
            Languages spoken
            <input
              value={form.languages}
              onChange={(event) => update("languages", event.target.value)}
              className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm text-ayati-ink"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-ayati-ink">
            Insurance accepted
            <input
              value={form.insurance}
              onChange={(event) => update("insurance", event.target.value)}
              className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm text-ayati-ink"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-ayati-ink">
            Accessibility notes
            <textarea
              rows={4}
              value={form.accessibilityNotes}
              onChange={(event) => update("accessibilityNotes", event.target.value)}
              className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm text-ayati-ink"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-ayati-ink">
            What to prepare before visit
            <textarea
              rows={4}
              value={form.preparationNotes}
              onChange={(event) => update("preparationNotes", event.target.value)}
              placeholder="One preparation note per line"
              className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm text-ayati-ink"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-ayati-ink">
            Who this clinic may be suitable for
            <textarea
              rows={4}
              value={form.suitableFor}
              onChange={(event) => update("suitableFor", event.target.value)}
              placeholder="One suitability note per line"
              className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm text-ayati-ink"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-ayati-ink">
            Claims to verify
            <textarea
              rows={3}
              value={form.claimsToVerify}
              onChange={(event) => update("claimsToVerify", event.target.value)}
              placeholder="Insurance claim, package wording, outcome claim"
              className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm text-ayati-ink"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-ayati-ink">
            Missing information
            <textarea
              rows={3}
              value={form.missingInformation}
              onChange={(event) => update("missingInformation", event.target.value)}
              className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm text-ayati-ink"
            />
          </label>
        </div>

        <button
          type="submit"
          className="focus-ring mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-ayati-teal px-4 py-3 text-sm font-semibold text-white hover:bg-[#0B5552]"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          Save local draft
        </button>

        {saved ? <p className="mt-3 text-sm font-medium text-ayati-teal">Saved as a local draft. Supabase can replace this storage layer later.</p> : null}
      </form>

      <aside className="h-fit rounded-md border border-ayati-line bg-ayati-mint p-5 lg:sticky lg:top-28">
        <h2 className="text-lg font-semibold text-ayati-ink">Profile preview</h2>
        <dl className="mt-4 grid gap-3 text-sm">
          <div>
            <dt className="font-medium text-ayati-muted">Name</dt>
            <dd className="mt-1 text-ayati-ink">{preview.name || "Not set"}</dd>
          </div>
          <div>
            <dt className="font-medium text-ayati-muted">Slug</dt>
            <dd className="mt-1 text-ayati-ink">{preview.slug || "not-set"}</dd>
          </div>
          <div>
            <dt className="font-medium text-ayati-muted">Location</dt>
            <dd className="mt-1 text-ayati-ink">{preview.location || "Not set"}</dd>
          </div>
          <div>
            <dt className="font-medium text-ayati-muted">Specialties</dt>
            <dd className="mt-1 text-ayati-ink">{preview.specialties.join(", ") || "Not set"}</dd>
          </div>
          <div>
            <dt className="font-medium text-ayati-muted">Best for</dt>
            <dd className="mt-1 text-ayati-ink">{preview.bestForTag || "Not set"}</dd>
          </div>
          <div>
            <dt className="font-medium text-ayati-muted">Languages</dt>
            <dd className="mt-1 text-ayati-ink">{preview.languages.join(", ") || "Not set"}</dd>
          </div>
          <div>
            <dt className="font-medium text-ayati-muted">Insurance</dt>
            <dd className="mt-1 text-ayati-ink">{preview.insurance.join(", ") || "Not set"}</dd>
          </div>
        </dl>
        <Link href="/ayati-admin" className="focus-ring mt-5 inline-flex rounded-md text-sm font-semibold text-ayati-teal hover:text-ayati-ink">
          Back to AYATI admin
        </Link>
      </aside>
    </div>
  );
}
