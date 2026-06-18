"use client";

import { type FormEvent, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { BarChart3, Bell, CalendarDays, CheckCircle2, ClipboardList, FileText, GitBranch, MessageSquareText, Pencil, PhoneCall, Plus, Stethoscope, UserRoundCog } from "lucide-react";
import { clsx } from "clsx";
import { StatusPill } from "@/components/StatusPill";
import { clinics, inquiries, preVisitForms } from "@/data/seed";
import { inquiryStatuses } from "@/lib/constants";
import {
  getClinicAdminStorageServerSnapshot,
  getClinicAdminStorageSnapshot,
  getClinicAdminTasks,
  saveClinicTask,
  sendClinicTaskReminder,
  subscribeClinicAdminStorage,
  syncAutoClinicTasks,
  updateClinicTask,
  type ClinicAdminTask
} from "@/lib/clinic-admin-storage";
import {
  getDemoInquiries,
  getDemoPreVisitForms,
  getDemoStorageServerSnapshot,
  getDemoStorageSnapshot,
  saveDemoInquiry,
  subscribeDemoStorage
} from "@/lib/demo-storage";
import type { Inquiry, InquiryStatus } from "@/types";

const pipelineStages: Array<{ label: string; statuses: InquiryStatus[] }> = [
  { label: "New", statuses: ["New"] },
  { label: "Contacted", statuses: ["Contacted"] },
  { label: "Booked", statuses: ["Booked"] },
  { label: "Needs info", statuses: ["Needs more info"] },
  { label: "Closed", statuses: ["Closed", "Not suitable"] }
];

const referrals: Array<{ patient: string; reason: string; target: string; status: string }> = [];

const teamNotes: string[] = [];

function stageColor(label: string) {
  if (label === "New") return "bg-[#FFF0E8] text-ayati-coral";
  if (label === "Contacted") return "bg-[#EAF1FF] text-ayati-blue";
  if (label === "Booked") return "bg-ayati-mint text-ayati-teal";
  if (label === "Needs info") return "bg-orange-50 text-orange-700";
  return "bg-ayati-paper text-ayati-muted";
}

function statusCount(rows: Inquiry[], statuses: InquiryStatus[]) {
  return rows.filter((row) => statuses.includes(row.status)).length;
}

function formatGeneratedAt(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
    second: "2-digit",
    year: "numeric"
  }).format(new Date(value));
}

function getResponseMinutes(row: Inquiry) {
  if (typeof row.timeToFirstResponseMinutes === "number" && row.timeToFirstResponseMinutes > 0) {
    return row.timeToFirstResponseMinutes;
  }

  return Math.max(1, Math.round((Date.now() - new Date(row.createdAt).getTime()) / 60000));
}

export function ClinicAdminDashboard() {
  const clinic = clinics[0];
  const storageSnapshot = useSyncExternalStore(subscribeDemoStorage, getDemoStorageSnapshot, getDemoStorageServerSnapshot);
  const clinicTaskSnapshot = useSyncExternalStore(subscribeClinicAdminStorage, getClinicAdminStorageSnapshot, getClinicAdminStorageServerSnapshot);
  const canReadClinicTasks = clinicTaskSnapshot !== "";
  const [statusOverrides, setStatusOverrides] = useState<Record<string, InquiryStatus>>({});
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [manualTask, setManualTask] = useState({ dueLabel: "Today", label: "" });
  const [editingTaskId, setEditingTaskId] = useState("");
  const [editingTask, setEditingTask] = useState({ dueLabel: "", label: "" });

  const baseRows = useMemo(() => {
    if (!clinic) {
      return [];
    }

    return (storageSnapshot !== "" ? getDemoInquiries(inquiries) : inquiries).filter((inquiry) => inquiry.clinicSlug === clinic.slug);
  }, [clinic, storageSnapshot]);

  const rows = useMemo(
    () => baseRows.map((row) => ({ ...row, status: statusOverrides[row.id] ?? row.status })),
    [baseRows, statusOverrides]
  );

  const forms = useMemo(() => {
    if (!clinic) {
      return [];
    }

    return (storageSnapshot !== "" ? getDemoPreVisitForms(preVisitForms) : preVisitForms).filter((form) => form.clinicSlug === clinic.slug);
  }, [clinic, storageSnapshot]);

  const clinicTasks = clinic && canReadClinicTasks ? getClinicAdminTasks(clinic.slug) : [];

  useEffect(() => {
    if (!clinic || !canReadClinicTasks) {
      return;
    }

    syncAutoClinicTasks(clinic.slug, rows);
  }, [canReadClinicTasks, clinic, rows]);

  if (!clinic) {
    return (
      <div className="grid gap-6">
        <section className="rounded-md border border-ayati-line bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-normal text-ayati-teal">Clinic admin dashboard</p>
          <h2 className="mt-2 text-3xl font-semibold text-ayati-ink">No clinic profile connected</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-ayati-muted">
            Dummy clinic records have been removed. Connect a real clinic profile before using the inbox, pipeline, appointment, follow-up, referral, notes, and analytics workflows.
          </p>
          <Link
            href="/ayati-admin/clinics/new"
            className="focus-ring mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-ayati-teal px-4 py-3 text-sm font-semibold text-white hover:bg-[#0B5552]"
          >
            Add clinic profile
            <Pencil className="h-4 w-4" aria-hidden="true" />
          </Link>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {["Inquiry Inbox", "Patient Pipeline", "Appointment Management", "Follow-Up Tasks"].map((item) => (
            <div key={item} className="rounded-md border border-ayati-line bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-ayati-muted">{item}</p>
              <p className="mt-2 text-2xl font-semibold text-ayati-ink">Empty</p>
            </div>
          ))}
        </section>
      </div>
    );
  }

  const requiredProfileFields = [
    clinic.description,
    clinic.specialties.length,
    clinic.helpsWith.length,
    clinic.services.length,
    clinic.doctors.length,
    clinic.languages.length,
    clinic.insurance.length,
    clinic.priceRange,
    clinic.preparationNotes.length,
    clinic.suitableFor.length
  ];
  const completeFields = requiredProfileFields.filter(Boolean).length;
  const profileCompleteness = Math.round((completeFields / requiredProfileFields.length) * 100);
  const bookedCount = rows.filter((row) => row.status === "Booked").length;
  const newCount = rows.filter((row) => row.status === "New").length;
  const conversionRate = rows.length > 0 ? Math.round((bookedCount / rows.length) * 100) : 0;
  const responseRows = rows.filter((row) => typeof row.timeToFirstResponseMinutes === "number" && row.timeToFirstResponseMinutes > 0);
  const averageResponseMinutes =
    responseRows.length > 0
      ? Math.round(responseRows.reduce((total, row) => total + (row.timeToFirstResponseMinutes ?? 0), 0) / responseRows.length)
      : 0;
  const topLanguage =
    rows.length > 0
      ? Object.entries(rows.reduce<Record<string, number>>((counts, row) => ({ ...counts, [row.preferredLanguage]: (counts[row.preferredLanguage] ?? 0) + 1 }), {})).sort((a, b) => b[1] - a[1])[0]?.[0]
      : "Not enough data";
  const topService =
    rows.length > 0
      ? Object.entries(rows.reduce<Record<string, number>>((counts, row) => ({ ...counts, [row.serviceInterest]: (counts[row.serviceInterest] ?? 0) + 1 }), {})).sort((a, b) => b[1] - a[1])[0]?.[0]
      : "Not enough data";

  const persistInquiryStatus = (row: Inquiry, status: InquiryStatus, changes: Partial<Inquiry> = {}) => {
    const updatedRow = { ...row, ...changes, status };

    setStatusOverrides((current) => ({ ...current, [row.id]: status }));
    saveDemoInquiry(updatedRow);

    void fetch(`/api/inquiries/${encodeURIComponent(row.id)}/status`, {
      body: JSON.stringify({ status }),
      headers: {
        "Content-Type": "application/json"
      },
      method: "PATCH"
    }).catch(() => undefined);
  };

  const setStatus = (id: string, status: InquiryStatus) => {
    const selectedRow = rows.find((row) => row.id === id);

    if (!selectedRow) {
      return;
    }

    persistInquiryStatus(selectedRow, status);
  };

  const offerNextAvailable = (row: Inquiry) => {
    const now = new Date().toISOString();

    persistInquiryStatus(row, "Contacted", {
      timeToFirstResponseMinutes: getResponseMinutes(row)
    });
    saveClinicTask({
      clinicSlug: clinic.slug,
      done: false,
      dueLabel: "Today",
      generatedAt: now,
      inquiryId: row.id,
      label: `Offer next available slot to ${row.patientName}`,
      owner: "AYATI Admin",
      reminderCount: 1,
      reminderSentAt: now,
      source: "appointment_action"
    });
  };

  const confirmVisitPreparation = (row: Inquiry) => {
    const now = new Date().toISOString();

    persistInquiryStatus(row, "Booked");
    saveClinicTask({
      clinicSlug: clinic.slug,
      done: true,
      dueLabel: "Completed now",
      generatedAt: now,
      inquiryId: row.id,
      label: `Visit preparation confirmed for ${row.patientName}`,
      owner: "AYATI Admin",
      reminderCount: 1,
      reminderSentAt: now,
      source: "appointment_action"
    });
  };

  const addManualTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!manualTask.label.trim()) {
      return;
    }

    saveClinicTask({
      clinicSlug: clinic.slug,
      done: false,
      dueLabel: manualTask.dueLabel || "Today",
      label: manualTask.label,
      owner: "Clinic team",
      source: "manual"
    });
    setManualTask({ dueLabel: "Today", label: "" });
    setShowTaskForm(false);
  };

  const startEditingTask = (task: ClinicAdminTask) => {
    setEditingTaskId(task.id);
    setEditingTask({ dueLabel: task.dueLabel, label: task.label });
  };

  const saveTaskEdit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingTaskId || !editingTask.label.trim()) {
      return;
    }

    updateClinicTask(editingTaskId, editingTask);
    setEditingTaskId("");
    setEditingTask({ dueLabel: "", label: "" });
  };

  return (
    <div className="grid min-w-0 justify-items-stretch gap-6">
      <section className="w-full max-w-full min-w-0 overflow-hidden rounded-md border border-ayati-line bg-white p-6 shadow-sm">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 gap-3">
            <UserRoundCog className="mt-1 h-6 w-6 text-ayati-teal" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-normal text-ayati-teal">Clinic admin dashboard</p>
              <h2 className="mt-2 text-3xl font-semibold text-ayati-ink">{clinic.name}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-ayati-muted">
                Work through patient navigation requests, coordinate bookings, assign follow-ups, and keep clinic operations clear.
              </p>
            </div>
          </div>
          <Link
            href={`/ayati-admin/clinics/${clinic.slug}/edit`}
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-ayati-line bg-ayati-warm px-4 py-3 text-sm font-semibold text-ayati-ink hover:border-ayati-teal"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Edit profile
          </Link>
        </div>

        <div className="mt-6 rounded-md bg-ayati-mint p-4">
          <p className="text-sm font-semibold text-ayati-teal">What should the team do next?</p>
          <p className="mt-1 text-lg font-semibold text-ayati-ink">Contact new inquiries, confirm insurance, then move suitable patients into booked appointments.</p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-md border border-ayati-line bg-white p-5 shadow-sm">
          <ClipboardList className="h-5 w-5 text-ayati-teal" aria-hidden="true" />
          <p className="mt-4 text-sm font-medium text-ayati-muted">Profile completeness</p>
          <p className="mt-2 text-3xl font-semibold text-ayati-ink">{profileCompleteness}%</p>
        </div>
        <div className="rounded-md border border-ayati-line bg-white p-5 shadow-sm">
          <CalendarDays className="h-5 w-5 text-ayati-teal" aria-hidden="true" />
          <p className="mt-4 text-sm font-medium text-ayati-muted">Services listed</p>
          <p className="mt-2 text-3xl font-semibold text-ayati-ink">{clinic.services.length}</p>
        </div>
        <div className="rounded-md border border-ayati-line bg-white p-5 shadow-sm">
          <FileText className="h-5 w-5 text-ayati-teal" aria-hidden="true" />
          <p className="mt-4 text-sm font-medium text-ayati-muted">Doctors listed</p>
          <p className="mt-2 text-3xl font-semibold text-ayati-ink">{clinic.doctors.length}</p>
        </div>
        <div className="rounded-md border border-ayati-line bg-white p-5 shadow-sm">
          <BarChart3 className="h-5 w-5 text-ayati-teal" aria-hidden="true" />
          <p className="mt-4 text-sm font-medium text-ayati-muted">New inquiries</p>
          <p className="mt-2 text-3xl font-semibold text-ayati-ink">{newCount}</p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="w-full max-w-full min-w-0 overflow-hidden rounded-md border border-ayati-line bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-ayati-teal" aria-hidden="true" />
            <h2 className="text-xl font-semibold text-ayati-ink">Inquiry Inbox</h2>
          </div>

          <div className="mt-5 max-w-full overflow-x-auto">
            <table className="w-full min-w-[1120px] border-separate border-spacing-0 text-left text-sm">
              <thead>
                <tr className="text-ayati-muted">
                  <th className="border-b border-ayati-line pb-3 font-semibold">Reference</th>
                  <th className="border-b border-ayati-line pb-3 font-semibold">Patient language</th>
                  <th className="border-b border-ayati-line pb-3 font-semibold">Service interest</th>
                  <th className="border-b border-ayati-line pb-3 font-semibold">Urgency</th>
                  <th className="border-b border-ayati-line pb-3 font-semibold">Pre-visit summary</th>
                  <th className="border-b border-ayati-line pb-3 font-semibold">Time to first response</th>
                  <th className="border-b border-ayati-line pb-3 font-semibold">Reason if not booked</th>
                  <th className="border-b border-ayati-line pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="align-top">
                    <td className="border-b border-ayati-line py-4 font-semibold text-ayati-ink">{row.id}</td>
                    <td className="border-b border-ayati-line py-4 text-ayati-muted">{row.preferredLanguage}</td>
                    <td className="border-b border-ayati-line py-4 text-ayati-muted">{row.serviceInterest}</td>
                    <td className="border-b border-ayati-line py-4 text-ayati-muted">{row.urgency}</td>
                    <td className="max-w-[320px] border-b border-ayati-line py-4 text-ayati-muted">{row.summary}</td>
                    <td className="border-b border-ayati-line py-4 text-ayati-muted">
                      {row.timeToFirstResponseMinutes ? `${row.timeToFirstResponseMinutes} min` : "Pending"}
                    </td>
                    <td className="border-b border-ayati-line py-4 text-ayati-muted">{row.reasonIfNotBooked || row.confusionReason || "-"}</td>
                    <td className="border-b border-ayati-line py-4">
                      <select
                        value={row.status}
                        data-testid={`inquiry-status-${row.id}`}
                        onChange={(event) => setStatus(row.id, event.target.value as InquiryStatus)}
                        className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-2 text-sm text-ayati-ink"
                      >
                        {inquiryStatuses.map((status) => (
                          <option key={status}>{status}</option>
                        ))}
                      </select>
                      <div className="mt-2">
                        <StatusPill status={row.status} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-md border border-ayati-line bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-ayati-teal" aria-hidden="true" />
            <h2 className="text-xl font-semibold text-ayati-ink">Patient Pipeline</h2>
          </div>
          <div className="mt-5 grid gap-3">
            {pipelineStages.map((stage) => (
              <div key={stage.label} className="rounded-md border border-ayati-line p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-ayati-ink">{stage.label}</p>
                  <span className={clsx("rounded-md px-3 py-1 text-sm font-semibold", stageColor(stage.label))}>{statusCount(rows, stage.statuses)}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-ayati-muted">
                  {stage.label === "New" && "Needs first contact and expectation setting."}
                  {stage.label === "Contacted" && "Awaiting patient response or booking readiness."}
                  {stage.label === "Booked" && "Appointment is scheduled and needs preparation."}
                  {stage.label === "Needs info" && "Staff need missing information before booking."}
                  {stage.label === "Closed" && "Journey step is closed or redirected."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-md border border-ayati-line bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-ayati-teal" aria-hidden="true" />
            <h2 className="text-xl font-semibold text-ayati-ink">Appointment Management</h2>
          </div>
          <div className="mt-5 grid gap-3">
            {rows.length > 0 ? (
              rows.slice(0, 3).map((row) => (
                <div key={row.id} className="rounded-md bg-ayati-warm p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-ayati-ink">{row.patientName}</p>
                      <p className="mt-1 text-sm text-ayati-muted">{row.serviceInterest}</p>
                    </div>
                    <StatusPill status={row.status} />
                  </div>
                  <button
                    type="button"
                    data-testid={`appointment-action-${row.id}`}
                    onClick={() => (row.status === "Booked" ? confirmVisitPreparation(row) : offerNextAvailable(row))}
                    className="focus-ring mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md border border-ayati-line bg-white px-3 py-2.5 text-sm font-medium text-ayati-ink hover:border-ayati-teal"
                  >
                    {row.status === "Booked" ? (
                      <CheckCircle2 className="h-4 w-4 text-ayati-teal" aria-hidden="true" />
                    ) : (
                      <CalendarDays className="h-4 w-4 text-ayati-teal" aria-hidden="true" />
                    )}
                    {row.status === "Booked" ? "Confirm visit preparation" : "Offer next available slot"}
                  </button>
                  <p className="mt-2 text-xs leading-5 text-ayati-muted">
                    {row.status === "Booked"
                      ? "Marks preparation confirmed and records an AYATI admin coordination task."
                      : "Moves the inquiry to Contacted and records the next-slot reminder."}
                  </p>
                </div>
              ))
            ) : (
              <p className="rounded-md bg-ayati-warm p-4 text-sm leading-6 text-ayati-muted">No appointment inquiries yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-md border border-ayati-line bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-2">
              <PhoneCall className="h-5 w-5 text-ayati-teal" aria-hidden="true" />
              <h2 className="text-xl font-semibold text-ayati-ink">Care Coordination Tasks</h2>
            </div>
            <button
              type="button"
              data-testid="clinic-add-task-toggle"
              onClick={() => setShowTaskForm((current) => !current)}
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-ayati-line bg-ayati-warm px-3 py-2 text-sm font-medium text-ayati-ink hover:border-ayati-teal"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add task
            </button>
          </div>

          {showTaskForm ? (
            <form onSubmit={addManualTask} className="mt-4 grid gap-3 rounded-md border border-ayati-line bg-ayati-warm p-4">
              <label className="grid gap-2 text-sm font-medium text-ayati-ink">
                Task
                <input
                  data-testid="clinic-manual-task-label"
                  value={manualTask.label}
                  onChange={(event) => setManualTask((current) => ({ ...current, label: event.target.value }))}
                  className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-2.5 text-sm"
                  placeholder="Example: Call patient to confirm insurance card"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-ayati-ink">
                Due
                <input
                  data-testid="clinic-manual-task-due"
                  value={manualTask.dueLabel}
                  onChange={(event) => setManualTask((current) => ({ ...current, dueLabel: event.target.value }))}
                  className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-2.5 text-sm"
                  placeholder="Today, tomorrow, before visit"
                />
              </label>
              <button type="submit" data-testid="clinic-manual-task-save" className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-ayati-teal px-3 py-2.5 text-sm font-medium text-white hover:bg-[#0B5552]">
                <Plus className="h-4 w-4" aria-hidden="true" />
                Save task
              </button>
            </form>
          ) : null}

          <div className="mt-5 grid gap-3">
            {clinicTasks.length > 0 ? (
              clinicTasks.slice(0, 6).map((task, index) => (
                <article key={`${task.id}-${index}`} className={clsx("rounded-md border p-4", task.done ? "border-ayati-line bg-ayati-paper" : "border-ayati-line bg-white")}>
                  {editingTaskId === task.id ? (
                    <form onSubmit={saveTaskEdit} className="grid gap-3">
                      <input
                        value={editingTask.label}
                        onChange={(event) => setEditingTask((current) => ({ ...current, label: event.target.value }))}
                        className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-2.5 text-sm"
                      />
                      <input
                        value={editingTask.dueLabel}
                        onChange={(event) => setEditingTask((current) => ({ ...current, dueLabel: event.target.value }))}
                        className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-2.5 text-sm"
                      />
                      <button type="submit" className="focus-ring rounded-md bg-ayati-teal px-3 py-2 text-sm font-medium text-white">Save edit</button>
                    </form>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className={clsx("font-medium", task.done ? "text-ayati-muted line-through" : "text-ayati-ink")}>{task.label}</p>
                          <p className="mt-2 text-xs leading-5 text-ayati-muted">
                            {task.owner} - {task.source === "auto" ? "auto-generated" : "manual"} - due {task.dueLabel}
                          </p>
                        </div>
                        <span className="rounded-md bg-ayati-mint px-2.5 py-1 text-xs font-medium text-ayati-teal">{task.done ? "Done" : "Open"}</span>
                      </div>
                      <p className="mt-3 text-xs leading-5 text-ayati-muted">
                        Generated {formatGeneratedAt(task.generatedAt)}
                        {task.reminderSentAt ? ` - reminder sent ${formatGeneratedAt(task.reminderSentAt)} (${task.reminderCount})` : ""}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          data-testid={`clinic-task-edit-${task.id}`}
                          onClick={() => startEditingTask(task)}
                          className="focus-ring inline-flex items-center gap-1 rounded-md border border-ayati-line bg-ayati-warm px-2.5 py-1.5 text-xs font-medium text-ayati-ink hover:border-ayati-teal"
                        >
                          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                          Edit
                        </button>
                        <button
                          type="button"
                          data-testid={`clinic-task-done-${task.id}`}
                          onClick={() => updateClinicTask(task.id, { done: !task.done })}
                          className="focus-ring inline-flex items-center gap-1 rounded-md border border-ayati-line bg-ayati-warm px-2.5 py-1.5 text-xs font-medium text-ayati-ink hover:border-ayati-teal"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                          {task.done ? "Reopen" : "Done"}
                        </button>
                        <button
                          type="button"
                          data-testid={`clinic-task-reminder-${task.id}`}
                          onClick={() => sendClinicTaskReminder(task.id)}
                          className="focus-ring inline-flex items-center gap-1 rounded-md border border-ayati-line bg-ayati-warm px-2.5 py-1.5 text-xs font-medium text-ayati-ink hover:border-ayati-teal"
                        >
                          <Bell className="h-3.5 w-3.5" aria-hidden="true" />
                          Reminder
                        </button>
                      </div>
                    </>
                  )}
                </article>
              ))
            ) : (
              <p className="rounded-md bg-ayati-warm p-4 text-sm leading-6 text-ayati-muted">
                AYATI Admin automation will generate coordination tasks when inquiries appear or statuses change.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-md border border-ayati-line bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-ayati-teal" aria-hidden="true" />
            <h2 className="text-xl font-semibold text-ayati-ink">Referral Tracking</h2>
          </div>
          <div className="mt-5 grid gap-3">
            {referrals.length > 0 ? (
              referrals.map((referral) => (
                <div key={`${referral.patient}-${referral.target}`} className="rounded-md bg-ayati-warm p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-ayati-ink">{referral.patient}</p>
                    <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-ayati-teal">{referral.status}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-ayati-muted">{referral.reason} to {referral.target}</p>
                </div>
              ))
            ) : (
              <p className="rounded-md bg-ayati-warm p-4 text-sm leading-6 text-ayati-muted">No referrals yet. Referral records should come from real care coordination events.</p>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-md border border-ayati-line bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <MessageSquareText className="h-5 w-5 text-ayati-teal" aria-hidden="true" />
            <h2 className="text-xl font-semibold text-ayati-ink">Team Notes</h2>
          </div>
          <div className="mt-5 grid gap-3">
            {teamNotes.length > 0 ? (
              teamNotes.map((note) => (
                <p key={note} className="rounded-md bg-ayati-warm p-4 text-sm leading-6 text-ayati-ink">{note}</p>
              ))
            ) : (
              <p className="rounded-md bg-ayati-warm p-4 text-sm leading-6 text-ayati-muted">No team notes yet. Notes should be added by clinic staff during real patient coordination.</p>
            )}
          </div>
        </div>

        <div className="rounded-md border border-ayati-line bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-ayati-teal" aria-hidden="true" />
            <h2 className="text-xl font-semibold text-ayati-ink">Analytics Dashboard</h2>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-md bg-ayati-warm p-4">
              <p className="text-sm font-medium text-ayati-muted">Response target</p>
              <p className="mt-2 text-2xl font-semibold text-ayati-ink">{averageResponseMinutes ? `${averageResponseMinutes} min` : "Pending"}</p>
            </div>
            <div className="rounded-md bg-ayati-warm p-4">
              <p className="text-sm font-medium text-ayati-muted">Language demand</p>
              <p className="mt-2 text-2xl font-semibold text-ayati-ink">{topLanguage}</p>
            </div>
            <div className="rounded-md bg-ayati-warm p-4">
              <p className="text-sm font-medium text-ayati-muted">Most common need</p>
              <p className="mt-2 text-2xl font-semibold text-ayati-ink">{topService}</p>
            </div>
            <div className="rounded-md bg-ayati-warm p-4">
              <p className="text-sm font-medium text-ayati-muted">Booking conversion</p>
              <p className="mt-2 text-2xl font-semibold text-ayati-ink">{conversionRate}%</p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-6 text-ayati-muted">
            Metrics are operational signals for coordination quality. They do not rank medical superiority.
          </p>
        </div>
      </section>

      <section className="w-full max-w-full min-w-0 rounded-md border border-ayati-line bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-ayati-teal" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-ayati-ink">Pre-Visit Context</h2>
        </div>

        <div className="mt-5 grid gap-4">
          {forms.length === 0 ? (
            <p className="text-sm text-ayati-muted">No pre-visit forms for this demo clinic yet.</p>
          ) : (
            forms.map((form) => (
              <article key={form.id} className="rounded-md border border-ayati-line bg-ayati-warm p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-ayati-ink">{form.id}</h3>
                    <p className="mt-1 text-sm text-ayati-muted">{form.concern}</p>
                  </div>
                  <span className="text-sm font-semibold text-ayati-teal">{form.preferredLanguage}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-ayati-muted">Duration: {form.duration}</p>
                <p className="mt-1 text-sm leading-6 text-ayati-muted">Patient worry: {form.worry}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
