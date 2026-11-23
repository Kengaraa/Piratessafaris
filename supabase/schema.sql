-- Piratessafaris schema. Run the whole file in Supabase > SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text, phone text,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, title text not null,
  category text not null check (category in ('safari','beach','international')),
  destination text not null, summary text, description text,
  days int not null check (days > 0),
  price numeric(12,2) not null check (price >= 0),
  currency text not null default 'KES',
  image_url text, highlights text[] not null default '{}',
  featured boolean not null default false, active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  package_id uuid not null references public.packages(id),
  travel_date date not null,
  adults int not null check (adults >= 1),
  children int not null default 0 check (children >= 0),
  notes text,
  total_price numeric(12,2) not null default 0,
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled','completed')),
  created_at timestamptz not null default now()
);
create index if not exists bookings_user_idx on public.bookings(user_id);

-- Helpers
create or replace function public.is_admin() returns boolean
language sql security definer set search_path = public stable as
$$ select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') $$;

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'phone');
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Only admins (or the SQL editor) may change roles
create or replace function public.guard_profile_role() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.role is distinct from old.role and auth.uid() is not null and not public.is_admin() then
    raise exception 'Not allowed to change role';
  end if;
  return new;
end $$;
drop trigger if exists guard_role on public.profiles;
create trigger guard_role before update on public.profiles
  for each row execute function public.guard_profile_role();

-- Price is always computed on the server (children pay 50%)
create or replace function public.prepare_booking() returns trigger
language plpgsql security definer set search_path = public as $$
declare p public.packages;
begin
  select * into p from public.packages where id = new.package_id and active;
  if not found then raise exception 'Package not available'; end if;
  if new.travel_date <= current_date then raise exception 'Travel date must be in the future'; end if;
  new.total_price := p.price * (new.adults + new.children * 0.5);
  new.status := 'pending';
  return new;
end $$;
drop trigger if exists prepare_booking on public.bookings;
create trigger prepare_booking before insert on public.bookings
  for each row execute function public.prepare_booking();

create or replace function public.cancel_booking(b_id uuid) returns void
language sql security definer set search_path = public as $$
  update public.bookings set status = 'cancelled'
  where id = b_id and user_id = auth.uid() and status in ('pending','confirmed')
$$;

create or replace function public.admin_stats() returns json
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Admins only'; end if;
  return json_build_object(
    'users', (select count(*) from public.profiles),
    'packages', (select count(*) from public.packages where active),
    'bookings', (select count(*) from public.bookings),
    'pending', (select count(*) from public.bookings where status = 'pending'),
    'revenue', (select coalesce(sum(total_price),0) from public.bookings where status in ('confirmed','completed'))
  );
end $$;

-- Row level security
alter table public.profiles enable row level security;
alter table public.packages enable row level security;
alter table public.bookings enable row level security;

create policy "profiles read" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles update" on public.profiles for update using (id = auth.uid() or public.is_admin());
create policy "packages read" on public.packages for select using (active or public.is_admin());
create policy "packages admin write" on public.packages for all using (public.is_admin()) with check (public.is_admin());
create policy "bookings read" on public.bookings for select using (user_id = auth.uid() or public.is_admin());
create policy "bookings insert" on public.bookings for insert with check (user_id = auth.uid());
create policy "bookings admin update" on public.bookings for update using (public.is_admin());

grant execute on function public.cancel_booking(uuid) to authenticated;
grant execute on function public.admin_stats() to authenticated;

-- Sample packages (images are placeholders; replace image_url with your own)
insert into public.packages (slug,title,category,destination,summary,description,days,price,currency,image_url,highlights,featured) values
('maasai-mara-3-days','Maasai Mara Bush Escape','safari','Maasai Mara','Three days of game drives in the home of the Great Migration.','Drive the open plains of the Mara with an expert guide, track lions at dawn and relax at a tented camp each evening. Includes park fees, meals and transfers.',3,38500,'KES','https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80',array['Daily game drives','Tented camp stay','Park fees included','Big Five viewing'],true),
('amboseli-2-days','Amboseli Elephant Weekend','safari','Amboseli','Elephants beneath Mount Kilimanjaro on a short weekend break.','Two days with large elephant herds and views of Kilimanjaro. Comfortable lodge, all meals and a private safari vehicle.',2,29500,'KES','https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1200&q=80',array['Kilimanjaro views','Elephant herds','Lodge stay','Private vehicle'],true),
('samburu-3-days','Samburu Northern Frontier','safari','Samburu','Rare northern species and Samburu culture in rugged semi-arid country.','Spot Grevy zebra, reticulated giraffe and gerenuk, and visit a Samburu community. Three days with lodge accommodation and full board.',3,42000,'KES','https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&q=80',array['Northern five species','Cultural visit','Full board','River-side lodge'],false),
('nakuru-weekend','Nakuru Rhino Weekend','safari','Nakuru','Rift Valley scenery, flamingos and rhino sanctuary drives.','A relaxed weekend in Lake Nakuru National Park with morning and afternoon game drives.',2,24000,'KES','https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=1200&q=80',array['Rhino sanctuary','Flamingo lake','Rift Valley views'],false),
('tsavo-3-days','Tsavo Red Elephants','safari','Tsavo','Red-dust elephants and wide skies in Kenya''s largest park.','Three days across Tsavo East with guided drives, a lodge stay and meals included.',3,36000,'KES','https://images.unsplash.com/photo-1535941339077-2dd1c7963098?w=1200&q=80',array['Red elephants','Mudanda Rock','Lodge stay'],false),
('diani-4-nights','Diani Beach Retreat','beach','Diani','Four nights on white sand with breakfast and airport transfers.','Beachfront resort, daily breakfast, return transfers and optional ocean excursions.',5,55000,'KES','https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',array['Beachfront resort','Breakfast daily','Airport transfers'],true),
('watamu-4-nights','Watamu Coastal Getaway','beach','Watamu','Marine park snorkelling and quiet North Coast beaches.','Four nights in Watamu with half board and a marine park boat trip.',5,73000,'KES','https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80',array['Marine park trip','Half board','Quiet beaches'],false),
('dubai-5-days','Dubai City Escape','international','Dubai','Flights, hotel and guided city tours in five days.','Return flights from Nairobi, four-star hotel, desert safari and Burj Khalifa visit.',5,145000,'KES','https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80',array['Return flights','Desert safari','City tour'],true)
on conflict (slug) do nothing;

-- Make yourself admin after signing up (replace the email):
-- update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'you@example.com');
