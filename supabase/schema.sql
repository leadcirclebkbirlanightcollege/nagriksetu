-- =====================================================================
-- NagrikSetu – Production PostgreSQL schema (Supabase)
-- Run in Supabase SQL Editor. Idempotent: safe to re-run.
--
-- NOTE: This script performs a CLEAN RESET of NagrikSetu's public tables
-- and types before recreating them, so a previous partial run cannot leave
-- the database in a broken state. It only drops NagrikSetu app objects; it
-- never touches auth.users or unrelated tables. Run schema.sql first, then
-- seed.sql.
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Clean reset (drop app objects from any previous run, in dependency order)
-- ---------------------------------------------------------------------
drop trigger if exists on_auth_user_created on auth.users;

drop table if exists public.activity_logs     cascade;
drop table if exists public.survey_responses  cascade;
drop table if exists public.survey_questions  cascade;
drop table if exists public.surveys           cascade;
drop table if exists public.feedback          cascade;
drop table if exists public.notifications     cascade;
drop table if exists public.complaint_images  cascade;
drop table if exists public.complaint_history cascade;
drop table if exists public.complaints        cascade;
drop table if exists public.officers          cascade;
drop table if exists public.profiles          cascade;
drop table if exists public.departments       cascade;
drop table if exists public.areas             cascade;
drop table if exists public.wards             cascade;

drop sequence if exists public.complaint_seq;

drop type if exists complaint_status   cascade;
drop type if exists complaint_priority cascade;
drop type if exists question_type      cascade;
drop type if exists gender_type        cascade;
drop type if exists user_role          cascade;

-- ---------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------
do $$ begin create type user_role as enum
  ('citizen','officer','admin','super_admin');
exception when duplicate_object then null; end $$;

do $$ begin create type complaint_status as enum
  ('Reported','Verified','Assigned','Officer Accepted','Work Started',
   'Inspection','Resolved','Citizen Verified','Closed');
exception when duplicate_object then null; end $$;

do $$ begin create type complaint_priority as enum
  ('Low','Medium','High','Critical');
exception when duplicate_object then null; end $$;

do $$ begin create type question_type as enum
  ('single','multi','rating','text');
exception when duplicate_object then null; end $$;

do $$ begin create type gender_type as enum
  ('Male','Female','Other','Prefer not to say');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------
-- Geography: wards + areas
-- ---------------------------------------------------------------------
create table if not exists public.wards (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  code       text unique,
  created_at timestamptz not null default now()
);

create table if not exists public.areas (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  ward_id    uuid references public.wards(id) on delete set null,
  lat        double precision,
  lng        double precision,
  created_at timestamptz not null default now(),
  unique (name, ward_id)
);

-- ---------------------------------------------------------------------
-- Departments (category routing lives here via categories[])
-- ---------------------------------------------------------------------
create table if not exists public.departments (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  code        text unique,
  categories  text[] not null default '{}',
  email       text,
  phone       text,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  email       text,
  phone       text,
  role        user_role not null default 'citizen',
  gender      gender_type,
  age         int,
  ward_id     uuid references public.wards(id) on delete set null,
  area_id     uuid references public.areas(id) on delete set null,
  avatar_url  text,
  language    text not null default 'en',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Officers (department staff; extends a profile)
-- ---------------------------------------------------------------------
create table if not exists public.officers (
  id            uuid primary key default gen_random_uuid(),
  profile_id    uuid not null references public.profiles(id) on delete cascade,
  department_id uuid references public.departments(id) on delete set null,
  designation   text,
  active        boolean not null default true,
  created_at    timestamptz not null default now(),
  unique (profile_id)
);

-- ---------------------------------------------------------------------
-- Complaints
-- ---------------------------------------------------------------------
create sequence if not exists public.complaint_seq start 1;

create table if not exists public.complaints (
  id             uuid primary key default gen_random_uuid(),
  public_id      text unique,
  title          text not null,
  category       text not null,
  description    text not null,
  area           text,
  area_id        uuid references public.areas(id) on delete set null,
  ward_id        uuid references public.wards(id) on delete set null,
  landmark       text,
  lat            double precision,
  lng            double precision,
  contact_number text,
  priority       complaint_priority not null default 'Medium',
  anonymous      boolean not null default false,
  status         complaint_status not null default 'Reported',
  reporter_id    uuid references public.profiles(id) on delete set null,
  department_id  uuid references public.departments(id) on delete set null,
  officer_id     uuid references public.officers(id) on delete set null,
  archived       boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  resolved_at    timestamptz
);

create index if not exists complaints_status_idx     on public.complaints(status);
create index if not exists complaints_category_idx   on public.complaints(category);
create index if not exists complaints_priority_idx   on public.complaints(priority);
create index if not exists complaints_reporter_idx   on public.complaints(reporter_id);
create index if not exists complaints_department_idx on public.complaints(department_id);
create index if not exists complaints_officer_idx    on public.complaints(officer_id);
create index if not exists complaints_public_id_idx  on public.complaints(public_id);
create index if not exists complaints_contact_idx    on public.complaints(contact_number);

-- Status timeline
create table if not exists public.complaint_history (
  id           uuid primary key default gen_random_uuid(),
  complaint_id uuid not null references public.complaints(id) on delete cascade,
  status       complaint_status not null,
  remarks      text,
  officer_id   uuid references public.officers(id) on delete set null,
  actor_name   text,
  created_at   timestamptz not null default now()
);
create index if not exists complaint_history_complaint_idx on public.complaint_history(complaint_id);

-- Images (stored in the complaint-images storage bucket)
create table if not exists public.complaint_images (
  id           uuid primary key default gen_random_uuid(),
  complaint_id uuid not null references public.complaints(id) on delete cascade,
  storage_path text not null,
  public_url   text,
  created_at   timestamptz not null default now()
);
create index if not exists complaint_images_complaint_idx on public.complaint_images(complaint_id);

-- ---------------------------------------------------------------------
-- Notifications
-- ---------------------------------------------------------------------
create table if not exists public.notifications (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references public.profiles(id) on delete cascade,
  role_target  user_role,
  title        text not null,
  body         text,
  type         text,
  complaint_id uuid references public.complaints(id) on delete cascade,
  read         boolean not null default false,
  created_at   timestamptz not null default now()
);
create index if not exists notifications_user_idx on public.notifications(user_id);
create index if not exists notifications_role_idx on public.notifications(role_target);

-- ---------------------------------------------------------------------
-- Feedback
-- ---------------------------------------------------------------------
create table if not exists public.feedback (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references public.profiles(id) on delete set null,
  complaint_id uuid references public.complaints(id) on delete set null,
  rating       int not null check (rating between 1 and 5),
  comment      text,
  suggestion   text,
  created_at   timestamptz not null default now()
);
create index if not exists feedback_complaint_idx on public.feedback(complaint_id);

-- ---------------------------------------------------------------------
-- Surveys
-- ---------------------------------------------------------------------
create table if not exists public.surveys (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  active      boolean not null default true,
  created_by  uuid references public.profiles(id) on delete set null,
  created_at  timestamptz not null default now()
);

create table if not exists public.survey_questions (
  id         uuid primary key default gen_random_uuid(),
  survey_id  uuid not null references public.surveys(id) on delete cascade,
  prompt     text not null,
  type       question_type not null default 'single',
  options    jsonb not null default '[]',
  position   int not null default 0,
  required   boolean not null default true
);
create index if not exists survey_questions_survey_idx on public.survey_questions(survey_id);

create table if not exists public.survey_responses (
  id          uuid primary key default gen_random_uuid(),
  survey_id   uuid not null references public.surveys(id) on delete cascade,
  respondent  uuid references public.profiles(id) on delete set null,
  gender      gender_type,
  age         int,
  area_id     uuid references public.areas(id) on delete set null,
  answers     jsonb not null default '{}',
  created_at  timestamptz not null default now()
);
create index if not exists survey_responses_survey_idx on public.survey_responses(survey_id);

-- ---------------------------------------------------------------------
-- Activity logs (audit trail)
-- ---------------------------------------------------------------------
create table if not exists public.activity_logs (
  id         uuid primary key default gen_random_uuid(),
  actor_id   uuid references public.profiles(id) on delete set null,
  actor_name text,
  action     text not null,
  entity     text,
  entity_id  text,
  meta       jsonb,
  created_at timestamptz not null default now()
);
create index if not exists activity_logs_created_idx on public.activity_logs(created_at desc);

-- =====================================================================
-- Functions & triggers
-- =====================================================================

-- Role helpers
create or replace function public.current_role()
returns user_role language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('officer','admin','super_admin'));
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin','super_admin'));
$$;

-- New auth user -> profile
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name',''),
    new.email,
    new.raw_user_meta_data->>'phone',
    'citizen'
  ) on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Assign public_id + department routing + first history row
create or replace function public.before_complaint_insert()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  dept uuid;
begin
  if new.public_id is null then
    new.public_id := 'NGS-' || to_char(now(),'YYYY') || '-' ||
      lpad(nextval('public.complaint_seq')::text, 6, '0');
  end if;
  -- category -> department routing
  select id into dept from public.departments
    where new.category = any(categories) limit 1;
  if dept is not null then
    new.department_id := dept;
  end if;
  return new;
end $$;
drop trigger if exists trg_before_complaint_insert on public.complaints;
create trigger trg_before_complaint_insert
  before insert on public.complaints
  for each row execute function public.before_complaint_insert();

create or replace function public.after_complaint_insert()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.complaint_history (complaint_id, status, remarks, actor_name)
  values (new.id, new.status, 'Complaint registered', 'System');
  -- notify admins of a new complaint
  insert into public.notifications (role_target, title, body, type, complaint_id)
  values ('admin', 'New complaint ' || new.public_id,
          new.title, 'new_complaint', new.id);
  if new.priority in ('High','Critical') then
    insert into public.notifications (role_target, title, body, type, complaint_id)
    values ('admin', 'High priority complaint ' || new.public_id,
            new.title, 'high_priority', new.id);
  end if;
  return new;
end $$;
drop trigger if exists trg_after_complaint_insert on public.complaints;
create trigger trg_after_complaint_insert
  after insert on public.complaints
  for each row execute function public.after_complaint_insert();

-- On status change: log history + notify reporter + stamp resolved_at
create or replace function public.after_complaint_update()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status is distinct from old.status then
    update public.complaints set updated_at = now() where id = new.id;
    if new.status = 'Resolved' and new.resolved_at is null then
      update public.complaints set resolved_at = now() where id = new.id;
    end if;
    if new.reporter_id is not null then
      insert into public.notifications (user_id, title, body, type, complaint_id)
      values (new.reporter_id,
              'Complaint ' || new.public_id || ' updated',
              'Status changed to ' || new.status, 'status_change', new.id);
    end if;
  end if;
  return new;
end $$;
drop trigger if exists trg_after_complaint_update on public.complaints;
create trigger trg_after_complaint_update
  after update on public.complaints
  for each row execute function public.after_complaint_update();

-- Notify admins on survey response
create or replace function public.after_survey_response()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.notifications (role_target, title, body, type)
  values ('admin', 'New survey response', 'A citizen submitted a survey.', 'survey_response');
  return new;
end $$;
drop trigger if exists trg_after_survey_response on public.survey_responses;
create trigger trg_after_survey_response
  after insert on public.survey_responses
  for each row execute function public.after_survey_response();

-- keep updated_at fresh on profiles
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end $$;
drop trigger if exists trg_profiles_touch on public.profiles;
create trigger trg_profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table public.profiles         enable row level security;
alter table public.wards            enable row level security;
alter table public.areas            enable row level security;
alter table public.departments      enable row level security;
alter table public.officers         enable row level security;
alter table public.complaints       enable row level security;
alter table public.complaint_history enable row level security;
alter table public.complaint_images enable row level security;
alter table public.notifications    enable row level security;
alter table public.feedback         enable row level security;
alter table public.surveys          enable row level security;
alter table public.survey_questions enable row level security;
alter table public.survey_responses enable row level security;
alter table public.activity_logs    enable row level security;

-- Reference data: public read, admin write
create policy p_wards_read   on public.wards       for select using (true);
create policy p_wards_admin  on public.wards       for all using (public.is_admin()) with check (public.is_admin());
create policy p_areas_read   on public.areas       for select using (true);
create policy p_areas_admin  on public.areas       for all using (public.is_admin()) with check (public.is_admin());
create policy p_dept_read    on public.departments for select using (true);
create policy p_dept_admin   on public.departments for all using (public.is_admin()) with check (public.is_admin());
create policy p_off_read     on public.officers    for select using (true);
create policy p_off_admin    on public.officers    for all using (public.is_admin()) with check (public.is_admin());

-- Profiles
create policy p_profiles_read   on public.profiles for select using (id = auth.uid() or public.is_staff());
create policy p_profiles_insert on public.profiles for insert with check (id = auth.uid());
create policy p_profiles_update on public.profiles for update using (id = auth.uid() or public.is_admin());

-- Complaints: public read (community dashboard/tracking); citizens create; owners/staff update; admin delete
create policy p_complaints_read   on public.complaints for select using (true);
create policy p_complaints_insert on public.complaints for insert
  with check (anonymous = true or reporter_id = auth.uid());
create policy p_complaints_update on public.complaints for update
  using (reporter_id = auth.uid() or public.is_staff());
create policy p_complaints_delete on public.complaints for delete using (public.is_admin());

-- History + images
create policy p_hist_read  on public.complaint_history for select using (true);
create policy p_hist_write on public.complaint_history for insert with check (public.is_staff());
create policy p_img_read   on public.complaint_images for select using (true);
create policy p_img_insert on public.complaint_images for insert
  with check (auth.uid() is not null or exists (
    select 1 from public.complaints c where c.id = complaint_id and c.anonymous));

-- Notifications: user sees own or role-targeted; staff insert
create policy p_notif_read on public.notifications for select
  using (user_id = auth.uid() or role_target = public.current_role());
create policy p_notif_update on public.notifications for update using (user_id = auth.uid());
create policy p_notif_insert on public.notifications for insert with check (true);

-- Feedback: anyone signed-in inserts; admin + owner read
create policy p_feedback_insert on public.feedback for insert with check (true);
create policy p_feedback_read   on public.feedback for select using (user_id = auth.uid() or public.is_admin());

-- Surveys
create policy p_surveys_read  on public.surveys for select using (true);
create policy p_surveys_admin on public.surveys for all using (public.is_admin()) with check (public.is_admin());
create policy p_sq_read       on public.survey_questions for select using (true);
create policy p_sq_admin      on public.survey_questions for all using (public.is_admin()) with check (public.is_admin());
create policy p_sr_insert     on public.survey_responses for insert with check (true);
create policy p_sr_read       on public.survey_responses for select using (public.is_admin());

-- Activity logs: admin read, staff insert
create policy p_logs_read  on public.activity_logs for select using (public.is_admin());
create policy p_logs_write on public.activity_logs for insert with check (auth.uid() is not null);

-- =====================================================================
-- Realtime publication
-- =====================================================================
do $$ begin
  alter publication supabase_realtime add table public.notifications;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.complaints;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.complaint_history;
exception when duplicate_object then null; end $$;

-- =====================================================================
-- Storage bucket for complaint images
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('complaint-images','complaint-images', true)
on conflict (id) do nothing;

drop policy if exists p_img_public_read on storage.objects;
create policy p_img_public_read on storage.objects for select
  using (bucket_id = 'complaint-images');
drop policy if exists p_img_auth_upload on storage.objects;
create policy p_img_auth_upload on storage.objects for insert to authenticated
  with check (bucket_id = 'complaint-images');
