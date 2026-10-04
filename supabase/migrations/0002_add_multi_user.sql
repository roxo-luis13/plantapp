-- Reintroduz suporte a múltiplos usuários: cada planta passa a ter um
-- dono, e o acesso deixa de ser aberto (RLS volta a ser por usuário).

alter table public.plants
  add column if not exists user_id uuid references auth.users (id) on delete cascade;

create index if not exists plants_user_id_idx on public.plants (user_id);

drop policy if exists "Plants are publicly readable" on public.plants;
drop policy if exists "Plants are publicly insertable" on public.plants;
drop policy if exists "Plants are publicly updatable" on public.plants;
drop policy if exists "Plants are publicly deletable" on public.plants;

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

drop policy if exists "Anyone can upload plant photos" on storage.objects;
drop policy if exists "Anyone can delete plant photos" on storage.objects;

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
