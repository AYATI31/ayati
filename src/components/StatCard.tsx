import type { ComponentType, SVGProps } from "react";

export function StatCard({
  label,
  value,
  icon: Icon,
  helper
}: {
  label: string;
  value: string | number;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  helper?: string;
}) {
  return (
    <div className="rounded-md border border-ayati-line bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-ayati-muted">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-normal text-ayati-ink">{value}</p>
          {helper ? <p className="mt-2 text-sm text-ayati-muted">{helper}</p> : null}
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-ayati-mint text-ayati-teal">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}
