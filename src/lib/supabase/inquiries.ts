import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { getSupabaseServerConfig } from "@/lib/supabase/server-config";
import type { Database } from "@/lib/supabase/database.types";
import type { InquiryStatus, PreVisitSubmission } from "@/types";

type InquiryStatusValue = Database["public"]["Enums"]["inquiry_status"];
type UrgencyValue = Database["public"]["Enums"]["urgency_level"];

export type SupabasePersistenceResult = {
  persisted: boolean;
  reference: string;
  reason?: string;
};

const urgencyToDatabase: Record<PreVisitSubmission["urgency"], UrgencyValue> = {
  Routine: "routine",
  Soon: "soon",
  Urgent: "urgent"
};

const statusToDatabase: Record<InquiryStatus, InquiryStatusValue> = {
  New: "new",
  Contacted: "contacted",
  Booked: "booked",
  "Needs more info": "needs_more_info",
  "Not suitable": "not_suitable",
  Closed: "closed"
};

function optionalText(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

async function findClinicId(slug?: string) {
  if (!slug) {
    return null;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("clinics").select("id").eq("slug", slug).maybeSingle();

  if (error) {
    throw error;
  }

  return data?.id ?? null;
}

async function findLanguageId(languageName: string) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("languages")
    .select("id")
    .ilike("name", languageName)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data?.id ?? null;
}

async function findInsuranceProviderId(providerName: string) {
  const normalizedProvider = optionalText(providerName);

  if (!normalizedProvider || normalizedProvider === "Not stated" || normalizedProvider === "Cash/self-pay") {
    return null;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("insurance_providers")
    .select("id")
    .ilike("name", normalizedProvider)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data?.id ?? null;
}

export async function createSupabaseInquiryWithPreVisit(
  submission: PreVisitSubmission
): Promise<SupabasePersistenceResult> {
  if (!getSupabaseServerConfig().isConfigured) {
    return {
      persisted: false,
      reason: "Supabase server environment variables are not configured.",
      reference: submission.reference
    };
  }

  const supabase = createSupabaseAdminClient();
  const [clinicId, languageId, insuranceProviderId] = await Promise.all([
    findClinicId(submission.clinicSlug),
    findLanguageId(submission.preferredLanguage),
    findInsuranceProviderId(submission.insuranceProvider)
  ]);

  const { data: inquiry, error: inquiryError } = await supabase
    .from("inquiries")
    .upsert(
      {
        accessibility_needs: optionalText(submission.accessibilityNeeds),
        budget_preference: optionalText(submission.budgetPreference),
        clinic_id: clinicId,
        confusion_reason: optionalText(submission.worry),
        contact_value: submission.contact,
        created_at: submission.createdAt,
        has_reports: submission.hasReports,
        insurance_provider_id: insuranceProviderId,
        insurance_provider_text: optionalText(submission.insuranceProvider),
        patient_for: optionalText(submission.patientFor),
        patient_name: submission.name || "Patient inquiry",
        preferred_language_id: languageId,
        preferred_language_text: submission.preferredLanguage,
        public_reference: submission.reference,
        service_interest: submission.concern || "Pre-visit inquiry",
        source_channel: "web",
        status: "new",
        summary: submission.summary,
        urgency: urgencyToDatabase[submission.urgency]
      },
      { onConflict: "public_reference" }
    )
    .select("id")
    .single();

  if (inquiryError) {
    throw inquiryError;
  }

  const { error: preVisitError } = await supabase
    .from("pre_visit_forms")
    .upsert(
      {
        accessibility_needs: optionalText(submission.accessibilityNeeds),
        budget_preference: optionalText(submission.budgetPreference),
        clinic_id: clinicId,
        concern: submission.concern,
        created_at: submission.createdAt,
        duration: submission.duration,
        has_reports: submission.hasReports,
        inquiry_id: inquiry.id,
        insurance_provider_text: optionalText(submission.insuranceProvider),
        patient_for: optionalText(submission.patientFor),
        preferred_language_id: languageId,
        preferred_language_text: submission.preferredLanguage,
        summary: submission.summary,
        urgency: urgencyToDatabase[submission.urgency],
        worry: optionalText(submission.worry)
      },
      { onConflict: "inquiry_id" }
    );

  if (preVisitError) {
    throw preVisitError;
  }

  return {
    persisted: true,
    reference: submission.reference
  };
}

export async function updateSupabaseInquiryStatus(
  reference: string,
  status: InquiryStatus
): Promise<SupabasePersistenceResult> {
  if (!getSupabaseServerConfig().isConfigured) {
    return {
      persisted: false,
      reason: "Supabase server environment variables are not configured.",
      reference
    };
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("inquiries")
    .update({
      status: statusToDatabase[status],
      updated_at: new Date().toISOString()
    })
    .eq("public_reference", reference)
    .select("id")
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return {
      persisted: false,
      reason: "Inquiry reference was not found in Supabase.",
      reference
    };
  }

  const { error: eventError } = await supabase.from("inquiry_status_events").insert({
    inquiry_id: data.id,
    source: "clinic_admin_dashboard",
    status: statusToDatabase[status]
  });

  if (eventError) {
    throw eventError;
  }

  return {
    persisted: true,
    reference
  };
}
