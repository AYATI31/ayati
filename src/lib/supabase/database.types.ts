export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      clinics: {
        Row: {
          id: string;
          slug: string;
          name: string;
          status: Database["public"]["Enums"]["clinic_status"];
          emirate: string;
          area: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          status?: Database["public"]["Enums"]["clinic_status"];
          emirate: string;
          area: string;
        };
        Update: Partial<Database["public"]["Tables"]["clinics"]["Insert"]>;
        Relationships: [];
      };
      languages: {
        Row: {
          id: string;
          code: string | null;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          code?: string | null;
          name: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["languages"]["Insert"]>;
        Relationships: [];
      };
      insurance_providers: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["insurance_providers"]["Insert"]>;
        Relationships: [];
      };
      inquiries: {
        Row: {
          id: string;
          public_reference: string;
          clinic_id: string | null;
          patient_name: string;
          contact_value: string;
          patient_for: string | null;
          preferred_language_id: string | null;
          preferred_language_text: string;
          service_interest: string;
          urgency: Database["public"]["Enums"]["urgency_level"];
          status: Database["public"]["Enums"]["inquiry_status"];
          summary: string;
          insurance_provider_id: string | null;
          insurance_provider_text: string | null;
          budget_preference: string | null;
          accessibility_needs: string | null;
          has_reports: boolean | null;
          reason_if_not_booked: string | null;
          time_to_first_response_minutes: number | null;
          confusion_reason: string | null;
          source_channel: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          public_reference: string;
          clinic_id?: string | null;
          patient_name: string;
          contact_value: string;
          patient_for?: string | null;
          preferred_language_id?: string | null;
          preferred_language_text?: string;
          service_interest: string;
          urgency?: Database["public"]["Enums"]["urgency_level"];
          status?: Database["public"]["Enums"]["inquiry_status"];
          summary: string;
          insurance_provider_id?: string | null;
          insurance_provider_text?: string | null;
          budget_preference?: string | null;
          accessibility_needs?: string | null;
          has_reports?: boolean | null;
          reason_if_not_booked?: string | null;
          time_to_first_response_minutes?: number | null;
          confusion_reason?: string | null;
          source_channel?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["inquiries"]["Insert"]>;
        Relationships: [];
      };
      pre_visit_forms: {
        Row: {
          id: string;
          inquiry_id: string | null;
          clinic_id: string | null;
          concern: string;
          duration: string;
          worry: string | null;
          has_reports: boolean;
          preferred_language_id: string | null;
          preferred_language_text: string;
          patient_for: string | null;
          urgency: Database["public"]["Enums"]["urgency_level"] | null;
          insurance_provider_text: string | null;
          budget_preference: string | null;
          accessibility_needs: string | null;
          summary: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          inquiry_id?: string | null;
          clinic_id?: string | null;
          concern: string;
          duration: string;
          worry?: string | null;
          has_reports?: boolean;
          preferred_language_id?: string | null;
          preferred_language_text?: string;
          patient_for?: string | null;
          urgency?: Database["public"]["Enums"]["urgency_level"] | null;
          insurance_provider_text?: string | null;
          budget_preference?: string | null;
          accessibility_needs?: string | null;
          summary: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["pre_visit_forms"]["Insert"]>;
        Relationships: [];
      };
      inquiry_status_events: {
        Row: {
          id: string;
          inquiry_id: string;
          status: Database["public"]["Enums"]["inquiry_status"];
          note: string | null;
          actor_admin_user_id: string | null;
          source: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          inquiry_id: string;
          status: Database["public"]["Enums"]["inquiry_status"];
          note?: string | null;
          actor_admin_user_id?: string | null;
          source?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["inquiry_status_events"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      admin_role: "clinic_admin" | "ayati_admin";
      clinic_status: "draft" | "pending_review" | "approved" | "needs_updates" | "archived";
      inquiry_status: "new" | "contacted" | "booked" | "needs_more_info" | "not_suitable" | "closed";
      signal_value: "strong" | "good" | "developing" | "not_yet_set";
      urgency_level: "routine" | "soon" | "urgent";
    };
    CompositeTypes: Record<string, never>;
  };
};
