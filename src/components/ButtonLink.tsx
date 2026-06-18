import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { clsx } from "clsx";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  variant?: "primary" | "secondary" | "quiet";
  className?: string;
};

export function ButtonLink({ href, children, icon: Icon, variant = "primary", className }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={clsx(
        "focus-ring inline-flex items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-semibold transition",
        variant === "primary" && "bg-ayati-teal text-white hover:bg-[#0B5552]",
        variant === "secondary" && "border border-ayati-line bg-white text-ayati-ink hover:border-ayati-teal",
        variant === "quiet" && "text-ayati-teal hover:bg-ayati-mint",
        className
      )}
    >
      {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
      {children}
    </Link>
  );
}
