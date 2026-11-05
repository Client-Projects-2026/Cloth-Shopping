-- Apply after 20261101000000_catalog_admin.sql.
create table if not exists public.everyday_items (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'published' check (status in ('published', 'hidden')),
  position smallint not null default 1 check (position between 1 and 999),
  name text not null check (char_length(name) between 2 and 100),
  category text not null check (char_length(category) between 2 and 40),
  description text not null check (char_length(description) between 10 and 500),
  color_hex text not null check (color_hex ~ '^#[0-9A-Fa-f]{6}$'),
  color_name text not null check (char_length(color_name) between 2 and 50),
  tag text not null default '' check (char_length(tag) <= 32),
  price_minor integer not null check (price_minor between 1 and 100000000),
  size_stock jsonb not null check (
    case when jsonb_typeof(size_stock) = 'array'
      then jsonb_array_length(size_stock) between 1 and 12
      else false end
  ),
  image_path text not null check (image_path ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}\.webp$'),
  updated_at timestamptz not null default now()
);

alter table public.everyday_items enable row level security;
revoke all on public.everyday_items from anon, authenticated;
grant select, insert, update on public.everyday_items to authenticated;

create policy "Only catalog admins read everyday inventory"
on public.everyday_items for select to authenticated
using ((select public.is_catalog_admin()));

create policy "Only catalog admins add everyday inventory"
on public.everyday_items for insert to authenticated
with check ((select public.is_catalog_admin()));

create policy "Only catalog admins edit everyday inventory"
on public.everyday_items for update to authenticated
using ((select public.is_catalog_admin()))
with check ((select public.is_catalog_admin()));

create or replace function public.get_public_everyday_collection()
returns jsonb language sql stable security definer set search_path = ''
as $$
  select coalesce(jsonb_agg(
    case when status = 'hidden' then
      jsonb_build_object('status', status)
    else
      jsonb_build_object(
        'id', id, 'status', status, 'position', position,
        'name', name, 'category', category, 'description', description,
        'color_hex', color_hex, 'color_name', color_name, 'tag', tag,
        'price_minor', price_minor, 'size_stock', size_stock, 'image_path', image_path
      )
    end order by position, name
  ), '[]'::jsonb)
  from public.everyday_items;
$$;
revoke all on function public.get_public_everyday_collection() from public;
grant execute on function public.get_public_everyday_collection() to anon, authenticated;
