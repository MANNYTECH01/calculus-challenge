-- Create admin user
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  role,
  aud
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'schooltact01@gmail.com',
  crypt('Oluwaseun@7', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"username": "admin_school"}',
  now(),
  now(),
  '',
  '',
  'authenticated',
  'authenticated'
);

-- Create regular user
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  role,
  aud
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'iseoluwae949@gmail.com',
  crypt('Deelite@7', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"username": "user_iseo"}',
  now(),
  now(),
  '',
  '',
  'authenticated',
  'authenticated'
);

-- Create profiles for both users with payment verified
INSERT INTO public.profiles (user_id, username, full_name, payment_verified)
SELECT 
  id,
  CASE 
    WHEN email = 'schooltact01@gmail.com' THEN 'admin_school'
    WHEN email = 'iseoluwae949@gmail.com' THEN 'user_iseo'
  END,
  CASE 
    WHEN email = 'schooltact01@gmail.com' THEN 'School Admin'
    WHEN email = 'iseoluwae949@gmail.com' THEN 'Iseo User'
  END,
  true
FROM auth.users 
WHERE email IN ('schooltact01@gmail.com', 'iseoluwae949@gmail.com');

-- Make schooltact01@gmail.com an admin
INSERT INTO public.admin_panel (user_id, is_admin)
SELECT id, true 
FROM auth.users 
WHERE email = 'schooltact01@gmail.com';