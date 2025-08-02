-- Fix the admin setup with proper conflict handling
-- Remove any existing incomplete data
DELETE FROM admin_panel WHERE user_id IN (
  SELECT id FROM auth.users WHERE email IN ('schooltact01@gmail.com', 'iseoluwae949@gmail.com')
);

DELETE FROM profiles WHERE user_id IN (
  SELECT id FROM auth.users WHERE email IN ('schooltact01@gmail.com', 'iseoluwae949@gmail.com')
);

-- Create profiles for existing auth users if they exist
INSERT INTO profiles (user_id, username, full_name, payment_verified)
SELECT 
  id as user_id,
  COALESCE(raw_user_meta_data->>'username', 'admin_school') as username,
  COALESCE(raw_user_meta_data->>'full_name', 'School Admin') as full_name,
  true as payment_verified
FROM auth.users 
WHERE email = 'schooltact01@gmail.com';

INSERT INTO profiles (user_id, username, full_name, payment_verified)
SELECT 
  id as user_id,
  COALESCE(raw_user_meta_data->>'username', 'user_iseo') as username,
  COALESCE(raw_user_meta_data->>'full_name', 'Iseo User') as full_name,
  true as payment_verified
FROM auth.users 
WHERE email = 'iseoluwae949@gmail.com';

-- Set admin privileges for the admin user
INSERT INTO admin_panel (user_id, is_admin)
SELECT id, true
FROM auth.users 
WHERE email = 'schooltact01@gmail.com';