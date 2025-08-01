-- Create regular user only (admin already exists)
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

-- Create profile for new user with payment verified
INSERT INTO public.profiles (user_id, username, full_name, payment_verified)
SELECT 
  id,
  'user_iseo',
  'Iseo User',
  true
FROM auth.users 
WHERE email = 'iseoluwae949@gmail.com';

-- Make schooltact01@gmail.com an admin (if not already)
INSERT INTO public.admin_panel (user_id, is_admin)
SELECT id, true 
FROM auth.users 
WHERE email = 'schooltact01@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET is_admin = true;