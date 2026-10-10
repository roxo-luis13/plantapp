-- Galeria do jardim: fotos soltas (não ligadas a uma planta específica),
-- sem nenhum processamento de IA — só foto e legenda opcional.

create table if not exists public.garden_photos (
  id uuid primary key default gen_random_uuid(),
  photo_path text not null,
  caption text,
  created_at timestamptz not null default now()
);

alter table public.garden_photos enable row level security;

create policy "Garden photos are publicly readable"
  on public.garden_photos for select
  using (true);

create policy "Garden photos are publicly insertable"
  on public.garden_photos for insert
  with check (true);

create policy "Garden photos are publicly deletable"
  on public.garden_photos for delete
  using (true);

insert into storage.buckets (id, name, public)
values ('garden-photos', 'garden-photos', true)
on conflict (id) do nothing;

create policy "Garden photos bucket readable"
  on storage.objects for select
  using (bucket_id = 'garden-photos');

create policy "Garden photos bucket insertable"
  on storage.objects for insert
  with check (bucket_id = 'garden-photos');

create policy "Garden photos bucket deletable"
  on storage.objects for delete
  using (bucket_id = 'garden-photos');
