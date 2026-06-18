-- Safe reference data for a new AYATI Supabase project.
-- This intentionally avoids fake clinic or patient records.

insert into public.languages (code, name)
values
  ('en', 'English'),
  ('ar', 'Arabic'),
  ('hi', 'Hindi'),
  ('ur', 'Urdu'),
  ('tl', 'Tagalog'),
  ('ml', 'Malayalam')
on conflict (name) do update set code = excluded.code;

insert into public.insurance_providers (name)
values
  ('Self-pay'),
  ('Cash/self-pay'),
  ('Daman'),
  ('Thiqa'),
  ('Neuron'),
  ('ADNIC'),
  ('Nextcare'),
  ('Oman Insurance'),
  ('NAS')
on conflict (name) do nothing;
