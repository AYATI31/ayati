import { NextResponse } from "next/server";
import { createSupabaseInquiryWithPreVisit } from "@/lib/supabase/inquiries";
import type { PreVisitSubmission } from "@/types";

function isValidSubmission(value: unknown): value is PreVisitSubmission {
  if (!value || typeof value !== "object") {
    return false;
  }

  const submission = value as Record<string, unknown>;
  const requiredStrings = ["reference", "concern", "duration", "preferredLanguage", "name", "contact", "summary", "createdAt"];

  return (
    requiredStrings.every((key) => typeof submission[key] === "string" && Boolean((submission[key] as string).trim())) &&
    typeof submission.hasReports === "boolean" &&
    (submission.urgency === "Routine" || submission.urgency === "Soon" || submission.urgency === "Urgent")
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!isValidSubmission(body)) {
      return NextResponse.json({ error: "Invalid inquiry payload." }, { status: 400 });
    }

    const result = await createSupabaseInquiryWithPreVisit(body);

    return NextResponse.json(result, { status: result.persisted ? 201 : 202 });
  } catch (error) {
    console.error("Unable to persist inquiry", error);
    return NextResponse.json({ error: "Unable to persist inquiry." }, { status: 500 });
  }
}
