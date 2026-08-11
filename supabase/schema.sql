-- Backend opcional. La aplicación funciona íntegramente con LocalStorage sin estas tablas.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  edition text not null default 'users' check (edition in ('owner','users')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.app_snapshots (
  user_id uuid primary key references auth.users(id) on delete cascade,
  snapshot jsonb not null,
  version integer not null default 1,
  updated_at timestamptz not null default now()
);
-- Sólo funciones con privilegios de servidor deben modificar entitlements.
create table if not exists public.premium_entitlements (
  user_id uuid primary key references auth.users(id) on delete cascade,
  status text not null check (status in ('active','inactive','trialing','past_due')),
  source text not null,
  valid_until timestamptz,
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
alter table public.app_snapshots enable row level security;
alter table public.premium_entitlements enable row level security;
create policy "read own profile" on public.profiles for select using (auth.uid()=id);
create policy "update own safe profile" on public.profiles for update using (auth.uid()=id) with check (auth.uid()=id);
create policy "insert own profile" on public.profiles for insert with check (auth.uid()=id and edition='users');
create policy "read own snapshot" on public.app_snapshots for select using (auth.uid()=user_id);
create policy "insert own snapshot" on public.app_snapshots for insert with check (auth.uid()=user_id);
create policy "update own snapshot" on public.app_snapshots for update using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "read own entitlement" on public.premium_entitlements for select using (auth.uid()=user_id);
-- No INSERT/UPDATE/DELETE policy for premium_entitlements: client writes are denied.
revoke insert, update, delete on public.premium_entitlements from authenticated, anon;
