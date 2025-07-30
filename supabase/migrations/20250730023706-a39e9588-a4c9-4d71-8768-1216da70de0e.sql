-- Add bank details to profiles table
ALTER TABLE public.profiles 
ADD COLUMN bank_name TEXT,
ADD COLUMN account_number TEXT,
ADD COLUMN account_name TEXT;

-- Create admin messages table
CREATE TABLE public.admin_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  screenshot_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admin_messages
ALTER TABLE public.admin_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_messages
CREATE POLICY "Users can view their own messages" 
ON public.admin_messages 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own message read status" 
ON public.admin_messages 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create trigger for admin_messages updated_at
CREATE TRIGGER update_admin_messages_updated_at
BEFORE UPDATE ON public.admin_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add quiz_attempt_limit to profiles to track if user has attempted quiz
ALTER TABLE public.profiles 
ADD COLUMN has_attempted_quiz BOOLEAN DEFAULT FALSE;

-- Add quiz completion timestamp 
ALTER TABLE public.profiles 
ADD COLUMN quiz_completed_at TIMESTAMP WITH TIME ZONE;