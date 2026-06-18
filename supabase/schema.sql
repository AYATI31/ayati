-- AYATI Healthcare Navigation Supabase baseline schema.
-- Product boundary: navigation, discovery, inquiry handling, and visit preparation only.
-- Do not store diagnosis, treatment notes, prescriptions, lab reports, or clinical records here.

create extension if not exists "pgcrypto";

create type public.admin_role as enum ('clinic_admin', 'ayati_admin');
create type public.clinic_status as enum ('draft', 'pending_review', 'approved', 'needs_updates', 'archived');
create type public.inquiry_status as enum ('new', 'contacted', 'booked', 'needs_more_info', 'not_suitable', 'closed');
create type public.signal_value as enum ('strong', 'good', 'developing', 'not_yet_set');
create type public.urgency_level as enum ('routine', 'soon', 'urgent');

create table public.clinics (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  status public.clinic_status not null default 'pending_review',
  profile_controlled boolean not null default true,
  best_for_tag text,
  image_url text,
  image_alt text,
  description text not null,
  emirate text not null,
  area text not null,
  address text,
  phone text,
  whatsapp text,
  email text,
  website text,
  helps_with text[] not null default '{}',
  payment_notes text,
  price_range text,
  accessibility_notes text[] not null default '{}',
  preparation_notes text[] not null default '{}',
  suitable_for text[] not null default '{}',
  claims_to_verify text[] not null default '{}',
  missing_information text[] not null default '{}',
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.specialties (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table public.clinic_specialties (
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  specialty_id uuid not null references public.specialties(id) on delete restrict,
  primary key (clinic_id, specialty_id)
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  name text not null,
  description text not null,
  price_from integer,
  price_to integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.doctors (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  name text not null,
  title text not null,
  focus_areas text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.languages (
  id uuid primary key default gen_random_uuid(),
  code text,
  name text not null unique,
  created_at timestamptz not null default now()
);

create table public.clinic_languages (
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  language_id uuid not null references public.languages(id) on delete restrict,
  primary key (clinic_id, language_id)
);

create table public.doctor_languages (
  doctor_id uuid not null references public.doctors(id) on delete cascade,
  language_id uuid not null references public.languages(id) on delete restrict,
  primary key (doctor_id, language_id)
);

create table public.insurance_providers (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table public.clinic_insurance_providers (
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  insurance_provider_id uuid not null references public.insurance_providers(id) on delete restrict,
  primary key (clinic_id, insurance_provider_id)
);

create table public.operating_hours (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  label text not null,
  value text not null,
  sort_order integer not null default 0
);

create table public.experience_signals (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  label text not null,
  value public.signal_value not null default 'not_yet_set',
  note text not null,
  controlled_by uuid,
  updated_at timestamptz not null default now(),
  unique (clinic_id, label)
);

create table public.admin_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  name text not null,
  email text not null unique,
  role public.admin_role not null,
  clinic_id uuid references public.clinics(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  public_reference text not null unique,
  clinic_id uuid references public.clinics(id) on delete set null,
  patient_name text not null,
  contact_value text not null,
  patient_for text,
  preferred_language_id uuid references public.languages(id) on delete set null,
  preferred_language_text text not null default 'English',
  service_interest text not null,
  urgency public.urgency_level not null default 'routine',
  status public.inquiry_status not null default 'new',
  summary text not null,
  insurance_provider_id uuid references public.insurance_providers(id) on delete set null,
  insurance_provider_text text,
  budget_preference text,
  accessibility_needs text,
  has_reports boolean,
  reason_if_not_booked text,
  time_to_first_response_minutes integer,
  confusion_reason text,
  source_channel text not null default 'web',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.pre_visit_forms (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid unique references public.inquiries(id) on delete set null,
  clinic_id uuid references public.clinics(id) on delete set null,
  concern text not null,
  duration text not null,
  worry text,
  has_reports boolean not null default false,
  preferred_language_id uuid references public.languages(id) on delete set null,
  preferred_language_text text not null default 'English',
  patient_for text,
  urgency public.urgency_level,
  insurance_provider_text text,
  budget_preference text,
  accessibility_needs text,
  summary text not null,
  created_at timestamptz not null default now()
);

create table public.inquiry_status_events (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references public.inquiries(id) on delete cascade,
  status public.inquiry_status not null,
  note text,
  actor_admin_user_id uuid references public.admin_users(id) on delete set null,
  source text not null default 'clinic_admin_dashboard',
  created_at timestamptz not null default now()
);

create index clinics_status_idx on public.clinics(status);
create index clinics_location_idx on public.clinics(emirate, area);
create index services_clinic_idx on public.services(clinic_id);
create index doctors_clinic_idx on public.doctors(clinic_id);
create index inquiries_reference_idx on public.inquiries(public_reference);
create index inquiries_status_idx on public.inquiries(status);
create index inquiries_clinic_idx on public.inquiries(clinic_id);
create index inquiries_created_at_idx on public.inquiries(created_at desc);
create index pre_visit_forms_clinic_idx on public.pre_visit_forms(clinic_id);
create index inquiry_status_events_inquiry_idx on public.inquiry_status_events(inquiry_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger clinics_set_updated_at
before update on public.clinics
for each row execute function public.set_updated_at();

create trigger services_set_updated_at
before update on public.services
for each row execute function public.set_updated_at();

create trigger doctors_set_updated_at
before update on public.doctors
for each row execute function public.set_updated_at();

create trigger inquiries_set_updated_at
before update on public.inquiries
for each row execute function public.set_updated_at();

create or replace function public.is_ayati_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where auth_user_id = auth.uid()
      and role = 'ayati_admin'
  );
$$;

create or replace function public.is_clinic_admin(target_clinic_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where auth_user_id = auth.uid()
      and role = 'clinic_admin'
      and clinic_id = target_clinic_id
  );
$$;

create or replace function public.is_public_clinic(target_clinic_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.clinics
    where id = target_clinic_id
      and status = 'approved'
  );
$$;

alter table public.clinics enable row level security;
alter table public.specialties enable row level security;
alter table public.clinic_specialties enable row level security;
alter table public.services enable row level security;
alter table public.doctors enable row level security;
alter table public.languages enable row level security;
alter table public.clinic_languages enable row level security;
alter table public.doctor_languages enable row level security;
alter table public.insurance_providers enable row level security;
alter table public.clinic_insurance_providers enable row level security;
alter table public.operating_hours enable row level security;
alter table public.experience_signals enable row level security;
alter table public.admin_users enable row level security;
alter table public.inquiries enable row level security;
alter table public.pre_visit_forms enable row level security;
alter table public.inquiry_status_events enable row level security;

create policy "Approved clinics are publicly readable"
on public.clinics for select
using (status = 'approved' or public.is_ayati_admin() or public.is_clinic_admin(id));

create policy "AYATI admins manage clinics"
on public.clinics for all
using (public.is_ayati_admin())
with check (public.is_ayati_admin());

create policy "Clinic admins update assigned clinic"
on public.clinics for update
using (public.is_clinic_admin(id))
with check (public.is_clinic_admin(id));

create policy "Public reference tables are readable"
on public.specialties for select
using (true);

create policy "Public languages are readable"
on public.languages for select
using (true);

create policy "Public insurance providers are readable"
on public.insurance_providers for select
using (true);

create policy "AYATI admins manage specialties"
on public.specialties for all
using (public.is_ayati_admin())
with check (public.is_ayati_admin());

create policy "AYATI admins manage languages"
on public.languages for all
using (public.is_ayati_admin())
with check (public.is_ayati_admin());

create policy "AYATI admins manage insurance providers"
on public.insurance_providers for all
using (public.is_ayati_admin())
with check (public.is_ayati_admin());

create policy "Clinic public joins are readable"
on public.clinic_specialties for select
using (public.is_public_clinic(clinic_id) or public.is_ayati_admin() or public.is_clinic_admin(clinic_id));

create policy "Clinic languages are readable"
on public.clinic_languages for select
using (public.is_public_clinic(clinic_id) or public.is_ayati_admin() or public.is_clinic_admin(clinic_id));

create policy "Doctor languages are readable"
on public.doctor_languages for select
using (
  exists (
    select 1 from public.doctors
    where doctors.id = doctor_languages.doctor_id
      and (public.is_public_clinic(doctors.clinic_id) or public.is_ayati_admin() or public.is_clinic_admin(doctors.clinic_id))
  )
);

create policy "Clinic insurance joins are readable"
on public.clinic_insurance_providers for select
using (public.is_public_clinic(clinic_id) or public.is_ayati_admin() or public.is_clinic_admin(clinic_id));

create policy "Clinic services are readable"
on public.services for select
using (public.is_public_clinic(clinic_id) or public.is_ayati_admin() or public.is_clinic_admin(clinic_id));

create policy "Clinic doctors are readable"
on public.doctors for select
using (public.is_public_clinic(clinic_id) or public.is_ayati_admin() or public.is_clinic_admin(clinic_id));

create policy "Clinic hours are readable"
on public.operating_hours for select
using (public.is_public_clinic(clinic_id) or public.is_ayati_admin() or public.is_clinic_admin(clinic_id));

create policy "Experience signals are readable"
on public.experience_signals for select
using (public.is_public_clinic(clinic_id) or public.is_ayati_admin() or public.is_clinic_admin(clinic_id));

create policy "AYATI admins manage clinic details"
on public.services for all
using (public.is_ayati_admin())
with check (public.is_ayati_admin());

create policy "Clinic admins manage own services"
on public.services for all
using (public.is_clinic_admin(clinic_id))
with check (public.is_clinic_admin(clinic_id));

create policy "AYATI admins manage doctors"
on public.doctors for all
using (public.is_ayati_admin())
with check (public.is_ayati_admin());

create policy "Clinic admins manage own doctors"
on public.doctors for all
using (public.is_clinic_admin(clinic_id))
with check (public.is_clinic_admin(clinic_id));

create policy "AYATI admins manage admin users"
on public.admin_users for all
using (public.is_ayati_admin())
with check (public.is_ayati_admin());

create policy "Admins can read own admin profile"
on public.admin_users for select
using (auth_user_id = auth.uid());

create policy "AYATI admins manage inquiries"
on public.inquiries for all
using (public.is_ayati_admin())
with check (public.is_ayati_admin());

create policy "Clinic admins manage assigned inquiries"
on public.inquiries for all
using (clinic_id is not null and public.is_clinic_admin(clinic_id))
with check (clinic_id is not null and public.is_clinic_admin(clinic_id));

create policy "AYATI admins manage pre visit forms"
on public.pre_visit_forms for all
using (public.is_ayati_admin())
with check (public.is_ayati_admin());

create policy "Clinic admins read assigned pre visit forms"
on public.pre_visit_forms for select
using (clinic_id is not null and public.is_clinic_admin(clinic_id));

create policy "AYATI admins read inquiry status events"
on public.inquiry_status_events for select
using (public.is_ayati_admin());

create policy "Clinic admins read assigned inquiry status events"
on public.inquiry_status_events for select
using (
  exists (
    select 1 from public.inquiries
    where inquiries.id = inquiry_status_events.inquiry_id
      and inquiries.clinic_id is not null
      and public.is_clinic_admin(inquiries.clinic_id)
  )
);
