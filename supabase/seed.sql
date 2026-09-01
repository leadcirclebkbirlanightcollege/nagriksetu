-- =====================================================================
-- NagrikSetu – seed reference data. Run AFTER schema.sql. Safe to re-run.
-- =====================================================================

-- Departments with category routing --------------------------------------
insert into public.departments (name, code, categories, phone) values
  ('Solid Waste Department', 'SWM', array['Garbage'], '1916'),
  ('Electrical Department',  'ELE', array['Street Lights'], '1912'),
  ('Public Works Department','PWD', array['Road Damage','Public Property Damage'], '1917'),
  ('Drainage Department',    'DRN', array['Drainage'], '1918'),
  ('Water Department',       'WTR', array['Water Leakage','Water Supply'], '1916'),
  ('Garden Department',      'GRD', array['Trees','Parks'], '1919'),
  ('Health Department',      'HLT', array['Public Toilets'], '104'),
  ('General Administration', 'GEN', array['Others'], '1950')
on conflict (name) do update set categories = excluded.categories;

-- Wards ------------------------------------------------------------------
insert into public.wards (name, code) values
  ('Ward 08 – Bandra', 'W08'),
  ('Ward 12 – Andheri', 'W12'),
  ('Ward 15 – Kurla',   'W15'),
  ('Ward 20 – Chembur', 'W20')
on conflict (code) do nothing;

-- Areas ------------------------------------------------------------------
insert into public.areas (name, ward_id, lat, lng)
select a.name, w.id, a.lat, a.lng from (values
  ('Shivaji Nagar', 'W12', 19.1197, 72.8468),
  ('Gandhi Road',   'W08', 19.0544, 72.8402),
  ('Nehru Colony',  'W15', 19.0726, 72.8790),
  ('Patel Ward',    'W20', 19.0530, 72.8990),
  ('Subhash Nagar', 'W12', 19.1180, 72.8460)
) as a(name, ward_code, lat, lng)
join public.wards w on w.code = a.ward_code
on conflict (name, ward_id) do nothing;

-- Sample survey ----------------------------------------------------------
insert into public.surveys (id, title, description, active)
values ('00000000-0000-0000-0000-0000000000a1',
        'Civic Priorities Survey 2026',
        'Help us understand which civic issues matter most in your neighbourhood.',
        true)
on conflict (id) do nothing;

insert into public.survey_questions (survey_id, prompt, type, options, position) values
  ('00000000-0000-0000-0000-0000000000a1','Which civic issue affects you most?','single',
     '["Garbage","Road Damage","Water Supply","Drainage","Street Lights"]', 0),
  ('00000000-0000-0000-0000-0000000000a1','Which services need urgent improvement?','multi',
     '["Waste collection","Road repair","Water supply","Public toilets","Parks"]', 1),
  ('00000000-0000-0000-0000-0000000000a1','Rate your satisfaction with current civic services','rating',
     '[]', 2)
on conflict do nothing;
