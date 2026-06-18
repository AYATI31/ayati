import { Info } from "lucide-react";
import { publicDisclaimer } from "@/lib/constants";

export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <aside className="rounded-md border border-ayati-line bg-white p-4 text-sm text-ayati-muted">
      <div className="flex gap-3">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-ayati-blue" aria-hidden="true" />
        <p className={compact ? "leading-6" : "leading-7"}>{publicDisclaimer}</p>
      </div>
    </aside>
  );
}
