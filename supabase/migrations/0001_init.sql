-- Catálogo de plantas: tabela principal, RLS e bucket de fotos.
--
-- Sem login: é um app de uso pessoal, então o acesso é aberto por trás da
-- chave pública (anon) do projeto — não há distinção de usuário.

create table if not exists public.plants (
  id uuid primary key default gen_random_uuid(),
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

create index if not exists plants_purchase_date_idx on public.plants (purchase_date desc);

alter table public.plants enable row level security;

create policy "Plants are publicly readable"
  on public.plants for select
  using (true);

create policy "Plants are publicly insertable"
  on public.plants for insert
  with check (true);

create policy "Plants are publicly updatable"
  on public.plants for update
  using (true)
  with check (true);

create policy "Plants are publicly deletable"
  on public.plants for delete
  using (true);

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

-- Bucket de fotos: leitura e escrita públicas (mesmo raciocínio acima).
insert into storage.buckets (id, name, public)
values ('plant-photos', 'plant-photos', true)
on conflict (id) do nothing;

create policy "Plant photos are publicly readable"
  on storage.objects for select
  using (bucket_id = 'plant-photos');

create policy "Anyone can upload plant photos"
  on storage.objects for insert
  with check (bucket_id = 'plant-photos');

create policy "Anyone can delete plant photos"
  on storage.objects for delete
  using (bucket_id = 'plant-photos');
