create extension if not exists "pgcrypto";

create table if not exists public.past_papers (
  id uuid primary key default gen_random_uuid(),
  teacher_name text not null,
  department text not null,
  semester text not null,
  course text not null,
  year integer not null check (year >= 2000 and year <= 2100),
  file_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  department text not null,
  achievement_title text not null,
  description text not null,
  github_link text,
  linkedin_link text,
  photo_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'student' check (role in ('admin', 'student')),
  created_at timestamptz not null default now()
);

create index if not exists idx_past_papers_teacher_name on public.past_papers (teacher_name);
create index if not exists idx_past_papers_department on public.past_papers (department);
create index if not exists idx_past_papers_semester on public.past_papers (semester);
create index if not exists idx_past_papers_course on public.past_papers (course);

alter table public.past_papers enable row level security;
alter table public.achievements enable row level security;
alter table public.profiles enable row level security;

create policy "Public can read past papers"
  on public.past_papers
  for select
  to anon, authenticated
  using (true);

create policy "Public can read achievements"
  on public.achievements
  for select
  to anon, authenticated
  using (true);

create policy "Users can read own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

create policy "Admins can insert past papers"
  on public.past_papers
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );
