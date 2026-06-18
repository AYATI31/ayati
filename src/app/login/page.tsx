import type { Metadata } from "next";
import { LockKeyhole, UserRoundCog } from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";

export const metadata: Metadata = {
  title: "Login Placeholder",
  description: "Placeholder login page for clinic admins and AYATI admins."
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="rounded-md border border-ayati-line bg-white p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-ayati-mint text-ayati-teal">
          <LockKeyhole className="h-6 w-6" aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-3xl font-semibold text-ayati-ink">Login placeholder</h1>
        <p className="mt-3 text-base leading-7 text-ayati-muted">
          Authentication is intentionally mocked in this first version. Supabase Auth can later separate clinic admins from AYATI admins with role-based access.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <ButtonLink href="/clinic-admin" icon={UserRoundCog} variant="secondary">
            Clinic admin
          </ButtonLink>
          <ButtonLink href="/ayati-admin" icon={UserRoundCog}>
            AYATI admin
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
