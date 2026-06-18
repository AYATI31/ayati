# AYATI Healthcare Navigation

AYATI is a UAE healthcare navigation platform that helps patients, caregivers, and clinics coordinate care journeys with clear next steps.

The product boundary is deliberate: this is not an EMR, does not store clinical records, does not provide medical advice, and does not rank clinics by medical superiority. It is a healthcare concierge interface for navigation, coordination, and preparation.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Local seed data and browser-local demo storage for v1
- Supabase/PostgreSQL-ready schema in `supabase/schema.sql`
- Supabase client and server persistence adapter for inquiries

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

In the Codex in-app browser, use the host-bound dev server when `localhost` is unreliable:

```bash
npm run dev:host
```

Then open the Network URL printed by Next.js, for example `http://10.10.10.23:3000`.

Useful checks:

```bash
npm run typecheck
npm run build
```

## Folder Structure

```text
src/app/                 Next.js routes and pages
src/components/          Reusable UI and feature components
src/data/seed.ts         Mock clinic, inquiry, admin, and analytics data
src/lib/                 Filtering, recommendation, CSV, and constants
src/types/               Shared TypeScript data model
supabase/schema.sql      PostgreSQL-ready production schema
public/images/           Project visual assets
```

## Pages Included

- Home
- Patient App
- Caregiver App
- Search / Discover Clinics as supporting clinic profile search
- Clinic Profile
- Help Me Choose
- Pre-Visit Form
- Patient Inquiry Confirmation
- Clinic Admin Dashboard with inquiry inbox, patient pipeline, appointments, follow-ups, referrals, team notes, and analytics
- AYATI Admin Dashboard
- Add/Edit Clinic Form
- About AYATI
- Privacy / Disclaimer
- Login placeholder

## Adding Clinics Manually in v1

Until Supabase is connected, edit `src/data/seed.ts`.

1. Add a new object to the `clinics` array.
2. Use a unique `id` and URL-safe `slug`.
3. Fill `specialties`, `services`, `doctors`, `languages`, `insurance`, `operatingHours`, and `accessibilityNotes`.
4. Set `status` to `Pending review` until AYATI has checked the profile.
5. Add any missing fields to `missingInformation` so the AYATI admin dashboard can flag them.
6. Add five `experienceSignals`; these are admin-controlled and are not public reviews.

The Add/Edit Clinic screen saves browser-local drafts under `ayati_clinic_drafts`, useful for founder iteration before a backend exists. Patient pre-visit submissions and inquiry status updates use browser-local demo storage until Supabase is connected.

## Future Supabase Integration

The first Supabase step is now wired for appointment inquiry persistence while keeping local demo storage as a fallback.

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Run `supabase/seed-reference.sql` to add language and insurance lookup values.
4. Add the keys to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
```

Legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are still supported during migration.

5. Restart the Next.js dev server.
6. Submit a pre-visit inquiry from `/pre-visit`.
7. Change the inquiry status in `/clinic-admin`.

Current persistence behavior:

- `POST /api/inquiries` stores an inquiry and pre-visit form when Supabase is configured.
- `PATCH /api/inquiries/[reference]/status` stores clinic dashboard status updates.
- If Supabase keys are missing, both routes return a non-breaking fallback response and browser-local demo storage remains active.

Next backend steps:

1. Replace patient-facing clinic reads from `src/data/seed.ts` with Supabase read functions.
2. Add Supabase Auth and map users to `admin_users`.
3. Use RLS so public users read approved clinic profiles only, clinic admins manage only their assigned clinic, and AYATI admins manage all profiles, signals, inquiries, and exports.
4. Add rate limiting and bot protection before accepting real public inquiries.
5. Store pre-visit summaries and clinic notes as operational context only, not clinical records.

## Multilingual Readiness

The first UI is English. The data model already captures languages spoken, and the content structure is ready for:

- Arabic
- Hindi/Urdu

Recommended next step: add a translation dictionary layer for route copy and clinic profile fields before adding automated translation.

## Future Features Not Built Yet

- verified patient feedback
- appointment booking integration
- WhatsApp automation
- clinic continuity intelligence dashboard
- medical tourism patient journey
- production caregiver consent and family member access
- report explanation layer
- multilingual AI assistant

## Generated Image

The homepage hero image was generated for this project and copied into `public/images/ayati-discover-hero.png`.
