import { clsx } from "clsx";
import type { InquiryStatus } from "@/types";

const statusTone: Record<InquiryStatus, string> = {
  New: "bg-ayati-mint text-ayati-teal",
  Contacted: "bg-blue-50 text-ayati-blue",
  Booked: "bg-emerald-50 text-emerald-700",
  "Needs more info": "bg-orange-50 text-orange-700",
  "Not suitable": "bg-rose-50 text-rose-700",
  Closed: "bg-ayati-paper text-ayati-muted"
};

export function StatusPill({ status }: { status: InquiryStatus }) {
  return <span className={clsx("rounded-md px-2.5 py-1 text-xs font-semibold", statusTone[status])}>{status}</span>;
}
