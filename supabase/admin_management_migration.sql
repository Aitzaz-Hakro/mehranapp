-- Run this in Supabase SQL Editor for existing databases.

alter table public.past_papers
  add column if not exists uploaded_by uuid references auth.users(id) on delete set null;

create index if not exists idx_past_papers_uploaded_by on public.past_papers (uploaded_by);

alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('admin', 'student', 'super_admin'));

alter table public.profiles
  add column if not exists admin_for_department text;

-- Mark your own account as super admin (replace email first)
insert into public.profiles (id, role)
select id, 'super_admin'
from auth.users
where lower(email) = lower('you@example.com')
on conflict (id) do update set role = excluded.role;

-- Optional: backfill uploader for old records where unknown
-- update public.past_papers
-- set uploaded_by = '<ADMIN_USER_UUID>'
-- where uploaded_by is null;

drop policy if exists "Public can insert past papers" on public.past_papers;
drop policy if exists "Admins can insert past papers" on public.past_papers;
drop policy if exists "Super admins can delete past papers" on public.past_papers;

create policy "Admins can insert past papers"
  on public.past_papers
  for insert
  to authenticated
  with check (
    uploaded_by = auth.uid()
    and exists (
      select 1
      from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'super_admin')
    )
  );

create policy "Super admins can delete past papers"
  on public.past_papers
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid() and p.role = 'super_admin'
    )
  );

drop policy if exists "Super admins can read all profiles" on public.profiles;
create policy "Super admins can read all profiles"
  on public.profiles
  for select
  to authenticated
  using (public.is_current_user_super_admin());

drop policy if exists "Super admins can insert profiles" on public.profiles;
create policy "Super admins can insert profiles"
  on public.profiles
  for insert
  to authenticated
  with check (public.is_current_user_super_admin());

drop policy if exists "Super admins can update profiles" on public.profiles;
create policy "Super admins can update profiles"
  on public.profiles
  for update
  to authenticated
  using (public.is_current_user_super_admin())
  with check (public.is_current_user_super_admin());

create or replace function public.get_admin_users()
returns table (
  id uuid,
  role text,
  created_at timestamptz,
  admin_for_department text,
  email text,
  display_name text
)
language sql
security definer
set search_path = public, auth
as $$
  select
    p.id,
    p.role,
    p.created_at,
    p.admin_for_department,
    u.email,
    coalesce(
      nullif(u.raw_user_meta_data->>'full_name', ''),
      nullif(u.raw_user_meta_data->>'name', ''),
      split_part(coalesce(u.email, ''), '@', 1)
    ) as display_name
  from public.profiles p
  join auth.users u on u.id = p.id
  where p.role = 'admin'
    and exists (
      select 1
      from public.profiles sp
      where sp.id = auth.uid() and sp.role = 'super_admin'
    )
  order by p.created_at desc;
$$;

revoke all on function public.get_admin_users() from public;
grant execute on function public.get_admin_users() to authenticated;

create or replace function public.is_current_user_super_admin()
returns boolean
language sql
security definer
set search_path = public, auth
as $$
  select
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid() and p.role = 'super_admin'
    )
    or exists (
      select 1
      from auth.users u
      where u.id = auth.uid() and coalesce(u.is_super_admin, false) = true
    );
$$;

revoke all on function public.is_current_user_super_admin() from public;
grant execute on function public.is_current_user_super_admin() to authenticated;

insert into storage.buckets (id, name, public)
values ('papers', 'papers', true)
on conflict (id) do nothing;

drop policy if exists "Public can read papers objects" on storage.objects;
create policy "Public can read papers objects"
  on storage.objects
  for select
  to public
  using (bucket_id = 'papers');

drop policy if exists "Admins can upload papers objects" on storage.objects;
create policy "Admins can upload papers objects"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'papers'
    and exists (
      select 1
      from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'super_admin')
    )
  );

drop policy if exists "Super admins can delete papers objects" on storage.objects;
create policy "Super admins can delete papers objects"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'papers'
    and public.is_current_user_super_admin()
  );

create or replace function public.is_current_user_uploader()
returns boolean
language sql
security definer
set search_path = public, auth
as $$
  select
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'super_admin')
    )
    or exists (
      select 1
      from auth.users u
      where u.id = auth.uid() and coalesce(u.is_super_admin, false) = true
    );
$$;

revoke all on function public.is_current_user_uploader() from public;
grant execute on function public.is_current_user_uploader() to authenticated;
