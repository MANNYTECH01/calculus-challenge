-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create questions table
CREATE TABLE public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer CHAR(1) NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  difficulty_level TEXT DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on questions
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Questions are readable by authenticated users during quiz
CREATE POLICY "Questions are viewable by authenticated users" 
ON public.questions 
FOR SELECT 
TO authenticated
USING (true);

-- Create quiz attempts table
CREATE TABLE public.quiz_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  time_taken INTEGER NOT NULL, -- in seconds
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  quiz_data JSONB, -- stores questions and user answers
  device_fingerprint TEXT,
  ip_address TEXT,
  user_agent TEXT,
  anti_cheat_violations JSONB DEFAULT '[]'::jsonb
);

-- Enable RLS on quiz attempts
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Users can view their own attempts
CREATE POLICY "Users can view their own quiz attempts" 
ON public.quiz_attempts 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own attempts
CREATE POLICY "Users can insert their own quiz attempts" 
ON public.quiz_attempts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create device sessions table for anti-cheat
CREATE TABLE public.device_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  device_fingerprint TEXT NOT NULL,
  session_token TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '24 hours'),
  UNIQUE(user_id, device_fingerprint)
);

-- Enable RLS on device sessions
ALTER TABLE public.device_sessions ENABLE ROW LEVEL SECURITY;

-- Users can manage their own device sessions
CREATE POLICY "Users can manage their own device sessions" 
ON public.device_sessions 
FOR ALL 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, full_name)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert sample questions
INSERT INTO public.questions (question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty_level) VALUES
('What is the derivative of x³?', '3x²', '3x', 'x²', '2x³', 'A', 'easy'),
('What is ∫x dx?', 'x²/2 + C', 'x² + C', '2x + C', 'x + C', 'A', 'easy'),
('What is the limit of (sin x)/x as x approaches 0?', '0', '1', '∞', 'undefined', 'B', 'medium'),
('What is the derivative of ln(x)?', '1/x', 'x', 'ln(x)', 'e^x', 'A', 'medium'),
('What is the second derivative of e^x?', 'e^x', '2e^x', 'xe^x', '0', 'A', 'easy'),
('What is ∫(1/x) dx?', 'ln|x| + C', 'x + C', '1/x² + C', 'e^x + C', 'A', 'medium'),
('What is the derivative of cos(x)?', 'sin(x)', '-sin(x)', 'cos(x)', '-cos(x)', 'B', 'easy'),
('What is the chain rule formula?', 'd/dx[f(g(x))] = f''(g(x))g''(x)', 'd/dx[f(g(x))] = f''(x)g''(x)', 'd/dx[f(g(x))] = f(g(x))g''(x)', 'd/dx[f(g(x))] = f''(g(x))', 'A', 'medium'),
('What is ∫cos(x) dx?', 'sin(x) + C', '-sin(x) + C', 'cos(x) + C', '-cos(x) + C', 'A', 'easy'),
('What is the derivative of tan(x)?', 'sec²(x)', 'cot(x)', 'sec(x)', 'csc²(x)', 'A', 'medium'),
('What is the fundamental theorem of calculus?', 'It relates differentiation and integration', 'It defines limits', 'It proves continuity', 'It explains derivatives', 'A', 'hard'),
('What is ∫e^x dx?', 'e^x + C', 'xe^x + C', 'e^x', 'ln(e^x) + C', 'A', 'easy'),
('What is the product rule?', '(fg)'' = f''g + fg''', '(fg)'' = f''g''', '(fg)'' = f''g - fg''', '(fg)'' = fg', 'A', 'medium'),
('What is the quotient rule?', '(f/g)'' = (f''g - fg'')/g²', '(f/g)'' = f''/g''', '(f/g)'' = (f''g + fg'')/g²', '(f/g)'' = f''/g', 'A', 'hard'),
('What is the derivative of x^n?', 'nx^(n-1)', 'nx^n', 'x^(n-1)', '(n-1)x^n', 'A', 'easy'),
('What is ∫x² dx?', 'x³/3 + C', 'x³ + C', '3x² + C', '2x + C', 'A', 'easy'),
('What is the mean value theorem?', 'If f is continuous on [a,b] and differentiable on (a,b), then ∃c∈(a,b) such that f''(c) = (f(b)-f(a))/(b-a)', 'Derivatives always exist', 'Integrals are continuous', 'Limits are unique', 'A', 'hard'),
('What is L''Hôpital''s rule used for?', 'Evaluating indeterminate forms', 'Finding derivatives', 'Solving integrals', 'Proving continuity', 'A', 'medium'),
('What is the derivative of arcsin(x)?', '1/√(1-x²)', '1/(1+x²)', '1/√(1+x²)', '-1/√(1-x²)', 'A', 'hard'),
('What is ∫1/(1+x²) dx?', 'arctan(x) + C', 'ln(1+x²) + C', 'arcsin(x) + C', '1/(2x) + C', 'A', 'medium');