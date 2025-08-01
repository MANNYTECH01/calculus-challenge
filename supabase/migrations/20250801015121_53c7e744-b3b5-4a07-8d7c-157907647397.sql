-- Make schooltact01@gmail.com an admin (if not already)
INSERT INTO public.admin_panel (user_id, is_admin)
SELECT id, true 
FROM auth.users 
WHERE email = 'schooltact01@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET is_admin = true;