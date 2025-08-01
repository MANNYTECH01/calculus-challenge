-- Clean up existing users and start fresh
DELETE FROM public.admin_panel WHERE user_id IN (
  SELECT id FROM auth.users WHERE email IN ('schooltact01@gmail.com', 'iseoluwae949@gmail.com')
);

DELETE FROM public.profiles WHERE user_id IN (
  SELECT id FROM auth.users WHERE email IN ('schooltact01@gmail.com', 'iseoluwae949@gmail.com')
);

DELETE FROM auth.users WHERE email IN ('schooltact01@gmail.com', 'iseoluwae949@gmail.com');