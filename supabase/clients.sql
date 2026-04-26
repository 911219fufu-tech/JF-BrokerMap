create extension if not exists pgcrypto;

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  contact text,
  status text not null default 'new',
  budget_min integer,
  budget_max integer,
  areas text[] not null default '{}',
  move_in_date date,
  preferred_layout text,
  living_setup text not null default 'open_to_share',
  max_occupants integer not null default 2,
  accepts_living_room_for_self text not null default 'maybe',
  accepts_living_room_occupant text not null default 'maybe',
  client_gender text not null default 'unspecified',
  roommate_gender_preference text not null default 'any',
  occupation_type text,
  lifestyle_preference text not null default 'balanced',
  schedule_preference text not null default 'flexible',
  smoking_preference text not null default 'no',
  pet_preference text not null default 'open',
  must_haves text[] not null default '{}',
  custom_needs text,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.clients add column if not exists preferred_layout text;
alter table public.clients add column if not exists living_setup text not null default 'open_to_share';
alter table public.clients add column if not exists max_occupants integer not null default 2;
alter table public.clients add column if not exists accepts_living_room_for_self text not null default 'maybe';
alter table public.clients add column if not exists accepts_living_room_occupant text not null default 'maybe';

create index if not exists clients_user_id_idx on public.clients (user_id);
create index if not exists clients_updated_at_idx on public.clients (updated_at desc);

create or replace function public.set_current_timestamp_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_clients_updated_at on public.clients;

create trigger set_clients_updated_at
before update on public.clients
for each row
execute function public.set_current_timestamp_updated_at();

alter table public.clients enable row level security;

drop policy if exists "Clients are viewable by owner" on public.clients;
create policy "Clients are viewable by owner"
on public.clients
for select
to authenticated
using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "Clients can be inserted by owner" on public.clients;
create policy "Clients can be inserted by owner"
on public.clients
for insert
to authenticated
with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "Clients can be updated by owner" on public.clients;
create policy "Clients can be updated by owner"
on public.clients
for update
to authenticated
using (auth.uid() is not null and auth.uid() = user_id)
with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "Clients can be deleted by owner" on public.clients;
create policy "Clients can be deleted by owner"
on public.clients
for delete
to authenticated
using (auth.uid() is not null and auth.uid() = user_id);
