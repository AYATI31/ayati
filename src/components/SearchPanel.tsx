"use client";

import { useMemo, useState } from "react";
import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { ClinicCard } from "@/components/ClinicCard";
import { NeedLanguageHelp } from "@/components/NeedLanguageHelp";
import {
  clinics,
  availableInsurances,
  availableLanguages,
  availableLocations,
  availableServices,
  availableSpecialties
} from "@/data/seed";
import { filterClinics, type ClinicFilters } from "@/lib/clinic-utils";

const emptyFilters: ClinicFilters = {
  query: "",
  specialty: "",
  service: "",
  location: "",
  language: "",
  insurance: "",
  price: ""
};

function FilterSelect({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value?: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-ayati-ink">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm text-ayati-ink"
      >
        <option value="">Any</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function SearchPanel() {
  const [filters, setFilters] = useState<ClinicFilters>(emptyFilters);

  const results = useMemo(() => filterClinics(filters), [filters]);

  const updateFilter = (key: keyof ClinicFilters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <aside className="h-fit rounded-md border border-ayati-line bg-white p-5 lg:sticky lg:top-28">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-ayati-teal" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-ayati-ink">Find a clinic</h2>
        </div>

        <div className="mt-5 grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-ayati-ink">
            What are you looking for?
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-ayati-muted" aria-hidden="true" />
              <input
                value={filters.query}
                onChange={(event) => updateFilter("query", event.target.value)}
                placeholder="Skin, IVF, dentist, eye check"
                className="focus-ring w-full rounded-md border border-ayati-line bg-white py-3 pl-10 pr-3 text-sm text-ayati-ink"
              />
            </div>
          </label>

          <FilterSelect label="Specialty" value={filters.specialty} options={availableSpecialties} onChange={(value) => updateFilter("specialty", value)} />
          <FilterSelect label="Treatment or service" value={filters.service} options={availableServices} onChange={(value) => updateFilter("service", value)} />
          <FilterSelect label="Location / emirate" value={filters.location} options={availableLocations} onChange={(value) => updateFilter("location", value)} />
          <FilterSelect label="Language spoken" value={filters.language} options={availableLanguages} onChange={(value) => updateFilter("language", value)} />
          <FilterSelect label="Insurance accepted" value={filters.insurance} options={availableInsurances} onChange={(value) => updateFilter("insurance", value)} />
          <FilterSelect
            label="Price range"
            value={filters.price}
            options={["Shows prices", "Self-pay friendly"]}
            onChange={(value) => updateFilter("price", value || "Any")}
          />
        </div>

        <button
          type="button"
          onClick={() => setFilters(emptyFilters)}
          className="focus-ring mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md border border-ayati-line bg-ayati-paper px-4 py-3 text-sm font-semibold text-ayati-ink hover:border-ayati-teal"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Reset filters
        </button>
      </aside>

      <section>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-ayati-muted">{results.length} clinic profiles found</p>
            <h2 className="mt-1 text-2xl font-semibold text-ayati-ink">Clear options, ready to compare</h2>
          </div>
        </div>

        <div className="mt-5 grid gap-4">
          {results.map((clinic) => (
            <ClinicCard key={clinic.id} clinic={clinic} />
          ))}
        </div>

        {clinics.length === 0 ? (
          <div className="mt-5 rounded-md border border-ayati-line bg-white p-6 text-center">
            <h3 className="text-lg font-semibold text-ayati-ink">No clinic profiles connected yet</h3>
            <p className="mt-2 text-sm leading-6 text-ayati-muted">
              Add approved clinic profiles in AYATI Admin before patients can compare real options.
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="mt-5 rounded-md border border-ayati-line bg-white p-6 text-center">
            <h3 className="text-lg font-semibold text-ayati-ink">No clinic matched every filter</h3>
            <p className="mt-2 text-sm leading-6 text-ayati-muted">
              Try removing one filter, or use Help me choose for a guided starting point.
            </p>
          </div>
        ) : null}

        <div className="mt-6">
          <NeedLanguageHelp />
        </div>
      </section>
    </div>
  );
}
