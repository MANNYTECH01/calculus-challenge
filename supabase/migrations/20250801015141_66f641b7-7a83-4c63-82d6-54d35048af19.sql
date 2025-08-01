-- Insert admin user without conflict handling first
INSERT INTO public.admin_panel (user_id, is_admin)
SELECT id, true 
FROM auth.users 
WHERE email = 'schooltact01@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM public.admin_panel WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'schooltact01@gmail.com'
  )
);