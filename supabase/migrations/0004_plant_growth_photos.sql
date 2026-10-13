-- Fotos de crescimento: registradas ao longo do tempo para uma planta já
-- cadastrada, pra acompanhar a evolução dela. Sem IA, só foto e legenda opcional.

create table if not exists public.plant_growth_photos (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid not null references public.plants (id) on delete cascade,
  photo_path text not null,
  caption text,
  created_at timestamptz not null default now()
);

create index if not exists plant_growth_photos_plant_id_idx
  on public.plant_growth_photos (plant_id);

alter table public.plant_growth_photos enable row level security;

create policy "Plant growth photos are publicly readable"
  on public.plant_growth_photos for select
  using (true);

create policy "Plant growth photos are publicly insertable"
  on public.plant_growth_photos for insert
  with check (true);

create policy "Plant growth photos are publicly deletable"
  on public.plant_growth_photos for delete
  using (true);

insert into storage.buckets (id, name, public)
values ('plant-growth-photos', 'plant-growth-photos', true)
on conflict (id) do nothing;

create policy "Plant growth photos bucket readable"
  on storage.objects for select
  using (bucket_id = 'plant-growth-photos');

create policy "Plant growth photos bucket insertable"
  on storage.objects for insert
  with check (bucket_id = 'plant-growth-photos');

create policy "Plant growth photos bucket deletable"
  on storage.objects for delete
  using (bucket_id = 'plant-growth-photos');
