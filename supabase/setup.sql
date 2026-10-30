-- Trip Planner: end-to-end encrypted sync storage.
-- Paste this whole file into Supabase → SQL Editor → New query → Run.
-- The server only ever stores encrypted blobs; it never sees trip contents or keys.

create table if not exists public.trips (
  id          text primary key check (id ~ '^[0-9a-f]{32}$'),
  write_hash  text not null check (write_hash ~ '^[0-9a-f]{64}$'),
  version     bigint not null default 1,
  data        text not null check (length(data) < 2000000 and data like 'v1.%'),
  updated_at  timestamptz not null default now()
);

-- Lock the table: no direct reads, writes or listing from the app's public key.
alter table public.trips enable row level security;
alter table public.trips force row level security;
revoke all on table public.trips from anon, authenticated, public;

-- Read exactly one trip by its unguessable 128-bit id (returns ciphertext only).
create or replace function public.get_trip(p_id text)
returns table (version bigint, data text, updated_at timestamptz)
language sql stable security definer set search_path = ''
as $$
  select t.version, t.data, t.updated_at from public.trips t
  where p_id ~ '^[0-9a-f]{32}$' and t.id = p_id;
$$;

-- Create or update a trip. Requires the write token (only its SHA-256 is stored),
-- and the expected version so two phones can't silently overwrite each other.
-- Returns the new version, or minus the current version if someone else saved first.
create or replace function public.put_trip(p_id text, p_token text, p_expected bigint, p_data text)
returns bigint
language plpgsql security definer set search_path = ''
as $$
declare
  h   text := encode(sha256(convert_to(coalesce(p_token, ''), 'UTF8')), 'hex');
  cur public.trips%rowtype;
begin
  if p_id !~ '^[0-9a-f]{32}$' or p_token !~ '^[0-9a-f]{64}$'
     or p_data is null or length(p_data) >= 2000000 or p_data not like 'v1.%' then
    raise exception 'bad request';
  end if;
  select * into cur from public.trips where id = p_id for update;
  if not found then
    if (select count(*) from public.trips) >= 25 then
      raise exception 'trip limit reached';
    end if;
    insert into public.trips (id, write_hash, data) values (p_id, h, p_data);
    return 1;
  end if;
  if cur.write_hash <> h then
    raise exception 'not allowed';
  end if;
  if cur.version <> p_expected then
    return -cur.version;
  end if;
  update public.trips set data = p_data, version = cur.version + 1, updated_at = now() where id = p_id;
  return cur.version + 1;
end;
$$;

-- Delete a trip (needs the write token).
create or replace function public.delete_trip(p_id text, p_token text)
returns boolean
language plpgsql security definer set search_path = ''
as $$
declare n int;
begin
  delete from public.trips
   where id = p_id and write_hash = encode(sha256(convert_to(coalesce(p_token, ''), 'UTF8')), 'hex');
  get diagnostics n = row_count;
  if n = 0 then raise exception 'not allowed'; end if;
  return true;
end;
$$;

-- Only these three functions are callable from the app.
revoke all on function public.get_trip(text), public.put_trip(text, text, bigint, text), public.delete_trip(text, text) from public;
grant execute on function public.get_trip(text), public.put_trip(text, text, bigint, text), public.delete_trip(text, text) to anon, authenticated;
