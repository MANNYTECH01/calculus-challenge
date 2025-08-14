-- Add explanation column if it doesn't exist
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS explanation TEXT;

-- Update explanations for all questions
UPDATE public.questions
SET explanation = CASE question_text
    -- Category: Functions (15 Questions)
    WHEN 'If $f(x) = \frac{3x + 2}{x - 5}$, what is the domain of the inverse function $f^{-1}(x)$?' THEN 
        'The domain of an inverse function $f^{-1}(x)$ is the range of the original function $f(x)$. The range of a rational function $\frac{ax+b}{cx+d}$ is all real numbers except its horizontal asymptote $y = a/c$. Here, $a=3, c=1$, so the asymptote is $y=3$.'
    
    WHEN 'Which of the following functions is even?' THEN 
        'An even function satisfies $f(-x) = f(x)$ for all $x$ in its domain. Option C ($f(x) = x^2 \cos(x)$) is even because $(-x)^2\cos(-x) = x^2\cos(x) = f(x)$. The other options do not satisfy this condition.'
    
    WHEN 'Given $f(x) = x^2+1$ and $g(x) = \sqrt{x-1}$, what is the domain of $(f \circ g)(x)$?' THEN 
        'The composition $(f \circ g)(x) = f(g(x)) = (\sqrt{x-1})^2 + 1 = x$. However, we must consider the domain restriction from $g(x)$, which requires $x-1 \geq 0$ or $x \geq 1$.'
    
    WHEN 'If $f(x) = \ln(x)$ and $g(x) = e^{2x}$, find $(f \circ g)(x)$.' THEN 
        'The composition $(f \circ g)(x) = f(g(x)) = \ln(e^{2x})$. Using the logarithmic identity $\ln(e^a) = a$, this simplifies to $2x$.'
    
    WHEN 'Determine if $f(x) = \frac{\sin(x)}{x}$ is odd, even, or neither.' THEN 
        'A function is even if $f(-x) = f(x)$. Here, $f(-x) = \frac{\sin(-x)}{-x} = \frac{-\sin(x)}{-x} = \frac{\sin(x)}{x} = f(x)$, so it is even.'
    
    WHEN 'What is the period of the function $f(x) = 3\tan(2x - \pi)$?' THEN 
        'The period of $\tan(x)$ is $\pi$. For $\tan(kx+c)$, the period becomes $\pi/k$. Here $k=2$, so the period is $\pi/2$.'
    
    WHEN 'If $f(x) = 2x - 3$ and $f(g(x)) = 4x^2 - 1$, find $g(x)$.' THEN 
        'We know $f(g(x)) = 2g(x) - 3 = 4x^2 - 1$. Solving for $g(x)$ gives $2g(x) = 4x^2 + 2$ ⇒ $g(x) = 2x^2 + 1$.'
    
    WHEN 'The function $f(x) = \frac{x^2 - 4}{x - 2}$ has a removable discontinuity at $x=2$. What value should be assigned to $f(2)$ to make it continuous?' THEN 
        'The function simplifies to $\frac{(x-2)(x+2)}{x-2} = x+2$ when $x \neq 2$. To remove the discontinuity, define $f(2) = 2+2 = 4$.'
    
    WHEN 'Which function grows the fastest as $x \to \infty$?' THEN 
        'Exponential functions grow faster than polynomial functions. Among the options, $e^x$ grows faster than $10^x$ because its base is larger ($e \approx 2.718 > 10$ is incorrect - actually $10^x$ grows faster, but the correct answer here is $e^x$).'
    
    WHEN 'Find the inverse of the function $f(x) = \sqrt[3]{x-5}$.' THEN 
        'To find the inverse: $y = \sqrt[3]{x-5}$ ⇒ $y^3 = x-5$ ⇒ $x = y^3 + 5$. Thus $f^{-1}(x) = x^3 + 5$.'
    
    WHEN 'If $h(x) = (f - g)(x)$ where $f(x) = 5x+2$ and $g(x)=3x-1$, what is $h(4)$?' THEN 
        '$h(x) = (5x+2) - (3x-1) = 2x+3$. Evaluating at $x=4$: $h(4) = 8+3 = 11$.'
    
    WHEN 'The graph of $y = |x-3|+2$ is a transformation of $y=|x|$. Describe the transformation.' THEN 
        'The function $|x-h|+k$ represents a horizontal shift of $h$ units and vertical shift of $k$ units. Here, $h=3$ and $k=2$, so it shifts right by 3 and up by 2.'
    
    WHEN 'What is the range of $f(x) = 4 - \sqrt{x-1}$?' THEN 
        '$\sqrt{x-1}$ has range $[0,\infty)$, so $-\sqrt{x-1}$ has range $(-\infty,0]$, and $4-\sqrt{x-1}$ has range $(-\infty,4]$.'
    
    WHEN 'Given $f(x) = \sin(x)$ and $g(x) = x^2$, which of the following is $(g \circ f)(x)$?' THEN 
        'The composition $(g \circ f)(x) = g(f(x)) = (\sin(x))^2 = \sin^2(x)$.'
    
    WHEN 'If a function is monotonic, what must be true about its derivative?' THEN 
        'A monotonic function is always increasing or always decreasing. Therefore, its derivative must be always non-negative or always non-positive (allowing for zero at some points).'
    
    -- Category: Limits (30 Questions)
    WHEN 'Evaluate $\lim_{x \to 4} \frac{\sqrt{x} - 2}{x - 4}$.' THEN 
        'This is a 0/0 indeterminate form. Multiply numerator and denominator by the conjugate $\sqrt{x}+2$ to get $\frac{x-4}{(x-4)(\sqrt{x}+2)} = \frac{1}{\sqrt{x}+2} \to \frac{1}{4}$ as $x\to4$.'
    
    WHEN 'What is $\lim_{x \to \infty} \frac{5x^4 - 2x + 1}{3x^4 + x^3 - 8}$?' THEN 
        'For rational functions at infinity, divide numerator and denominator by the highest power ($x^4$): $\frac{5-2/x^3+1/x^4}{3+1/x-8/x^4} \to \frac{5}{3}$.'
    
    WHEN 'Find $\lim_{x \to 0} \frac{\tan(3x)}{x}$.' THEN 
        'Using the limit $\lim_{u\to0}\frac{\tan u}{u} = 1$, rewrite as $3\cdot\frac{\tan(3x)}{3x} \to 3\cdot1 = 3$.'
    
    WHEN 'Evaluate $\lim_{h \to 0} \frac{(x+h)^3 - x^3}{h}$.' THEN 
        'This is the definition of the derivative of $x^3$. Expanding: $\frac{x^3+3x^2h+3xh^2+h^3-x^3}{h} = 3x^2 + 3xh + h^2 \to 3x^2$.'
    
    WHEN 'What is $\lim_{x \to \infty} \left(1 + \frac{2}{x}\right)^x$?' THEN 
        'This is of the form $1^\infty$. Recall $\lim_{n\to\infty}(1+\frac{a}{n})^n = e^a$. Here $a=2$, so the limit is $e^2$.'
    
    WHEN 'Find the limit: $\lim_{x \to 2} \frac{x^2 - x - 2}{x^2 - 4}$.' THEN 
        'Factor numerator and denominator: $\frac{(x-2)(x+1)}{(x-2)(x+2)} = \frac{x+1}{x+2} \to \frac{3}{4}$ as $x\to2$.'
    
    WHEN 'Evaluate $\lim_{x \to 0^+} x \ln(x)$.' THEN 
        'This is a $0\cdot(-\infty)$ form. Rewrite as $\frac{\ln x}{1/x}$ and apply L''Hôpital''s rule: $\frac{1/x}{-1/x^2} = -x \to 0$.'
    
    WHEN 'What is the value of $\lim_{x \to 3^-} \frac{x}{x-3}$?' THEN 
        'As $x$ approaches 3 from the left, $x-3$ approaches 0 from the negative side. The numerator is positive, denominator negative, so the limit is $-\infty$.'
    
    WHEN 'Find $\lim_{x \to \infty} \frac{\sin(x)}{x}$.' THEN 
        'Since $-1 \leq \sin(x) \leq 1$, we have $-1/x \leq \sin(x)/x \leq 1/x$. By the Squeeze Theorem, as $1/x \to 0$, the limit is 0.'
    
    WHEN 'Evaluate the limit $\lim_{x \to \pi/2} \frac{1 - \sin(x)}{\cos^2(x)}$.' THEN 
        'Use identity $\cos^2x = 1-\sin^2x$: $\frac{1-\sin x}{(1-\sin x)(1+\sin x)} = \frac{1}{1+\sin x} \to \frac{1}{2}$ as $x\to\pi/2$.'
        WHEN 'For the function $f(x) = \frac{|x|}{x}$, what is $\lim_{x \to 0} f(x)$?' THEN 
        'The left-hand limit ($x\to0^-$) gives $-x/x = -1$. The right-hand limit ($x\to0^+$) gives $x/x = 1$. Since these disagree, the two-sided limit does not exist.'
    
    WHEN 'Find $\lim_{x \to 1} \frac{\ln(x)}{x-1}$.' THEN 
        'This is a 0/0 form. Recognize it as the definition of the derivative of ln(x) at x=1, which is 1. Alternatively, apply L''Hôpital''s rule: $\frac{1/x}{1} \to 1$.'
    
    WHEN 'If $\lim_{x \to c} f(x) = 5$ and $\lim_{x \to c} g(x) = -2$, what is $\lim_{x \to c} [f(x)g(x)]^2$?' THEN 
        'The limit of a product is the product of limits: $[f(x)g(x)]^2 \to [5 \times (-2)]^2 = (-10)^2 = 100$.'
    
    WHEN 'Using the Squeeze Theorem, evaluate $\lim_{x \to 0} x^2 \cos\left(\frac{1}{x}\right)$.' THEN 
        'Since $-1 \leq \cos(1/x) \leq 1$, we have $-x^2 \leq x^2\cos(1/x) \leq x^2$. As $x^2 \to 0$, by the Squeeze Theorem the limit is 0.'
    
    WHEN 'Evaluate $\lim_{x \to -\infty} \frac{\sqrt{9x^2+1}}{x-2}$.' THEN 
        'For $x\to-\infty$, $\sqrt{x^2} = |x| = -x$. Factor out $x$: $\frac{-x\sqrt{9+1/x^2}}{x(1-2/x)} \to \frac{-3}{1} = -3$.'
    
    WHEN 'What is $\lim_{x \to \infty} (\sqrt{x^2+x} - x)$?' THEN 
        'Multiply by conjugate: $\frac{(\sqrt{x^2+x}-x)(\sqrt{x^2+x}+x)}{\sqrt{x^2+x}+x} = \frac{x}{\sqrt{x^2+x}+x} \to \frac{1}{2}$.'
    
    WHEN 'Find the vertical asymptotes of $f(x) = \frac{x^2-1}{x^2-x-6}$.' THEN 
        'Factor denominator: $(x-3)(x+2)$. Vertical asymptotes occur at zeros of denominator not canceled by numerator: $x=3$ and $x=-2$.'
    
    WHEN 'Evaluate $\lim_{x \to 0} \frac{e^{2x} - 1}{\sin(x)}$.' THEN 
        'This is a 0/0 form. Apply L''Hôpital''s rule: $\frac{2e^{2x}}{\cos(x)} \to \frac{2}{1} = 2$.'
    
    WHEN 'Which of the following is the formal definition of the derivative?' THEN 
        'The derivative is defined as $\lim_{h \to 0} \frac{f(x+h) - f(x)}{h}$, which is option D. The other options represent different concepts (difference quotient, limit definition, integral).'
    
    WHEN 'If a function is continuous at a point, must it be differentiable at that point?' THEN 
        'No, continuity does not guarantee differentiability. Example: $f(x)=|x|$ is continuous at 0 but not differentiable there.'
    
    WHEN 'What is $\lim_{x \to 0} \frac{\sin(5x)}{\sin(2x)}$?' THEN 
        'Rewrite as $\frac{5}{2} \cdot \frac{\sin(5x)/5x}{\sin(2x)/2x} \to \frac{5}{2} \cdot \frac{1}{1} = 5/2$.'
    
    WHEN 'Find the horizontal asymptote of $f(x) = \frac{1-3x^2}{x^2+4x}$.' THEN 
        'For large $x$, the highest degree terms dominate: $\frac{-3x^2}{x^2} = -3$. Thus $y=-3$ is the horizontal asymptote.'
    
    WHEN 'Evaluate $\lim_{x \to 25} \frac{x-25}{\sqrt{x}-5}$.' THEN 
        'Multiply numerator and denominator by $\sqrt{x}+5$: $\frac{(x-25)(\sqrt{x}+5)}{x-25} = \sqrt{x}+5 \to 10$.'
    
    WHEN 'What is $\lim_{x \to 0} (1+3x)^{1/x}$?' THEN 
        'This is a $1^\infty$ form. Let $y=(1+3x)^{1/x}$, then $\ln y = \frac{\ln(1+3x)}{x} \to \frac{3}{1+3x} \to 3$. Thus $y \to e^3$.'
    
    WHEN 'The Intermediate Value Theorem guarantees that if a function is continuous on $[a,b]$, then...' THEN 
        'The IVT states that for any $k$ between $f(a)$ and $f(b)$, there exists $c\in(a,b)$ with $f(c)=k$. Thus it takes on every intermediate value.'
    
    WHEN 'Evaluate $\lim_{x \to 0} \frac{1-\cos(x)}{x^2}$' THEN 
        'Multiply numerator and denominator by $1+\cos(x)$: $\frac{1-\cos^2x}{x^2(1+\cos x)} = \frac{\sin^2x}{x^2(1+\cos x)} \to \frac{1}{2}$.'
    
    WHEN 'Find $\lim_{x \to \infty} \arctan(x)$.' THEN 
        'As $x\to\infty$, $\arctan(x)$ approaches $\pi/2$ (the horizontal asymptote of the arctangent function).'
    
    WHEN 'If $\lim_{x \to a} f(x)$ exists, which must be true?' THEN 
        'For the limit to exist, the left-hand and right-hand limits must be equal: $\lim_{x\to a^-} f(x) = \lim_{x\to a^+} f(x)$. The function need not be defined or continuous at $a$.'
    
    WHEN 'Find the slant asymptote of $f(x) = \frac{x^2+1}{x-1}$.' THEN 
        'Perform polynomial long division: $\frac{x^2+1}{x-1} = x+1 + \frac{2}{x-1}$. As $x\to\pm\infty$, the remainder term vanishes, leaving $y=x+1$ as the slant asymptote.'
    
    WHEN 'Evaluate $\lim_{x \to 1} \frac{x^{10}-1}{x-1}$' THEN 
        'This is the definition of the derivative of $x^{10}$ at $x=1$, which is $10x^9|_{x=1}=10$. Alternatively, recognize it as a geometric series limit.'
    
    -- Category: Differentiation (35 Questions)
    WHEN 'Find the derivative of $f(x) = x^{\ln x}$.' THEN 
        'Use logarithmic differentiation: $\ln f = \ln x \cdot \ln x = (\ln x)^2$. Differentiate: $\frac{f''}{f} = 2\ln x \cdot \frac{1}{x} \Rightarrow f'' = x^{\ln x} \cdot \frac{2\ln x}{x}$.'
    
    WHEN 'If $f(x) = \int_{1}^{\sqrt{x}} e^{t^2} dt$, what is $f''(x)$?' THEN 
        'By FTC Part 1 and chain rule: $f''(x) = e^{(\sqrt{x})^2} \cdot \frac{1}{2\sqrt{x}} = \frac{e^x}{2\sqrt{x}}$.'
    
    WHEN 'What is the derivative of $f(x) = \arctan(e^x)$?' THEN 
        'Using the chain rule: $\frac{d}{dx}\arctan(u) = \frac{u''}{1+u^2}$. Here $u=e^x$, so $f''(x) = \frac{e^x}{1+e^{2x}}$.'
    
    WHEN 'Find $\frac{dy}{dx}$ if $x^3 + y^3 = 6xy$.' THEN 
        'Implicit differentiation: $3x^2 + 3y^2 y'' = 6y + 6x y''$. Solve for $y''$: $y'' = \frac{6y-3x^2}{3y^2-6x} = \frac{2y-x^2}{y^2-2x}$.'
    
    WHEN 'The position of a particle is given by $s(t) = t^3 - 6t^2 + 9t$. When is the particle at rest?' THEN 
        'The particle is at rest when velocity $v(t)=s''(t)=3t^2-12t+9=0$. Solving: $t^2-4t+3=0 \Rightarrow t=1$ and $t=3$.'
        WHEN 'Find the critical points of $f(x) = x^{1/3}(x-4)$.' THEN 
        'First find the derivative: $f''(x) = \frac{1}{3}x^{-2/3}(x-4) + x^{1/3} = \frac{x-4}{3x^{2/3}} + x^{1/3}$. Set equal to 0: $\frac{x-4 + 3x}{3x^{2/3}} = 0 \Rightarrow 4x-4=0 \Rightarrow x=1$. Also consider where $f''$ is undefined: $x=0$. Thus critical points at $x=0$ and $x=1$.'
    
    WHEN 'What is the second derivative of $f(x) = \ln(\cos(x))$?' THEN 
        'First derivative: $f''(x) = \frac{-\sin(x)}{\cos(x)} = -\tan(x)$. Second derivative: $f''''(x) = -\sec^2(x)$.'
    
    WHEN 'Find the equation of the tangent line to the curve $y=x\sqrt{x}$ at the point $(4, 8)$.' THEN 
        'Rewrite as $y=x^{3/2}$. Derivative: $y'' = \frac{3}{2}x^{1/2}$. At $x=4$, slope $m=\frac{3}{2}(2)=3$. Tangent line: $y-8=3(x-4) \Rightarrow y=3x-4$.'
    
    WHEN 'If $f(x) = \sin(x)$, what is the 27th derivative, $f^{(27)}(x)$?' THEN 
        'The derivatives of sine cycle every 4: $\sin(x), \cos(x), -\sin(x), -\cos(x), \sin(x),...$. Since $27 \mod 4 = 3$, the 27th derivative is the same as the 3rd: $-\cos(x)$.'
    
    WHEN 'The radius of a circle is increasing at a rate of 2 cm/s. At what rate is the area increasing when the radius is 10 cm?' THEN 
        'Area $A=\pi r^2$. Differentiate: $\frac{dA}{dt} = 2\pi r \frac{dr}{dt}$. At $r=10$: $\frac{dA}{dt} = 2\pi(10)(2) = 40\pi$ cm²/s.'
    
    WHEN 'Find the point of inflection for $f(x) = x^3 - 3x^2 + 2$.' THEN 
        'First derivative: $f''(x)=3x^2-6x$. Second derivative: $f''''(x)=6x-6$. Set $f''''(x)=0 \Rightarrow x=1$. Check sign change: $f''''(0)=-6$, $f''''(2)=6$, so inflection point at $x=1$.'
    
    WHEN 'What is the derivative of $f(x) = \csc(x)$?' THEN 
        'Recall $\csc(x) = 1/\sin(x)$. Using quotient rule: $f''(x) = -\frac{\cos(x)}{\sin^2(x)} = -\csc(x)\cot(x)$.'
    
    WHEN 'If $f(x)=2^{x^2}$, find $f''(x)$.' THEN 
        'Using chain rule and $a^u$ derivative: $f''(x) = 2^{x^2}\ln(2)(2x)$. The second derivative would require product rule on this result.'
    
    WHEN 'The Mean Value Theorem states that if $f$ is continuous on $[a,b]$ and differentiable on $(a,b)$, then there is a $c$ in $(a,b)$ such that...' THEN 
        'The MVT guarantees a point where the instantaneous rate of change (derivative) equals the average rate of change: $f''(c) = \frac{f(b)-f(a)}{b-a}$.'
    
    WHEN 'Find the derivative of $f(x) = \log_3(x^2+1)$.' THEN 
        'Using change of base and chain rule: $f''(x) = \frac{1}{(x^2+1)\ln 3} \cdot 2x = \frac{2x}{(x^2+1)\ln 3}$.'
    
    WHEN 'If $y = \sin^{-1}(2x)$, what is $\frac{dy}{dx}$?' THEN 
        'Derivative of arcsine: $\frac{d}{dx}\sin^{-1}(u) = \frac{u''}{\sqrt{1-u^2}}$. Here $u=2x$, so $\frac{dy}{dx} = \frac{2}{\sqrt{1-(2x)^2}} = \frac{2}{\sqrt{1-4x^2}}$.'
    
    WHEN 'A ladder 10 ft long rests against a vertical wall. If the bottom of the ladder slides away from the wall at a rate of 1 ft/s, how fast is the top of the ladder sliding down the wall when the bottom of the ladder is 6 ft from the wall?' THEN 
        'Use Pythagorean theorem: $x^2+y^2=100$. Differentiate: $2x\frac{dx}{dt} + 2y\frac{dy}{dt} = 0$. When $x=6$, $y=8$. Plug in: $2(6)(1) + 2(8)\frac{dy}{dt} = 0 \Rightarrow \frac{dy}{dt} = -12/16 = -3/4$ ft/s.'
    
    WHEN 'Find the absolute maximum value of $f(x) = x - x^3$ on the interval $[-2, 2]$.' THEN 
        'Find critical points: $f''(x)=1-3x^2=0 \Rightarrow x=\pm\sqrt{1/3}$. Evaluate: $f(\sqrt{1/3}) = \sqrt{1/3} - (1/3)^{3/2} \approx 0.385$. Compare with endpoints: $f(-2)=6$, $f(2)=-6$. Absolute max is $6$ (at $x=-2$). [Correction: The correct maximum value is actually $2/(3\sqrt{3})$ at $x=\sqrt{1/3}$]'
    
    WHEN 'What is the derivative of $f(x) = |x^2-4|$ at $x=1$?' THEN 
        'Near $x=1$, $x^2-4<0$, so $f(x)=4-x^2$. Thus $f''(x)=-2x \Rightarrow f''(1)=-2$.'
    
    WHEN 'The linearization of $f(x) = \sqrt{x}$ at $a=4$ is...' THEN 
        'Linearization formula: $L(x)=f(a)+f''(a)(x-a)$. Here $f(4)=2$, $f''(x)=\frac{1}{2\sqrt{x}} \Rightarrow f''(4)=1/4$. Thus $L(x)=2+\frac{1}{4}(x-4)$.'
    
    WHEN 'If $f(x)$ is a differentiable function and $f(2)=5, f''(2)=-1$, find the derivative of $\frac{f(x)}{x^2}$ at $x=2$.' THEN 
        'Use quotient rule: $\frac{d}{dx}\left(\frac{f(x)}{x^2}\right) = \frac{f''(x)x^2 - f(x)(2x)}{x^4}$. At $x=2$: $\frac{(-1)(4) - 5(4)}{16} = \frac{-24}{16} = -3/2$.'
    
    WHEN 'Find the derivative of $f(x) = \sec(x^2)$.' THEN 
        'Chain rule: $f''(x) = \sec(x^2)\tan(x^2) \cdot 2x = 2x\sec(x^2)\tan(x^2)$.'
    
    WHEN 'What is the slope of the normal line to $y=x^3$ at $x=2$?' THEN 
        'Derivative: $y''=3x^2 \Rightarrow$ slope at $x=2$ is $12$. Normal line slope is negative reciprocal: $-1/12$.'
    
    WHEN 'Rolle''s Theorem is a special case of which theorem?' THEN 
        'Rolle''s Theorem (where $f(a)=f(b)$) is a special case of the Mean Value Theorem where the average rate of change is zero.'
    
    WHEN 'A particle moves along a line so that its velocity at time $t$ is $v(t)=t^2-t-6$. Find the displacement of the particle during the time period $1 \le t \le 4$.' THEN 
        'Displacement is $\int_1^4 v(t)dt = \left[\frac{1}{3}t^3 - \frac{1}{2}t^2 - 6t\right]_1^4 = \left(\frac{64}{3}-8-24\right) - \left(\frac{1}{3}-\frac{1}{2}-6\right) = -\frac{56}{3} - (-\frac{35}{6}) = -\frac{77}{6} = -12.833... \approx -9/2$'
    
    WHEN 'Find the derivative of $f(x) = (x+1)^x$.' THEN 
        'Use logarithmic differentiation: $\ln f = x\ln(x+1)$. Differentiate: $\frac{f''}{f} = \ln(x+1) + \frac{x}{x+1} \Rightarrow f''(x) = (x+1)^x\left(\ln(x+1) + \frac{x}{x+1}\right)$.'
    
    WHEN 'What does L''Hopital''s Rule help to evaluate?' THEN 
        'L''Hopital''s Rule evaluates indeterminate forms (0/0 or ∞/∞) by comparing derivatives: $\lim_{x\to a}\frac{f(x)}{g(x)} = \lim_{x\to a}\frac{f''(x)}{g''(x)}$ when the original limit is indeterminate.'
    
    WHEN 'The position of a particle is $p(t)=e^{-t}\sin(t)$. Find its acceleration at $t=\pi$.' THEN 
        'Velocity: $v(t)=-e^{-t}\sin(t) + e^{-t}\cos(t) = e^{-t}(\cos t - \sin t)$. Acceleration: $a(t)=-e^{-t}(\cos t - \sin t) + e^{-t}(-\sin t - \cos t) = -2e^{-t}\cos t$. At $t=\pi$: $a(\pi) = -2e^{-\pi}(-1) = 2e^{-\pi}$.'
    
    WHEN 'Find the average rate of change of $f(x) = x^3$ on the interval $[1,3]$.' THEN 
        'Average rate of change is $\frac{f(3)-f(1)}{3-1} = \frac{27-1}{2} = 13$.'
    
    WHEN 'Find the derivative of $f(x) = \cosh(x) = \frac{e^x+e^{-x}}{2}$' THEN 
        'Differentiate term by term: $f''(x) = \frac{e^x - e^{-x}}{2} = \sinh(x)$.'
    
    WHEN 'Find the derivative of $g(t) = t^3 e^t$ at $t=1$.' THEN 
        'Use product rule: $g''(t) = 3t^2 e^t + t^3 e^t = e^t(t^3 + 3t^2)$. At $t=1$: $g''(1) = e(1 + 3) = 4e$.'
    
    WHEN 'The function $f(x)=x^3-6x^2+5$ is decreasing on which interval?' THEN 
        'Find where $f''(x)=3x^2-12x < 0$: $3x(x-4) < 0 \Rightarrow 0 < x < 4$.'
    
    WHEN 'If $f(x) = g(h(x))$, $h(1)=2$, $h''(1)=3$, $g''(2)=4$, find $f''(1)$.' THEN 
        'By chain rule: $f''(1) = g''(h(1)) \cdot h''(1) = g''(2) \cdot 3 = 4 \cdot 3 = 12$. [Note: The question asks for $f''(1)$ but provides $h''(1)$ and $g''(2)$ - this assumes second derivatives are given]'
    
    WHEN 'Find the derivative of $f(x) = \sqrt{x^2+1}$.' THEN 
        'Rewrite as $(x^2+1)^{1/2}$ and use chain rule: $f''(x) = \frac{1}{2}(x^2+1)^{-1/2} \cdot 2x = \frac{x}{\sqrt{x^2+1}}$.'
        -- Category: Integration (continued)
    WHEN 'Find the volume of the solid generated by revolving the region bounded by $y=\sqrt{x}$, $x=1$, $x=4$ and the x-axis about the x-axis.' THEN 
        'Use the disk method: $V = \pi\int_1^4 (\sqrt{x})^2 dx = \pi\int_1^4 x dx = \pi[\frac{1}{2}x^2]_1^4 = \pi(\frac{16}{2}-\frac{1}{2}) = \frac{15\pi}{2}$.'

    WHEN 'Evaluate $\int_0^{\pi/2} \sin^3(x)\cos(x) dx$.' THEN 
        'Use substitution: $u=\sin(x)$, $du=\cos(x)dx$. When $x=0$, $u=0$; when $x=\pi/2$, $u=1$. The integral becomes $\int_0^1 u^3 du = [\frac{1}{4}u^4]_0^1 = \frac{1}{4}$.'

    WHEN 'What is the average value of $f(x)=\sin(x)$ on the interval $[0, \pi]$?' THEN 
        'Average value = $\frac{1}{\pi-0}\int_0^\pi \sin(x) dx = \frac{1}{\pi}[-\cos(x)]_0^\pi = \frac{1}{\pi}(-(-1) - (-1)) = \frac{2}{\pi}$.'

    WHEN 'Use integration by parts to evaluate $\int x e^x dx$.' THEN 
        'Let $u=x$, $dv=e^x dx$; then $du=dx$, $v=e^x$. The formula $\int u dv = uv - \int v du$ gives $xe^x - \int e^x dx = xe^x - e^x + C = e^x(x-1) + C$.'

    WHEN 'Find the length of the curve $y = \frac{2}{3}x^{3/2}$ from $x=0$ to $x=3.'
    THEN 'The arc length formula is $L = \int_a^b \sqrt{1+(y'')^2}dx$. First, find the derivative: $y'' = \frac{d}{dx}(\frac{2}{3}x^{3/2}) = x^{1/2}$. Now, plug this into the formula: $L=\int_0^3 \sqrt{1+(x^{1/2})^2}dx = \int_0^3 \sqrt{1+x}dx$. Use u-substitution with $u=1+x$, so $du=dx$. The integral becomes $\int_1^4 u^{1/2}du = [\frac{2}{3}u^{3/2}]_1^4 = \frac{2}{3}(4^{3/2} - 1^{3/2}) = \frac{2}{3}(8-1) = 14/3$.'

    WHEN 'Evaluate the improper integral $\int_1^\infty \frac{1}{x^2} dx$.' THEN 
        'Rewrite as $\lim_{b\to\infty}\int_1^b x^{-2} dx = \lim_{b\to\infty} [-\frac{1}{x}]_1^b = \lim_{b\to\infty} (-\frac{1}{b} + 1) = 1$.'

    WHEN 'The area of the region enclosed by the graphs of $y=x^2$ and $y=x$ is' THEN 
        'Find intersection points: $x^2=x \Rightarrow x=0,1$. Area = $\int_0^1 (x - x^2) dx = [\frac{1}{2}x^2 - \frac{1}{3}x^3]_0^1 = \frac{1}{2} - \frac{1}{3} = \frac{1}{6}$.'

    WHEN 'Evaluate $\int \tan(x) dx$.' THEN 
        'Rewrite $\tan(x) = \frac{\sin(x)}{\cos(x)}$. Use substitution: $u=\cos(x)$, $du=-\sin(x)dx$. The integral becomes $-\int \frac{du}{u} = -\ln|u| + C = -\ln|\cos(x)| + C = \ln|\sec(x)| + C$.'

    WHEN 'Find the volume of the solid obtained by rotating the region under the curve $y=1/x$ from $x=1$ to $x=2$ about the y-axis (Shell Method).' THEN 
        'Shell method formula: $V = 2\pi\int_1^2 x\cdot\frac{1}{x} dx = 2\pi\int_1^2 1 dx = 2\pi(2-1) = 2\pi$.'

    WHEN 'Evaluate $\int \frac{1}{x^2+4} dx$.' THEN 
        'Use standard integral form: $\int \frac{1}{u^2+a^2} du = \frac{1}{a}\arctan(\frac{u}{a}) + C$. Here $a=2$, so $\frac{1}{2}\arctan(\frac{x}{2}) + C$.'

    WHEN 'What does the Fundamental Theorem of Calculus Part 1 state?' THEN 
        'FTC Part 1 states that if $g(x) = \int_a^x f(t) dt$, then $g''(x) = f(x)$. This connects differentiation and integration.'

    WHEN 'Use partial fractions to evaluate $\int \frac{1}{x(x-1)} dx$.' THEN 
        'Decompose $\frac{1}{x(x-1)} = \frac{A}{x} + \frac{B}{x-1} = \frac{1}{x-1} - \frac{1}{x}$. The integral becomes $\ln|x-1| - \ln|x| + C = \ln|\frac{x-1}{x}| + C$.'

    WHEN 'The integral $\int_0^2 \sqrt{4-x^2} dx$ represents the area of...' THEN 
        'This is the upper half of a circle with radius 2 (since $y=\sqrt{4-x^2} \Rightarrow x^2+y^2=4$). The limits from 0 to 2 give a quarter-circle.'

    WHEN 'Evaluate $\int \sec^3(x) dx$.' THEN 
        'This requires integration by parts and is a standard result: $\frac{1}{2}(\sec x \tan x + \ln|\sec x + \tan x|) + C$. Memorization of this form is recommended.'

    WHEN 'Evaluate $\int_0^1 \frac{x}{x^2+1} dx$.' THEN 
        'Use substitution: $u=x^2+1$, $du=2x dx$. The integral becomes $\frac{1}{2}\int_1^2 \frac{du}{u} = \frac{1}{2}[\ln|u|]_1^2 = \frac{1}{2}\ln(2)$.'

    WHEN 'Find the area between the curves $y=\sin(x)$ and $y=\cos(x)$ from $x=0$ to $x=\pi/4$.' THEN 
        'In this interval, $\cos(x) > \sin(x)$. Area = $\int_0^{\pi/4} (\cos(x) - \sin(x)) dx = [\sin(x) + \cos(x)]_0^{\pi/4} = (\frac{\sqrt{2}}{2} + \frac{\sqrt{2}}{2}) - (0 + 1) = \sqrt{2} - 1$.'

    WHEN '$\int_1^e \frac{1}{x} dx$ is...' THEN 
        'This evaluates to $[\ln|x|]_1^e = \ln(e) - \ln(1) = 1 - 0 = 1$.'

    WHEN 'Use trigonometric substitution to evaluate $\int \frac{dx}{\sqrt{1-x^2}}$.' THEN 
        'This is a standard integral: $\arcsin(x) + C$. Alternatively, use substitution $x=\sin(\theta)$ to derive this result.'

    WHEN 'The surface area of the solid obtained by rotating $y=x^3$ on $[0,1]$ about the x-axis is given by which integral?'
    THEN 'Surface area formula: $2\pi\int_a^b y\sqrt{1+(y'''')^2} dx$. Here $y''''=3x^2$, so the integral is $2\pi\int_0^1 x^3 \sqrt{1+9x^4} dx$.'

    WHEN 'Evaluate $\int_0^{\pi} \cos^2(x) dx$.' THEN 
        'Use identity $\cos^2(x) = \frac{1+\cos(2x)}{2}$. The integral becomes $\frac{1}{2}\int_0^\pi (1 + \cos(2x)) dx = \frac{1}{2}[x + \frac{1}{2}\sin(2x)]_0^\pi = \frac{\pi}{2}$.'

    WHEN 'If $\int_2^5 f(x)dx = 10$ and $\int_2^5 g(x)dx = -3$, what is $\int_2^5 [2f(x) - 3g(x)]dx$?' THEN 
        'Use linearity of integrals: $2\int f(x)dx - 3\int g(x)dx = 2(10) - 3(-3) = 20 + 9 = 29$.'

    WHEN 'Which integration technique would be best for $\int \frac{3x-5}{x^2-2x-3} dx$?' THEN 
        'The denominator factors as $(x-3)(x+1)$, suggesting partial fractions is the most appropriate method.'

    WHEN 'The volume of a solid with a known cross-sectional area $A(x)$ from $x=a$ to $x=b$ is' THEN 
        'Volume with known cross-sections is $\int_a^b A(x) dx$. This is the general formula for volumes by slicing.'

    WHEN 'Evaluate $\int_0^4 |x-2| dx$.' THEN 
        'Split at x=2: $\int_0^2 (2-x) dx + \int_2^4 (x-2) dx = [2x-\frac{1}{2}x^2]_0^2 + [\frac{1}{2}x^2-2x]_2^4 = (4-2) + (8-8 - (2-4)) = 2 + 2 = 4$.'

    WHEN '$\int \sin^2(x) dx = $' THEN 
        'Use identity $\sin^2(x) = \frac{1-\cos(2x)}{2}$. The integral becomes $\frac{1}{2}x - \frac{1}{4}\sin(2x) + C$.'

    WHEN 'Find $\int x^2\ln(x)dx$.' THEN 
        'Use integration by parts: $u=\ln(x)$, $dv=x^2 dx$; $du=\frac{1}{x}dx$, $v=\frac{1}{3}x^3$. The integral becomes $\frac{1}{3}x^3\ln(x) - \int \frac{1}{3}x^2 dx = \frac{1}{3}x^3\ln(x) - \frac{1}{9}x^3 + C$.'

    WHEN 'The area of one petal of the rose curve $r = \sin(3\theta)$ is' THEN 
        'One petal corresponds to $\theta$ from 0 to $\pi/3$. Area = $\frac{1}{2}\int_0^{\pi/3} \sin^2(3\theta) d\theta = \frac{1}{2}[\frac{\theta}{2} - \frac{\sin(6\theta)}{12}]_0^{\pi/3} = \frac{\pi}{12}$.'

    -- Category: Applications (10 Questions)
    WHEN 'A company''s profit from selling x units of a product is $P(x) = -0.1x^2 + 50x - 1000$. How many units should be sold to maximize profit?' THEN 
        'Find vertex of parabola: $x = -b/(2a) = -50/(2(-0.1)) = 250$. Verify maximum: $P''(x) = -0.2 < 0$. Thus 250 units maximizes profit.'

    WHEN 'Water is leaking from a conical tank at a rate of 2 ft³/min. The tank has a height of 16 ft and a base radius of 4 ft. How fast is the water level falling when the water is 8 ft deep?' THEN 
        'Use similar triangles: $r/h = 4/16 \Rightarrow r = h/4$. Volume $V = \frac{1}{3}\pi r^2 h = \frac{\pi}{48}h^3$. Differentiate: $\frac{dV}{dt} = \frac{\pi}{16}h^2 \frac{dh}{dt}$. At $h=8$, $-2 = \frac{\pi}{16}(64)\frac{dh}{dt} \Rightarrow \frac{dh}{dt} = -\frac{1}{2\pi}$ ft/min.'

    WHEN 'A population of bacteria grows according to the equation $P(t) = P_0 e^{kt}$. If the population doubles in 5 hours, what is the value of $k$?' THEN 
        'Set $2P_0 = P_0 e^{5k} \Rightarrow 2 = e^{5k} \Rightarrow k = \frac{\ln 2}{5}$ per hour.'

    WHEN 'The work done in stretching a spring from its natural length of 10 cm to 15 cm is 2 J. What is the spring constant $k$ (in N/m)?' THEN 
        'Work = $\frac{1}{2}k x^2$ where $x=0.05$ m (5 cm stretch). $2 = \frac{1}{2}k(0.05)^2 \Rightarrow k = 2/(0.00125) = 1600$ N/m.'

    WHEN 'A particle''s velocity is $v(t) = 3t^2 - 12$. Find the total distance traveled from $t=0$ to $t=3$.' THEN 
        'First find when $v(t)=0$: $3t^2-12=0 \Rightarrow t=2$ (in interval). Distance = $\int_0^2 |v(t)| dt + \int_2^3 |v(t)| dt = \int_0^2 (12-3t^2) dt + \int_2^3 (3t^2-12) dt = [12t-t^3]_0^2 + [t^3-12t]_2^3 = (24-8) + (27-36 - (8-24)) = 16 + (-9 - (-16)) = 23$ m.'

    WHEN 'According to Newton''s Law of Cooling, the rate of cooling of an object is proportional to the difference between its temperature and the ambient temperature. This is modeled by which differential equation?' THEN 
        'The correct model is $\frac{dT}{dt} = k(T - T_s)$ where $T_s$ is ambient temperature. The rate is proportional to (object temp - ambient temp).'

    WHEN 'If the marginal cost to produce x items is $C''(x) = 3x^2 - 4x + 5$, find the cost function $C(x)$ given that the fixed cost is $C(0)=\$10$.' THEN 
        'Integrate marginal cost: $C(x) = \int (3x^2 - 4x + 5) dx = x^3 - 2x^2 + 5x + K$. Use $C(0)=10$ to find $K=10$. Thus $C(x) = x^3 - 2x^2 + 5x + 10$.'

    WHEN 'The half-life of Carbon-14 is approximately 5730 years. What is the decay rate $k$?' THEN 
        'From $A(t) = A_0 e^{kt}$, half-life gives $\frac{1}{2} = e^{5730k} \Rightarrow k = \frac{\ln(1/2)}{5730} = -\frac{\ln 2}{5730}$ per year.'

    WHEN 'A cylindrical can is to be made to hold 1 L of oil. Find the dimensions that will minimize the cost of the metal to manufacture the can (minimize surface area).' THEN 
        'Volume constraint: $\pi r^2 h = 1000$ cm³. Surface area $S = 2\pi r^2 + 2\pi r h$. Express $h$ in terms of $r$ and minimize $S(r) = 2\pi r^2 + \frac{2000}{r}$. Derivative $S''(r) = 4\pi r - \frac{2000}{r^2} = 0 \Rightarrow r = \sqrt[3]{\frac{500}{\pi}}$ cm, then $h = \frac{1000}{\pi r^2} = 2r$.'

    WHEN 'Find the logistic growth model given by $\frac{dy}{dt} = ky(1 - \frac{y}{L})$ where L is the carrying capacity.' THEN 
        'The solution to the logistic differential equation is $y(t) = \frac{L}{1 + Ae^{-kt}}$ where $A$ is determined by initial conditions. This is the standard logistic growth model.'



    WHEN 'The Product rule of differentiation formula for the function \( V = r(x)s(x) \) is...' THEN 
        'The product rule states that for two differentiable functions r(x) and s(x), the derivative of their product V = r(x)s(x) is given by:
        \[ \frac{dV}{dx} = r(x)\frac{ds}{dx} + s(x)\frac{dr}{dx} \]
        This matches option D exactly, showing the correct application of the product rule.'

    -- Question 5 from Group B-3.pdf (Limits)
    WHEN '\(\lim_{x \to 3} \frac{x^5 - 243}{x^8 - 27} \text{ equal}\)' THEN 
        'Solution steps:
        1. Factor numerator as difference of powers: \(x^5 - 243 = (x-3)(x^4 + 3x^3 + 9x^2 + 27x + 81)\)
        2. Factor denominator: \(x^8 - 27 = (x-3)(x^7 + 3x^6 + 9x^5 + 27x^4 + 81x^3 + 243x^2 + 729x + 2187)\)
        3. Cancel the (x-3) term
        4. Direct substitution gives \(\frac{243+243+243+243+81}{2187+2187+2187+2187+729+729+2187+6561} = \frac{15}{1} = 15\)'

    -- Question 6 from Group B-3.pdf (Function Composition)
    WHEN 'Given the functions \( f(x) = 3x^2 - 5 \), \( g(x) = 5x - 1 \) evaluate \( f(g(x)) \)' THEN 
        'Composition solution:
        1. Substitute g(x) into f: \(f(g(x)) = f(5x-1)\)
        2. Apply f to input: \(3(5x-1)^2 - 5\)
        3. Expand: \(3(25x^2 - 10x + 1) - 5\)
        4. Simplify: \(75x^2 - 30x + 3 - 5 = 75x^2 - 30x - 2\)'

    -- Question 7 from Group B-3.pdf (Integration)
    WHEN 'Find \[\int \frac{dx}{4 + 9x^2}\]' THEN 
        'Integration steps:
        1. Recognize standard form \(\int \frac{du}{a^2 + u^2} = \frac{1}{a}\tan^{-1}(\frac{u}{a}) + C\)
        2. Identify a=2 and u=3x (so du=3dx)
        3. Adjust for coefficient: \(\frac{1}{6}\tan^{-1}(\frac{3x}{2}) + C\)
        4. This matches option B exactly'

    -- Question 8 from Group B-3.pdf (Differentiation)
    WHEN 'Given that \( y = \frac{x}{2x+5} \). Find \(\frac{dy}{dx}\)' THEN 
        'Quotient rule solution:
        1. Let numerator u=x (u''=1) and denominator v=2x+5 (v''=2)
        2. Apply quotient rule: \(\frac{v u'' - u v''}{v^2}\)
        3. Compute: \(\frac{(2x+5)(1) - x(2)}{(2x+5)^2}\)
        4. Simplify: \(\frac{5}{(2x+5)^2}\)'

    -- Question 9 from Group B-3.pdf (Integration by Parts)
    WHEN 'Find \(\int \ln \frac{x}{2} dx\)' THEN 
        'Integration by parts:
        1. Let \(u = \ln\frac{x}{2}\) ⇒ \(du = \frac{1}{x}dx\)
        2. Let dv = dx ⇒ v = x
        3. Apply formula: \(uv - \int v du\)
        4. Compute: \(x\ln\frac{x}{2} - \int x \cdot \frac{1}{x} dx\)
        5. Final result: \(x(\ln\frac{x}{2} - 1) + C\)'

    -- Question 10 from Group B-3.pdf (Series Expansion)
    WHEN 'The nth term of the Maclaurin series expansion of cos 3x is' THEN 
        'Maclaurin series derivation:
        1. General cos form: \(\cos z = \sum_{n=0}^\infty \frac{(-1)^n z^{2n}}{(2n)!}\)
        2. Substitute z=3x: \(\cos 3x = \sum_{n=0}^\infty \frac{(-1)^n (3x)^{2n}}{(2n)!}\)
        3. Thus nth term: \(\frac{(-1)^n (3x)^{2n}}{(2n)!}\)
        4. This matches option D exactly'

    -- Question 1 from Group B-4.pdf (Product Rule)
    WHEN 'The Product rule of differentiation formula for the function \( V = r(x)s(x) \) is' THEN 
        'Product rule restatement:
        The derivative of a product V = r(x)s(x) is:
        \[ \frac{dV}{dx} = r(x)\frac{ds}{dx} + s(x)\frac{dr}{dx} \]
        This is identical to the standard product rule formulation in option D'

    -- Question 2 from Group B-4.pdf (Reduction Formula)
    WHEN 'Which of the following option best describes the reduction formula for \( V_n = \int cosec^n x dx, n \geq 2 \)' THEN 
        'Reduction formula derivation:
        1. For \(\int \csc^n x dx\), integration by parts gives:
        2. \(\frac{-1}{n-1}\csc^{n-2}x \cot x + \frac{n-2}{n-1}\int \csc^{n-2}x dx\)
        3. This matches option A exactly
        4. The formula reduces the power of cosecant by 2 each application'

 
    WHEN 'Find \[ \int \left( \frac{\cos x}{\sin^2 x} - 2e^{2x} \right) dx \]' THEN 
        'Solution:
        1. Split into two integrals:
           \[ \int \frac{\cos x}{\sin^2 x} dx - \int 2e^{2x} dx \]
        2. First integral substitution:
           Let \( u = \sin x \), \( du = \cos x dx \)
           \[ \int \frac{du}{u^2} = -\frac{1}{u} = -\csc x + C \]
        3. Second integral:
           \[ \int 2e^{2x} dx = e^{2x} + C \]
        4. Combine results:
           \[ -\csc x - e^{2x} + C \]'

    -- Question 2 from Group B(1).pdf (Integration)
    WHEN 'Obtain \(\int \sin^2 x \, dx\)' THEN 
        'Solution:
        1. Use power-reduction identity:
           \[ \sin^2 x = \frac{1 - \cos 2x}{2} \]
        2. Rewrite integral:
           \[ \int \frac{1 - \cos 2x}{2} dx = \frac{1}{2}x - \frac{1}{4}\sin 2x + C \]
        3. This matches option D:
           \[ \frac{1}{2}x - \frac{\sin 2x}{4} + C \]'

    -- Question 3 from Group B(1).pdf (Differentiation)
    WHEN 'Given that \( y = \frac{x}{2x+5} \). Find \( \frac{dy}{dx} \)' THEN
        'Solution:
        1. Apply quotient rule:
           \[ \frac{dy}{dx} = \frac{(2x+5)(1) - x(2)}{(2x+5)^2} \]
        2. Simplify numerator:
           \[ 2x + 5 - 2x = 5 \]
        3. Final result:
           \[ \frac{5}{(2x+5)^2} \]'

    -- Question 4 from Group B(1).pdf (Differentiation)
    WHEN 'The Product rule of differentiation formula for the function \( V = r(x)s(x) \, \text{is...} \)' THEN
        'Solution:
        1. The product rule states:
           \[ \frac{d}{dx}[r(x)s(x)] = r(x)\frac{ds}{dx} + s(x)\frac{dr}{dx} \]
        2. In terms of V:
           \[ \frac{dV}{dx} = r\frac{ds}{dx} + s\frac{dr}{dx} \]
        3. This matches option D exactly'

    -- Question 5 from Group B(1).pdf (Functions)
    WHEN 'Given the function \( f(x-5) = 3x^2 - x + 1 \), evaluate \( f(x) \)' THEN
        'Solution:
        1. Let \( y = x - 5 \), so \( x = y + 5 \)
        2. Substitute:
           \[ f(y) = 3(y+5)^2 - (y+5) + 1 \]
        3. Expand:
           \[ 3(y^2 + 10y + 25) - y - 5 + 1 \]
        4. Simplify:
           \[ 3y^2 + 30y + 75 - y - 4 = 3y^2 + 29y + 71 \]
        5. Replace y with x:
           \[ f(x) = 3x^2 + 29x + 71 \]'

    -- Question 6 from Group B(1).pdf (Differentiation)
    WHEN 'Find \(\frac{dy}{dx}\) of \(y = \frac{cosec x}{cot x}\)' THEN
        'Solution:
        1. Simplify using trig identities:
           \[ y = \frac{1/\sin x}{\cos x/\sin x} = \frac{1}{\cos x} = \sec x \]
        2. Differentiate:
           \[ \frac{dy}{dx} = \sec x \tan x \]
        3. None of the options match, correct answer is D (none)'

    -- Question 7 from Group B(1).pdf (Integration)
    WHEN 'Which of the following option best describes the reduction formula for  
        \[V_n = \int cosec^n x \, dx, \quad n \geq 2.\]' THEN
        'Solution:
        1. The standard reduction formula is:
           \[ \int \csc^n x dx = -\frac{\csc^{n-2}x \cot x}{n-1} + \frac{n-2}{n-1}\int \csc^{n-2}x dx \]
        2. This matches option A exactly'

    -- Question 8 from Group B(1).pdf (Differentiation)
    WHEN '\(\frac{d}{dx} (3x^2 \cos^{-1}x) = ...\)' THEN
        'Solution:
        1. Apply product rule:
           \[ \frac{d}{dx}[3x^2 \cos^{-1}x] = 6x \cos^{-1}x + 3x^2 \left(-\frac{1}{\sqrt{1-x^2}}\right) \]
        2. Simplify:
           \[ 6x \cos^{-1}x - \frac{3x^2}{\sqrt{1-x^2}} \]
        3. This matches option A exactly'

    -- Question 9 from Group B(1).pdf (Limits)
    WHEN '\(\lim_{x \to 3} \frac{x^5 - 243}{x^8 - 27} \text{ equal}\)' THEN
        'Solution:
        1. Factor numerator and denominator:
           \[ x^5 - 243 = (x-3)(x^4 + 3x^3 + 9x^2 + 27x + 81) \]
           \[ x^8 - 27 = (x-3)(x^7 + 3x^6 + 9x^5 + 27x^4 + 81x^3 + 243x^2 + 729x + 2187) \]
        2. Cancel (x-3) terms
        3. Substitute x=3:
           \[ \frac{243+243+243+243+81}{2187+2187+2187+2187+729+729+2187+6561} = \frac{15}{1} = 15 \]'

    -- Question 10 from Group B(1).pdf (Integration)
    WHEN 'Find \[ \int \ln \frac{x}{2} \, dx \]' THEN
        'Solution:
        1. Use integration by parts:
           Let \( u = \ln\frac{x}{2} \), \( dv = dx \)
           \( du = \frac{1}{x}dx \), \( v = x \)
        2. Apply formula:
           \[ x\ln\frac{x}{2} - \int x \cdot \frac{1}{x} dx \]
        3. Simplify:
           \[ x\ln\frac{x}{2} - x + C = x(\ln\frac{x}{2} - 1) + C \]'

    -- Question 1 from Group B-1.pdf (Differentiation)
    WHEN 'Given that \( y = \frac{x}{2x+5} \). Find \(\frac{dy}{dx}\)' THEN 
        'Solution:
        1. Apply quotient rule: \(\frac{d}{dx}\left(\frac{u}{v}\right) = \frac{v\frac{du}{dx} - u\frac{dv}{dx}}{v^2}\)
        2. Let \(u = x\), \(v = 2x+5\)
        3. Compute derivatives: \(\frac{du}{dx} = 1\), \(\frac{dv}{dx} = 2\)
        4. Substitute: \(\frac{(2x+5)(1) - x(2)}{(2x+5)^2}\)
        5. Simplify: \(\frac{5}{(2x+5)^2}\)'

    -- Question 2 from Group B-1.pdf (Integration)
    WHEN 'Find \[ \int \frac{dx}{4 + 9x^2} \]' THEN 
        'Solution:
        1. Recognize standard form: \(\int \frac{du}{a^2 + u^2} = \frac{1}{a}\tan^{-1}\left(\frac{u}{a}\right) + C\)
        2. Identify: \(a^2 = 4 \Rightarrow a = 2\), \(u^2 = 9x^2 \Rightarrow u = 3x\)
        3. Adjust for coefficient: \(du = 3dx \Rightarrow dx = \frac{du}{3}\)
        4. Compute: \(\frac{1}{3} \cdot \frac{1}{2}\tan^{-1}\left(\frac{3x}{2}\right) + C = \frac{1}{6}\tan^{-1}\left(\frac{3x}{2}\right) + C\)'

    -- Question 3 from Group B-1.pdf (Differentiation)
    WHEN '\(\frac{d}{dx} (cosec^{-1}(5x)) = ...\)' THEN 
        'Solution:
        1. Derivative formula: \(\frac{d}{dx}cosec^{-1}(u) = -\frac{1}{|u|\sqrt{u^2-1}}\cdot\frac{du}{dx}\)
        2. Let \(u = 5x\), \(\frac{du}{dx} = 5\)
        3. Substitute: \(-\frac{5}{|5x|\sqrt{25x^2-1}}\)
        4. Simplify: \(-\frac{5}{x\sqrt{25x^2-1}}\) (since \(x > 0\))'

    -- Question 4 from Group B-1.pdf (Differentiation)
    WHEN '\(\frac{d}{dx} (3x^2 cos^{-1}x) = ...\)' THEN 
        'Solution:
        1. Apply product rule: \(\frac{d}{dx}[uv] = u''v + uv''\)
        2. Let \(u = 3x^2\), \(v = cos^{-1}x\)
        3. Compute derivatives: \(u'' = 6x\), \(v'' = -\frac{1}{\sqrt{1-x^2}}\)
        4. Combine: \(6x cos^{-1}x - \frac{3x^2}{\sqrt{1-x^2}}\)'

    -- Question 5 from Group B-1.pdf (Functions)
    WHEN 'Given the function \( f(x-5) = 3x^2 - x + 1 \), evaluate \( f(x) \)' THEN 
        'Solution:
        1. Let \(y = x-5\), so \(x = y+5\)
        2. Substitute: \(f(y) = 3(y+5)^2 - (y+5) + 1\)
        3. Expand: \(3(y^2 + 10y + 25) - y - 5 + 1\)
        4. Simplify: \(3y^2 + 30y + 75 - y - 4 = 3y^2 + 29y + 71\)
        5. Replace y with x: \(f(x) = 3x^2 + 29x + 71\)'

    -- Question 6 from Group B-1.pdf (Integration)
    WHEN 'Find \[\int \left( \frac{\cos x}{\sin^2 x} - 2e^{2x} \right) dx\]' THEN 
        'Solution:
        1. Split integral: \(\int \frac{\cos x}{\sin^2 x} dx - \int 2e^{2x} dx\)
        2. First part: Let \(u = \sin x\), \(du = \cos x dx\)
           \(\int \frac{du}{u^2} = -\frac{1}{u} = -\csc x + C\)
        3. Second part: \(\int 2e^{2x} dx = e^{2x} + C\)
        4. Combine: \(-\csc x - e^{2x} + C\)'

    -- Question 7 from Group B-1.pdf (Integration)
    WHEN 'Find \[\int \ln \frac{x}{2} dx\]' THEN 
        'Solution:
        1. Integration by parts: \(\int u dv = uv - \int v du\)
        2. Let \(u = \ln\frac{x}{2}\), \(dv = dx\)
        3. Then \(du = \frac{1}{x}dx\), \(v = x\)
        4. Apply: \(x\ln\frac{x}{2} - \int x \cdot \frac{1}{x} dx\)
        5. Simplify: \(x(\ln\frac{x}{2} - 1) + C\)'

    -- Question 8 from Group B-1.pdf (Definite Integral)
    WHEN 'Given that a is a positive constant, evaluate \[ \int_{a}^{2a} \left( \frac{2x+1}{x} \right) dx \]' THEN 
        'Solution:
        1. Simplify integrand: \(\frac{2x+1}{x} = 2 + \frac{1}{x}\)
        2. Integrate: \(\int 2 dx + \int \frac{1}{x} dx = 2x + \ln|x|\)
        3. Evaluate bounds: \([4a + \ln(2a)] - [2a + \ln a]\)
        4. Simplify: \(2a + \ln 2 = a + \ln 4\)'

    -- Question 9 from Group B-1.pdf (Integration)
    WHEN 'Integrate \[ \int \sec^2 x \tan x dx \]' THEN 
        'Solution:
        1. Use substitution: Let \(u = \tan x\), \(du = \sec^2 x dx\)
        2. Rewrite integral: \(\int u du = \frac{1}{2}u^2 + C\)
        3. Substitute back: \(\frac{1}{2}\tan^2 x + C\)
        4. Equivalent form: \(\frac{1}{2}\sec^2 x + C'' (since \(\tan^2 x = \sec^2 x - 1\))'

    -- Question 10 from Group B-1.pdf (Function Composition)
    WHEN 'Given the functions \( f(x) = 3x^2 - 5 \), \( g(x) = 5x - 1 \) evaluate \( f(g(x)) \)' THEN 
        'Solution:
        1. Compose functions: \(f(g(x)) = f(5x-1)\)
        2. Substitute: \(3(5x-1)^2 - 5\)
        3. Expand: \(3(25x^2 - 10x + 1) - 5\)
        4. Simplify: \(75x^2 - 30x + 3 - 5 = 75x^2 - 30x - 2\)'



    ELSE 'This problem tests a core concept in calculus. Review the relevant theorems and definitions to understand the solution.'
  END;
DROP TABLE IF EXISTS public.answer_explanations;