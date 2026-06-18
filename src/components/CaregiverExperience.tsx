"use client";

import { type FormEvent, useState, useSyncExternalStore } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  HeartHandshake,
  MessageCircle,
  Plus,
  Send,
  ShieldCheck,
  Trash2,
  UserPlus,
  UsersRound
} from "lucide-react";
import { clsx } from "clsx";
import { availableInsurances, clinics } from "@/data/seed";
import {
  addTimelineEvent,
  getCaregiverAppointments,
  getCaregiverDependents,
  getCaregiverMessages,
  getCaregiverStorageServerSnapshot,
  getCaregiverStorageSnapshot,
  getCaregiverTasks,
  getCaregiverTimeline,
  mapCaregiverStatusToInquiryStatus,
  removeDependent,
  saveAppointment,
  saveDependent,
  saveMessage,
  saveTask,
  setTaskDone,
  subscribeCaregiverStorage,
  updateAppointmentStatus,
  type CaregiverAppointment,
  type CaregiverAppointmentStatus,
  type CaregiverDependent
} from "@/lib/caregiver-storage";
import { languageOptions } from "@/lib/constants";
import { saveDemoInquiry } from "@/lib/demo-storage";
import type { Inquiry, InquiryStatus, PreVisitSubmission } from "@/types";

const relationshipOptions = ["Parent", "Child", "Spouse", "Sibling", "Relative", "Other"];
const emirates = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"];
const appointmentStatuses: CaregiverAppointmentStatus[] = ["Requested", "Contacted", "Booked", "Needs more info", "Closed"];

type DependentFormState = {
  name: string;
  relationship: string;
  age: string;
  preferredLanguage: string;
  emirate: string;
  consentStatus: CaregiverDependent["consentStatus"];
  accessLevel: CaregiverDependent["accessLevel"];
  notes: string;
};

type BookingFormState = {
  clinicSlug: string;
  serviceInterest: string;
  preferredDate: string;
  preferredTime: string;
  urgency: Inquiry["urgency"];
  insuranceProvider: string;
  summary: string;
};

const initialDependentForm: DependentFormState = {
  accessLevel: "Booking only",
  age: "",
  consentStatus: "Consent pending",
  emirate: "Dubai",
  name: "",
  notes: "",
  preferredLanguage: "English",
  relationship: "Parent"
};

const initialBookingForm: BookingFormState = {
  clinicSlug: clinics[0]?.slug ?? "",
  insuranceProvider: "Not sure yet",
  preferredDate: "",
  preferredTime: "Morning",
  serviceInterest: clinics[0]?.services[0]?.name ?? "",
  summary: "",
  urgency: "Routine"
};

function statusClass(status: CaregiverAppointmentStatus) {
  if (status === "Booked") return "bg-ayati-mint text-ayati-teal";
  if (status === "Contacted") return "bg-[#EAF1FF] text-ayati-blue";
  if (status === "Needs more info") return "bg-orange-50 text-orange-700";
  if (status === "Closed") return "bg-ayati-paper text-ayati-muted";
  return "bg-[#FFF0E8] text-ayati-coral";
}

function buildCaregiverSummary(dependent: CaregiverDependent, booking: BookingFormState, clinicName: string) {
  return [
    `Caregiver request for: ${dependent.name}`,
    `Relationship: ${dependent.relationship}`,
    `Preferred clinic: ${clinicName}`,
    `Service interest: ${booking.serviceInterest}`,
    `Preferred date/time: ${booking.preferredDate || "Flexible"} ${booking.preferredTime}`,
    `Urgency described by caregiver: ${booking.urgency}`,
    `Preferred language: ${dependent.preferredLanguage}`,
    `Insurance/payment: ${booking.insuranceProvider}`,
    `Caregiver notes: ${booking.summary || dependent.notes || "No additional notes"}`
  ].join("\n");
}

function buildInquiryFromAppointment(
  appointment: CaregiverAppointment,
  dependent: CaregiverDependent,
  status: InquiryStatus = "New"
): Inquiry {
  return {
    accessibilityNeeds: dependent.notes,
    contact: "Caregiver-managed request",
    createdAt: appointment.createdAt,
    id: appointment.id,
    insuranceProvider: appointment.insuranceProvider,
    patientFor: `Caregiver booking for ${dependent.relationship.toLowerCase()}`,
    patientName: dependent.name,
    preferredLanguage: dependent.preferredLanguage,
    serviceInterest: appointment.serviceInterest,
    status,
    summary: appointment.summary,
    urgency: appointment.urgency,
    clinicSlug: appointment.clinicSlug
  };
}

function buildPreVisitSubmission(appointment: CaregiverAppointment, dependent: CaregiverDependent): PreVisitSubmission {
  return {
    accessibilityNeeds: dependent.notes,
    budgetPreference: "No preference stated",
    clinicSlug: appointment.clinicSlug,
    concern: appointment.serviceInterest,
    contact: "Caregiver-managed request",
    createdAt: appointment.createdAt,
    duration: "Not stated",
    hasReports: false,
    insuranceProvider: appointment.insuranceProvider,
    name: dependent.name,
    patientFor: `Caregiver booking for ${dependent.relationship.toLowerCase()}`,
    preferredLanguage: dependent.preferredLanguage,
    reference: appointment.id,
    summary: appointment.summary,
    urgency: appointment.urgency,
    worry: "Caregiver wants clearer booking coordination before the first call"
  };
}

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-AE", {
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "short"
  }).format(new Date(value));
}

export function CaregiverExperience() {
  const storageSnapshot = useSyncExternalStore(
    subscribeCaregiverStorage,
    getCaregiverStorageSnapshot,
    getCaregiverStorageServerSnapshot
  );
  const isHydrated = storageSnapshot !== "";

  const dependents = isHydrated ? getCaregiverDependents() : [];
  const appointments = isHydrated ? getCaregiverAppointments() : [];
  const tasks = isHydrated ? getCaregiverTasks() : [];
  const timeline = isHydrated ? getCaregiverTimeline() : [];
  const messages = isHydrated ? getCaregiverMessages() : [];

  const [activeDependentId, setActiveDependentId] = useState("");
  const [showDependentForm, setShowDependentForm] = useState(false);
  const [dependentForm, setDependentForm] = useState<DependentFormState>(initialDependentForm);
  const [bookingForm, setBookingForm] = useState<BookingFormState>(initialBookingForm);
  const [taskForm, setTaskForm] = useState({ dueDate: "", label: "" });
  const [messageBody, setMessageBody] = useState("");

  const activeDependent = dependents.find((dependent) => dependent.id === activeDependentId) ?? dependents[0];
  const activeDependentKey = activeDependent?.id ?? "";
  const selectedClinic = clinics.find((clinic) => clinic.slug === bookingForm.clinicSlug);
  const selectedClinicServices = selectedClinic?.services ?? [];

  const activeAppointments = appointments.filter((appointment) => appointment.dependentId === activeDependentKey);
  const activeTasks = tasks.filter((task) => task.dependentId === activeDependentKey);
  const activeTimeline = timeline.filter((event) => event.dependentId === activeDependentKey);
  const activeMessages = messages.filter((message) => message.dependentId === activeDependentKey).slice().reverse();
  const hasOpenTasks = activeTasks.some((task) => !task.done);
  const nextAction = !dependents.length
    ? "Add the first dependent profile"
    : !activeAppointments.length
      ? "Book on behalf of the selected patient"
      : hasOpenTasks
        ? "Complete open coordination tasks"
        : "Monitor clinic response and keep the family updated";

  const createDependent = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const row = saveDependent(dependentForm);
    setActiveDependentId(row.id);
    setDependentForm(initialDependentForm);
    setShowDependentForm(false);
  };

  const createAppointment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!activeDependent || !selectedClinic) {
      return;
    }

    const summary = buildCaregiverSummary(activeDependent, bookingForm, selectedClinic.name);
    const appointment = saveAppointment({
      clinicName: selectedClinic.name,
      clinicSlug: selectedClinic.slug,
      dependentId: activeDependent.id,
      insuranceProvider: bookingForm.insuranceProvider,
      preferredDate: bookingForm.preferredDate || "Flexible",
      preferredTime: bookingForm.preferredTime,
      serviceInterest: bookingForm.serviceInterest,
      summary,
      urgency: bookingForm.urgency
    });

    saveDemoInquiry(buildInquiryFromAppointment(appointment, activeDependent));
    void fetch("/api/inquiries", {
      body: JSON.stringify(buildPreVisitSubmission(appointment, activeDependent)),
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST"
    }).catch(() => undefined);

    setBookingForm({
      ...bookingForm,
      preferredDate: "",
      summary: ""
    });
  };

  const changeAppointmentStatus = (appointment: CaregiverAppointment, status: CaregiverAppointmentStatus) => {
    if (!activeDependent) {
      return;
    }

    updateAppointmentStatus(appointment.id, status);
    const inquiryStatus = mapCaregiverStatusToInquiryStatus(status);
    saveDemoInquiry(buildInquiryFromAppointment(appointment, activeDependent, inquiryStatus));
    void fetch(`/api/inquiries/${encodeURIComponent(appointment.id)}/status`, {
      body: JSON.stringify({ status: inquiryStatus }),
      headers: {
        "Content-Type": "application/json"
      },
      method: "PATCH"
    }).catch(() => undefined);
  };

  const createTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!activeDependent || !taskForm.label.trim()) {
      return;
    }

    saveTask({
      dependentId: activeDependent.id,
      dueDate: taskForm.dueDate || "No date set",
      label: taskForm.label
    });
    addTimelineEvent({
      dependentId: activeDependent.id,
      detail: taskForm.label,
      title: "Coordination task added"
    });
    setTaskForm({ dueDate: "", label: "" });
  };

  const sendCaregiverMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!activeDependent || !messageBody.trim()) {
      return;
    }

    saveMessage({
      body: messageBody,
      dependentId: activeDependent.id,
      sender: "Caregiver"
    });
    saveMessage({
      body: "Noted. Keep this as coordination context for the clinic handoff. AYATI does not provide medical advice.",
      dependentId: activeDependent.id,
      sender: "AYATI Coordinator"
    });
    addTimelineEvent({
      dependentId: activeDependent.id,
      detail: "Caregiver added a coordination message.",
      title: "Message added"
    });
    setMessageBody("");
  };

  return (
    <div className="grid gap-6">
      <section className="grid gap-5 rounded-md border border-ayati-line bg-white p-5 shadow-sm lg:grid-cols-[1fr_360px]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-ayati-teal">Caregiver app</p>
          <h1 className="mt-3 max-w-4xl text-3xl font-medium leading-tight text-ayati-ink sm:text-4xl">Coordinate care for the people who rely on you.</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-ayati-muted">
            Add dependents, book on their behalf, track appointment progress, manage tasks, and keep coordination messages in one place.
          </p>
        </div>
        <aside className="rounded-md bg-ayati-warm p-4">
          <p className="text-sm font-semibold text-ayati-muted">What should you do next?</p>
          <div className="mt-3 flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-ayati-mint text-ayati-teal">
              <UsersRound className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-semibold text-ayati-ink">{nextAction}</p>
              <p className="mt-1 text-sm leading-6 text-ayati-muted">This demo uses local persistence so you can test the workflow immediately.</p>
            </div>
          </div>
        </aside>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-md border border-ayati-line bg-white p-5 shadow-sm">
          <UsersRound className="h-5 w-5 text-ayati-teal" aria-hidden="true" />
          <p className="mt-4 text-sm font-medium text-ayati-muted">Dependents</p>
          <p className="mt-2 text-3xl font-semibold text-ayati-ink">{dependents.length}</p>
        </div>
        <div className="rounded-md border border-ayati-line bg-white p-5 shadow-sm">
          <CalendarDays className="h-5 w-5 text-ayati-teal" aria-hidden="true" />
          <p className="mt-4 text-sm font-medium text-ayati-muted">Appointments</p>
          <p className="mt-2 text-3xl font-semibold text-ayati-ink">{appointments.length}</p>
        </div>
        <div className="rounded-md border border-ayati-line bg-white p-5 shadow-sm">
          <CheckCircle2 className="h-5 w-5 text-ayati-teal" aria-hidden="true" />
          <p className="mt-4 text-sm font-medium text-ayati-muted">Open tasks</p>
          <p className="mt-2 text-3xl font-semibold text-ayati-ink">{tasks.filter((task) => !task.done).length}</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <aside className="rounded-md border border-ayati-line bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <UsersRound className="h-5 w-5 text-ayati-teal" aria-hidden="true" />
              <h2 className="text-xl font-semibold text-ayati-ink">Dependents</h2>
            </div>
            <button
              type="button"
              onClick={() => setShowDependentForm((current) => !current)}
              className="focus-ring inline-flex items-center gap-2 rounded-md border border-ayati-line bg-ayati-warm px-3 py-2 text-sm font-semibold text-ayati-ink"
            >
              <UserPlus className="h-4 w-4" aria-hidden="true" />
              Add
            </button>
          </div>

          {(showDependentForm || dependents.length === 0) ? (
            <form onSubmit={createDependent} className="mt-5 grid gap-3 rounded-md border border-ayati-line bg-ayati-warm p-4">
              <label className="grid gap-2 text-sm font-medium text-ayati-ink">
                Dependent name
                <input
                  required
                  value={dependentForm.name}
                  onChange={(event) => setDependentForm((current) => ({ ...current, name: event.target.value }))}
                  className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm"
                  placeholder="Full name"
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-ayati-ink">
                  Relationship
                  <select
                    value={dependentForm.relationship}
                    onChange={(event) => setDependentForm((current) => ({ ...current, relationship: event.target.value }))}
                    className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm"
                  >
                    {relationshipOptions.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-medium text-ayati-ink">
                  Age
                  <input
                    value={dependentForm.age}
                    onChange={(event) => setDependentForm((current) => ({ ...current, age: event.target.value }))}
                    className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm"
                    placeholder="Example: 64"
                  />
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-ayati-ink">
                  Language
                  <select
                    value={dependentForm.preferredLanguage}
                    onChange={(event) => setDependentForm((current) => ({ ...current, preferredLanguage: event.target.value }))}
                    className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm"
                  >
                    {languageOptions.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-medium text-ayati-ink">
                  Emirate
                  <select
                    value={dependentForm.emirate}
                    onChange={(event) => setDependentForm((current) => ({ ...current, emirate: event.target.value }))}
                    className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm"
                  >
                    {emirates.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="grid gap-2 text-sm font-medium text-ayati-ink">
                Consent status
                <select
                  value={dependentForm.consentStatus}
                  onChange={(event) => setDependentForm((current) => ({ ...current, consentStatus: event.target.value as CaregiverDependent["consentStatus"] }))}
                  className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm"
                >
                  <option>Consent pending</option>
                  <option>Consent captured</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium text-ayati-ink">
                Access level
                <select
                  value={dependentForm.accessLevel}
                  onChange={(event) => setDependentForm((current) => ({ ...current, accessLevel: event.target.value as CaregiverDependent["accessLevel"] }))}
                  className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm"
                >
                  <option>Booking only</option>
                  <option>Full coordination</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium text-ayati-ink">
                Coordination notes
                <textarea
                  value={dependentForm.notes}
                  onChange={(event) => setDependentForm((current) => ({ ...current, notes: event.target.value }))}
                  rows={3}
                  className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm"
                  placeholder="Accessibility, language, transport, or family coordination needs"
                />
              </label>
              <button type="submit" className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-ayati-teal px-4 py-3 text-sm font-semibold text-white hover:bg-[#0B5552]">
                <Plus className="h-4 w-4" aria-hidden="true" />
                Save dependent
              </button>
            </form>
          ) : null}

          <div className="mt-5 grid gap-3">
            {dependents.length > 0 ? (
              dependents.map((dependent) => (
                <button
                  key={dependent.id}
                  type="button"
                  onClick={() => setActiveDependentId(dependent.id)}
                  className={clsx(
                    "focus-ring rounded-md border p-4 text-left",
                    dependent.id === activeDependentKey ? "border-ayati-teal bg-ayati-mint" : "border-ayati-line bg-white"
                  )}
                >
                  <span className="block font-semibold text-ayati-ink">{dependent.name}</span>
                  <span className="mt-1 block text-sm text-ayati-muted">
                    {dependent.relationship} - {dependent.preferredLanguage}
                  </span>
                  <span className="mt-2 inline-flex rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-ayati-teal">{dependent.consentStatus}</span>
                </button>
              ))
            ) : (
              <div className="rounded-md border border-dashed border-ayati-line bg-white p-5">
                <h3 className="font-semibold text-ayati-ink">No dependents added yet</h3>
                <p className="mt-2 text-sm leading-6 text-ayati-muted">Add a dependent to unlock booking, timeline, tasks, and messages.</p>
              </div>
            )}
          </div>
        </aside>

        {activeDependent ? (
          <div className="grid gap-6">
            <section className="rounded-md border border-ayati-line bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-normal text-ayati-teal">Selected dependent</p>
                  <h2 className="mt-2 text-3xl font-semibold text-ayati-ink">{activeDependent.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-ayati-muted">
                    {activeDependent.relationship} - {activeDependent.emirate} - {activeDependent.preferredLanguage} - {activeDependent.accessLevel}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeDependent(activeDependent.id)}
                  className="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  Remove
                </button>
              </div>
              <div className="mt-5 rounded-md bg-ayati-warm p-4">
                <p className="text-sm font-semibold text-ayati-ink">Coordination context</p>
                <p className="mt-2 text-sm leading-6 text-ayati-muted">{activeDependent.notes || "No coordination notes added yet."}</p>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
              <form onSubmit={createAppointment} className="rounded-md border border-ayati-line bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-ayati-teal" aria-hidden="true" />
                  <h2 className="text-xl font-semibold text-ayati-ink">Book on behalf</h2>
                </div>
                <div className="mt-5 grid gap-4">
                  <label className="grid gap-2 text-sm font-medium text-ayati-ink">
                    Clinic
                    <select
                      value={bookingForm.clinicSlug}
                      onChange={(event) => {
                        const clinic = clinics.find((item) => item.slug === event.target.value);
                        setBookingForm((current) => ({
                          ...current,
                          clinicSlug: event.target.value,
                          serviceInterest: clinic?.services[0]?.name ?? ""
                        }));
                      }}
                      className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm"
                    >
                      {clinics.map((clinic) => (
                        <option key={clinic.slug} value={clinic.slug}>
                          {clinic.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-2 text-sm font-medium text-ayati-ink">
                    Service interest
                    <select
                      value={bookingForm.serviceInterest}
                      onChange={(event) => setBookingForm((current) => ({ ...current, serviceInterest: event.target.value }))}
                      className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm"
                    >
                      {selectedClinicServices.map((service) => (
                        <option key={service.id}>{service.name}</option>
                      ))}
                    </select>
                  </label>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm font-medium text-ayati-ink">
                      Preferred date
                      <input
                        type="date"
                        value={bookingForm.preferredDate}
                        onChange={(event) => setBookingForm((current) => ({ ...current, preferredDate: event.target.value }))}
                        className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm"
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-medium text-ayati-ink">
                      Preferred time
                      <select
                        value={bookingForm.preferredTime}
                        onChange={(event) => setBookingForm((current) => ({ ...current, preferredTime: event.target.value }))}
                        className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm"
                      >
                        <option>Morning</option>
                        <option>Afternoon</option>
                        <option>Evening</option>
                        <option>First available</option>
                      </select>
                    </label>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm font-medium text-ayati-ink">
                      Urgency
                      <select
                        value={bookingForm.urgency}
                        onChange={(event) => setBookingForm((current) => ({ ...current, urgency: event.target.value as Inquiry["urgency"] }))}
                        className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm"
                      >
                        <option>Routine</option>
                        <option>Soon</option>
                        <option>Urgent</option>
                      </select>
                    </label>
                    <label className="grid gap-2 text-sm font-medium text-ayati-ink">
                      Insurance/payment
                      <select
                        value={bookingForm.insuranceProvider}
                        onChange={(event) => setBookingForm((current) => ({ ...current, insuranceProvider: event.target.value }))}
                        className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm"
                      >
                        <option>Not sure yet</option>
                        <option>Cash/self-pay</option>
                        {availableInsurances.map((item) => (
                          <option key={item}>{item}</option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="grid gap-2 text-sm font-medium text-ayati-ink">
                    What should the clinic know before calling?
                    <textarea
                      value={bookingForm.summary}
                      onChange={(event) => setBookingForm((current) => ({ ...current, summary: event.target.value }))}
                      rows={4}
                      className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm"
                      placeholder="Keep it practical: availability, language, insurance, mobility, or family coordination needs"
                    />
                  </label>
                </div>
                <button type="submit" className="focus-ring mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-ayati-teal px-4 py-3 text-sm font-semibold text-white hover:bg-[#0B5552]">
                  <Send className="h-4 w-4" aria-hidden="true" />
                  Send appointment request
                </button>
              </form>

              <section className="rounded-md border border-ayati-line bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-ayati-teal" aria-hidden="true" />
                  <h2 className="text-xl font-semibold text-ayati-ink">Appointment tracking</h2>
                </div>
                <div className="mt-5 grid gap-3">
                  {activeAppointments.length > 0 ? (
                    activeAppointments.map((appointment) => (
                      <article key={appointment.id} className="rounded-md border border-ayati-line bg-ayati-warm p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="font-semibold text-ayati-ink">{appointment.clinicName}</h3>
                            <p className="mt-1 text-sm leading-6 text-ayati-muted">{appointment.serviceInterest}</p>
                          </div>
                          <span className={clsx("w-fit rounded-md px-3 py-1 text-xs font-semibold", statusClass(appointment.status))}>{appointment.status}</span>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-ayati-muted">
                          Preferred: {appointment.preferredDate} - {appointment.preferredTime}
                        </p>
                        <label className="mt-3 grid gap-2 text-sm font-medium text-ayati-ink">
                          Update status
                          <select
                            value={appointment.status}
                            onChange={(event) => changeAppointmentStatus(appointment, event.target.value as CaregiverAppointmentStatus)}
                            className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-2 text-sm"
                          >
                            {appointmentStatuses.map((status) => (
                              <option key={status}>{status}</option>
                            ))}
                          </select>
                        </label>
                      </article>
                    ))
                  ) : (
                    <div className="rounded-md border border-dashed border-ayati-line bg-ayati-warm p-5">
                      <h3 className="font-semibold text-ayati-ink">No appointment requests yet</h3>
                      <p className="mt-2 text-sm leading-6 text-ayati-muted">Send a request to create a trackable appointment and clinic inquiry.</p>
                    </div>
                  )}
                </div>
              </section>
            </section>

            <section className="grid gap-6 xl:grid-cols-3">
              <div className="rounded-md border border-ayati-line bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <HeartHandshake className="h-5 w-5 text-ayati-teal" aria-hidden="true" />
                  <h2 className="text-xl font-semibold text-ayati-ink">Care coordination</h2>
                </div>
                <form onSubmit={createTask} className="mt-4 grid gap-3">
                  <input
                    value={taskForm.label}
                    onChange={(event) => setTaskForm((current) => ({ ...current, label: event.target.value }))}
                    className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm"
                    placeholder="Add task"
                  />
                  <input
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(event) => setTaskForm((current) => ({ ...current, dueDate: event.target.value }))}
                    className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm"
                  />
                  <button type="submit" className="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-ayati-line bg-ayati-warm px-4 py-3 text-sm font-semibold text-ayati-ink">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Add task
                  </button>
                </form>
                <div className="mt-4 grid gap-2">
                  {activeTasks.length > 0 ? (
                    activeTasks.map((task, index) => (
                      <label key={`${task.id}-${index}`} className="flex items-start gap-3 rounded-md bg-ayati-warm p-3 text-sm">
                        <input
                          type="checkbox"
                          checked={task.done}
                          onChange={(event) => setTaskDone(task.id, event.target.checked)}
                          className="mt-1 h-4 w-4 rounded border-ayati-line text-ayati-teal"
                        />
                        <span>
                          <span className={clsx("block font-semibold", task.done ? "text-ayati-muted line-through" : "text-ayati-ink")}>{task.label}</span>
                          <span className="mt-1 block text-ayati-muted">{task.dueDate}</span>
                        </span>
                      </label>
                    ))
                  ) : (
                    <p className="rounded-md bg-ayati-warm p-3 text-sm leading-6 text-ayati-muted">No tasks yet. Booking requests create default coordination tasks.</p>
                  )}
                </div>
              </div>

              <div className="rounded-md border border-ayati-line bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-ayati-teal" aria-hidden="true" />
                  <h2 className="text-xl font-semibold text-ayati-ink">Shared timeline</h2>
                </div>
                <div className="mt-5 grid gap-3">
                  {activeTimeline.length > 0 ? (
                    activeTimeline.map((event, index) => (
                      <article key={`${event.id}-${index}`} className="rounded-md bg-ayati-warm p-3">
                        <p className="font-semibold text-ayati-ink">{event.title}</p>
                        <p className="mt-1 text-sm leading-6 text-ayati-muted">{event.detail}</p>
                        <p className="mt-2 text-xs font-semibold text-ayati-teal">{formatTimestamp(event.createdAt)}</p>
                      </article>
                    ))
                  ) : (
                    <p className="rounded-md bg-ayati-warm p-3 text-sm leading-6 text-ayati-muted">Timeline events appear as care coordination happens.</p>
                  )}
                </div>
              </div>

              <div className="rounded-md border border-ayati-line bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-ayati-teal" aria-hidden="true" />
                  <h2 className="text-xl font-semibold text-ayati-ink">Family messages</h2>
                </div>
                <div className="mt-5 grid max-h-[360px] gap-3 overflow-y-auto">
                  {activeMessages.length > 0 ? (
                    activeMessages.map((message, index) => (
                      <article key={`${message.id}-${index}`} className={clsx("rounded-md p-3", message.sender === "Caregiver" ? "bg-ayati-mint" : "bg-ayati-warm")}>
                        <p className="text-sm font-semibold text-ayati-ink">{message.sender}</p>
                        <p className="mt-1 text-sm leading-6 text-ayati-muted">{message.body}</p>
                      </article>
                    ))
                  ) : (
                    <p className="rounded-md bg-ayati-warm p-3 text-sm leading-6 text-ayati-muted">Add a message to track coordination context.</p>
                  )}
                </div>
                <form onSubmit={sendCaregiverMessage} className="mt-4 grid gap-3">
                  <textarea
                    value={messageBody}
                    onChange={(event) => setMessageBody(event.target.value)}
                    rows={3}
                    className="focus-ring rounded-md border border-ayati-line bg-white px-3 py-3 text-sm"
                    placeholder="Write a coordination note or family update"
                  />
                  <button type="submit" className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-ayati-teal px-4 py-3 text-sm font-semibold text-white hover:bg-[#0B5552]">
                    <Send className="h-4 w-4" aria-hidden="true" />
                    Send message
                  </button>
                </form>
              </div>
            </section>
          </div>
        ) : (
          <div className="rounded-md border border-ayati-line bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-ayati-ink">Add a dependent to start testing the caregiver workflow</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ayati-muted">
              Once added, you can send appointment requests, create clinic inquiries, update status, track tasks, build a shared timeline, and test coordination messages.
            </p>
          </div>
        )}
      </section>

      <section className="rounded-md border border-ayati-line bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 text-ayati-teal" aria-hidden="true" />
          <p className="text-sm leading-6 text-ayati-muted">
            This test workflow stores coordination data locally in the browser and can post appointment inquiries to Supabase when configured. It is not an EMR and does not store diagnosis, treatment notes, or clinical records.
          </p>
        </div>
      </section>
    </div>
  );
}
