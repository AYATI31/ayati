import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClinicForm } from "@/components/ClinicForm";
import { SectionHeading } from "@/components/SectionHeading";
import { clinics } from "@/data/seed";
import { getClinicBySlug } from "@/lib/clinic-utils";

type EditClinicProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return clinics.map((clinic) => ({ slug: clinic.slug }));
}

export async function generateMetadata({ params }: EditClinicProps): Promise<Metadata> {
  const { slug } = await params;
  const clinic = getClinicBySlug(slug);

  return {
    title: clinic ? `Edit ${clinic.name}` : "Edit Clinic",
    description: "Edit an AYATI clinic profile."
  };
}

export default async function EditClinicPage({ params }: EditClinicProps) {
  const { slug } = await params;
  const clinic = getClinicBySlug(slug);

  if (!clinic) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Edit clinic" title={`Update ${clinic.name}`}>
        <p>Adjust the profile, services, doctors, languages, insurance, missing information, and admin-facing quality notes.</p>
      </SectionHeading>
      <div className="mt-8">
        <ClinicForm mode="edit" clinic={clinic} />
      </div>
    </div>
  );
}
