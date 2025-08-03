-- Add foreign key relationship between quiz_attempts and profiles
ALTER TABLE public.quiz_attempts 
ADD CONSTRAINT fk_quiz_attempts_user_id 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Update questions to have 40 questions limit and add sample calculus questions
INSERT INTO public.questions (question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty_level) VALUES
('The fundamental theorem of calculus connects:', 'Derivatives and integrals', 'Limits and continuity', 'Functions and graphs', 'Series and sequences', 'A', 'medium'),
('If f(x) = sin(x), then f''(x) = ?', 'cos(x)', '-cos(x)', '-sin(x)', 'sin(x)', 'C', 'medium'),
('The chain rule states that d/dx[f(g(x))] = ?', 'f''(g(x)) · g''(x)', 'f''(g(x)) + g''(x)', 'f''(g(x)) · g(x)', 'f''(g(x)) / g''(x)', 'A', 'medium'),
('What is lim(x→0) (sin x)/x ?', '0', '1', '∞', 'undefined', 'B', 'hard'),
('A function is continuous at x = a if:', 'lim(x→a) f(x) = f(a)', 'f(a) exists', 'lim(x→a) f(x) exists', 'All of the above', 'D', 'medium'),
('The quotient rule is:', '(u/v)'' = (u''v - uv'')/v²', '(u/v)'' = (u''v + uv'')/v²', '(u/v)'' = u''/v''', '(u/v)'' = (uv'' - u''v)/v²', 'A', 'hard'),
('d/dx[eˣ] = ?', 'eˣ', 'xeˣ⁻¹', 'e', 'ln(x)', 'A', 'easy'),
('∫x²dx = ?', 'x³/3 + C', '2x + C', '3x² + C', 'x³ + C', 'A', 'easy'),
('The derivative of ln(x) is:', '1/x', 'ln(x)/x', 'x', '1', 'A', 'medium'),
('What is the second derivative of x⁴?', '4x³', '12x²', '24x', '4', 'B', 'medium'),
('Integration by parts formula is:', '∫udv = uv - ∫vdu', '∫udv = uv + ∫vdu', '∫udv = ∫udu + ∫vdv', '∫udv = u∫dv', 'A', 'hard'),
('If y = x², then dy/dx = ?', 'x', '2x', 'x²', '2', 'B', 'easy'),
('The mean value theorem applies to functions that are:', 'Continuous and differentiable', 'Only continuous', 'Only differentiable', 'Neither continuous nor differentiable', 'A', 'medium'),
('∫1/x dx = ?', 'ln|x| + C', '1/x² + C', 'x + C', 'x⁻¹ + C', 'A', 'medium'),
('The derivative of tan(x) is:', 'sec²(x)', 'cot(x)', '-sec²(x)', 'csc²(x)', 'A', 'medium'),
('What is lim(x→∞) 1/x ?', '∞', '1', '0', 'undefined', 'C', 'easy'),
('The critical points of a function occur where:', 'f''(x) = 0 or undefined', 'f(x) = 0', 'f''(x) > 0', 'f(x) is continuous', 'A', 'medium'),
('d/dx[cos(x)] = ?', '-sin(x)', 'sin(x)', '-cos(x)', 'cos(x)', 'A', 'easy'),
('The fundamental theorem of calculus part 1 states:', 'd/dx ∫ᵃˣ f(t)dt = f(x)', '∫ᵃᵇ f''(x)dx = f(b) - f(a)', 'Both A and B', 'Neither A nor B', 'A', 'hard'),
('If f(x) = x³ - 3x² + 2x - 1, then f''(1) = ?', '0', '1', '2', '-2', 'A', 'medium'),
('The area under the curve y = x² from x = 0 to x = 2 is:', '8/3', '4', '8', '2', 'A', 'hard'),
('L''Hopital''s rule can be applied when we have:', '0/0 or ∞/∞ forms', 'Any limit', 'Only 0/0 form', 'Only ∞/∞ form', 'A', 'hard'),
('The derivative of x^n is:', 'nx^(n-1)', 'x^(n-1)', 'nx^n', 'n*x', 'A', 'easy'),
('∫e^x dx = ?', 'e^x + C', 'xe^x + C', 'e^x/x + C', 'x*e^x + C', 'A', 'easy'),
('A function has a local maximum at x = c if:', 'f''(c) = 0 and f''''(c) < 0', 'f''(c) > 0', 'f(c) > 0', 'f''''(c) > 0', 'A', 'medium'),
('The implicit differentiation of x² + y² = 25 gives dy/dx = ?', '-x/y', 'x/y', '-y/x', 'y/x', 'A', 'hard'),
('∫cos(x)dx = ?', 'sin(x) + C', '-sin(x) + C', 'cos(x) + C', '-cos(x) + C', 'A', 'easy'),
('The velocity is the derivative of:', 'Position', 'Acceleration', 'Time', 'Distance', 'A', 'medium'),
('What is the derivative of x*ln(x)?', 'ln(x) + 1', 'ln(x)', '1 + 1/x', 'x/ln(x)', 'A', 'hard'),
('The second fundamental theorem of calculus is:', '∫ᵃᵇ f''(x)dx = f(b) - f(a)', 'd/dx ∫f(x)dx = f(x)', 'Both A and B', 'Neither A nor B', 'A', 'hard'),
('If f(x) = 1/x, then ∫f(x)dx = ?', 'ln|x| + C', '-1/x² + C', '1/x² + C', 'x + C', 'A', 'medium'),
('The point of inflection occurs where:', 'f''''(x) = 0 and changes sign', 'f''(x) = 0', 'f(x) = 0', 'f''(x) changes sign', 'A', 'hard'),
('d/dx[x^x] = ?', 'x^x(ln(x) + 1)', 'x*x^(x-1)', 'x^x*ln(x)', 'x^x + x^x*ln(x)', 'A', 'hard'),
('The definite integral ∫₀¹ x dx = ?', '1/2', '1', '0', '2', 'A', 'medium'),
('Rolle''s theorem requires the function to be:', 'Continuous on [a,b], differentiable on (a,b), and f(a)=f(b)', 'Only continuous', 'Only differentiable', 'Only f(a)=f(b)', 'A', 'hard');

-- Create a payment_sessions table to track Stripe payments
CREATE TABLE public.payment_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  stripe_session_id TEXT UNIQUE NOT NULL,
  amount INTEGER NOT NULL, -- Amount in kobo (₦1000 = 100000 kobo)
  currency TEXT DEFAULT 'ngn',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_sessions ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own payment sessions
CREATE POLICY "Users can view their own payment sessions" 
ON public.payment_sessions 
FOR SELECT 
USING (user_email = auth.email());

-- Allow edge functions to manage payment sessions
CREATE POLICY "Edge functions can manage payment sessions" 
ON public.payment_sessions 
FOR ALL 
USING (true);

-- Add payment_verified field to profiles
ALTER TABLE public.profiles 
ADD COLUMN payment_verified BOOLEAN DEFAULT false;

-- Create trigger for payment sessions updates
CREATE TRIGGER update_payment_sessions_updated_at
BEFORE UPDATE ON public.payment_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();