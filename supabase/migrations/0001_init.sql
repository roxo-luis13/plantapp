-- Catálogo de plantas: tabela principal, RLS e bucket de fotos.

create table if not exists public.plants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  scientific_name text,
  purchase_date date not null,
  photo_path text not null,
  notes text,
  identification_confidence numeric,
  care_info jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists plants_user_id_idx on public.plants (user_id);
create index if not exists plants_purchase_date_idx on public.plants (purchase_date desc);

alter table public.plants enable row level security;

create policy "Plants are visible to their owner"
  on public.plants for select
  using (auth.uid() = user_id);

create policy "Plants are insertable by their owner"
  on public.plants for insert
  with check (auth.uid() = user_id);

create policy "Plants are updatable by their owner"
  on public.plants for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Plants are deletable by their owner"
  on public.plants for delete
  using (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists plants_set_updated_at on public.plants;
create trigger plants_set_updated_at
  before update on public.plants
  for each row
  execute function public.set_updated_at();

-- Bucket de fotos. Fica público para leitura (as URLs das fotos ficam nos
-- cartões do catálogo), mas só o dono pode enviar/apagar dentro da sua
-- própria pasta ({user_id}/...).
insert into storage.buckets (id, name, public)
values ('plant-photos', 'plant-photos', true)
on conflict (id) do nothing;

create policy "Plant photos are publicly readable"
  on storage.objects for select
  using (bucket_id = 'plant-photos');

create policy "Users upload photos into their own folder"
  on storage.objects for insert
  with check (
    bucket_id = 'plant-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users delete their own photos"
  on storage.objects for delete
  using (
    bucket_id = 'plant-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
