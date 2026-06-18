"use client";

import type { Inquiry, InquiryStatus, PreVisitForm, PreVisitSubmission } from "@/types";

const keys = {
  inquiries: "ayati_inquiries",
  preVisitForms: "ayati_pre_visit_forms"
};

const demoStorageEvent = "ayati-demo-storage-change";

export type StoredPreVisitForm = PreVisitForm & {
  name?: string;
  contact?: string;
  summary?: string;
};

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function readArray<T>(key: string): T[] {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const value = window.localStorage.getItem(key);
    const parsed = value ? JSON.parse(value) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeArray<T>(key: string, rows: T[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(rows));
  window.dispatchEvent(new Event(demoStorageEvent));
}

function normalizePreVisitForm(raw: unknown): StoredPreVisitForm | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const item = raw as Record<string, unknown>;
  const id = typeof item.id === "string" ? item.id : typeof item.reference === "string" ? item.reference : "";
  const concern = typeof item.concern === "string" ? item.concern : "";
  const duration = typeof item.duration === "string" ? item.duration : "";
  const worry = typeof item.worry === "string" ? item.worry : "";
  const preferredLanguage = typeof item.preferredLanguage === "string" ? item.preferredLanguage : "English";
  const patientFor = typeof item.patientFor === "string" ? item.patientFor : undefined;
  const urgency = item.urgency === "Soon" || item.urgency === "Urgent" || item.urgency === "Routine" ? item.urgency : undefined;
  const insuranceProvider = typeof item.insuranceProvider === "string" ? item.insuranceProvider : undefined;
  const budgetPreference = typeof item.budgetPreference === "string" ? item.budgetPreference : undefined;
  const accessibilityNeeds = typeof item.accessibilityNeeds === "string" ? item.accessibilityNeeds : undefined;
  const createdAt = typeof item.createdAt === "string" ? item.createdAt : new Date().toISOString();
  const hasReports = typeof item.hasReports === "boolean" ? item.hasReports : item.hasReports === "Yes";

  if (!id || !concern) {
    return null;
  }

  return {
    id,
    clinicSlug: typeof item.clinicSlug === "string" ? item.clinicSlug : undefined,
    concern,
    duration,
    worry,
    hasReports,
    preferredLanguage,
    patientFor,
    urgency,
    insuranceProvider,
    budgetPreference,
    accessibilityNeeds,
    createdAt,
    name: typeof item.name === "string" ? item.name : undefined,
    contact: typeof item.contact === "string" ? item.contact : undefined,
    summary: typeof item.summary === "string" ? item.summary : undefined
  };
}

function normalizeInquiry(raw: unknown): Inquiry | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const item = raw as Record<string, unknown>;
  const id = typeof item.id === "string" ? item.id : "";
  const clinicSlug = typeof item.clinicSlug === "string" ? item.clinicSlug : "not-sure-yet";
  const patientName = typeof item.patientName === "string" ? item.patientName : "Patient inquiry";
  const preferredLanguage = typeof item.preferredLanguage === "string" ? item.preferredLanguage : "English";
  const serviceInterest = typeof item.serviceInterest === "string" ? item.serviceInterest : "Appointment inquiry";
  const urgency = item.urgency === "Soon" || item.urgency === "Urgent" || item.urgency === "Routine" ? item.urgency : "Routine";
  const status =
    item.status === "Contacted" ||
    item.status === "Booked" ||
    item.status === "Needs more info" ||
    item.status === "Not suitable" ||
    item.status === "Closed"
      ? item.status
      : "New";
  const createdAt = typeof item.createdAt === "string" ? item.createdAt : new Date().toISOString();

  if (!id) {
    return null;
  }

  return {
    id,
    clinicSlug,
    patientName,
    contact: typeof item.contact === "string" ? item.contact : undefined,
    patientFor: typeof item.patientFor === "string" ? item.patientFor : undefined,
    preferredLanguage,
    serviceInterest,
    urgency,
    status,
    summary:
      typeof item.summary === "string"
        ? item.summary
        : `Patient is interested in ${serviceInterest}. Preferred language: ${preferredLanguage}.`,
    insuranceProvider: typeof item.insuranceProvider === "string" ? item.insuranceProvider : undefined,
    budgetPreference: typeof item.budgetPreference === "string" ? item.budgetPreference : undefined,
    accessibilityNeeds: typeof item.accessibilityNeeds === "string" ? item.accessibilityNeeds : undefined,
    hasReports: typeof item.hasReports === "boolean" ? item.hasReports : undefined,
    reasonIfNotBooked: typeof item.reasonIfNotBooked === "string" ? item.reasonIfNotBooked : undefined,
    timeToFirstResponseMinutes:
      typeof item.timeToFirstResponseMinutes === "number" ? item.timeToFirstResponseMinutes : undefined,
    confusionReason: typeof item.confusionReason === "string" ? item.confusionReason : undefined,
    createdAt
  };
}

function inferUrgency(form: StoredPreVisitForm): Inquiry["urgency"] {
  const text = `${form.concern} ${form.duration} ${form.worry}`.toLowerCase();

  if (text.includes("urgent") || text.includes("severe") || text.includes("same day")) {
    return "Urgent";
  }

  if (text.includes("soon") || text.includes("pain") || text.includes("worse")) {
    return "Soon";
  }

  return "Routine";
}

function inquiryFromPreVisitForm(form: StoredPreVisitForm): Inquiry {
  return {
    id: form.id,
    clinicSlug: form.clinicSlug || "not-sure-yet",
    patientName: form.name || "Patient inquiry",
    contact: form.contact,
    patientFor: form.patientFor,
    preferredLanguage: form.preferredLanguage,
    serviceInterest: form.concern || "Pre-visit inquiry",
    urgency: form.urgency || inferUrgency(form),
    status: "New",
    summary:
      form.summary ||
      `Patient concern: ${form.concern}. Duration: ${form.duration || "Not stated"}. Main worry: ${form.worry || "Not stated"}. Preferred language: ${form.preferredLanguage}.`,
    insuranceProvider: form.insuranceProvider || "Not stated",
    budgetPreference: form.budgetPreference,
    accessibilityNeeds: form.accessibilityNeeds,
    hasReports: form.hasReports,
    timeToFirstResponseMinutes: 0,
    confusionReason: form.worry || "Patient wants a clearer starting point",
    createdAt: form.createdAt
  };
}

function mergeInquiries(rows: Inquiry[]) {
  return Array.from(new Map(rows.map((row) => [row.id, row])).values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getDemoPreVisitForms(seedForms: PreVisitForm[] = []) {
  const storedForms = readArray<unknown>(keys.preVisitForms)
    .map(normalizePreVisitForm)
    .filter((form): form is StoredPreVisitForm => Boolean(form));

  return Array.from(new Map([...seedForms, ...storedForms].map((form) => [form.id, form])).values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getDemoInquiries(seedInquiries: Inquiry[] = []) {
  const storedInquiries = readArray<unknown>(keys.inquiries)
    .map(normalizeInquiry)
    .filter((inquiry): inquiry is Inquiry => Boolean(inquiry));
  const inquiriesFromStoredForms = getDemoPreVisitForms([])
    .filter((form) => form.clinicSlug)
    .map(inquiryFromPreVisitForm);

  return mergeInquiries([...seedInquiries, ...inquiriesFromStoredForms, ...storedInquiries]);
}

export function saveDemoInquiry(updatedInquiry: Inquiry) {
  const current = readArray<Inquiry>(keys.inquiries);
  writeArray(keys.inquiries, mergeInquiries([...current, updatedInquiry]));
}

export function saveDemoInquiryStatus(updatedInquiry: Inquiry, status: InquiryStatus) {
  saveDemoInquiry({ ...updatedInquiry, status });
}

export function savePreVisitSubmission(submission: PreVisitSubmission) {
  const storedForm: StoredPreVisitForm = {
    id: submission.reference,
    clinicSlug: submission.clinicSlug || undefined,
    concern: submission.concern,
    duration: submission.duration,
    worry: submission.worry,
    hasReports: submission.hasReports,
    preferredLanguage: submission.preferredLanguage,
    patientFor: submission.patientFor,
    urgency: submission.urgency,
    insuranceProvider: submission.insuranceProvider,
    budgetPreference: submission.budgetPreference,
    accessibilityNeeds: submission.accessibilityNeeds,
    createdAt: submission.createdAt,
    name: submission.name,
    contact: submission.contact,
    summary: submission.summary
  };

  const forms = getDemoPreVisitForms([]).filter((form) => form.id !== storedForm.id);
  writeArray(keys.preVisitForms, [...forms, storedForm]);
  saveDemoInquiry(inquiryFromPreVisitForm(storedForm));
}

export function subscribeDemoStorage(listener: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", listener);
  window.addEventListener(demoStorageEvent, listener);

  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(demoStorageEvent, listener);
  };
}

export function getDemoStorageSnapshot() {
  if (!canUseStorage()) {
    return "";
  }

  return [window.localStorage.getItem(keys.inquiries) ?? "", window.localStorage.getItem(keys.preVisitForms) ?? ""].join("|");
}

export function getDemoStorageServerSnapshot() {
  return "";
}
