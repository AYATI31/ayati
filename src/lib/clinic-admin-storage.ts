"use client";

import type { Inquiry, InquiryStatus } from "@/types";

export type ClinicTaskSource = "auto" | "manual" | "appointment_action";

export type ClinicAdminTask = {
  id: string;
  clinicSlug: string;
  inquiryId?: string;
  label: string;
  owner: "AYATI Admin" | "Clinic team";
  source: ClinicTaskSource;
  dueLabel: string;
  done: boolean;
  generatedAt: string;
  updatedAt: string;
  reminderSentAt?: string;
  reminderCount: number;
};

const taskKey = "ayati_clinic_admin_tasks";
const clinicTaskEvent = "ayati-clinic-admin-storage-change";

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function readTasks(): ClinicAdminTask[] {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(taskKey);
    const parsed = raw ? JSON.parse(raw) : [];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((task): task is Partial<ClinicAdminTask> => Boolean(task) && typeof task === "object")
      .map((task) => {
        const generatedAt = typeof task.generatedAt === "string" ? task.generatedAt : new Date().toISOString();
        const owner: ClinicAdminTask["owner"] = task.owner === "Clinic team" ? "Clinic team" : "AYATI Admin";
        const source: ClinicTaskSource = task.source === "manual" || task.source === "appointment_action" ? task.source : "auto";

        return {
          clinicSlug: typeof task.clinicSlug === "string" ? task.clinicSlug : "",
          done: Boolean(task.done),
          dueLabel: typeof task.dueLabel === "string" ? task.dueLabel : "Today",
          generatedAt,
          id: typeof task.id === "string" ? task.id : makeId("clinic-task"),
          inquiryId: typeof task.inquiryId === "string" ? task.inquiryId : undefined,
          label: typeof task.label === "string" ? task.label : "Review inquiry",
          owner,
          reminderCount: typeof task.reminderCount === "number" ? task.reminderCount : task.reminderSentAt ? 1 : 0,
          reminderSentAt: typeof task.reminderSentAt === "string" ? task.reminderSentAt : undefined,
          source,
          updatedAt: typeof task.updatedAt === "string" ? task.updatedAt : generatedAt
        };
      })
      .filter((task) => Boolean(task.clinicSlug));
  } catch {
    return [];
  }
}

function writeTasks(tasks: ClinicAdminTask[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(taskKey, JSON.stringify(tasks));
  window.dispatchEvent(new Event(clinicTaskEvent));
}

function byNewest(tasks: ClinicAdminTask[]) {
  return [...tasks].sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime());
}

function autoTaskTemplates(inquiry: Inquiry) {
  const tasks: Array<{ key: string; label: string; dueLabel: string }> = [];

  if (inquiry.status === "New") {
    tasks.push({
      dueLabel: inquiry.urgency === "Urgent" ? "Now" : "Today",
      key: "first-response",
      label: `Offer next available slot to ${inquiry.patientName}`
    });
  }

  if (inquiry.status === "Contacted") {
    tasks.push({
      dueLabel: "Within 24 hours",
      key: "follow-up",
      label: `Send follow-up reminder to ${inquiry.patientName}`
    });
  }

  if (inquiry.status === "Booked") {
    tasks.push({
      dueLabel: "Before visit",
      key: "visit-prep",
      label: `Confirm visit preparation for ${inquiry.patientName}`
    });
  }

  if (inquiry.status === "Needs more info") {
    tasks.push({
      dueLabel: "Today",
      key: "missing-info",
      label: `Request missing information from ${inquiry.patientName}`
    });
  }

  if (inquiry.urgency === "Urgent" && inquiry.status !== "Booked" && inquiry.status !== "Closed" && inquiry.status !== "Not suitable") {
    tasks.push({
      dueLabel: "Now",
      key: "urgent-reminder",
      label: `AYATI admin reminder: urgent response needed for ${inquiry.patientName}`
    });
  }

  return tasks;
}

export function getClinicAdminTasks(clinicSlug: string) {
  return byNewest(readTasks().filter((task) => task.clinicSlug === clinicSlug));
}

export function syncAutoClinicTasks(clinicSlug: string, inquiries: Inquiry[]) {
  const current = readTasks();
  const existingIds = new Set(current.map((task) => task.id));
  const generated: ClinicAdminTask[] = [];

  inquiries.forEach((inquiry) => {
    autoTaskTemplates(inquiry).forEach((template) => {
      const id = `auto-${clinicSlug}-${inquiry.id}-${template.key}`;

      if (existingIds.has(id)) {
        return;
      }

      const now = new Date().toISOString();
      generated.push({
        clinicSlug,
        done: false,
        dueLabel: template.dueLabel,
        generatedAt: now,
        id,
        inquiryId: inquiry.id,
        label: template.label,
        owner: "AYATI Admin",
        reminderCount: 1,
        reminderSentAt: now,
        source: "auto",
        updatedAt: now
      });
    });
  });

  if (generated.length > 0) {
    writeTasks([...generated, ...current]);
  }
}

export function saveClinicTask(task: Omit<ClinicAdminTask, "id" | "generatedAt" | "updatedAt" | "reminderCount"> & { generatedAt?: string; reminderCount?: number }) {
  const now = task.generatedAt ?? new Date().toISOString();
  const row: ClinicAdminTask = {
    ...task,
    generatedAt: now,
    id: makeId("clinic-task"),
    reminderCount: task.reminderCount ?? (task.reminderSentAt ? 1 : 0),
    updatedAt: now
  };

  writeTasks([row, ...readTasks()]);
  return row;
}

export function updateClinicTask(id: string, updates: Partial<Pick<ClinicAdminTask, "done" | "dueLabel" | "label">>) {
  const now = new Date().toISOString();

  writeTasks(
    readTasks().map((task) =>
      task.id === id
        ? {
            ...task,
            ...updates,
            updatedAt: now
          }
        : task
    )
  );
}

export function sendClinicTaskReminder(id: string) {
  const now = new Date().toISOString();

  writeTasks(
    readTasks().map((task) =>
      task.id === id
        ? {
            ...task,
            reminderCount: task.reminderCount + 1,
            reminderSentAt: now,
            updatedAt: now
          }
        : task
    )
  );
}

export function subscribeClinicAdminStorage(listener: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", listener);
  window.addEventListener(clinicTaskEvent, listener);

  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(clinicTaskEvent, listener);
  };
}

export function getClinicAdminStorageSnapshot() {
  if (!canUseStorage()) {
    return "";
  }

  return window.localStorage.getItem(taskKey) ?? "ready";
}

export function getClinicAdminStorageServerSnapshot() {
  return "";
}

export function isTerminalStatus(status: InquiryStatus) {
  return status === "Closed" || status === "Not suitable";
}
