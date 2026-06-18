import { NextResponse } from "next/server";
import { updateSupabaseInquiryStatus } from "@/lib/supabase/inquiries";
import type { InquiryStatus } from "@/types";

const validStatuses: InquiryStatus[] = ["New", "Contacted", "Booked", "Needs more info", "Not suitable", "Closed"];

function isInquiryStatus(value: unknown): value is InquiryStatus {
  return typeof value === "string" && validStatuses.includes(value as InquiryStatus);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ reference: string }> }) {
  try {
    const { reference } = await params;
    const body = await request.json();

    if (!reference || !isInquiryStatus(body?.status)) {
      return NextResponse.json({ error: "Invalid status update payload." }, { status: 400 });
    }

    const result = await updateSupabaseInquiryStatus(reference, body.status);

    return NextResponse.json(result, { status: result.persisted ? 200 : 202 });
  } catch (error) {
    console.error("Unable to update inquiry status", error);
    return NextResponse.json({ error: "Unable to update inquiry status." }, { status: 500 });
  }
}
