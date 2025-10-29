create schema if not exists clio;

create table if not exists clio.collections (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  structure_proxy jsonb not null,
  visibility text not null default 'private',
  is_deleted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, name)
);

create table if not exists clio.collection_members (
  collection_id uuid not null references clio.collections(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','writer','reader')),
  added_at timestamptz not null default now(),
  primary key (collection_id, user_id)
);

create table if not exists clio.entries (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references clio.collections(id) on delete cascade,
  entry_data jsonb not null,
  created_by uuid not null references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  is_deleted boolean not null default false
);

create index if not exists idx_entries_collection on clio.entries(collection_id) where is_deleted = false;
create index if not exists idx_collections_owner on clio.collections(owner_id) where is_deleted = false;
