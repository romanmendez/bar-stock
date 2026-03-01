-- Bar Stock schema
-- Run this in your Supabase project: SQL Editor → New query → paste → Run

create table if not exists categories (
  name text primary key
);

create table if not exists items (
  id          uuid primary key,
  name        text    not null,
  category    text    not null,
  stock_unit  text    not null default 'bottles',
  order_unit  text    not null default 'cases',
  par         integer not null default 6,
  left_count  integer not null default 0,
  order_flag  boolean not null default false,
  order_qty   integer not null default 0
);

create table if not exists records (
  id        uuid    primary key,
  timestamp bigint  not null,
  item_id   uuid,
  item_name text    not null,
  category  text    not null,
  unit      text    not null,
  used      integer not null,
  left_count integer not null,
  par       integer not null
);

-- Allow public (anon) access — fine for a private single-bar app.
-- If you add auth later, replace these with user-scoped policies.
alter table categories enable row level security;
alter table items      enable row level security;
alter table records    enable row level security;

create policy "public all" on categories for all using (true) with check (true);
create policy "public all" on items      for all using (true) with check (true);
create policy "public all" on records    for all using (true) with check (true);
