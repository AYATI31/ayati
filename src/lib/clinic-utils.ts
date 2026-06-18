import { clinics, inquiries, topSearches } from "@/data/seed";
import type { Inquiry } from "@/types";

export type ClinicFilters = {
  query?: string;
  specialty?: string;
  service?: string;
  location?: string;
  language?: string;
  insurance?: string;
  price?: string;
};

const normalize = (value: string) => value.toLowerCase().trim();

const includesText = (source: string | string[], search?: string) => {
  if (!search) return true;
  const term = normalize(search);
  const values = Array.isArray(source) ? source : [source];
  return values.some((value) => normalize(value).includes(term));
};

export function getClinicBySlug(slug: string) {
  return clinics.find((clinic) => clinic.slug === slug);
}

export function filterClinics(filters: ClinicFilters) {
  return clinics.filter((clinic) => {
    const services = clinic.services.map((service) => service.name);
    const searchable = [
      clinic.name,
      clinic.description,
      clinic.bestForTag,
      clinic.emirate,
      clinic.area,
      ...clinic.specialties,
      ...clinic.helpsWith,
      ...services,
      ...clinic.languages,
      ...clinic.insurance
    ];

    const matchesQuery = includesText(searchable, filters.query);
    const matchesSpecialty = includesText(clinic.specialties, filters.specialty);
    const matchesService = includesText(services, filters.service);
    const matchesLocation = includesText([clinic.emirate, clinic.area], filters.location);
    const matchesLanguage = includesText(clinic.languages, filters.language);
    const matchesInsurance = includesText(clinic.insurance, filters.insurance);
    const matchesPrice =
      !filters.price ||
      filters.price === "Any" ||
      (filters.price === "Self-pay friendly" && clinic.insurance.includes("Self-pay")) ||
      (filters.price === "Shows prices" && clinic.priceRange !== "Contact clinic");

    return (
      matchesQuery &&
      matchesSpecialty &&
      matchesService &&
      matchesLocation &&
      matchesLanguage &&
      matchesInsurance &&
      matchesPrice
    );
  });
}

export type ChoiceAnswers = {
  need: string;
  patientFor: string;
  location: string;
  language: string;
  insuranceProvider: string;
  budgetPreference: string;
  urgency: string;
  accessibilityNeeds: string;
};

export function getSuggestedCareCategories(need: string) {
  const normalizedNeed = normalize(need);

  if (!normalizedNeed) {
    return ["General clinic", "Healthcare navigation call"];
  }

  const categoryRules = [
    { terms: ["tooth", "dent", "gum", "cleaning"], categories: ["Dental", "Family dental"] },
    { terms: ["skin", "acne", "pigment", "aesthetic", "hair"], categories: ["Dermatology", "Aesthetics"] },
    { terms: ["fertility", "ivf", "pregnancy", "women", "cycle"], categories: ["Fertility / IVF", "Women's health"] },
    { terms: ["eye", "vision", "contact lens"], categories: ["Ophthalmology"] },
    { terms: ["weight", "metabolic", "diabetes", "lifestyle"], categories: ["Obesity / metabolic care", "General clinic"] }
  ];

  const matched = categoryRules.flatMap((rule) =>
    rule.terms.some((term) => normalizedNeed.includes(term)) ? rule.categories : []
  );

  return matched.length > 0 ? Array.from(new Set(matched)) : ["General clinic", "Healthcare navigation call"];
}

export function generatePreVisitSummary(answers: ChoiceAnswers) {
  const categories = getSuggestedCareCategories(answers.need);
  const lines = [
    `Looking for: ${answers.need || "Not specified yet"}.`,
    `For: ${answers.patientFor || "Not specified"}.`,
    `Preferred language: ${answers.language || "Any language"}.`,
    `Preferred location: ${answers.location || "Any UAE location"}.`,
    `Insurance/payment: ${answers.insuranceProvider || "Not sure yet"}.`,
    `Price preference: ${answers.budgetPreference || "No preference stated"}.`,
    `Urgency described by user: ${answers.urgency || "Routine"}.`,
    `Accessibility needs: ${answers.accessibilityNeeds || "None mentioned"}.`,
    `Suggested starting categories: ${categories.join(", ")}.`
  ];

  return lines.join(" ");
}

export function recommendClinics(answers: ChoiceAnswers) {
  const normalizedNeed = normalize(answers.need);
  const suggestedCategories = getSuggestedCareCategories(answers.need).map(normalize);

  return clinics
    .map((clinic) => {
      let score = 0;
      const reasons: string[] = [];
      const clinicTopics = [
        ...clinic.specialties,
        ...clinic.helpsWith,
        ...clinic.services.map((service) => service.name),
        clinic.bestForTag,
        clinic.description
      ].map(normalize);

      if (clinicTopics.some((topic) => topic.includes(normalizedNeed) || normalizedNeed.includes(topic))) {
        score += 4;
        reasons.push("matches the care area you described");
      }

      if (clinic.specialties.map(normalize).some((specialty) => suggestedCategories.includes(specialty))) {
        score += 3;
        reasons.push("fits the suggested clinic category");
      }

      if (answers.location && includesText([clinic.emirate, clinic.area], answers.location)) {
        score += 3;
        reasons.push(`is in ${clinic.emirate}`);
      }

      if (answers.language && includesText(clinic.languages, answers.language)) {
        score += 2;
        reasons.push(`supports ${answers.language}`);
      }

      if (answers.insuranceProvider === "Cash/self-pay" && clinic.insurance.includes("Self-pay")) {
        score += 1;
        reasons.push("lists self-pay support");
      }

      if (answers.insuranceProvider && answers.insuranceProvider !== "Cash/self-pay" && includesText(clinic.insurance, answers.insuranceProvider)) {
        score += 2;
        reasons.push(`lists ${answers.insuranceProvider}`);
      }

      if (answers.budgetPreference === "Prefer visible prices" && clinic.priceRange !== "Contact clinic") {
        score += 1;
        reasons.push("shows price guidance");
      }

      if (answers.accessibilityNeeds && clinic.accessibilityNotes.length > 0) {
        score += 1;
        reasons.push("has accessibility notes to confirm before booking");
      }

      if (answers.urgency === "Urgent" && clinic.specialties.includes("General clinic")) {
        score += 1;
        reasons.push("can help with first-step guidance");
      }

      if (clinic.status === "Approved") {
        score += 1;
      }

      return { clinic, score, reasons };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}

export function getAdminMetrics() {
  const clinicsWithMissingInformation = clinics.filter((clinic) => clinic.missingInformation.length > 0);

  return {
    totalClinics: clinics.length,
    totalInquiries: inquiries.length,
    pendingApprovals: clinics.filter((clinic) => clinic.status !== "Approved").length,
    missingInformationCount: clinicsWithMissingInformation.length,
    clinicsWithMissingInformation,
    topSearches
  };
}

export function getClinicAdminRows(clinicSlug = "noura-dental-studio") {
  return {
    clinic: getClinicBySlug(clinicSlug),
    inquiries: inquiries.filter((inquiry) => inquiry.clinicSlug === clinicSlug),
    preVisitForms: []
  };
}

export function exportInquiriesCsv(rows: Inquiry[]) {
  const header = [
    "id",
    "clinic",
    "patient_name",
    "contact",
    "patient_for",
    "language",
    "service_interest",
    "urgency",
    "insurance_provider",
    "budget_preference",
    "accessibility_needs",
    "status",
    "summary",
    "created_at"
  ];
  const escape = (value: string) => `"${value.replaceAll('"', '""')}"`;
  const body = rows.map((row) => {
    const clinicName = getClinicBySlug(row.clinicSlug)?.name ?? row.clinicSlug;
    return [
      row.id,
      clinicName,
      row.patientName,
      row.contact ?? "",
      row.patientFor ?? "",
      row.preferredLanguage,
      row.serviceInterest,
      row.urgency,
      row.insuranceProvider ?? "",
      row.budgetPreference ?? "",
      row.accessibilityNeeds ?? "",
      row.status,
      row.summary,
      row.createdAt
    ]
      .map(escape)
      .join(",");
  });

  return [header.join(","), ...body].join("\n");
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-AE", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}
