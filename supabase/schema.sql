create extension if not exists "pgcrypto";

create table if not exists public.couples (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  partner_one_name text not null,
  partner_two_name text not null,
  started_on date not null,
  hero_message text,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.couple_members (
  couple_id uuid not null references public.couples (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  role text not null default 'member',
  primary key (couple_id, profile_id)
);

create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples (id) on delete cascade,
  title text not null,
  city text not null,
  label text,
  note text,
  latitude double precision,
  longitude double precision,
  visited_on date not null,
  created_at timestamptz not null default now()
);

create table if not exists public.moments (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples (id) on delete cascade,
  author_id uuid references public.profiles (id) on delete set null,
  place_id uuid references public.places (id) on delete set null,
  title text not null,
  summary text,
  body text,
  mood text,
  weather text,
  happened_at date not null,
  is_private boolean not null default true,
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.moment_photos (
  id uuid primary key default gen_random_uuid(),
  moment_id uuid not null references public.moments (id) on delete cascade,
  file_path text not null,
  caption text,
  taken_at timestamptz default now(),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.anniversaries (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples (id) on delete cascade,
  title text not null,
  description text,
  event_date date not null,
  recurring boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.capsules (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples (id) on delete cascade,
  author_id uuid references public.profiles (id) on delete set null,
  title text not null,
  preview text,
  message text,
  unlock_at timestamptz not null,
  status text not null default 'locked' check (status in ('locked', 'opened')),
  created_at timestamptz not null default now()
);

create table if not exists public.wishlists (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples (id) on delete cascade,
  title text not null,
  detail text,
  city text,
  status text not null default 'idea' check (status in ('idea', 'planned', 'done')),
  target_date date,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.share_links (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples (id) on delete cascade,
  slug text unique not null,
  title text not null,
  description text,
  resource_type text not null default 'gallery',
  resource_id uuid,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.couple_invites (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples (id) on delete cascade,
  invited_by uuid not null references public.profiles (id) on delete cascade,
  token text unique not null,
  note text,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.couples enable row level security;
alter table public.profiles enable row level security;
alter table public.couple_members enable row level security;
alter table public.places enable row level security;
alter table public.moments enable row level security;
alter table public.moment_photos enable row level security;
alter table public.anniversaries enable row level security;
alter table public.capsules enable row level security;
alter table public.wishlists enable row level security;
alter table public.share_links enable row level security;
alter table public.couple_invites enable row level security;

insert into storage.buckets (id, name, public)
values ('moment-photos', 'moment-photos', false)
on conflict (id) do nothing;

create policy "members can read their couples"
on public.couples for select
using (
  exists (
    select 1
    from public.couple_members cm
    where cm.couple_id = couples.id
      and cm.profile_id = auth.uid()
  )
);

create policy "authenticated users can read couples for onboarding"
on public.couples for select
to authenticated
using (true);

create policy "members can read their profiles"
on public.profiles for select
using (id = auth.uid());

create policy "members can manage their member rows"
on public.couple_members for select
using (profile_id = auth.uid());

create policy "members can insert their member rows"
on public.couple_members for insert
with check (profile_id = auth.uid());

create policy "members can upsert their profiles"
on public.profiles for insert
with check (id = auth.uid());

create policy "members can update their profiles"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

create policy "members can read related places"
on public.places for select
using (
  exists (
    select 1
    from public.couple_members cm
    where cm.couple_id = places.couple_id
      and cm.profile_id = auth.uid()
  )
);

create policy "members can insert related places"
on public.places for insert
with check (
  exists (
    select 1
    from public.couple_members cm
    where cm.couple_id = places.couple_id
      and cm.profile_id = auth.uid()
  )
);

create policy "members can read related moments"
on public.moments for select
using (
  exists (
    select 1
    from public.couple_members cm
    where cm.couple_id = moments.couple_id
      and cm.profile_id = auth.uid()
  )
);

create policy "members can insert related moments"
on public.moments for insert
with check (
  exists (
    select 1
    from public.couple_members cm
    where cm.couple_id = moments.couple_id
      and cm.profile_id = auth.uid()
  )
);

create policy "members can read related anniversaries"
on public.anniversaries for select
using (
  exists (
    select 1
    from public.couple_members cm
    where cm.couple_id = anniversaries.couple_id
      and cm.profile_id = auth.uid()
  )
);

create policy "members can insert related anniversaries"
on public.anniversaries for insert
with check (
  exists (
    select 1
    from public.couple_members cm
    where cm.couple_id = anniversaries.couple_id
      and cm.profile_id = auth.uid()
  )
);

create policy "members can read related capsules"
on public.capsules for select
using (
  exists (
    select 1
    from public.couple_members cm
    where cm.couple_id = capsules.couple_id
      and cm.profile_id = auth.uid()
  )
);

create policy "members can insert related capsules"
on public.capsules for insert
with check (
  exists (
    select 1
    from public.couple_members cm
    where cm.couple_id = capsules.couple_id
      and cm.profile_id = auth.uid()
  )
);

create policy "members can read related wishlists"
on public.wishlists for select
using (
  exists (
    select 1
    from public.couple_members cm
    where cm.couple_id = wishlists.couple_id
      and cm.profile_id = auth.uid()
  )
);

create policy "members can insert related wishlists"
on public.wishlists for insert
with check (
  exists (
    select 1
    from public.couple_members cm
    where cm.couple_id = wishlists.couple_id
      and cm.profile_id = auth.uid()
  )
);

create policy "members can read related photos"
on public.moment_photos for select
using (
  exists (
    select 1
    from public.moments m
    join public.couple_members cm on cm.couple_id = m.couple_id
    where m.id = moment_photos.moment_id
      and cm.profile_id = auth.uid()
  )
);

create policy "members can insert related photos"
on public.moment_photos for insert
with check (
  exists (
    select 1
    from public.moments m
    join public.couple_members cm on cm.couple_id = m.couple_id
    where m.id = moment_photos.moment_id
      and cm.profile_id = auth.uid()
  )
);

create policy "share links are public"
on public.share_links for select
using (expires_at is null or expires_at > now());

create policy "members can insert share links"
on public.share_links for insert
with check (
  exists (
    select 1
    from public.couple_members cm
    where cm.couple_id = share_links.couple_id
      and cm.profile_id = auth.uid()
  )
);

create policy "members can read their invites"
on public.couple_invites for select
using (
  exists (
    select 1
    from public.couple_members cm
    where cm.couple_id = couple_invites.couple_id
      and cm.profile_id = auth.uid()
  )
);

create policy "members can create invites"
on public.couple_invites for insert
with check (
  exists (
    select 1
    from public.couple_members cm
    where cm.couple_id = couple_invites.couple_id
      and cm.profile_id = auth.uid()
  )
);

create policy "authenticated users can read active invites by token"
on public.couple_invites for select
to authenticated
using (
  accepted_at is null
  and expires_at > now()
);

create policy "authenticated users can accept invites"
on public.couple_invites for update
to authenticated
using (
  accepted_at is null
  and expires_at > now()
)
with check (
  accepted_at is not null
);

create policy "authenticated users can upload private photos"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'moment-photos'
);

create policy "authenticated users can read private photos"
on storage.objects for select
to authenticated
using (
  bucket_id = 'moment-photos'
);

insert into public.couples (id, slug, title, partner_one_name, partner_two_name, started_on, hero_message)
values (
  '7b02e9dd-4b9a-431d-b470-3e6a399b0d7b',
  'heart-archive',
  '心动存档',
  '你',
  'TA',
  '2025-02-14',
  '这里存放一起走过的路、写过的小纸条和所有值得纪念的普通日子。'
)
on conflict (slug) do nothing;

insert into public.places (couple_id, title, city, label, note, latitude, longitude, visited_on)
values
  ('7b02e9dd-4b9a-431d-b470-3e6a399b0d7b', '第一次见面的咖啡馆', '上海', '第一次见面', '桌边的灯有点暗，但你笑起来的时候，一下就记住了这一天。', 31.214, 121.465, '2025-02-14'),
  ('7b02e9dd-4b9a-431d-b470-3e6a399b0d7b', '看日落的堤岸', '厦门', '海边散步', '后来每次提起旅行，都会先想到这里的风。', 24.441, 118.112, '2026-04-06')
on conflict do nothing;

insert into public.anniversaries (couple_id, title, description, event_date, recurring)
values
  ('7b02e9dd-4b9a-431d-b470-3e6a399b0d7b', '恋爱纪念日', '每年都要认真庆祝的那一天。', '2026-05-06', true),
  ('7b02e9dd-4b9a-431d-b470-3e6a399b0d7b', '第一次一起旅行', '把第一次远行的路线和照片都放在这里。', '2026-07-12', true)
on conflict do nothing;
