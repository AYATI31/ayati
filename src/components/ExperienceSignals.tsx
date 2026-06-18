import { CheckCircle2, CircleAlert, Sparkles } from "lucide-react";
import type { ExperienceSignal } from "@/types";

const iconMap = {
  Strong: CheckCircle2,
  Good: Sparkles,
  Developing: CircleAlert,
  "Not yet set": CircleAlert
};

export function ExperienceSignals({ signals }: { signals: ExperienceSignal[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {signals.map((signal) => {
        const Icon = iconMap[signal.value];
        return (
          <div key={signal.label} className="rounded-md border border-ayati-line bg-white p-4">
            <div className="flex items-start gap-3">
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-ayati-teal" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-ayati-ink">{signal.label}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-normal text-ayati-coral">{signal.value}</p>
                <p className="mt-2 text-sm leading-6 text-ayati-muted">{signal.note}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
