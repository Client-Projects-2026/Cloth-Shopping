-- Apply in the Supabase SQL editor before enabling the admin UI.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
revoke all on public.admin_users from anon, authenticated;
grant select on public.admin_users to authenticated;

create policy "Admins can read their own membership"
on public.admin_users for select to authenticated
using (user_id = (select auth.uid()));

create or replace function public.is_catalog_admin()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  );
$$;
revoke all on function public.is_catalog_admin() from public, anon;
grant execute on function public.is_catalog_admin() to authenticated;

create table if not exists public.catalog_items (
  id uuid primary key default gen_random_uuid(),
  audience text not null check (audience in ('Men', 'Women', 'Girls', 'Boys')),
  slot smallint not null check (slot between 1 and 5),
  status text not null default 'published' check (status in ('published', 'hidden')),
  name text not null check (char_length(name) between 2 and 100),
  garment_type text not null check (char_length(garment_type) between 2 and 60),
  description text not null check (char_length(description) between 10 and 500),
  color_hex text not null check (color_hex ~ '^#[0-9A-Fa-f]{6}$'),
  color_name text not null check (char_length(color_name) between 2 and 50),
  price_minor integer not null check (price_minor between 0 and 100000000),
  size_stock jsonb not null check (
    case when jsonb_typeof(size_stock) = 'array'
      then jsonb_array_length(size_stock) between 1 and 12
      else false end
  ),
  front_path text not null,
  left_path text,
  right_path text,
  rack_path text not null,
  updated_at timestamptz not null default now(),
  constraint catalog_image_paths check (
    front_path ~ '^(/garments/[a-z0-9-]+\.webp|[0-9a-f-]{36}/[0-9a-f-]{36}\.webp)$'
    and rack_path ~ '^(/garments/[a-z0-9-]+\.webp|[0-9a-f-]{36}/[0-9a-f-]{36}\.webp)$'
    and (left_path is null or left_path ~ '^(/garments/[a-z0-9-]+\.webp|[0-9a-f-]{36}/[0-9a-f-]{36}\.webp)$')
    and (right_path is null or right_path ~ '^(/garments/[a-z0-9-]+\.webp|[0-9a-f-]{36}/[0-9a-f-]{36}\.webp)$')
  ),
  unique (audience, slot)
);

alter table public.catalog_items enable row level security;
revoke all on public.catalog_items from anon, authenticated;
grant select, insert, update on public.catalog_items to authenticated;

create policy "Only catalog admins read inventory"
on public.catalog_items for select to authenticated
using ((select public.is_catalog_admin()));
create policy "Only catalog admins add inventory"
on public.catalog_items for insert to authenticated
with check ((select public.is_catalog_admin()));
create policy "Only catalog admins edit inventory"
on public.catalog_items for update to authenticated
using ((select public.is_catalog_admin()))
with check ((select public.is_catalog_admin()));

create or replace function public.get_public_catalog()
returns jsonb language sql stable security definer set search_path = ''
as $$
  select coalesce(jsonb_agg(
    case when status = 'hidden' then
      jsonb_build_object('audience', audience, 'slot', slot, 'status', status)
    else
      jsonb_build_object(
        'id', id, 'audience', audience, 'slot', slot, 'status', status,
        'name', name, 'garment_type', garment_type, 'description', description,
        'color_hex', color_hex, 'color_name', color_name, 'price_minor', price_minor,
        'size_stock', size_stock, 'front_path', front_path, 'left_path', left_path,
        'right_path', right_path, 'rack_path', rack_path
      )
    end order by audience, slot
  ), '[]'::jsonb)
  from public.catalog_items;
$$;
revoke all on function public.get_public_catalog() from public;
grant execute on function public.get_public_catalog() to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('catalog-garments', 'catalog-garments', true, 4194304, array['image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Catalog admins upload to their own folder"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'catalog-garments'
  and (select public.is_catalog_admin())
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and name ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}\.webp$'
);
