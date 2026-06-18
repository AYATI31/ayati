"use client";

import type { Inquiry, InquiryStatus } from "@/types";

export type CaregiverDependent = {
  id: string;
  name: string;
  relationship: string;
  age: string;
  preferredLanguage: string;
  emirate: string;
  consentStatus: "Consent captured" | "Consent pending";
  accessLevel: "Booking only" | "Full coordination";
  notes: string;
  createdAt: string;
};

export type CaregiverAppointmentStatus = "Requested" | "Contacted" | "Booked" | "Needs more info" | "Closed";

export type CaregiverAppointment = {
  id: string;
  dependentId: string;
  clinicSlug: string;
  clinicName: string;
  serviceInterest: string;
  preferredDate: string;
  preferredTime: string;
  urgency: Inquiry["urgency"];
  insuranceProvider: string;
  summary: string;
  status: CaregiverAppointmentStatus;
  createdAt: string;
};

export type CaregiverTask = {
  id: string;
  dependentId: string;
  label: string;
  dueDate: string;
  done: boolean;
  createdAt: string;
};

export type CaregiverTimelineEvent = {
  id: string;
  dependentId: string;
  title: string;
  detail: string;
  createdAt: string;
};

export type CaregiverMessage = {
  id: string;
  dependentId: string;
  sender: "Caregiver" | "AYATI Coordinator";
  body: string;
  createdAt: string;
};

const keys = {
  appointments: "ayati_caregiver_appointments",
  dependents: "ayati_caregiver_dependents",
  messages: "ayati_caregiver_messages",
  tasks: "ayati_caregiver_tasks",
  timeline: "ayati_caregiver_timeline"
};

const caregiverStorageEvent = "ayati-caregiver-storage-change";

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
  window.dispatchEvent(new Event(caregiverStorageEvent));
}

function byNewest<T extends { createdAt: string }>(rows: T[]) {
  return [...rows].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getCaregiverDependents() {
  return byNewest(readArray<CaregiverDependent>(keys.dependents));
}

export function getCaregiverAppointments() {
  return byNewest(readArray<CaregiverAppointment>(keys.appointments));
}

export function getCaregiverTasks() {
  return byNewest(readArray<CaregiverTask>(keys.tasks));
}

export function getCaregiverTimeline() {
  return byNewest(readArray<CaregiverTimelineEvent>(keys.timeline));
}

export function getCaregiverMessages() {
  return byNewest(readArray<CaregiverMessage>(keys.messages));
}

export function addTimelineEvent(event: Omit<CaregiverTimelineEvent, "id" | "createdAt">) {
  const row: CaregiverTimelineEvent = {
    ...event,
    createdAt: new Date().toISOString(),
    id: makeId("timeline")
  };

  writeArray(keys.timeline, [row, ...getCaregiverTimeline()]);
  return row;
}

export function saveDependent(dependent: Omit<CaregiverDependent, "id" | "createdAt">) {
  const row: CaregiverDependent = {
    ...dependent,
    createdAt: new Date().toISOString(),
    id: makeId("dependent")
  };

  writeArray(keys.dependents, [row, ...getCaregiverDependents()]);
  addTimelineEvent({
    dependentId: row.id,
    detail: `${row.relationship} profile added with ${row.consentStatus.toLowerCase()}.`,
    title: "Dependent profile created"
  });

  return row;
}

export function removeDependent(id: string) {
  writeArray(keys.dependents, getCaregiverDependents().filter((row) => row.id !== id));
  writeArray(keys.appointments, getCaregiverAppointments().filter((row) => row.dependentId !== id));
  writeArray(keys.tasks, getCaregiverTasks().filter((row) => row.dependentId !== id));
  writeArray(keys.timeline, getCaregiverTimeline().filter((row) => row.dependentId !== id));
  writeArray(keys.messages, getCaregiverMessages().filter((row) => row.dependentId !== id));
}

export function saveAppointment(appointment: Omit<CaregiverAppointment, "id" | "createdAt" | "status">) {
  const row: CaregiverAppointment = {
    ...appointment,
    createdAt: new Date().toISOString(),
    id: `AYATI-CG-${Date.now().toString().slice(-6)}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`,
    status: "Requested"
  };

  writeArray(keys.appointments, [row, ...getCaregiverAppointments()]);
  addTimelineEvent({
    dependentId: row.dependentId,
    detail: `${row.clinicName} received a caregiver booking request for ${row.serviceInterest}.`,
    title: "Appointment request sent"
  });
  saveTask({
    dependentId: row.dependentId,
    dueDate: row.preferredDate,
    label: "Confirm clinic response and appointment time"
  });
  saveTask({
    dependentId: row.dependentId,
    dueDate: row.preferredDate,
    label: "Prepare Emirates ID, insurance card, and relevant reports"
  });
  saveMessage({
    body: `Request sent to ${row.clinicName}. Track the clinic response in appointment status.`,
    dependentId: row.dependentId,
    sender: "AYATI Coordinator"
  });

  return row;
}

export function updateAppointmentStatus(id: string, status: CaregiverAppointmentStatus) {
  const rows = getCaregiverAppointments();
  const selected = rows.find((row) => row.id === id);

  if (!selected) {
    return;
  }

  writeArray(
    keys.appointments,
    rows.map((row) => (row.id === id ? { ...row, status } : row))
  );
  addTimelineEvent({
    dependentId: selected.dependentId,
    detail: `${selected.clinicName} appointment moved to ${status}.`,
    title: "Appointment status updated"
  });
}

export function saveTask(task: Omit<CaregiverTask, "id" | "createdAt" | "done">) {
  const row: CaregiverTask = {
    ...task,
    createdAt: new Date().toISOString(),
    done: false,
    id: makeId("task")
  };

  writeArray(keys.tasks, [row, ...getCaregiverTasks()]);
  return row;
}

export function setTaskDone(id: string, done: boolean) {
  const rows = getCaregiverTasks();
  const selected = rows.find((row) => row.id === id);

  writeArray(keys.tasks, rows.map((row) => (row.id === id ? { ...row, done } : row)));

  if (selected) {
    addTimelineEvent({
      dependentId: selected.dependentId,
      detail: selected.label,
      title: done ? "Coordination task completed" : "Coordination task reopened"
    });
  }
}

export function saveMessage(message: Omit<CaregiverMessage, "id" | "createdAt">) {
  const row: CaregiverMessage = {
    ...message,
    createdAt: new Date().toISOString(),
    id: makeId("message")
  };

  writeArray(keys.messages, [row, ...getCaregiverMessages()]);
  return row;
}

export function subscribeCaregiverStorage(listener: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", listener);
  window.addEventListener(caregiverStorageEvent, listener);

  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(caregiverStorageEvent, listener);
  };
}

export function getCaregiverStorageSnapshot() {
  if (!canUseStorage()) {
    return "";
  }

  return [
    window.localStorage.getItem(keys.dependents) ?? "",
    window.localStorage.getItem(keys.appointments) ?? "",
    window.localStorage.getItem(keys.tasks) ?? "",
    window.localStorage.getItem(keys.timeline) ?? "",
    window.localStorage.getItem(keys.messages) ?? ""
  ].join("|");
}

export function getCaregiverStorageServerSnapshot() {
  return "";
}

export function mapCaregiverStatusToInquiryStatus(status: CaregiverAppointmentStatus): InquiryStatus {
  if (status === "Requested") return "New";
  if (status === "Booked") return "Booked";
  if (status === "Needs more info") return "Needs more info";
  if (status === "Closed") return "Closed";
  return "Contacted";
}
