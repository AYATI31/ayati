import type { AdminUser, Clinic, Inquiry, PreVisitForm } from "@/types";

type TopSearchItem = { label: string; count: number };

const standardSignals = [
  { label: "Response speed", value: "Good", note: "Clinic has a named front-desk response process." },
  { label: "Language support", value: "Strong", note: "Multiple patient-facing languages are listed." },
  { label: "Follow-up support", value: "Good", note: "Follow-up expectations are described before booking." },
  { label: "Care clarity", value: "Good", note: "Services are explained in plain language." },
  { label: "Insurance guidance", value: "Developing", note: "Insurance support is listed, but final eligibility must be confirmed by the clinic." }
] as const;

export const clinics: Clinic[] = [
  {
    id: "clinic-bayt-dental",
    slug: "bayt-dental-care",
    name: "Bayt Dental Care",
    status: "Approved",
    bestForTag: "Dental pain, routine checks, family dental questions",
    profileControlled: true,
    imageAlt: "Calm dental reception placeholder",
    description:
      "A fictional UAE dental clinic profile used to demonstrate how AYATI explains care options before the first call.",
    emirate: "Dubai",
    area: "Jumeirah",
    address: "Jumeirah Road, Dubai",
    specialties: ["Dental", "Family dental"],
    helpsWith: ["Tooth pain", "Dental check-up", "Cleaning", "Cosmetic dental questions"],
    services: [
      {
        id: "service-dental-check",
        name: "Dental consultation",
        description: "A first visit where the dentist checks the concern, explains options, and confirms the next step.",
        priceFrom: 250
      },
      {
        id: "service-cleaning",
        name: "Cleaning and polish",
        description: "A routine hygiene visit for plaque removal and basic oral health guidance.",
        priceFrom: 350,
        priceTo: 550
      }
    ],
    doctors: [
      {
        id: "doctor-bayt-1",
        name: "Clinic dentist",
        title: "General Dentist",
        languages: ["English", "Arabic", "Hindi"],
        focusAreas: ["Dental pain", "Routine dental care", "Family dental visits"]
      }
    ],
    languages: ["English", "Arabic", "Hindi", "Urdu"],
    insurance: ["Self-pay", "Daman", "Thiqa", "Neuron"],
    paymentNotes: "Self-pay prices are shown for common services. Insurance coverage must be confirmed by the clinic.",
    priceRange: "AED 250 - 550",
    phone: "+971 4 000 0101",
    whatsapp: "+971 50 000 0101",
    email: "care@baytdental.example",
    operatingHours: [
      { label: "Mon - Fri", value: "9:00 AM - 7:00 PM" },
      { label: "Saturday", value: "10:00 AM - 4:00 PM" },
      { label: "Sunday", value: "Closed" }
    ],
    accessibilityNotes: ["Lift access", "Nearby paid parking", "Ground-floor entrance confirmation recommended"],
    preparationNotes: ["Bring Emirates ID", "Bring insurance card if using insurance", "Share any recent dental X-rays if available"],
    suitableFor: ["Patients who want a clear dental starting point", "Families comparing language support", "Self-pay patients who need price visibility"],
    claimsToVerify: ["Insurance network participation", "Same-day availability"],
    experienceSignals: standardSignals.map((signal) => ({ ...signal })),
    missingInformation: [],
    approvedAt: "2026-06-01"
  },
  {
    id: "clinic-noor-fertility",
    slug: "noor-fertility-womens-care",
    name: "Noor Fertility & Women's Care",
    status: "Approved",
    bestForTag: "Fertility questions, IVF orientation, women's health planning",
    profileControlled: true,
    imageAlt: "Women's health consultation room placeholder",
    description:
      "A fictional clinic profile for patients who need a calm first step around fertility or women's health questions.",
    emirate: "Abu Dhabi",
    area: "Al Bateen",
    address: "Al Bateen, Abu Dhabi",
    specialties: ["Fertility / IVF", "Women's health"],
    helpsWith: ["IVF orientation", "Fertility assessment questions", "Women's health consultation", "Second-opinion preparation"],
    services: [
      {
        id: "service-fertility-orientation",
        name: "Fertility orientation visit",
        description: "A first conversation to understand goals, review past reports, and explain possible next steps without promising outcomes.",
        priceFrom: 450
      },
      {
        id: "service-womens-health",
        name: "Women's health consultation",
        description: "A consultation for non-emergency concerns, cycle questions, or follow-up planning.",
        priceFrom: 350
      }
    ],
    doctors: [
      {
        id: "doctor-noor-1",
        name: "Clinic specialist",
        title: "Consultant Obstetrics and Gynecology",
        languages: ["English", "Arabic"],
        focusAreas: ["Fertility planning", "Women's health", "Report review"]
      }
    ],
    languages: ["English", "Arabic", "Urdu"],
    insurance: ["Self-pay", "Daman", "ADNIC"],
    paymentNotes: "Coverage for fertility services varies widely. Patients should confirm benefits before booking.",
    priceRange: "AED 350 - 450",
    phone: "+971 2 000 0202",
    whatsapp: "+971 50 000 0202",
    email: "navigation@noorfertility.example",
    operatingHours: [
      { label: "Mon - Thu", value: "8:30 AM - 6:00 PM" },
      { label: "Friday", value: "8:30 AM - 1:00 PM" },
      { label: "Weekend", value: "By appointment" }
    ],
    accessibilityNotes: ["Wheelchair access", "Private consultation rooms", "Interpreter request should be made before visit"],
    preparationNotes: ["Bring previous reports if available", "List current medicines", "Write down main questions before the visit"],
    suitableFor: ["Patients comparing fertility starting points", "Couples who need insurance guidance", "Patients who prefer Arabic or Urdu support"],
    claimsToVerify: ["Fertility package claims", "Insurance benefit wording", "Doctor availability"],
    experienceSignals: standardSignals.map((signal) => ({ ...signal })),
    missingInformation: ["Fertility package details require verification"],
    approvedAt: "2026-06-02"
  },
  {
    id: "clinic-dermalume",
    slug: "dermalume-skin-aesthetics",
    name: "Dermalume Skin & Aesthetics",
    status: "Pending review",
    bestForTag: "Skin concerns, acne questions, aesthetics orientation",
    profileControlled: true,
    imageAlt: "Dermatology clinic placeholder",
    description:
      "A fictional dermatology and aesthetics profile that separates medical skin concerns from elective aesthetic inquiries.",
    emirate: "Dubai",
    area: "Healthcare City",
    address: "Dubai Healthcare City, Dubai",
    specialties: ["Dermatology", "Aesthetics"],
    helpsWith: ["Acne concerns", "Pigmentation questions", "Hair and skin consultation", "Aesthetics information"],
    services: [
      {
        id: "service-derm-consult",
        name: "Dermatology consultation",
        description: "A doctor-led visit to understand the skin concern and explain suitable next steps.",
        priceFrom: 400
      },
      {
        id: "service-aesthetic-orientation",
        name: "Aesthetics orientation",
        description: "A non-diagnostic information visit to understand available aesthetic services, risks, and suitability checks.",
        priceFrom: 250
      }
    ],
    doctors: [
      {
        id: "doctor-dermalume-1",
        name: "Clinic dermatologist",
        title: "Specialist Dermatologist",
        languages: ["English", "Arabic", "Hindi"],
        focusAreas: ["Acne", "Pigmentation", "General dermatology"]
      }
    ],
    languages: ["English", "Arabic", "Hindi", "Tagalog"],
    insurance: ["Self-pay", "Neuron", "Nextcare"],
    paymentNotes: "Medical dermatology may be insurance eligible. Elective aesthetics are usually self-pay.",
    priceRange: "AED 250 - 400",
    phone: "+971 4 000 0303",
    whatsapp: "+971 50 000 0303",
    email: "hello@dermalume.example",
    operatingHours: [
      { label: "Mon - Fri", value: "10:00 AM - 8:00 PM" },
      { label: "Saturday", value: "10:00 AM - 6:00 PM" },
      { label: "Sunday", value: "Closed" }
    ],
    accessibilityNotes: ["Lift access", "Metro nearby", "Ask clinic about patch-test preparation when relevant"],
    preparationNotes: ["Bring photos of previous flare-ups if useful", "List products currently used", "Ask whether makeup should be avoided before visit"],
    suitableFor: ["Patients who want skin concerns explained plainly", "Self-pay aesthetics inquiries", "Patients who need Hindi or Tagalog support"],
    claimsToVerify: ["Before-and-after image use", "Aesthetic outcome claims", "Insurance eligibility"],
    experienceSignals: standardSignals.map((signal) => ({ ...signal, value: signal.label === "Care clarity" ? "Developing" : signal.value })),
    missingInformation: ["Aesthetic claims review", "Doctor schedule"]
  },
  {
    id: "clinic-basira-eye",
    slug: "basira-eye-center",
    name: "Basira Eye Center",
    status: "Approved",
    bestForTag: "Eye checks, vision concerns, insurance-guided ophthalmology",
    profileControlled: true,
    imageAlt: "Ophthalmology room placeholder",
    description:
      "A fictional ophthalmology profile for patients comparing eye-care starting points and language support.",
    emirate: "Sharjah",
    area: "Al Majaz",
    address: "Al Majaz, Sharjah",
    specialties: ["Ophthalmology"],
    helpsWith: ["Vision check", "Eye discomfort inquiry", "Contact lens questions", "Ophthalmology follow-up"],
    services: [
      {
        id: "service-eye-consult",
        name: "Eye consultation",
        description: "A visit to review eye concerns, vision changes, and whether further testing is needed.",
        priceFrom: 300
      },
      {
        id: "service-vision-screen",
        name: "Vision screening",
        description: "A basic vision check that helps the clinic decide whether a specialist visit is needed.",
        priceFrom: 150
      }
    ],
    doctors: [
      {
        id: "doctor-basira-1",
        name: "Clinic ophthalmologist",
        title: "Specialist Ophthalmologist",
        languages: ["English", "Arabic", "Urdu"],
        focusAreas: ["General ophthalmology", "Vision concerns", "Follow-up care"]
      }
    ],
    languages: ["English", "Arabic", "Urdu", "Malayalam"],
    insurance: ["Self-pay", "Daman", "Oman Insurance"],
    paymentNotes: "Insurance pre-approval may be needed for some tests. The clinic should confirm before visit.",
    priceRange: "AED 150 - 300",
    phone: "+971 6 000 0404",
    whatsapp: "+971 50 000 0404",
    email: "support@basiraeye.example",
    operatingHours: [
      { label: "Mon - Sat", value: "9:00 AM - 7:00 PM" },
      { label: "Sunday", value: "Closed" }
    ],
    accessibilityNotes: ["Wheelchair access", "Family waiting area", "Parking validation may be available"],
    preparationNotes: ["Bring glasses or contact lenses", "Bring previous eye reports if available", "Ask if pupil dilation may affect driving"],
    suitableFor: ["Patients comparing ophthalmology options", "Families needing Urdu or Malayalam support", "Patients who need insurance guidance"],
    claimsToVerify: ["Diagnostic test pricing", "Insurance pre-approval process"],
    experienceSignals: standardSignals.map((signal) => ({ ...signal })),
    missingInformation: [],
    approvedAt: "2026-06-04"
  },
  {
    id: "clinic-metabolic-path",
    slug: "metabolic-path-clinic",
    name: "Metabolic Path Clinic",
    status: "Needs updates",
    bestForTag: "Weight, metabolic care, lifestyle-supported planning",
    profileControlled: true,
    imageAlt: "Metabolic care consultation placeholder",
    description:
      "A fictional metabolic care profile for patients who need a starting point for weight and metabolic health conversations.",
    emirate: "Abu Dhabi",
    area: "Al Reem Island",
    address: "Al Reem Island, Abu Dhabi",
    specialties: ["Obesity / metabolic care", "General clinic"],
    helpsWith: ["Weight management questions", "Metabolic risk discussion", "Lifestyle-supported follow-up", "General care navigation"],
    services: [
      {
        id: "service-metabolic-consult",
        name: "Metabolic care consultation",
        description: "A first appointment to understand health goals, review existing reports, and plan appropriate follow-up.",
        priceFrom: 500
      },
      {
        id: "service-general-navigation",
        name: "General clinic visit",
        description: "A general visit for non-emergency concerns and referral planning when needed.",
        priceFrom: 250
      }
    ],
    doctors: [
      {
        id: "doctor-metabolic-1",
        name: "Clinic physician",
        title: "Family Medicine Physician",
        languages: ["English", "Arabic", "Hindi"],
        focusAreas: ["Metabolic care", "General medicine", "Follow-up planning"]
      }
    ],
    languages: ["English", "Arabic", "Hindi"],
    insurance: ["Self-pay", "Daman", "NAS"],
    paymentNotes: "Coverage depends on diagnosis, referral rules, and insurer approval. AYATI does not confirm eligibility.",
    priceRange: "AED 250 - 500",
    phone: "+971 2 000 0505",
    whatsapp: "+971 50 000 0505",
    email: "care@metabolicpath.example",
    operatingHours: [
      { label: "Mon - Fri", value: "8:00 AM - 6:00 PM" },
      { label: "Saturday", value: "9:00 AM - 1:00 PM" },
      { label: "Sunday", value: "Closed" }
    ],
    accessibilityNotes: ["Step-free access", "Quiet waiting area", "Longer appointment slot can be requested"],
    preparationNotes: ["Bring recent blood tests if available", "List current medicines", "Prepare goals and previous care history"],
    suitableFor: ["Patients seeking a first care plan", "Patients needing follow-up structure", "Patients comparing insurance and self-pay options"],
    claimsToVerify: ["Weight-loss outcome language", "Package terms", "Insurance eligibility"],
    experienceSignals: standardSignals.map((signal) => ({ ...signal, value: signal.label === "Insurance guidance" ? "Developing" : signal.value })),
    missingInformation: ["Package terms", "Outcome claim review"]
  },
  {
    id: "clinic-safa-family",
    slug: "safa-family-clinic",
    name: "Safa Family Clinic",
    status: "Approved",
    bestForTag: "General care, family coordination, first-step guidance",
    profileControlled: true,
    imageAlt: "Family clinic reception placeholder",
    description:
      "A fictional general clinic profile for patients and caregivers who need a clear first call and practical preparation.",
    emirate: "Dubai",
    area: "Al Safa",
    address: "Al Safa, Dubai",
    specialties: ["General clinic", "Women's health"],
    helpsWith: ["General non-emergency concerns", "Family care coordination", "Women's health starting point", "Referral planning"],
    services: [
      {
        id: "service-general-consult",
        name: "General consultation",
        description: "A first appointment for non-emergency concerns, basic review, and next-step planning.",
        priceFrom: 220
      },
      {
        id: "service-care-coordination",
        name: "Care coordination support",
        description: "Front-desk support to clarify documents, insurance, and what to bring before the visit.",
        priceFrom: 0
      }
    ],
    doctors: [
      {
        id: "doctor-safa-1",
        name: "Clinic family physician",
        title: "Family Medicine Physician",
        languages: ["English", "Arabic", "Malayalam"],
        focusAreas: ["General medicine", "Family care", "Care coordination"]
      }
    ],
    languages: ["English", "Arabic", "Hindi", "Malayalam"],
    insurance: ["Self-pay", "Daman", "Neuron", "Nextcare"],
    paymentNotes: "General consultation prices are visible. Insurance must be confirmed by the clinic before booking.",
    priceRange: "AED 0 - 220",
    phone: "+971 4 000 0606",
    whatsapp: "+971 50 000 0606",
    email: "frontdesk@safafamily.example",
    operatingHours: [
      { label: "Mon - Fri", value: "8:00 AM - 8:00 PM" },
      { label: "Saturday", value: "9:00 AM - 5:00 PM" },
      { label: "Sunday", value: "10:00 AM - 2:00 PM" }
    ],
    accessibilityNotes: ["Wheelchair access", "Caregiver-friendly reception", "Interpreter request can be noted before booking"],
    preparationNotes: ["Bring Emirates ID", "Bring current medicine list", "Share main concern in one or two sentences"],
    suitableFor: ["Patients unsure where to start", "Caregivers booking for family", "Patients needing language-supported front desk help"],
    claimsToVerify: ["Doctor roster updates", "Insurance network status"],
    experienceSignals: standardSignals.map((signal) => ({ ...signal })),
    missingInformation: [],
    approvedAt: "2026-06-05"
  }
];

export const inquiries: Inquiry[] = [
  {
    id: "AYATI-1001",
    clinicSlug: "safa-family-clinic",
    patientName: "Anonymous patient",
    preferredLanguage: "Arabic",
    serviceInterest: "General consultation",
    urgency: "Soon",
    status: "New",
    summary: "Patient wants a non-emergency first appointment, prefers Arabic, and needs insurance guidance before booking.",
    insuranceProvider: "Daman",
    timeToFirstResponseMinutes: 0,
    confusionReason: "Not sure whether to book general clinic or specialist",
    createdAt: "2026-06-15T08:30:00.000Z"
  },
  {
    id: "AYATI-1002",
    clinicSlug: "bayt-dental-care",
    patientName: "Anonymous caregiver inquiry",
    preferredLanguage: "Hindi",
    serviceInterest: "Dental consultation",
    urgency: "Urgent",
    status: "Contacted",
    summary: "Caregiver is looking for a dental starting point, Hindi support, and price visibility before the first call.",
    insuranceProvider: "Self-pay",
    timeToFirstResponseMinutes: 38,
    confusionReason: "Worried about cost before consultation",
    createdAt: "2026-06-15T10:10:00.000Z"
  },
  {
    id: "AYATI-1003",
    clinicSlug: "basira-eye-center",
    patientName: "Anonymous patient",
    preferredLanguage: "Urdu",
    serviceInterest: "Eye consultation",
    urgency: "Routine",
    status: "Booked",
    summary: "Patient wants an eye check in Sharjah, prefers Urdu, and needs to know what to bring before visit.",
    insuranceProvider: "Oman Insurance",
    timeToFirstResponseMinutes: 54,
    createdAt: "2026-06-14T13:20:00.000Z"
  },
  {
    id: "AYATI-1004",
    clinicSlug: "noor-fertility-womens-care",
    patientName: "Anonymous patient",
    preferredLanguage: "Arabic",
    serviceInterest: "Fertility orientation visit",
    urgency: "Routine",
    status: "Needs more info",
    summary: "Patient is comparing fertility starting points and wants to understand report preparation before booking.",
    insuranceProvider: "ADNIC",
    timeToFirstResponseMinutes: 72,
    confusionReason: "Unclear whether insurance covers fertility-related services",
    createdAt: "2026-06-14T16:45:00.000Z"
  }
];

export const preVisitForms: PreVisitForm[] = [
  {
    id: "PV-1001",
    clinicSlug: "safa-family-clinic",
    concern: "General non-emergency concern and uncertainty about the right first step.",
    duration: "Several days",
    worry: "Patient is unsure whether to start with a general clinic or specialist.",
    hasReports: false,
    preferredLanguage: "Arabic",
    createdAt: "2026-06-15T08:32:00.000Z"
  }
];

export const adminUsers: AdminUser[] = [
  {
    id: "admin-ayati-1",
    name: "AYATI operator",
    email: "operator@ayati.example",
    role: "ayati_admin"
  },
  {
    id: "admin-clinic-1",
    name: "Clinic admin",
    email: "clinic.admin@example",
    role: "clinic_admin",
    clinicSlug: "safa-family-clinic"
  }
];

export const topSearches: Record<"specialties" | "languages" | "locations", TopSearchItem[]> = {
  specialties: [
    { label: "General clinic", count: 18 },
    { label: "Dental", count: 14 },
    { label: "Dermatology", count: 11 }
  ],
  languages: [
    { label: "Arabic", count: 21 },
    { label: "Hindi", count: 16 },
    { label: "Urdu", count: 12 }
  ],
  locations: [
    { label: "Dubai", count: 28 },
    { label: "Abu Dhabi", count: 19 },
    { label: "Sharjah", count: 9 }
  ]
};

export const commonConfusionReasons = [
  { label: "Not sure which specialty to start with", count: 24 },
  { label: "Insurance coverage unclear before calling", count: 19 },
  { label: "Language support not obvious", count: 13 },
  { label: "Price visibility missing", count: 11 }
];

export const availableSpecialties = Array.from(new Set(clinics.flatMap((clinic) => clinic.specialties))).sort();
export const availableServices = Array.from(new Set(clinics.flatMap((clinic) => clinic.services.map((service) => service.name)))).sort();
export const availableLanguages = Array.from(new Set(clinics.flatMap((clinic) => clinic.languages))).sort();
export const availableInsurances = Array.from(new Set(clinics.flatMap((clinic) => clinic.insurance))).sort();
export const availableLocations = Array.from(new Set(clinics.map((clinic) => clinic.emirate))).sort();
