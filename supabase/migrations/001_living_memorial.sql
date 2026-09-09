-- The Living Memorial / Operation Sweetpea
-- Apply through the Supabase SQL editor or CLI, then add the first authenticated
-- administrator to public.admin_users.

create extension if not exists pgcrypto;

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create or replace function public.is_memorial_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = auth.uid() and active = true
  );
$$;

create table public.site_settings (
  id uuid primary key default gen_random_uuid(),
  site_title text not null default 'The Living Memorial',
  site_description text not null default 'A living place of remembrance.',
  logo_url text,
  favicon_url text,
  default_share_image_url text,
  contact_email text,
  phone text,
  address text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  directions_url text,
  copyright_text text,
  is_public boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.homepage_content (
  id uuid primary key default gen_random_uuid(),
  hero_eyebrow text,
  hero_heading text not null,
  hero_intro text,
  hero_quote text,
  hero_image_id uuid,
  hero_image_position text not null default 'center',
  cta_label text,
  cta_url text,
  cta_enabled boolean not null default true,
  intro_heading text,
  intro_body text,
  intro_image_id uuid,
  shop_promo_enabled boolean not null default true,
  published boolean not null default false,
  updated_at timestamptz not null default now()
);

create table public.about_content (
  id uuid primary key default gen_random_uuid(),
  page_heading text not null,
  page_intro text,
  story_heading text,
  story_body text,
  story_quote text,
  story_image_id uuid,
  published boolean not null default false,
  updated_at timestamptz not null default now()
);

create table public.media (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  public_url text not null,
  filename text not null,
  mime_type text,
  width integer,
  height integer,
  alt_text text,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.homepage_content
  add constraint homepage_hero_image_fk foreign key (hero_image_id) references public.media(id) on delete set null,
  add constraint homepage_intro_image_fk foreign key (intro_image_id) references public.media(id) on delete set null;
alter table public.about_content
  add constraint about_story_image_fk foreign key (story_image_id) references public.media(id) on delete set null;

create table public.memorial_features (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subtitle text,
  description text,
  image_id uuid references public.media(id) on delete set null,
  installed_on date,
  installed_label text,
  additional_image_ids uuid[] not null default '{}',
  display_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.owners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  biography text,
  image_id uuid references public.media(id) on delete set null,
  display_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subtitle text,
  description text,
  start_date date not null,
  end_date date,
  start_time time,
  end_time time,
  image_id uuid references public.media(id) on delete set null,
  location text,
  link_url text,
  display_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint event_date_range check (end_date is null or end_date >= start_date)
);

create index events_public_dates_idx on public.events (published, start_date, end_date);

create table public.gallery_albums (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  cover_image_id uuid references public.media(id) on delete set null,
  display_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  media_id uuid not null references public.media(id) on delete cascade,
  album_id uuid references public.gallery_albums(id) on delete set null,
  title text,
  caption text,
  description text,
  date_taken date,
  alt_text text not null default '',
  display_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index gallery_images_album_order_idx on public.gallery_images (album_id, display_order);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subtitle text,
  description text,
  main_image_id uuid references public.media(id) on delete set null,
  price_amount numeric(10,2),
  price_label text,
  availability text,
  button_label text not null default 'Enquire',
  purchase_url text,
  display_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  media_id uuid not null references public.media(id) on delete cascade,
  display_order integer not null default 0,
  unique(product_id, media_id)
);

create table public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  label text,
  url text not null,
  icon text,
  display_order integer not null default 0,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'site_settings', 'homepage_content', 'about_content', 'media',
    'memorial_features', 'owners', 'events', 'gallery_albums',
    'gallery_images', 'products', 'social_links'
  ]
  loop
    execute format(
      'create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()',
      table_name, table_name
    );
  end loop;
end;
$$;

alter table public.admin_users enable row level security;
alter table public.site_settings enable row level security;
alter table public.homepage_content enable row level security;
alter table public.about_content enable row level security;
alter table public.media enable row level security;
alter table public.memorial_features enable row level security;
alter table public.owners enable row level security;
alter table public.events enable row level security;
alter table public.gallery_albums enable row level security;
alter table public.gallery_images enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.social_links enable row level security;
alter table public.contact_messages enable row level security;

create policy "Admins can view their own access" on public.admin_users
  for select to authenticated using (user_id = auth.uid());

create policy "Public can read site settings" on public.site_settings
  for select to anon, authenticated using (is_public = true);
create policy "Public can read published homepage" on public.homepage_content
  for select to anon, authenticated using (published = true);
create policy "Public can read published about content" on public.about_content
  for select to anon, authenticated using (published = true);
create policy "Public can read media metadata" on public.media
  for select to anon, authenticated using (true);
create policy "Public can read published features" on public.memorial_features
  for select to anon, authenticated using (published = true);
create policy "Public can read published owners" on public.owners
  for select to anon, authenticated using (published = true);
create policy "Public can read published events" on public.events
  for select to anon, authenticated using (published = true);
create policy "Public can read published albums" on public.gallery_albums
  for select to anon, authenticated using (published = true);
create policy "Public can read published gallery images" on public.gallery_images
  for select to anon, authenticated using (published = true);
create policy "Public can read published products" on public.products
  for select to anon, authenticated using (published = true);
create policy "Public can read images for published products" on public.product_images
  for select to anon, authenticated using (
    exists (select 1 from public.products where products.id = product_id and products.published = true)
  );
create policy "Public can read enabled social links" on public.social_links
  for select to anon, authenticated using (enabled = true);

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'site_settings', 'homepage_content', 'about_content', 'media',
    'memorial_features', 'owners', 'events', 'gallery_albums',
    'gallery_images', 'products', 'product_images', 'social_links',
    'contact_messages'
  ]
  loop
    execute format(
      'create policy "Administrators manage %1$s" on public.%1$I for all to authenticated using (public.is_memorial_admin()) with check (public.is_memorial_admin())',
      table_name
    );
  end loop;
end;
$$;

create policy "Anyone can send a contact message" on public.contact_messages
  for insert to anon, authenticated
  with check (
    length(trim(name)) between 1 and 120
    and length(trim(email)) between 3 and 320
    and length(trim(message)) between 1 and 5000
  );

insert into storage.buckets (id, name, public)
values ('memorial-media', 'memorial-media', true)
on conflict (id) do update set public = excluded.public;

create policy "Public can view memorial media" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'memorial-media');
create policy "Administrators can upload memorial media" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'memorial-media' and public.is_memorial_admin());
create policy "Administrators can update memorial media" on storage.objects
  for update to authenticated
  using (bucket_id = 'memorial-media' and public.is_memorial_admin())
  with check (bucket_id = 'memorial-media' and public.is_memorial_admin());
create policy "Administrators can delete memorial media" on storage.objects
  for delete to authenticated
  using (bucket_id = 'memorial-media' and public.is_memorial_admin());
