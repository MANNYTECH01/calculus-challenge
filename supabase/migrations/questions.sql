-- This script clears the questions table and inserts a new, comprehensive set of 120 categorized calculus questions.
-- The correct options have been mixed to ensure variety.

-- Step 1: Add a 'category' column to the questions table if it doesn't already exist.
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS category TEXT;

-- Step 2: Purge all old data to ensure a clean slate.
DELETE FROM public.questions;

-- Step 3: Insert the new list of 120 categorized calculus questions.
INSERT INTO public.questions (question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty_level, category) VALUES

-- Category: Functions (15 Questions)
('Which of the following functions is even?', '$f(x) = x^3 + \sin(x)$', '$f(x) = e^x - e^{-x}$', '$f(x) = x^2 \cos(x)$', '$f(x) = x+1$', 'C', 'medium', 'functions'),
('If $f(x) = \ln(x)$ and $g(x) = e^{2x}$, find $(f \circ g)(x)$.', '$e^{2\ln(x)}$', '$x^2$', '$\ln(e^{2x})$', '$2x$', 'D', 'easy', 'functions'),
('Determine if $f(x) = \frac{\sin(x)}{x}$ is odd, even, or neither.', 'Odd', 'Even', 'Neither', 'Both even and odd', 'B', 'medium', 'functions'),
('If $f(x) = 2x - 3$ and $f(g(x)) = 4x^2 - 1$, find $g(x)$.', '$x^2+1$', '$2x^2+1$', '$4x^2-4$', '$2x^2-1$', 'B', 'hard', 'functions'),
('The function $f(x) = \frac{x^2 - 4}{x - 2}$ has a removable discontinuity at $x=2$. What value should be assigned to $f(2)$ to make it continuous?', '2', '0', '4', '1', 'C', 'easy', 'functions'),
('Which function grows the fastest as $x \to \infty$?', '$x^{100}$', '$\ln(x)$', '$e^x$', '$10^x$', 'C', 'medium', 'functions'),
('Find the inverse of the function $f(x) = \sqrt[3]{x-5}$.', '$f^{-1}(x) = (x+5)^3$', '$f^{-1}(x) = 5-x^3$', '$f^{-1}(x) = x^3-5$', '$f^{-1}(x) = x^3+5$', 'D', 'easy', 'functions'),
('If $h(x) = (f - g)(x)$ where $f(x) = 5x+2$ and $g(x)=3x-1$, what is $h(4)$?', '22', '10', '9', '11', 'B', 'easy', 'functions'),
('Given $f(x) = \sin(x)$ and $g(x) = x^2$, which of the following is $(g \circ f)(x)$?', '$\sin(x^2)$', '$\sin^2(x)$', '$x \sin(x)$', '$(\sin(x))^x$', 'B', 'easy', 'functions'),

-- Category: Limits (30 Questions)
('Evaluate $\lim_{x \to 4} \frac{\sqrt{x} - 2}{x - 4}$.', '$1/4$', '$1/2$', '$0$', 'Does not exist', 'A', 'medium', 'limits'),
('What is $\lim_{x \to \infty} \frac{5x^4 - 2x + 1}{3x^4 + x^3 - 8}$?', '$\infty$', '$5/3$', '$0$', '$1/8$', 'B', 'medium', 'limits'),
('Find $\lim_{x \to 0} \frac{\tan(3x)}{x}$.', '0', '1/3', '1', '3', 'D', 'medium', 'limits'),
('Evaluate $\lim_{h \to 0} \frac{(x+h)^3 - x^3}{h}$. This represents the derivative of $x^3$.', '$x^3$', '$3x^2$', '0', 'Does not exist', 'B', 'medium', 'limits'),
('What is $\lim_{x \to \infty} \left(1 + \frac{2}{x}\right)^x$?', '1', '$e$', '$\infty$', '$e^2$', 'D', 'hard', 'limits'),
('Find the limit: $\lim_{x \to 2} \frac{x^2 - x - 2}{x^2 - 4}$.', '1', '$3/4$', '0', 'Does not exist', 'B', 'easy', 'limits'),
('Evaluate $\lim_{x \to 0^+} x \ln(x)$.', '1', '-1', '$-\infty$', '0', 'D', 'hard', 'limits'),
('What is the value of $\lim_{x \to 3^-} \frac{x}{x-3}$?', '$-\infty$', '$\infty$', '0', '1', 'A', 'medium', 'limits'),
('Find $\lim_{x \to \infty} \frac{\sin(x)}{x}$.', '1', '0', '$\infty$', 'Does not exist', 'B', 'easy', 'limits'),
('Evaluate the limit $\lim_{x \to \pi/2} \frac{1 - \sin(x)}{\cos^2(x)}$.', '0', '1', '2', '$1/2$', 'D', 'hard', 'limits'),
('For the function $f(x) = \frac{|x|}{x}$, what is $\lim_{x \to 0} f(x)$?', '0', '1', 'Does not exist', '-1', 'C', 'medium', 'limits'),
('Find $\lim_{x \to 1} \frac{\ln(x)}{x-1}$.', '1', '0', '$e$', 'Does not exist', 'A', 'medium', 'limits'),
('If $\lim_{x \to c} f(x) = 5$ and $\lim_{x \to c} g(x) = -2$, what is $\lim_{x \to c} [f(x)g(x)]^2$?', '-10', '100', '25', '4', 'B', 'easy', 'limits'),
('Evaluate $\lim_{x \to -\infty} \frac{\sqrt{9x^2+1}}{x-2}$.', '3', '-3', '9', '$\infty$', 'B', 'hard', 'limits'),
('What is $\lim_{x \to \infty} (\sqrt{x^2+x} - x)$?', '$1/2$', '1', '0', '$\infty$', 'A', 'hard', 'limits'),
('Evaluate $\lim_{x \to 0} \frac{e^{2x} - 1}{\sin(x)}$.', '1', '2', '0', '$e^2$', 'B', 'medium', 'limits'),
('Which of the following is the formal definition of the derivative?', '$\frac{f(b)-f(a)}{b-a}$', '$\lim_{x \to c} f(x) = L$', '$\int_a^b f(x) dx$', '$\lim_{h \to 0} \frac{f(x+h) - f(x)}{h}$', 'D', 'easy', 'limits'),
('If a function is continuous at a point, must it be differentiable at that point?', 'Yes', 'No', 'Only if the function is polynomial', 'Only if the limit exists', 'B', 'medium', 'limits'),
('What is $\lim_{x \to 0} \frac{\sin(5x)}{\sin(2x)}$?', '5/2', '2/5', '1', '0', 'A', 'medium', 'limits'),
('Evaluate $\lim_{x \to 25} \frac{x-25}{\sqrt{x}-5}$.', '5', '10', '1/10', '25', 'B', 'medium', 'limits'),
('What is $\lim_{x \to 0} (1+3x)^{1/x}$?', '$e^3$', '$e$', '3', '1', 'A', 'hard', 'limits'),
('Evaluate $\lim_{x \to 0} \frac{1-\cos(x)}{x^2}$', '1/2', '0', '1', '2', 'A', 'hard', 'limits'),
('Find $\lim_{x \to \infty} \arctan(x)$.', '$\pi/2$', '$-\pi/2$', '0', '$\infty$', 'A', 'easy', 'limits'),
('If $\lim_{x \to a} f(x)$ exists, which must be true?', '$f(a)$ exists', '$\lim_{x \to a^-} f(x) = \lim_{x \to a^+} f(x)$', '$f(x)$ is continuous at $x=a$', 'All of the above', 'B', 'medium', 'limits'),
('Evaluate $\lim_{x \to 1} \frac{x^{10}-1}{x-1}$', '10', '1', '0', 'Does not exist', 'A', 'medium', 'limits'),

-- Category: Differentiation and Rate (35 Questions)
('Find the derivative of $f(x) = x^{\ln x}$.', '$(\ln x) x^{\ln x - 1}$', '$x^{\ln x} \ln x$', '$x^{\ln x} \frac{2\ln x}{x}$', '$e^{\ln x \ln x}$', 'C', 'hard', 'differentiation'),
('If $f(x) = \int_{1}^{\sqrt{x}} e^{t^2} dt$, what is $f''(x)$?', '$e^x$', '$\frac{e^x}{2\sqrt{x}}$', '$e^{\sqrt{x}}$', '$2xe^{x^2}$', 'B', 'hard', 'differentiation'),
('What is the derivative of $f(x) = \arctan(e^x)$?', '$\frac{e^x}{1+e^{2x}}$', '$e^x \sec^2(e^x)$', '$\frac{1}{1+e^{2x}}$', '$\frac{e^x}{\sqrt{1-e^{2x}}}$', 'A', 'medium', 'differentiation'),
('Find $\frac{dy}{dx}$ if $x^3 + y^3 = 6xy$.', '$\frac{2y+x^2}{y^2+2x}$', '$\frac{x^2}{y^2}$', '$\frac{6y-3x^2}{3y^2-6x}$', '$\frac{2y-x^2}{y^2-2x}$', 'D', 'medium', 'differentiation'),
('The position of a particle is given by $s(t) = t^3 - 6t^2 + 9t$. When is the particle at rest?', '$t=1$', '$t=3$', '$t=1$ and $t=3$', '$t=0$', 'C', 'medium', 'differentiation'),
('Find the critical points of $f(x) = x^{1/3}(x-4)$.', '$x=0$ and $x=4$', '$x=1$ and $x=4$', '$x=0$ and $x=1$', '$x=1$', 'C', 'medium', 'differentiation'),
('What is the second derivative of $f(x) = \ln(\cos(x))$?', '$-\tan(x)$', '$-\sec^2(x)$', '$\sec(x)\tan(x)$', '$-\cot(x)$', 'B', 'medium', 'differentiation'),
('Find the equation of the tangent line to the curve $y=x\sqrt{x}$ at the point $(4, 8)$.', '$y=2x$', '$y=3x-4$', '$y=3x$', '$y=x+4$', 'B', 'medium', 'differentiation'),
('If $f(x) = \sin(x)$, what is the 27th derivative, $f^{(27)}(x)$?', '$\sin(x)$', '$\cos(x)$', '$-\cos(x)$', '$-\sin(x)$', 'C', 'medium', 'differentiation'),
('The radius of a circle is increasing at a rate of 2 cm/s. At what rate is the area increasing when the radius is 10 cm?', '$20\pi$ cm²/s', '$40\pi$ cm²/s', '$100\pi$ cm²/s', '$4\pi$ cm²/s', 'B', 'medium', 'differentiation'),
('Find the point of inflection for $f(x) = x^3 - 3x^2 + 2$.', '$x=1$', '$x=0$', '$x=2$', '$x=-1$', 'A', 'easy', 'differentiation'),
('What is the derivative of $f(x) = \csc(x)$?', '$\sec(x)\tan(x)$', '$-\csc(x)\cot(x)$', '$\csc^2(x)$', '$-\cot^2(x)$', 'B', 'easy', 'differentiation'),
('If $f(x)=2^{x^2}$, find $f''(x)$.', '$x^2 \cdot 2^{x^2-1}$', '$2^{x^2} \ln(2)$', '$2^{x^2} \cdot 2x \ln(2)$', '$2x \cdot 2^{x^2}$', 'C', 'medium', 'differentiation'),
('Find the derivative of $f(x) = \log_3(x^2+1)$.', '$\frac{2x}{x^2+1}$', '$\frac{2x}{(x^2+1)\ln(3)}$', '$\frac{1}{(x^2+1)\ln(3)}$', '$\frac{\ln(3)}{x^2+1}$', 'B', 'medium', 'differentiation'),
('If $y = \sin^{-1}(2x)$, what is $\frac{dy}{dx}$?', '$\frac{1}{\sqrt{1-4x^2}}$', '$\frac{2}{\sqrt{1-x^2}}$', '$2\cos(2x)$', '$\frac{2}{\sqrt{1-4x^2}}$', 'D', 'medium', 'differentiation'),
('A ladder 10 ft long rests against a vertical wall. If the bottom of the ladder slides away from the wall at a rate of 1 ft/s, how fast is the top of the ladder sliding down the wall when the bottom of the ladder is 6 ft from the wall?', '-4/3 ft/s', '-1 ft/s', '-3/4 ft/s', '-2 ft/s', 'C', 'hard', 'differentiation'),
('Find the absolute maximum value of $f(x) = x - x^3$ on the interval $[-2, 2]$.', '$2/(3\sqrt{3})$', '-2', '2', '0', 'A', 'medium', 'differentiation'),
('What is the derivative of $f(x) = |x^2-4|$ at $x=1$?', '-2', '2', '0', 'Does not exist', 'A', 'medium', 'differentiation'),
('If $f(x)$ is a differentiable function and $f(2)=5, f''(2)=-1$, find the derivative of $\frac{f(x)}{x^2}$ at $x=2$.', '-1/4', '-9/8', '9/8', '1/4', 'B', 'hard', 'differentiation'),
('Find the derivative of $f(x) = \sec(x^2)$.', '$2x \sec(x^2) \tan(x^2)$', '$\sec(x) \tan(x)$', '$2x \tan(x^2)$', '$\sec^2(x^2)$', 'A', 'medium', 'differentiation'),
('What is the slope of the normal line to $y=x^3$ at $x=2$?', '12', '-12', '-1/12', '1/8', 'C', 'medium', 'differentiation'),
('Rolle''s Theorem is a special case of which theorem?', 'Squeeze Theorem', 'Mean Value Theorem', 'Intermediate Value Theorem', 'Fundamental Theorem of Calculus', 'B', 'easy', 'differentiation'),
('A particle moves along a line so that its velocity at time $t$ is $v(t)=t^2-t-6$. Find the displacement of the particle during the time period $1 \le t \le 4$.', '9/2', '-15/2', '15/2', '-9/2', 'D', 'medium', 'differentiation'),
('Find the derivative of $f(x) = (x+1)^x$.', '$x(x+1)^{x-1}$', '$(x+1)^x \left( \ln(x+1) + \frac{x}{x+1} \right)$', '$(x+1)^x \ln(x+1)$', 'Cannot be differentiated', 'B', 'hard', 'differentiation'),
('What does L''Hopital''s Rule help to evaluate?', 'Definite integrals', 'Continuity of a function', 'Indeterminate forms of limits', 'Derivatives of complex functions', 'C', 'easy', 'differentiation'),
('The position of a particle is $p(t)=e^{-t}\sin(t)$. Find its acceleration at $t=\pi$.', '0', '$e^{-\pi}$', '1', '$-e^{-\pi}$', 'B', 'hard', 'differentiation'),
('Find the average rate of change of $f(x) = x^3$ on the interval $[1,3]$.', '13', '26', '9', '27', 'A', 'easy', 'differentiation'),
('Find the derivative of $f(x) = \cosh(x) = \frac{e^x+e^{-x}}{2}$', '$\sinh(x)$', '$-\sinh(x)$', '$\cosh(x)$', '$-\cosh(x)$', 'A', 'medium', 'differentiation'),
('Find the derivative of $g(t) = t^3 e^t$ at $t=1$.', '$4e$', '$3e$', '$e$', '$2e$', 'A', 'medium', 'differentiation'),
('The function $f(x)=x^3-6x^2+5$ is decreasing on which interval?', '(0, 4)', '(-$\infty$, 0)', '(4, $\infty$)', '(0, 2)', 'A', 'medium', 'differentiation'),
('If $f(x) = g(h(x))$, $h(1)=2$, $h''(1)=3$, $g''(2)=4$, find $f''(1)$.', '12', '7', 'Cannot be determined', '6', 'C', 'hard', 'differentiation'),
('Find the derivative of $f(x) = \sqrt{x^2+1}$.', '$\frac{x}{\sqrt{x^2+1}}$', '$\frac{1}{2\sqrt{x^2+1}}$', '$x\sqrt{x^2+1}$', '$\frac{2x}{\sqrt{x^2+1}}$', 'A', 'easy', 'differentiation'),

-- Category: Integration, Volume & Area (30 Questions)
('Evaluate $\int (3x^2+1)(x^3+x)^3 \, dx$.', '$(x^3+x)^4+C$', '$4(x^3+x)^4+C$', '$\frac{1}{4}(x^3+x)^4+C$', '$(6x)(3(x^3+x)^2)+C$', 'C', 'medium', 'integration'),
('Find the area of the region bounded by $y=e^x$, $y=e^{-x}$, $x=0$, and $x=1$.', '$e+1/e$', '$e + 1/e - 2$', '$e - 1/e$', '$e-1$', 'B', 'medium', 'integration'),
('Evaluate the integral $\int \frac{\ln(x)}{x} dx$.', '$\ln|x| + C$', '$\frac{1}{2}(\ln x)^2 + C$', '$\ln(\ln x) + C$', '$x \ln x - x + C$', 'B', 'easy', 'integration'),
('Find the volume of the solid generated by revolving the region bounded by $y=\sqrt{x}$, $x=1$, $x=4$ and the x-axis about the x-axis.', '$7\pi$', '$15\pi/2$', '$8\pi$', '$14\pi/3$', 'B', 'medium', 'integration'),
('Evaluate $\int_0^{\pi/2} \sin^3(x)\cos(x) dx$.', '1/3', '1/2', '1/4', '1', 'C', 'medium', 'integration'),
('What is the average value of $f(x)=\sin(x)$ on the interval $[0, \pi]$?', '$2/\pi$', '$1/2$', '1', '$\pi/2$', 'A', 'medium', 'integration'),
('Use integration by parts to evaluate $\int x e^x dx$.', '$xe^x + e^x + C$', '$xe^x - e^x + C$', '$x e^x + C$', '$\frac{1}{2}x^2 e^x + C$', 'B', 'medium', 'integration'),
('Find the length of the curve $y = \frac{2}{3}x^{3/2}$ from $x=0$ to $x=3$.', '8', '7', '$2\sqrt{3}$', '$14/3$', 'D', 'hard', 'integration'),
('Evaluate the improper integral $\int_1^\infty \frac{1}{x^2} dx$.', '1', '2', '$\infty$', '0', 'A', 'medium', 'integration'),
('The area of the region enclosed by the graphs of $y=x^2$ and $y=x$ is', '1/3', '1/2', '5/6', '1/6', 'D', 'easy', 'integration'),
('Evaluate $\int \tan(x) dx$.', '$\sec^2(x) + C$', '$\ln|\sin x| + C$', '$\ln|\sec x| + C$', '$\cot(x) + C$', 'C', 'medium', 'integration'),
('Find the volume of the solid obtained by rotating the region under the curve $y=1/x$ from $x=1$ to $x=2$ about the y-axis (Shell Method).', '$\pi$', '$\pi \ln(2)$', '$2\pi \ln(2)$', '$2\pi$', 'D', 'hard', 'integration'),
('Evaluate $\int \frac{1}{x^2+4} dx$.', '$\ln(x^2+4) + C$', '$\frac{1}{2}\arctan(\frac{x}{2}) + C$', '$\arctan(\frac{x}{2}) + C$', '$\frac{1}{4}\arctan(x) + C$', 'B', 'medium', 'integration'),
('What does the Fundamental Theorem of Calculus Part 1 state?', '$\int_a^b f(x)dx = F(b)-F(a)$', 'Every continuous function has an antiderivative', 'If $g(x) = \int_a^x f(t)dt$, then $g''(x)=f(x)$', 'The integral of a rate of change is the net change', 'C', 'easy', 'integration'),
('Use partial fractions to evaluate $\int \frac{1}{x(x-1)} dx$.', '$\ln|x(x-1)| + C$', '$\ln|\frac{x-1}{x}| + C$', '$-\frac{1}{x^2} - \frac{1}{(x-1)^2} + C$', '$\arctan(x) - \arctan(x-1) + C$', 'B', 'hard', 'integration'),
('The integral $\int_0^2 \sqrt{4-x^2} dx$ represents the area of...', 'A semi-circle of radius 2', 'A quarter-circle of radius 2', 'A circle of radius 2', 'A square with side 2', 'B', 'medium', 'integration'),
('Evaluate $\int \sec^3(x) dx$.', '$\frac{1}{2}(\sec x \tan x + \ln|\sec x + \tan x|) + C$', '$\frac{1}{2}\sec x \tan x + C$', '$\frac{\tan^2(x)}{2} + C$', '$\ln|\sec x + \tan x| + C$', 'A', 'hard', 'integration'),
('Evaluate $\int_0^1 \frac{x}{x^2+1} dx$.', '$\ln(2)$', '$\pi/4$', '$\frac{1}{2}\ln(2)$', '1', 'C', 'medium', 'integration'),
('Find the area between the curves $y=\sin(x)$ and $y=\cos(x)$ from $x=0$ to $x=\pi/4$.', '$\sqrt{2}-1$', '$2\sqrt{2}$', '1', '$\frac{\sqrt{2}}{2}$', 'A', 'medium', 'integration'),
('$\int_1^e \frac{1}{x} dx$ is...', 'e', '0', '1', 'Does not exist', 'C', 'easy', 'integration'),
('Use trigonometric substitution to evaluate $\int \frac{dx}{\sqrt{1-x^2}}$.', '$\arctan(x)+C$', '$\arcsin(x)+C$', '$\ln|\sqrt{1-x^2}|+C$', '$x\sqrt{1-x^2}+C$', 'B', 'medium', 'integration'),
('The surface area of the solid obtained by rotating $y=x^3$ on $[0,1]$ about the x-axis is given by which integral?', '$2\pi \int_0^1 x^3 \sqrt{1+9x^4} dx$', '$2\pi \int_0^1 x \sqrt{1+9x^4} dx$', '$\pi \int_0^1 (x^3)^2 dx$', '$2\pi \int_0^1 \sqrt{1+9x^4} dx$', 'A', 'hard', 'integration'),
('Evaluate $\int_0^{\pi} \cos^2(x) dx$.', '$\pi$', '$\pi/2$', '0', '$2\pi$', 'B', 'medium', 'integration'),
('If $\int_2^5 f(x)dx = 10$ and $\int_2^5 g(x)dx = -3$, what is $\int_2^5 [2f(x) - 3g(x)]dx$?', '11', '20', '-9', '29', 'D', 'easy', 'integration'),
('Which integration technique would be best for $\int \frac{3x-5}{x^2-2x-3} dx$?', 'Integration by Parts', 'Trigonometric Substitution', 'Partial Fractions', 'U-Substitution', 'C', 'easy', 'integration'),
('The volume of a solid with a known cross-sectional area $A(x)$ from $x=a$ to $x=b$ is', '$\int_a^b A(x)^2 dx$', '$\pi \int_a^b A(x) dx$', '$\int_a^b A(x) dx$', '$A(b)-A(a)$', 'C', 'easy', 'integration'),
('Evaluate $\int_0^4 |x-2| dx$.', '4', '2', '0', '8', 'A', 'medium', 'integration'),
('$\int \sin^2(x) dx = $', '$\frac{1}{2}x - \frac{1}{4}\sin(2x)+C$', '$\frac{1}{3}\sin^3(x)+C$', '$\cos^2(x)+C$', '$-\frac{1}{2}\cos(2x)+C$', 'A', 'hard', 'integration'),
('Find $\int x^2\ln(x)dx$.', '$\frac{x^3\ln(x)}{3} - \frac{x^3}{9}+C$', '$\frac{x^3\ln(x)}{3}+C$', '$2x\ln(x)+x+C$', '$x^3\ln(x) - \frac{x^3}{3}+C$', 'A', 'hard', 'integration'),
('The area of one petal of the rose curve $r = \sin(3\theta)$ is', '$\pi/12$', '$\pi/6$', '$\pi/3$', '$\pi/24$', 'A', 'hard', 'integration'),

-- Category: Applications (10 Questions)
('A company''s profit from selling x units of a product is $P(x) = -0.1x^2 + 50x - 1000$. How many units should be sold to maximize profit?', '500 units', '250 units', '100 units', '1000 units', 'B', 'medium', 'applications'),
('Water is leaking from a conical tank at a rate of 2 ft³/min. The tank has a height of 16 ft and a base radius of 4 ft. How fast is the water level falling when the water is 8 ft deep?', '1/π ft/min', '2/π ft/min', '1/(2π) ft/min', 'π/2 ft/min', 'C', 'hard', 'applications'),
('A population of bacteria grows according to the equation $P(t) = P_0 e^{kt}$. If the population doubles in 5 hours, what is the value of $k$?', '$\frac{\ln 2}{5}$', '$5 \ln 2$', '$\ln(2/5)$', '$\frac{2}{5}$', 'A', 'medium', 'applications'),
('The work done in stretching a spring from its natural length of 10 cm to 15 cm is 2 J. What is the spring constant $k$ (in N/m)?', '800', '1600', '400', '200', 'B', 'hard', 'applications'),
('A particle''s velocity is $v(t) = 3t^2 - 12$. Find the total distance traveled from $t=0$ to $t=3$.', '7', '-9', '23', '16', 'C', 'medium', 'applications'),
('According to Newton''s Law of Cooling, the rate of cooling of an object is proportional to the difference between its temperature and the ambient temperature. This is modeled by which differential equation?', '$\frac{dT}{dt} = k(T_s - T)$', '$\frac{dT}{dt} = k(T - T_s)$', '$\frac{dT}{dt} = kT$', '$T(t) = T_s + (T_0-T_s)e^{-kt}$', 'B', 'medium', 'applications'),
('If the marginal cost to produce x items is $C''(x) = 3x^2 - 4x + 5$, find the cost function $C(x)$ given that the fixed cost is $C(0)=\$10$.', '$x^3 - 2x^2 + 5x$', '$6x - 4$', '$x^3 - 2x^2 + 5x + 10$', '$3x^2 - 4x + 15$', 'C', 'medium', 'applications'),
('The half-life of Carbon-14 is approximately 5730 years. What is the decay rate $k$?', '$k = -\frac{\ln 2}{5730}$', '$k = \frac{\ln 2}{5730}$', '$k = -5730 \ln 2$', '$k = \ln(2) \cdot 5730$', 'A', 'medium', 'applications'),
('A cylindrical can is to be made to hold 1 L of oil. Find the dimensions that will minimize the cost of the metal to manufacture the can (minimize surface area).', '$r=h$', '$h=2r$', '$r=2h$', '$r = \sqrt[3]{1/(2\pi)}$ and $h=2r$', 'D', 'hard', 'applications'),
('Find the logistic growth model given by $\frac{dy}{dt} = ky(1 - \frac{y}{L})$ where L is the carrying capacity.', '$y(t) = \frac{L}{1+Ae^{-kt}}$', '$y(t) = L(1-e^{-kt})$', '$y(t) = Ae^{kt}$', '$y(t) = \frac{A}{1+Le^{-kt}}$', 'A', 'hard', 'applications'),





('Find \[ \int \left( \frac{\cos x}{\sin^2 x} - 2e^{2x} \right) dx \]', 
 '\( \csc x - e^{2x} + c \)', 
 '\( -\csc x - 3e^{2x} + c \)', 
 '\( -\csc x - e^{2x} + c \)', 
 '\( \csc x - 2e^{2x} + c \)', 
 'C', 
 'medium', 
 'integration'),

-- Question 2 from Group B(1).pdf
('Obtain \(\int \sin^2 x \, dx\)', 
 '\( \frac{1}{2} x - \frac{\sin 2x}{2} \)', 
 '\( \frac{1}{4} x + \frac{\sin 2x}{2} \)', 
 '\( \frac{1}{4} x - \frac{\sin x}{4} \)', 
 '\( \frac{1}{2} x - \frac{\sin 2x}{4} \)', 
 'D', 
 'medium', 
 'integration'),

-- Question 3 from Group B(1).pdf
('Given that \( y = \frac{x}{2x+5} \). Find \( \frac{dy}{dx} \)',
 '\( \frac{2}{(2x+5)^2} \)',
 '\( \frac{3}{(2x+5)^2} \)',
 '\( \frac{4}{(2x+5)^2} \)',
 '\( \frac{5}{(2x+5)^2} \)',
 'D',
 'easy',
 'differentiation'),

-- Question 4 from Group B(1).pdf
('The Product rule of differentiation formula for the function \( V = r(x)s(x) \, \text{is...} \)',
 '\(\frac{dV}{dr} = x \frac{ds}{dr} + s \frac{dr}{dx}\)',
 '\(\frac{dx}{dV} = r \frac{ds}{dx} + s \frac{dr}{dx}\)',
 '\(\frac{dV}{dr} = x \frac{ds}{dr} - s \frac{dr}{dx}\)',
 '\(\frac{dV}{dx} = r \frac{ds}{dx} + s \frac{dr}{dx}\)',
 'D',
 'easy',
 'differentiation'),

-- Question 5 from Group B(1).pdf
('Given the function \( f(x-5) = 3x^2 - x + 1 \), evaluate \( f(x) \)',
 '\( 3x^2 + 29x + 81 \)',
 '\( 3x^2 - 29x - 71 \)',
 '\( 3x^2 + 29x + 71 \)',
 '\( 3x^2 - 3x + 1 \)',
 'C',
 'medium',
 'functions'),

-- Question 6 from Group B(1).pdf
('Find \(\frac{dy}{dx}\) of \(y = \frac{cosec x}{cot x}\)',
 '\(sec x + tan x\)',
 '\(cosec x + cot x\)',
 '\(sec x tan x\)',
 'none of the above',
 'D',
 'medium',
 'differentiation'),

-- Question 7 from Group B(1).pdf
('Which of the following option best describes the reduction formula for  
\[V_n = \int cosec^n x \, dx, \quad n \geq 2.\]',
 '\(\frac{-1}{n-1} cosec^{n-2}x \, cot x + \frac{n-2}{n-1} V_{n-2}\)',
 '\(\frac{-1}{1-n} cosec^{n-2}x \, cot x - \frac{n-2}{n-1} V_{n-2}\)',
 '\(\frac{-1}{n-1} cosec^{n-2}x \, tan x + \frac{n-2}{n-1} V_{n-2}\)',
 'None',
 'A',
 'hard',
 'integration'),

-- Question 8 from Group B(1).pdf
('\(\frac{d}{dx} (3x^2 \cos^{-1}x) = ...\)',
 '\( 6x \cos^{-1}x - \frac{3x^2}{\sqrt{1-x^2}} \)',
 '\( 6x \cos^{-1}x - \frac{3x^2}{\sqrt{x^2-1}} \)',
 '\( 6x \cos^{-1}x - \frac{3x^2}{x\sqrt{1-x^2}} \)',
 '\( 6x \cos^{-1}x + \frac{3x^2}{\sqrt{1-x^2}} \)',
 'A',
 'medium',
 'differentiation'),

-- Question 9 from Group B(1).pdf
('\(\lim_{x \to 3} \frac{x^5 - 243}{x^8 - 27} \text{ equal}\)',
 '25',
 '15',
 '10',
 '9',
 'B',
 'hard',
 'limits'),

-- Question 10 from Group B(1).pdf
('Find \[ \int \ln \frac{x}{2} \, dx \]',
 '\( e^x \)',
 '\(\frac{x}{2}(\ln x - 1)\)',
 '\(\frac{1}{x}\)',
 '\( x \left( \ln \frac{x}{2} - 1 \right) \)',
 'D',
 'medium',
 'integration'),

-- Question 1 from Group B-1.pdf
('Given that \( y = \frac{x}{2x+5} \). Find \(\frac{dy}{dx}\)',
 '\( \frac{2}{(2x+5)^2} \)',
 '\( \frac{3}{(2x+5)^2} \)',
 '\( \frac{4}{(2x+5)^2} \)',
 '\( \frac{5}{(2x+5)^2} \)',
 'D',
 'easy',
 'differentiation'),

-- Question 2 from Group B-1.pdf
('Find \[ \int \frac{dx}{4 + 9x^2} \]',
 '\(\frac{1}{3}\tan^{-1}(\frac{3x}{2})\)',
 '\(\frac{1}{6}\tan^{-1}(\frac{3x}{2})\)',
 '\(\frac{2}{3}\ln(\frac{2 + 3x}{2})\)',
 '\(\ln(4 + 9x^2)\)',
 'B',
 'medium',
 'integration'),

-- Question 3 from Group B-1.pdf
('\(\frac{d}{dx} (cosec^{-1}(5x)) = ...\)',
 '\(-\frac{1}{5x\sqrt{25x^2 - 1}}\)',
 '\(-\frac{1}{x\sqrt{25x^2 - 1}}\)',
 '\(-\frac{5}{x\sqrt{25x^2 - 1}}\)',
 '\(-\frac{1}{5x\sqrt{25x^2 - 1}}\)',
 'C',
 'medium',
 'differentiation'), 


 -- Question 4 from Group B-1.pdf
('\(\frac{d}{dx} (3x^2 cos^{-1}x) = ...\)',
 '\(6x cos^{-1}x - \frac{3x^2}{\sqrt{1-x^2}}\)',
 '\(6x cos^{-1}x - \frac{3x^2}{\sqrt{x^2-1}}\)',
 '\(6x cos^{-1}x - \frac{3x^2}{x\sqrt{1-x^2}}\)',
 '\(6x cos^{-1}x + \frac{3x^2}{\sqrt{1-x^2}}\)',
 'A',
 'medium',
 'differentiation'),

-- Question 5 from Group B-1.pdf
('Given the function \( f(x-5) = 3x^2 - x + 1 \), evaluate \( f(x) \)',
 '\( 3x^2 + 29x + 81 \)',
 '\( 3x^2 - 29x - 71 \)',
 '\( 3x^2 + 29x + 71 \)',
 '\( 3x^2 - 3x + 1 \)',
 'C',
 'medium',
 'functions'),

-- Question 6 from Group B-1.pdf
('Find \[\int \left( \frac{\cos x}{\sin^2 x} - 2e^{2x} \right) dx\]',
 '\( \cos e x - e^{2x} + c \)',
 '\( -\cos e x - 3e^{2x} + c \)',
 '\( -\cos e x - e^{2x} + c \)',
 '\( \cos e x - 2e^{2x} + c \)',
 'C',
 'medium',
 'integration'),

-- Question 7 from Group B-1.pdf
('Find \[\int \ln \frac{x}{2} dx\]',
 '\( e^x \)',
 '\( \frac{x}{2} (\ln x - 1) \)',
 '\( \frac{1}{x} \)',
 '\( x \left( \ln \frac{x}{2} - 1 \right) \)',
 'D',
 'medium',
 'integration'),

-- Question 8 from Group B-1.pdf
('Given that a is a positive constant, evaluate \[ \int_{a}^{2a} \left( \frac{2x+1}{x} \right) dx \)',
 '\( 3a + \ln 4 \)',
 '\( 4a + \ln 3 \)',
 '\( -3a + \ln 3 \)',
 '\( 5a + \ln 3 \)',
 'A',
 'medium',
 'integration'),

-- Question 9 from Group B-1.pdf
('Integrate \[ \int \sec^2 x \tan x dx \]',
 '\( 2 \sec^2 x \)',
 '\( \tan^2 x \)',
 '\( \frac{1}{2} \sec^2 x \)',
 '\( \cos e x \cot x \)',
 'C',
 'medium',
 'integration'),

-- Question 10 from Group B-1.pdf
('Given the functions \( f(x) = 3x^2 - 5 \), \( g(x) = 5x - 1 \) evaluate \( f(g(x)) \)',
 '\( 75x^2 - 30x - 2 \)',
 '\( 25x^2 + 2x + 7 \)',
 '\( 75x^2 + 3x + 1 \)',
 '\( 70x-70 \)',
 'A',
 'easy',
 'functions'),

-- Question 1 from Group B-3.pdf
('Given that \( x^3 + x + y^3 + 3y = 6 \). Find \(\frac{dy}{dx}\) at (1, 1)',
 '\(-\frac{3}{4}\)',
 '\(\frac{2}{3}\)',
 '\(\frac{5}{2}\)',
 '\(-\frac{2}{3}\)',
 'D',
 'hard',
 'differentiation'),

-- Question 2 from Group B-3.pdf
('The Wallis formula for \(\int_{0}^{2\pi} \sin^n x \, dx, n \geq 2\) and \(n\) is an odd number, is',
 '\((n-1)(n-3)(n-5)...6.4.2\)',
 '\(\frac{4.(n-1)(n-3)(n-5)...6.4.2}{(n-2)(n-4)(n-6)...5.3.1}\)',
 '\(\frac{4.(n-1)(n-3)(n-5)...6.4.2}{(n-2)(n-4)(n-6)...5.3.1}\)',
 '\(\frac{4.(n-1)(n-3)(n-5)...5.3.1}{(n-2)(n-4)(n-6)...6.4.2}\)',
 'C',
 'hard',
 'integration'),

-- Question 3 from Group B-3.pdf
('Find \(\frac{dy}{dx}\) of \(y = \frac{cosec \, x}{cot \, x}\)',
 '\(sec \, x + tan \, x\)',
 '\(cosec \, x + cot \, x\)',
 '\(sec \, x \, tan \, x\)',
 'none of the above',
 'D',
 'medium',
 'differentiation'),



 -- Question 4 from Group B-3.pdf
('The Product rule of differentiation formula for the function \( V = r(x)s(x) \) is...',
 '\(\frac{dV}{dr} = x \frac{ds}{dr} + s \frac{dr}{dx}\)',
 '\(\frac{dx}{dV} = r \frac{ds}{dx} + s \frac{dr}{dx}\)',
 '\(\frac{dV}{dr} = x \frac{ds}{dr} - s \frac{dr}{dx}\)',
 '\(\frac{dV}{dx} = r \frac{ds}{dx} + s \frac{dr}{dx}\)',
 'D',
 'easy',
 'differentiation'),

-- Question 5 from Group B-3.pdf
('\(\lim_{x \to 3} \frac{x^5 - 243}{x^8 - 27} \text{ equal}\)',
 '25',
 '15',
 '10',
 '9',
 'B',
 'hard',
 'limits'),

-- Question 6 from Group B-3.pdf
('Given the functions \( f(x) = 3x^2 - 5 \), \( g(x) = 5x - 1 \) evaluate \( f(g(x)) \)',
 '\( 75x^2 - 30x - 2 \)',
 '\( 25x^2 + 2x + 7 \)',
 '\( 75x^2 + 3x + 1 \)',
 '\( 70x-70 \)',
 'A',
 'easy',
 'functions'),

-- Question 7 from Group B-3.pdf
('Find \[\int \frac{dx}{4 + 9x^2}\]',
 '\(\frac{1}{3} \tan^{-1} \left( \frac{3x}{2} \right)\)',
 '\(\frac{1}{6} \tan^{-1} \left( \frac{3x}{2} \right)\)',
 '\(\frac{2}{3} \ln \left( \frac{2 + 3x}{2} \right)\)',
 '\(\ln (4 + 9x^2)\)',
 'B',
 'medium',
 'integration'),

-- Question 8 from Group B-3.pdf
('Given that \( y = \frac{x}{2x+5} \). Find \(\frac{dy}{dx}\)',
 '\(\frac{2}{(2x+5)^2}\)',
 '\(\frac{3}{(2x+5)^2}\)',
 '\(\frac{4}{(2x+5)^2}\)',
 '\(\frac{5}{(2x+5)^2}\)',
 'D',
 'easy',
 'differentiation'),

-- Question 9 from Group B-3.pdf
('Find \(\int \ln \frac{x}{2} dx\)',
 '\(e^x\)',
 '\(\frac{x}{2}(\ln x - 1)\)',
 '\(\frac{1}{x}\)',
 '\(x(\ln \frac{x}{2} - 1)\)',
 'D',
 'medium',
 'integration'),

-- Question 10 from Group B-3.pdf
('The nth term of the Maclaurin series expansion of cos 3x is',
 '\(\frac{(-1)^n (3x)^{2n}}{2n}\)',
 '\(\frac{(-1)^{2n} (3x)^{2n}}{(2n)!}\)',
 '\(\frac{(-1)^n (3x)^{2n+1}}{(2n+1)!}\)',
 '\(\frac{(-1)^n (3x)^{2n}}{(2n)!}\)',
 'D',
 'hard',
 'differentiation'),

-- Question 1 from Group B-4.pdf
('The Product rule of differentiation formula for the function \( V = r(x)s(x) \) is',
 '\(\frac{dV}{dr} = x \frac{ds}{dr} + s \frac{dr}{dx}\)',
 '\(\frac{dx}{dV} = r \frac{ds}{dx} + s \frac{dr}{dx}\)',
 '\(\frac{dV}{dr} = x \frac{ds}{dr} - s \frac{dr}{dx}\)',
 '\(\frac{dV}{dx} = r \frac{ds}{dx} + s \frac{dr}{dx}\)',
 'D',
 'easy',
 'differentiation'),

-- Question 2 from Group B-4.pdf
('Which of the following option best describes the reduction formula for \( V_n = \int cosec^n x dx, n \geq 2 \)',
 '\(\frac{-1}{n-1} cosec^{n-2} x \cot x + \frac{n-2}{n-1} V_{n-2}\)',
 '\(\frac{-1}{1-n} cosec^{n-2} x \cot x - \frac{n-2}{n-1} V_{n-2}\)',
 '\(\frac{-1}{n-1} cosec^{n-2} x \tan x + \frac{n-2}{n-1} V_{n-2}\)',
 'None',
 'A',
 'hard',
 'integration');

-- Question 3 from Group B-4.pdf

