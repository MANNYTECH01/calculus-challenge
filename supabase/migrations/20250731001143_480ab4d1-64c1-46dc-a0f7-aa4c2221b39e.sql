-- Create violations table for detailed rule violation tracking
CREATE TABLE public.quiz_violations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  violation_type TEXT NOT NULL,
  violation_details TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  quiz_attempt_id UUID,
  ip_address TEXT,
  user_agent TEXT
);

-- Enable RLS
ALTER TABLE public.quiz_violations ENABLE ROW LEVEL SECURITY;

-- Create policies for violations
CREATE POLICY "Users can view their own violations" 
ON public.quiz_violations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own violations" 
ON public.quiz_violations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create admin_panel table for admin users
CREATE TABLE public.admin_panel (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_panel ENABLE ROW LEVEL SECURITY;

-- Admin can manage everything
CREATE POLICY "Admins can manage admin panel" 
ON public.admin_panel 
FOR ALL 
USING (true);

-- Only admins can view admin data
CREATE POLICY "Only admins can view admin panel" 
ON public.admin_panel 
FOR SELECT 
USING (auth.uid() = user_id AND is_admin = true);