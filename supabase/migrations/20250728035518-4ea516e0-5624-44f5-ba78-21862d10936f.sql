-- Add area/location field to profiles for question randomization
ALTER TABLE public.profiles ADD COLUMN location TEXT;

-- Add questions area field for regional distribution
ALTER TABLE public.questions ADD COLUMN question_area TEXT DEFAULT 'general';

-- Update payment_sessions to support Paystack
ALTER TABLE public.payment_sessions ADD COLUMN paystack_reference TEXT;
ALTER TABLE public.payment_sessions ADD COLUMN paystack_access_code TEXT;

-- Add table for storing answer explanations (to be released Aug 10, 7 AM)
CREATE TABLE public.answer_explanations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  explanation TEXT NOT NULL,
  explanation_math TEXT, -- for KaTeX rendering
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on answer_explanations
ALTER TABLE public.answer_explanations ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing explanations (only after Aug 10, 7 AM)
CREATE POLICY "Explanations viewable after release date" 
ON public.answer_explanations 
FOR SELECT 
USING (
  now() >= '2025-08-10 07:00:00+00'::timestamp with time zone
);

-- Add prize information table
CREATE TABLE public.prize_structure (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  position INTEGER NOT NULL UNIQUE,
  prize_amount INTEGER NOT NULL,
  prize_description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert prize structure
INSERT INTO public.prize_structure (position, prize_amount, prize_description) VALUES
(1, 2000000, '₦10,000'), -- stored in kobo
(2, 1500000, '₦5,000'),
(3, 1000000, '₦3,000'),
(4, 300000, '₦1,000'),
(5, 200000, '₦1,000');

-- Enable RLS on prize_structure
ALTER TABLE public.prize_structure ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing prize structure
CREATE POLICY "Prize structure viewable by everyone" 
ON public.prize_structure 
FOR SELECT 
USING (true);

-- Add support chat table
CREATE TABLE public.support_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT,
  message TEXT NOT NULL,
  is_admin_response BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on support_messages
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for support messages
CREATE POLICY "Users can view their own support messages" 
ON public.support_messages 
FOR SELECT 
USING (auth.uid() = user_id OR user_email = auth.email());

CREATE POLICY "Users can insert their own support messages" 
ON public.support_messages 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_email = auth.email());

-- Update quiz_attempts to include location for area-based randomization
ALTER TABLE public.quiz_attempts ADD COLUMN user_location TEXT;