export type InquiryStatus =
  | "New"
  | "Contacted"
  | "Booked"
  | "Needs more info"
  | "Not suitable"
  | "Closed";

export type AdminRole = "clinic_admin" | "ayati_admin";

export type Service = {
  id: string;
  name: string;
  description: string;
  priceFrom?: number;
  priceTo?: number;
};

export type Doctor = {
  id: string;
  name: string;
  title: string;
  languages: string[];
  focusAreas: string[];
};

export type OperatingHour = {
  label: string;
  value: string;
};

export type ExperienceSignal = {
  label:
    | "Response speed"
    | "Language support"
    | "Follow-up support"
    | "Care clarity"
    | "Insurance guidance";
  value: "Strong" | "Good" | "Developing" | "Not yet set";
  note: string;
};

export type Clinic = {
  id: string;
  slug: string;
  name: string;
  status: "Approved" | "Pending review" | "Needs updates";
  bestForTag: string;
  profileControlled: boolean;
  imageAlt: string;
  description: string;
  emirate: string;
  area: string;
  address: string;
  specialties: string[];
  helpsWith: string[];
  services: Service[];
  doctors: Doctor[];
  languages: string[];
  insurance: string[];
  paymentNotes: string;
  priceRange: string;
  phone: string;
  whatsapp: string;
  email: string;
  website?: string;
  operatingHours: OperatingHour[];
  accessibilityNotes: string[];
  preparationNotes: string[];
  suitableFor: string[];
  claimsToVerify: string[];
  experienceSignals: ExperienceSignal[];
  missingInformation: string[];
  approvedAt?: string;
};

export type Inquiry = {
  id: string;
  clinicSlug: string;
  patientName: string;
  contact?: string;
  patientFor?: string;
  preferredLanguage: string;
  serviceInterest: string;
  urgency: "Routine" | "Soon" | "Urgent";
  status: InquiryStatus;
  summary: string;
  insuranceProvider?: string;
  budgetPreference?: string;
  accessibilityNeeds?: string;
  hasReports?: boolean;
  reasonIfNotBooked?: string;
  timeToFirstResponseMinutes?: number;
  confusionReason?: string;
  createdAt: string;
};

export type PreVisitForm = {
  id: string;
  clinicSlug?: string;
  concern: string;
  duration: string;
  worry: string;
  hasReports: boolean;
  preferredLanguage: string;
  patientFor?: string;
  urgency?: Inquiry["urgency"];
  insuranceProvider?: string;
  budgetPreference?: string;
  accessibilityNeeds?: string;
  createdAt: string;
};

export type PreVisitSubmission = {
  reference: string;
  clinicSlug?: string;
  concern: string;
  duration: string;
  worry: string;
  hasReports: boolean;
  preferredLanguage: string;
  patientFor: string;
  urgency: Inquiry["urgency"];
  insuranceProvider: string;
  budgetPreference: string;
  accessibilityNeeds: string;
  name: string;
  contact: string;
  summary: string;
  createdAt: string;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  clinicSlug?: string;
};
