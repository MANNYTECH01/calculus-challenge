-- This script updates the explanations for the questions in the public.questions table.

-- Add explanation column if it doesn't exist
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS explanation TEXT;

-- Update explanations for the first 15 questions
UPDATE public.questions
SET explanation = CASE question_text

    -- Category: Functions (9 Questions from this batch)
    WHEN 'Which of the following functions is even?' THEN 
        'An *even function* is a function that satisfies the property $f(-x) = f(x)$. This means the function is symmetric about the y-axis.\nLet''s test the correct option, $f(x) = x^2 \cos(x)$:\n$$f(-x) = (-x)^2 \cos(-x)$$\nSince $(-x)^2 = x^2$ and $\cos(-x) = \cos(x)$ (an identity of cosine), we get:\n$$f(-x) = x^2 \cos(x) = f(x)$$\nBecause $f(-x) = f(x)$, the function is even.'

    WHEN 'If $f(x) = \ln(x)$ and $g(x) = e^{2x}$, find $(f \circ g)(x)$.' THEN 
        'The composition $(f \circ g)(x)$ means we substitute the entire function $g(x)$ into $f(x)$.\n$$ (f \circ g)(x) = f(g(x)) = \ln(e^{2x}) $$\nUsing the logarithmic identity $\ln(e^a) = a$, the expression simplifies directly to:\n$$ 2x $$'

    WHEN 'Determine if $f(x) = \frac{\sin(x)}{x}$ is odd, even, or neither.' THEN 
        'To determine if a function is even or odd, we test $f(-x)$.\n- If $f(-x) = f(x)$, the function is **even**.\n- If $f(-x) = -f(x)$, the function is **odd**.\nLet''s substitute $-x$ into the function:\n$$f(-x) = \frac{\sin(-x)}{-x}$$\nSince $\sin(-x) = -\sin(x)$ (an identity of sine), we have:\n$$f(-x) = \frac{-\sin(x)}{-x} = \frac{\sin(x)}{x} = f(x)$$\nBecause $f(-x) = f(x)$, the function is even.'

    WHEN 'If $f(x) = 2x - 3$ and $f(g(x)) = 4x^2 - 1$, find $g(x)$.' THEN 
        'We are given the rule for the outer function, $f(\text{input}) = 2(\text{input}) - 3$.\nWe can apply this rule to the inner function, $g(x)$:\n$$f(g(x)) = 2(g(x)) - 3$$\nWe are also given that $f(g(x)) = 4x^2 - 1$. So we can set the two expressions equal and solve for $g(x)$:\n$$2(g(x)) - 3 = 4x^2 - 1$$\n$$2(g(x)) = 4x^2 + 2$$\n$$g(x) = 2x^2 + 1$$'

    WHEN 'The function $f(x) = \frac{x^2 - 4}{x - 2}$ has a removable discontinuity at $x=2$. What value should be assigned to $f(2)$ to make it continuous?' THEN 
        'A removable discontinuity (a "hole" in the graph) can be "filled" by finding the limit of the function as $x$ approaches that point.\nFirst, factor the numerator:\n$$f(x) = \frac{(x-2)(x+2)}{x - 2}$$\nFor all values of $x$ not equal to 2, we can cancel the $(x-2)$ term:\n$$f(x) = x+2, \quad (x \neq 2)$$\nNow, find the limit as $x$ approaches 2:\n$$\lim_{x \to 2} (x+2) = 2+2 = 4$$\nTo make the function continuous, we define $f(2)$ to be this limit. So, $f(2) = 4$.'

    WHEN 'Which function grows the fastest as $x \to \infty$?' THEN 
        'This question compares the growth rates of different classes of functions.\nThe hierarchy of growth rates as $x \to \infty$ is generally:\n**Exponential > Polynomial > Logarithmic**\n- $e^x$ and $10^x$ are exponential.\n- $x^{100}$ is polynomial.\n- $\ln(x)$ is logarithmic.\nExponential functions grow much faster than any polynomial. Since $e \approx 2.718$, $10^x$ actually grows faster than $e^x$, but both are in the fastest-growing category among the options.'

    WHEN 'Find the inverse of the function $f(x) = \sqrt[3]{x-5}$.' THEN 
        'To find the inverse function, $f^{-1}(x)$, we follow these steps:\n1. Replace $f(x)$ with $y$: $$y = \sqrt[3]{x-5}$$\n2. Swap $x$ and $y$: $$x = \sqrt[3]{y-5}$$\n3. Solve for the new $y$:\n   - Cube both sides: $$x^3 = y-5$$\n   - Add 5 to both sides: $$y = x^3 + 5$$\n4. Replace $y$ with $f^{-1}(x)$: $$f^{-1}(x) = x^3+5$$'

    WHEN 'If $h(x) = (f - g)(x)$ where $f(x) = 5x+2$ and $g(x)=3x-1$, what is $h(4)$?' THEN 
        'First, find the expression for the new function $h(x)$ by subtracting $g(x)$ from $f(x)$:\n$$h(x) = f(x) - g(x) = (5x+2) - (3x-1)$$\n$$h(x) = 5x + 2 - 3x + 1 = 2x + 3$$\nNow, substitute $x=4$ into the expression for $h(x)$:\n$$h(4) = 2(4) + 3 = 8 + 3 = 11$$'

    WHEN 'Given $f(x) = \sin(x)$ and $g(x) = x^2$, which of the following is $(g \circ f)(x)$?' THEN 
        'The composition $(g \circ f)(x)$ means "g of f of x". We apply the function $f(x)$ first, and then apply the function $g(x)$ to that result.\n1. Start with the input to $g$: $$g(f(x))$$\n2. Substitute the expression for $f(x)$: $$g(\sin(x))$$\n3. Apply the rule for $g$, which is to square the input: $$(\sin(x))^2 = \sin^2(x)$$'

    -- Category: Limits (6 Questions from this batch)
    WHEN 'Evaluate $\lim_{x \to 4} \frac{\sqrt{x} - 2}{x - 4}$.' THEN 
        'Substituting $x=4$ gives $\frac{0}{0}$, an indeterminate form. We can solve this by multiplying the numerator and denominator by the conjugate of the numerator, which is $(\sqrt{x}+2)$.\n$$\lim_{x \to 4} \frac{(\sqrt{x}-2)(\sqrt{x}+2)}{(x-4)(\sqrt{x}+2)} = \lim_{x \to 4} \frac{x-4}{(x-4)(\sqrt{x}+2)}$$\nCancel the $(x-4)$ terms:\n$$\lim_{x \to 4} \frac{1}{\sqrt{x}+2} = \frac{1}{\sqrt{4}+2} = \frac{1}{2+2} = \frac{1}{4}$$'

    WHEN 'What is $\lim_{x \to \infty} \frac{5x^4 - 2x + 1}{3x^4 + x^3 - 8}$?' THEN 
        'For limits of rational functions at infinity, we compare the degrees of the numerator and the denominator.\nHere, the degrees are the same (both are 4). In this case, the limit is the ratio of the leading coefficients.\nLeading coefficient of numerator: 5\nLeading coefficient of denominator: 3\nTherefore, the limit is $\frac{5}{3}$.'

    WHEN 'Find $\lim_{x \to 0} \frac{\tan(3x)}{x}$.' THEN 
        'We can solve this using the fundamental trigonometric limit $\lim_{u\to0}\frac{\sin u}{u} = 1$.\nFirst, rewrite $\tan(3x)$ in terms of sine and cosine:\n$$\lim_{x \to 0} \frac{\sin(3x)}{x \cos(3x)}$$\nTo use the known limit, we need the argument of sine to match the denominator. Multiply the top and bottom by 3:\n$$\lim_{x \to 0} \left(\frac{\sin(3x)}{3x} \cdot \frac{3}{\cos(3x)}\right)$$\nAs $x \to 0$, we have $\frac{\sin(3x)}{3x} \to 1$ and $\cos(3x) \to \cos(0) = 1$. The limit becomes:\n$$1 \cdot \frac{3}{1} = 3$$'

    WHEN 'Evaluate $\lim_{h \to 0} \frac{(x+h)^3 - x^3}{h}$. This represents the derivative of $x^3$.' THEN 
        'This expression is the formal definition of the derivative for the function $f(x) = x^3$.\nFirst, expand the binomial $(x+h)^3$:\n$$x^3 + 3x^2h + 3xh^2 + h^3$$\nSubstitute this back into the limit expression:\n$$\lim_{h \to 0} \frac{(x^3 + 3x^2h + 3xh^2 + h^3) - x^3}{h} = \lim_{h \to 0} \frac{3x^2h + 3xh^2 + h^3}{h}$$\nFactor out $h$ from the numerator and cancel with the denominator:\n$$\lim_{h \to 0} (3x^2 + 3xh + h^2)$$\nNow substitute $h=0$: $$3x^2 + 3x(0) + (0)^2 = 3x^2$$'

    WHEN 'What is $\lim_{x \to \infty} \left(1 + \frac{2}{x}\right)^x$?' THEN 
        'This limit is in the indeterminate form $1^\infty$. It matches the special limit definition for the number $e$:\n$$\lim_{n\to\infty}\left(1+\frac{a}{n}\right)^n = e^a$$\nIn this problem, $a=2$. Therefore, the limit evaluates to $e^2$.'

    WHEN 'Find the limit: $\lim_{x \to 2} \frac{x^2 - x - 2}{x^2 - 4}$.' THEN 
        'Substituting $x=2$ gives $\frac{0}{0}$, an indeterminate form. We can solve this by factoring the numerator and the denominator.\nNumerator: $x^2 - x - 2 = (x-2)(x+1)$\nDenominator: $x^2 - 4 = (x-2)(x+2)$\nThe limit becomes:\n$$\lim_{x \to 2} \frac{(x-2)(x+1)}{(x-2)(x+2)}$$\nCancel the common factor $(x-2)$:\n$$\lim_{x \to 2} \frac{x+1}{x+2} = \frac{2+1}{2+2} = \frac{3}{4}$$'

    WHEN 'What is $\lim_{x \to \infty} \left(1 + \frac{2}{x}\right)^x$?' THEN 
        'This limit is in the indeterminate form $1^\infty$. It matches the special limit definition for the number $e$:\n$$\lim_{n\to\infty}\left(1+\frac{a}{n}\right)^n = e^a$$\nIn this problem, $a=2$. Therefore, the limit evaluates to $e^2$.'

    WHEN 'Find the limit: $\lim_{x \to 2} \frac{x^2 - x - 2}{x^2 - 4}$.' THEN 
        'Substituting $x=2$ gives $\frac{0}{0}$, an indeterminate form. We can solve this by factoring the numerator and the denominator.\nNumerator: $x^2 - x - 2 = (x-2)(x+1)$\nDenominator: $x^2 - 4 = (x-2)(x+2)$\nThe limit becomes:\n$$\lim_{x \to 2} \frac{(x-2)(x+1)}{(x-2)(x+2)}$$\nCancel the common factor $(x-2)$:\n$$\lim_{x \to 2} \frac{x+1}{x+2} = \frac{2+1}{2+2} = \frac{3}{4}$$'

    WHEN 'Evaluate $\lim_{x \to 0^+} x \ln(x)$.' THEN 
        'This is a $0 \cdot (-\infty)$ indeterminate form. We must first rewrite it as a fraction to apply L''Hopital''s Rule.\n$$ \lim_{x \to 0^+} \frac{\ln x}{1/x} $$\nNow it is a $-\infty/\infty$ form. Applying L''Hopital''s Rule:\n$$ \lim_{x \to 0^+} \frac{d/dx(\ln x)}{d/dx(1/x)} = \lim_{x \to 0^+} \frac{1/x}{-1/x^2} = \lim_{x \to 0^+} -x = 0 $$'

    WHEN 'What is the value of $\lim_{x \to 3^-} \frac{x}{x-3}$?' THEN 
        'We are evaluating the limit as $x$ approaches 3 from the left side (values slightly less than 3).\nNumerator: As $x \to 3^-$, the numerator $x$ approaches 3.\nDenominator: As $x \to 3^-$, the denominator $x-3$ approaches 0 from the negative side (e.g., if $x=2.99$, then $x-3 = -0.01$).\nA positive number (3) divided by a very small negative number approaches $-\infty$.'

    WHEN 'Find $\lim_{x \to \infty} \frac{\sin(x)}{x}$.' THEN 
        'This is a classic Squeeze Theorem problem. The sine function is always bounded between -1 and 1:\n$$-1 \le \sin x \le 1$$\nFor $x>0$, we can divide the entire inequality by $x$ without changing the direction of the inequalities:\n$$-\frac{1}{x} \le \frac{\sin x}{x} \le \frac{1}{x}$$\nAs $x \to \infty$, both $\lim_{x \to \infty} -1/x = 0$ and $\lim_{x \to \infty} 1/x = 0$.\nBy the Squeeze Theorem, the limit of $\frac{\sin x}{x}$ must also be 0.'

    WHEN 'Evaluate the limit $\lim_{x \to \pi/2} \frac{1 - \sin(x)}{\cos^2(x)}$.' THEN 
        'Substituting $x=\pi/2$ gives a 0/0 indeterminate form.\nWe can use the trigonometric identity $\cos^2(x) = 1-\sin^2(x)$.\n$$ \lim_{x \to \pi/2} \frac{1 - \sin(x)}{1-\sin^2(x)} $$\nFactor the denominator as a difference of squares:\n$$ \lim_{x \to \pi/2} \frac{1 - \sin(x)}{(1-\sin x)(1+\sin x)} = \lim_{x \to \pi/2} \frac{1}{1+\sin x} $$\nNow substitute $x=\pi/2$: $$\frac{1}{1+\sin(\pi/2)} = \frac{1}{1+1} = \frac{1}{2}$$'
    
    WHEN 'For the function $f(x) = \frac{|x|}{x}$, what is $\lim_{x \to 0} f(x)$?' THEN 
        'The limit does not exist because the left-hand and right-hand limits are not equal.\nLimit from the right ($x>0$): $$\lim_{x \to 0^+} \frac{x}{x} = 1$$\nLimit from the left ($x<0$): $$\lim_{x \to 0^-} \frac{-x}{x} = -1$$\nSince $1 \neq -1$, the two-sided limit does not exist.'

    WHEN 'Find $\lim_{x \to 1} \frac{\ln(x)}{x-1}$.' THEN 
        'This limit is in the 0/0 indeterminate form. It also matches the definition of the derivative of $f(x)=\ln(x)$ at the point $x=1$.\nThe derivative of $\ln(x)$ is $1/x$. At $x=1$, the value is $1/1 = 1$.\nAlternatively, using L''Hopital''s Rule:\n$$\lim_{x \to 1} \frac{d/dx(\ln x)}{d/dx(x-1)} = \lim_{x \to 1} \frac{1/x}{1} = 1$$'

    WHEN 'If $\lim_{x \to c} f(x) = 5$ and $\lim_{x \to c} g(x) = -2$, what is $\lim_{x \to c} [f(x)g(x)]^2$?' THEN 
        'We use the limit laws. The limit of a product is the product of the limits, and the limit of a power is the power of the limit.\n$$\lim_{x \to c} [f(x)g(x)]^2 = \left[\left(\lim_{x \to c} f(x)\right) \cdot \left(\lim_{x \to c} g(x)\right)\right]^2$$\n$$= [5 \cdot (-2)]^2 = [-10]^2 = 100$$'

    WHEN 'Using the Squeeze Theorem, evaluate $\lim_{x \to 0} x^2 \cos\left(\frac{1}{x}\right)$.' THEN
        'The Squeeze Theorem is perfect for functions involving sine or cosine of a reciprocal.\nWe know the range of the cosine function is $[-1, 1]$:\n$$-1 \le \cos(1/x) \le 1$$\nMultiply the inequality by $x^2$ (which is non-negative):\n$$-x^2 \le x^2\cos(1/x) \le x^2$$\nAs $x \to 0$, both $\lim_{x \to 0} -x^2 = 0$ and $\lim_{x \to 0} x^2 = 0$.\nSince the function is "squeezed" between two functions that both approach 0, its limit must also be 0.'
    
    WHEN 'Evaluate $\lim_{x \to -\infty} \frac{\sqrt{9x^2+1}}{x-2}$.' THEN
        'For limits at negative infinity, remember that $\sqrt{x^2} = |x| = -x$ for $x<0$.\nDivide the numerator and denominator by the highest power of $x$ in the denominator, which is $x$.\n$$\lim_{x \to -\infty} \frac{\sqrt{9x^2+1}/x}{(x-2)/x} = \lim_{x \to -\infty} \frac{-\sqrt{(9x^2+1)/x^2}}{1-2/x}$$\n$$= \lim_{x \to -\infty} \frac{-\sqrt{9+1/x^2}}{1-2/x} = \frac{-\sqrt{9+0}}{1-0} = -3$$'

    WHEN 'What is $\lim_{x \to \infty} (\sqrt{x^2+x} - x)$?' THEN
        'This is an $\infty - \infty$ indeterminate form. We can solve this by multiplying by the conjugate, which is $(\sqrt{x^2+x}+x)$.\n$$\lim_{x \to \infty} \frac{(\sqrt{x^2+x}-x)(\sqrt{x^2+x}+x)}{\sqrt{x^2+x}+x} = \lim_{x \to \infty} \frac{(x^2+x) - x^2}{\sqrt{x^2+x}+x}$$\n$$= \lim_{x \to \infty} \frac{x}{\sqrt{x^2+x}+x}$$\nNow, divide the numerator and denominator by $x$:\n$$\lim_{x \to \infty} \frac{1}{\sqrt{1+1/x}+1} = \frac{1}{\sqrt{1+0}+1} = \frac{1}{2}$$'

    WHEN 'Find the vertical asymptotes of $f(x) = \frac{x^2-1}{x^2-x-6}$.' THEN
        'Vertical asymptotes occur where the denominator is zero, provided the numerator is not also zero at that point.\nFactor the denominator: $$x^2-x-6 = (x-3)(x+2)$$\nThe denominator is zero at $x=3$ and $x=-2$.\nNeither of these values makes the numerator zero, so both are vertical asymptotes.'

    WHEN 'Evaluate $\lim_{x \to 0} \frac{e^{2x} - 1}{\sin(x)}$.' THEN
        'Substituting $x=0$ gives a 0/0 indeterminate form, so we can apply L''Hopital''s Rule.\nTake the derivative of the numerator and the denominator:\n$$\lim_{x \to 0} \frac{d/dx(e^{2x} - 1)}{d/dx(\sin(x))} = \lim_{x \to 0} \frac{2e^{2x}}{\cos(x)}$$\nNow, substitute $x=0$:\n$$\frac{2e^{0}}{\cos(0)} = \frac{2(1)}{1} = 2$$'

    WHEN 'Which of the following is the formal definition of the derivative?' THEN 
        'The formal definition of the derivative of a function $f(x)$ at a point $x$ is given by the limit of the difference quotient as the interval $h$ approaches zero.\nThis is expressed as:\n$$f''(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}$$\nThis represents the instantaneous rate of change of the function.'



    WHEN 'Find the derivative of $y = \tan^{-1}(2x)$.' THEN
        'This requires the chain rule combined with the derivative of arctan.\nThe standard derivative is $\frac{d}{du}(\tan^{-1}u) = \frac{1}{1+u^2}$.\nIn this case, the inner function is $u=2x$, so $\frac{du}{dx}=2$.\nApplying the chain rule, $\frac{dy}{dx} = \frac{dy}{du} \cdot \frac{du}{dx}$:\n$$\frac{dy}{dx} = \frac{1}{1+(2x)^2} \cdot 2 = \frac{2}{1+4x^2}$$'

    WHEN 'The second derivative of a function $f(x)$ represents:' THEN
        'The second derivative, $f''''(x)$, describes the **concavity** of the function''s graph.\n- If $f''''(x) > 0$, the graph is concave **upward** (like a cup).\n- If $f''''(x) < 0$, the graph is concave **downward** (like a frown).\nIt also tells us how the first derivative (the slope) is changing.'

    WHEN 'Find the derivative of $f(x) = e^{\sin(x)}$.' THEN
        'This requires the chain rule. The outer function is $e^u$ and the inner function is $u=\sin(x)$.\nThe derivative of $e^u$ is $e^u$, and the derivative of $\sin(x)$ is $\cos(x)$.\nApplying the chain rule, $f''(x) = e^u \cdot \frac{du}{dx}$:\n$$f''(x) = e^{\sin(x)} \cdot \cos(x)$$'

    WHEN 'If $f(x) = (x^2+1)^3$, find $f''(1)$.' THEN
        'First, find the derivative, $f''(x)$, using the chain rule.\n$$f''(x) = 3(x^2+1)^2 \cdot \frac{d}{dx}(x^2+1)$$\n$$f''(x) = 3(x^2+1)^2 \cdot (2x) = 6x(x^2+1)^2$$\nNow, substitute $x=1$ into the derivative:\n$$f''(1) = 6(1)(1^2+1)^2 = 6(2)^2 = 6(4) = 24$$'

    WHEN 'What is the derivative of $y = \cos(x^2)$?' THEN
        'This is an application of the chain rule.\nThe outer function is $\cos(u)$ and the inner function is $u=x^2$.\nThe derivative of $\cos(u)$ is $-\sin(u)$, and the derivative of $x^2$ is $2x$.\nApplying the chain rule:\n$$\frac{dy}{dx} = -\sin(x^2) \cdot 2x = -2x\sin(x^2)$$'

    WHEN 'The slope of the tangent line to the graph of $f(x) = x^3$ at $x=2$ is:' THEN
        'The slope of the tangent line at any point is given by the value of the first derivative at that point.\nFirst, find the derivative of $f(x)=x^3$:\n$$f''(x) = 3x^2$$\nNow, evaluate the derivative at $x=2$:\n$$f''(2) = 3(2)^2 = 3(4) = 12$$'

    WHEN 'Find the derivative of $f(x) = \frac{x}{x+1}$.' THEN
        'Use the quotient rule: $\left(\frac{u}{v}\right)'' = \frac{u''v - uv''}{v^2}$.\nLet $u=x$ and $v=x+1$. Then $u''=1$ and $v''=1$.\n$$f''(x) = \frac{(1)(x+1) - (x)(1)}{(x+1)^2}$$\n$$f''(x) = \frac{x+1-x}{(x+1)^2} = \frac{1}{(x+1)^2}$$'

    WHEN 'If $y=5^x$, what is $\frac{dy}{dx}$?' THEN
        'This is the derivative of an exponential function with a base other than $e$.\nThe rule is $\frac{d}{dx}(a^x) = a^x \ln(a)$.\nIn this case, $a=5$, so the derivative is:\n$$\frac{dy}{dx} = 5^x \ln(5)$$'

    WHEN 'What is the derivative of $y=x^2+3x-5$?' THEN
        'We can differentiate term by term using the power rule.\n- The derivative of $x^2$ is $2x$.\n- The derivative of $3x$ is $3$.\n- The derivative of the constant $-5$ is $0$.\nCombining these gives: $$\frac{dy}{dx} = 2x + 3$$'

    WHEN 'If $s(t) = 4.9t^2$ is the distance function, find the velocity at $t=2$.' THEN
        'Velocity is the first derivative of the position (or distance) function with respect to time.\n$$v(t) = s''(t) = \frac{d}{dt}(4.9t^2) = 2 \cdot 4.9t = 9.8t$$\nNow, evaluate the velocity at $t=2$:\n$$v(2) = 9.8(2) = 19.6$$'

    WHEN 'Find the derivative of $f(x) = \sin(x)\cos(x)$.' THEN
        'Use the product rule: $(uv)'' = u''v + uv''$.\nLet $u=\sin(x)$ and $v=\cos(x)$. Then $u''=\cos(x)$ and $v''=-\sin(x)$.\n$$f''(x) = (\cos x)(\cos x) + (\sin x)(-\sin x)$$\n$$f''(x) = \cos^2(x) - \sin^2(x)$$\nThis can also be simplified using the double angle identity to $\cos(2x)$.'

    WHEN 'Find the critical points of $f(x) = x^3 - 3x$.' THEN
        'Critical points occur where the first derivative is zero or undefined.\nFirst, find the derivative:\n$$f''(x) = 3x^2 - 3$$\nSet the derivative to zero and solve for $x$:\n$$3x^2 - 3 = 0 \implies 3(x^2-1) = 0$$\n$$x^2-1 = 0 \implies (x-1)(x+1)=0$$\nThe critical points are $x=1$ and $x=-1$.'

    WHEN 'What is the derivative of $y = \sec(x)$?' THEN
        'This is a standard derivative of a trigonometric function.\nOne way to derive it is by writing $\sec(x) = \frac{1}{\cos(x)}$ and using the quotient rule.\nThe result is a known formula:\n$$\frac{d}{dx}(\sec x) = \sec x \tan x$$'

    WHEN 'If a function is differentiable at a point, it must also be:' THEN
        '**Differentiability implies continuity.**\nFor a function to have a derivative at a point, it must be continuous at that point. If there is a break, jump, or hole in the graph (discontinuity), you cannot define a unique tangent line, and therefore the derivative does not exist.'

    WHEN 'What is the derivative of $f(x)= \sqrt{x}$?' THEN
        'First, rewrite the square root using a fractional exponent:\n$$f(x) = x^{1/2}$$\nNow, apply the power rule, $\frac{d}{dx}(x^n) = nx^{n-1}$, with $n=1/2$.\n$$f''(x) = \frac{1}{2}x^{1/2 - 1} = \frac{1}{2}x^{-1/2}$$\nThis can be rewritten as: $$\frac{1}{2\sqrt{x}}$$'

    
    WHEN 'The second derivative of a function $f(x)$ represents:' THEN
        'The second derivative, $f''''(x)$, describes the **concavity** of the function''s graph.\n- If $f''''(x) > 0$, the graph is concave **upward** (like a cup).\n- If $f''''(x) < 0$, the graph is concave **downward** (like a frown).\nIt also tells us how the first derivative (the slope) is changing.'

    WHEN 'Find the derivative of $f(x) = e^{\sin(x)}$.' THEN
        'This requires the chain rule. The outer function is $e^u$ and the inner function is $u=\sin(x)$.\nThe derivative of $e^u$ is $e^u$, and the derivative of $\sin(x)$ is $\cos(x)$.\nApplying the chain rule, $f''(x) = e^u \cdot \frac{du}{dx}$:\n$$f''(x) = e^{\sin(x)} \cdot \cos(x)$$'

    WHEN 'If $f(x) = (x^2+1)^3$, find $f''(1)$.' THEN
        'First, find the derivative, $f''(x)$, using the chain rule.\n$$f''(x) = 3(x^2+1)^2 \cdot \frac{d}{dx}(x^2+1)$$\n$$f''(x) = 3(x^2+1)^2 \cdot (2x) = 6x(x^2+1)^2$$\nNow, substitute $x=1$ into the derivative:\n$$f''(1) = 6(1)(1^2+1)^2 = 6(2)^2 = 6(4) = 24$$'

    WHEN 'What is the derivative of $y = \cos(x^2)$?' THEN
        'This is an application of the chain rule.\nThe outer function is $\cos(u)$ and the inner function is $u=x^2$.\nThe derivative of $\cos(u)$ is $-\sin(u)$, and the derivative of $x^2$ is $2x$.\nApplying the chain rule:\n$$\frac{dy}{dx} = -\sin(x^2) \cdot 2x = -2x\sin(x^2)$$'

    WHEN 'The slope of the tangent line to the graph of $f(x) = x^3$ at $x=2$ is:' THEN
        'The slope of the tangent line at any point is given by the value of the first derivative at that point.\nFirst, find the derivative of $f(x)=x^3$:\n$$f''(x) = 3x^2$$\nNow, evaluate the derivative at $x=2$:\n$$f''(2) = 3(2)^2 = 3(4) = 12$$'

    WHEN 'Find the derivative of $f(x) = \frac{x}{x+1}$.' THEN
        'Use the quotient rule: $\left(\frac{u}{v}\right)'' = \frac{u''v - uv''}{v^2}$.\nLet $u=x$ and $v=x+1$. Then $u''=1$ and $v''=1$.\n$$f''(x) = \frac{(1)(x+1) - (x)(1)}{(x+1)^2}$$\n$$f''(x) = \frac{x+1-x}{(x+1)^2} = \frac{1}{(x+1)^2}$$'

    WHEN 'If $y=5^x$, what is $\frac{dy}{dx}$?' THEN
        'This is the derivative of an exponential function with a base other than $e$.\nThe rule is $\frac{d}{dx}(a^x) = a^x \ln(a)$.\nIn this case, $a=5$, so the derivative is:\n$$\frac{dy}{dx} = 5^x \ln(5)$$'

    WHEN 'What is the derivative of $y=x^2+3x-5$?' THEN
        'We can differentiate term by term using the power rule.\n- The derivative of $x^2$ is $2x$.\n- The derivative of $3x$ is $3$.\n- The derivative of the constant $-5$ is $0$.\nCombining these gives: $$\frac{dy}{dx} = 2x + 3$$'

    WHEN 'If $s(t) = 4.9t^2$ is the distance function, find the velocity at $t=2$.' THEN
        'Velocity is the first derivative of the position (or distance) function with respect to time.\n$$v(t) = s''(t) = \frac{d}{dt}(4.9t^2) = 2 \cdot 4.9t = 9.8t$$\nNow, evaluate the velocity at $t=2$:\n$$v(2) = 9.8(2) = 19.6$$'

    WHEN 'Find the derivative of $f(x) = \sin(x)\cos(x)$.' THEN
        'Use the product rule: $(uv)'' = u''v + uv''$.\nLet $u=\sin(x)$ and $v=\cos(x)$. Then $u''=\cos(x)$ and $v''=-\sin(x)$.\n$$f''(x) = (\cos x)(\cos x) + (\sin x)(-\sin x)$$\n$$f''(x) = \cos^2(x) - \sin^2(x)$$\nThis can also be simplified using the double angle identity to $\cos(2x)$.'

    WHEN 'Find the critical points of $f(x) = x^3 - 3x$.' THEN
        'Critical points occur where the first derivative is zero or undefined.\nFirst, find the derivative:\n$$f''(x) = 3x^2 - 3$$\nSet the derivative to zero and solve for $x$:\n$$3x^2 - 3 = 0 \implies 3(x^2-1) = 0$$\n$$x^2-1 = 0 \implies (x-1)(x+1)=0$$\nThe critical points are $x=1$ and $x=-1$.'

    WHEN 'What is the derivative of $y = \sec(x)$?' THEN
        'This is a standard derivative of a trigonometric function.\nOne way to derive it is by writing $\sec(x) = \frac{1}{\cos(x)}$ and using the quotient rule.\nThe result is a known formula:\n$$\frac{d}{dx}(\sec x) = \sec x \tan x$$'

    WHEN 'If a function is differentiable at a point, it must also be:' THEN
        '**Differentiability implies continuity.**\nFor a function to have a derivative at a point, it must be continuous at that point. If there is a break, jump, or hole in the graph (discontinuity), you cannot define a unique tangent line, and therefore the derivative does not exist.'

    WHEN 'What is the derivative of $f(x)= \sqrt{x}$?' THEN
        'First, rewrite the square root using a fractional exponent:\n$$f(x) = x^{1/2}$$\nNow, apply the power rule, $\frac{d}{dx}(x^n) = nx^{n-1}$, with $n=1/2$.\n$$f''(x) = \frac{1}{2}x^{1/2 - 1} = \frac{1}{2}x^{-1/2}$$\nThis can be rewritten as: $$\frac{1}{2\sqrt{x}}$$'

    WHEN 'Find the derivative of $y= \ln(x^2+1)$.' THEN
        'This requires the chain rule. The outer function is $\ln(u)$ and the inner function is $u=x^2+1$.\nThe derivative of $\ln(u)$ is $\frac{1}{u}$, and the derivative of $x^2+1$ is $2x$.\nApplying the chain rule:\n$$\frac{dy}{dx} = \frac{1}{x^2+1} \cdot 2x = \frac{2x}{x^2+1}$$'

    WHEN 'Find the absolute maximum value of f(x) = x³ - 3x on the interval [0, 2].' THEN
        'To find the absolute maximum on a closed interval, we must check the function''s value at the critical points within the interval and at the endpoints.\n1.  **Find critical points**: First, find the derivative, f''(x) = 3x² - 3. Set it to zero: 3x² - 3 = 0, which gives x = ±1. The only critical point in our interval [0, 2] is x=1.\n2.  **Evaluate at points**: Now, test the function at the endpoints (0 and 2) and the critical point (1).\n    * f(0) = 0³ - 3(0) = 0\n    * f(1) = 1³ - 3(1) = -2\n    * f(2) = 2³ - 3(2) = 8 - 6 = 2\n3.  **Compare values**: The values are 0, -2, and 2. The highest value is 2.'

    WHEN 'The inflection point of a function is where:' THEN
        'An inflection point is a point on a curve where the **concavity changes**. This means the graph switches from being concave upward (like a cup) to concave downward (like a frown), or vice versa. This change occurs where the second derivative, f''''(x), is either zero or undefined.'

    WHEN 'If a function''s first derivative is negative on an interval, the function is:' THEN
        'The first derivative, f''(x), tells us the slope of the function.\n* If f''(x) > 0 (positive), the function is **increasing** (going uphill).\n* If f''(x) < 0 (negative), the function is **decreasing** (going downhill). 📉'

    WHEN 'Find the derivative of y = x^sin(x).' THEN
        'This requires a technique called **logarithmic differentiation** because the variable appears in both the base and the exponent.\n1.  **Take the natural log**: ln(y) = ln(x^sin(x)). Using log properties, this becomes ln(y) = sin(x) * ln(x).\n2.  **Differentiate implicitly**: Differentiate both sides with respect to x, using the product rule on the right.\n    (1/y) * (dy/dx) = [cos(x) * ln(x)] + [sin(x) * (1/x)]\n3.  **Solve for dy/dx**: Multiply both sides by y.\n    dy/dx = y * [cos(x)ln(x) + sin(x)/x]\n4.  **Substitute back y**: Replace y with the original function, x^sin(x).\n    dy/dx = x^sin(x) * [cos(x)ln(x) + sin(x)/x]'

    WHEN 'What are the dimensions of the largest rectangle that can be inscribed in a semicircle of radius 4?' THEN
        '1.  **Set up the problem**: Let the rectangle have corners at (x, y) and (-x, y) on the semicircle and (-x, 0), (x, 0) on the x-axis. The semicircle''s equation is x² + y² = 16. The rectangle''s area is A = (2x)(y).\n2.  **Express Area with one variable**: From the circle equation, y = sqrt(16 - x²). So, Area A(x) = 2x * sqrt(16 - x²).\n3.  **Maximize Area**: To make differentiation easier, we can maximize A² instead of A. A² = 4x²(16 - x²) = 64x² - 4x⁴. Find the derivative with respect to x and set to 0.\n    d(A²)/dx = 128x - 16x³ = 0\n    16x(8 - x²) = 0\n    This gives x² = 8, so x = sqrt(8) = 2√2.\n4.  **Find Dimensions**: The width is 2x = 4√2. The height is y = sqrt(16 - 8) = sqrt(8) = 2√2.'

    WHEN 'A particle''s position is given by s(t) = t³-6t²+9t. When is the particle at rest?' THEN
        'The particle is at rest when its velocity is zero. Velocity is the first derivative of the position function, s(t).\n1.  **Find the velocity function**: v(t) = s''(t) = 3t² - 12t + 9.\n2.  **Set velocity to zero**: 3t² - 12t + 9 = 0.\n3.  **Solve for t**: Divide by 3 to simplify: t² - 4t + 3 = 0. Factor the quadratic: (t-1)(t-3) = 0. The solutions are t=1 and t=3.'

    WHEN 'According to the Mean Value Theorem, for f(x) = x² on [0, 2], there must be a point c such that:' THEN
        'The Mean Value Theorem (MVT) states there is a point c in (a, b) where the instantaneous slope, f''(c), equals the average slope over [a, b].\n1.  **Find the average slope**: (f(b) - f(a)) / (b - a) = (f(2) - f(0)) / (2 - 0) = (4 - 0) / 2 = 2.\n2.  **Find the instantaneous slope**: f''(x) = 2x. So, f''(c) = 2c.\n3.  **Set them equal**: According to the MVT, f''(c) = 2. So, 2c = 2, which means c = 1.'

    WHEN 'The linear approximation of f(x) = ln(x) at x=1 is:' THEN
        'The formula for linear approximation (or the tangent line) at x=a is L(x) = f(a) + f''(a)(x-a).\n1.  **Find the point**: Here, a=1. f(1) = ln(1) = 0. The point is (1, 0).\n2.  **Find the slope**: The derivative is f''(x) = 1/x. The slope at a=1 is f''(1) = 1/1 = 1.\n3.  **Write the equation**: L(x) = 0 + 1*(x-1), which simplifies to L(x) = x-1.'

    WHEN 'What is the absolute minimum value of f(x)=x²-2x+3 on [-1,3]?' THEN
        'To find the absolute minimum on a closed interval, we check the function''s value at the critical points within the interval and at the endpoints.\n1.  **Find critical points**: f''(x) = 2x - 2. Setting it to zero gives 2x - 2 = 0, so x = 1. This point is in our interval [-1, 3].\n2.  **Evaluate at points**: Test the function at the endpoints (-1 and 3) and the critical point (1).\n    * f(-1) = (-1)² - 2(-1) + 3 = 1 + 2 + 3 = 6\n    * f(1) = 1² - 2(1) + 3 = 1 - 2 + 3 = 2\n    * f(3) = 3² - 2(3) + 3 = 9 - 6 + 3 = 6\n3.  **Compare values**: The values are 6, 2, and 6. The lowest value is 2.'

    WHEN 'If f''(x) > 0 on an interval, the function is:' THEN
        'The second derivative, f''''(x), tells us about the concavity of a function.\n* If f''''(x) > 0, the function is **concave up**. This means the slope of the function is increasing, and its graph looks like a cup. ∪\n* If f''''(x) < 0, the function is **concave down**.'

    -- Category: Integration
    WHEN 'What is ∫(2x+1)dx?' THEN
        'We integrate term by term using the power rule for integration, which is ∫xⁿdx = (xⁿ⁺¹)/(n+1).\n* For the 2x term, n=1: ∫2x dx = 2 * (x¹⁺¹)/(1+1) = 2 * (x²/2) = x².\n* For the 1 term, n=0: ∫1 dx = x.\nDon''t forget to add the constant of integration, C.\nCombining these gives: x² + x + C.'

    WHEN 'Evaluate the definite integral ∫ from 0 to 1 of x²dx.' THEN
        'First, find the antiderivative of x² using the power rule for integration.\n∫x²dx = x³/3.\nNow, use the Fundamental Theorem of Calculus to evaluate from 0 to 1:\n[x³/3] from 0 to 1 = (1³/3) - (0³/3) = 1/3 - 0 = 1/3.'

    WHEN 'The area under the curve y=f(x) from x=a to x=b is given by:' THEN
        'A fundamental concept in calculus is that the definite integral of a non-negative function represents the area between the function''s graph and the x-axis.\nTherefore, the area under the curve y=f(x) from x=a to x=b is given by the definite integral: ∫ from a to b of f(x)dx.'

    WHEN 'What is the integral of sin(x)?' THEN
        'This is a standard integration formula based on reversing differentiation. The derivative of -cos(x) is -(-sin(x)) = sin(x).\nTherefore, the integral of sin(x) is:\n∫sin(x)dx = -cos(x) + C.\nAlways remember the constant of integration, C.'

    WHEN 'Evaluate ∫ from 0 to π/2 of cos(x)dx.' THEN
        'First, find the antiderivative of cos(x). The antiderivative is sin(x).\nNow, use the Fundamental Theorem of Calculus to evaluate from 0 to π/2:\n[sin(x)] from 0 to π/2 = sin(π/2) - sin(0) = 1 - 0 = 1.'


    -- From older questions file, ensuring they are calculus-related (continued)
    WHEN 'If y = x², then dy/dx = ?' THEN
        'This is a direct application of the power rule for differentiation, which states that for $f(x) = x^n$, the derivative is $f''(x) = nx^{n-1}$.\nIn this case, $n=2$, so the derivative is:\n$$ \frac{dy}{dx} = 2x^{2-1} = 2x $$'

    WHEN 'The mean value theorem applies to functions that are:' THEN
        'The Mean Value Theorem has two main requirements for a function $f(x)$ on a closed interval $[a,b]$:\n1. The function must be **continuous** on the closed interval $[a,b]$.\n2. The function must be **differentiable** on the open interval $(a,b)$.\nTherefore, the function must be both continuous and differentiable.'

    WHEN '∫1/x dx = ?' THEN
        'This is a standard integration formula. The integral of $1/x$ is the natural logarithm of the absolute value of $x$.\n$$ \int \frac{1}{x} dx = \ln|x| + C $$\nThe absolute value is necessary because the domain of $\ln(x)$ is only positive numbers, while the domain of $1/x$ includes all non-zero numbers.'

    WHEN 'What is lim(x→∞) 1/x ?' THEN
        'This limit asks what value the function $f(x) = 1/x$ approaches as $x$ becomes infinitely large.\nAs the denominator $x$ gets larger and larger, the value of the fraction $1/x$ gets smaller and smaller, approaching 0.\nTherefore, the limit is 0.'

    WHEN 'The critical points of a function occur where:' THEN
        'Critical points of a function $f(x)$ are the points in the domain where the first derivative, $f''(x)$, is either equal to zero or is undefined.\nThese points are important because they are potential locations for local maxima or minima.'

    WHEN 'The fundamental theorem of calculus part 1 states:' THEN
        'The Fundamental Theorem of Calculus, Part 1, establishes a connection between differentiation and integration.\nIt states that if a function $f$ is continuous, then the function defined as $g(x) = \int_a^x f(t)dt$ has a derivative, and that derivative is the original function $f(x)$.\nSymbolically: $$\frac{d}{dx} \int_a^x f(t)dt = f(x)$$'

    WHEN 'If f(x) = x³ - 3x² + 2x - 1, then f''(1) = ?' THEN
        'First, find the first derivative of the function:\n$$ f''(x) = 3x^2 - 6x + 2 $$\nNow, substitute $x=1$ into the first derivative:\n$$ f''(1) = 3(1)^2 - 6(1) + 2 = 3 - 6 + 2 = -1 $$'
    
    WHEN 'L''Hopital''s rule can be applied when we have:' THEN
        'L''Hopital''s Rule is a method for evaluating limits of fractions that result in an indeterminate form.\nThe rule can be applied specifically when the limit evaluates to $\frac{0}{0}$ or $\frac{\infty}{\infty}$.'

    WHEN 'The derivative of x^n is:' THEN
        'This is the Power Rule, one of the most fundamental rules of differentiation.\nIt states that for any real number $n$, the derivative of $x^n$ is:\n$$ \frac{d}{dx}[x^n] = nx^{n-1} $$'

    WHEN 'A function has a local maximum at x = c if:' THEN
        'The Second Derivative Test helps determine if a critical point is a local maximum or minimum.\nIf $f''(c) = 0$ (meaning $x=c$ is a critical point) and the second derivative $f''''(c) < 0$ (meaning the function is concave down), then the function has a local maximum at $x=c$.'

    WHEN 'The implicit differentiation of x² + y² = 25 gives dy/dx = ?' THEN
        'We differentiate both sides of the equation with respect to $x$, remembering to use the chain rule for terms involving $y$.\n$$ \frac{d}{dx}(x^2) + \frac{d}{dx}(y^2) = \frac{d}{dx}(25) $$\n$$ 2x + 2y \frac{dy}{dx} = 0 $$\nNow, solve for $\frac{dy}{dx}$:\n$$ 2y \frac{dy}{dx} = -2x $$\n$$ \frac{dy}{dx} = -\frac{x}{y} $$'

    WHEN 'The velocity is the derivative of:' THEN
        'In calculus, velocity is defined as the rate of change of position with respect to time.\nTherefore, the velocity function $v(t)$ is the first derivative of the position function $s(t)$.\n$$ v(t) = s''(t) $$'

    WHEN 'd/dx[x^x] = ?' THEN
        'This requires logarithmic differentiation. Let $y = x^x$.\nTake the natural log of both sides: $$\ln y = \ln(x^x) = x \ln x$$\nDifferentiate implicitly: $$\frac{1}{y}\frac{dy}{dx} = (1)\ln x + x\left(\frac{1}{x}\right) = \ln x + 1$$\nSolve for $\frac{dy}{dx}$: $$\frac{dy}{dx} = y(\ln x + 1) = x^x(\ln x + 1)$$'

    WHEN 'The definite integral ∫₀¹ x dx = ?' THEN
        'Use the power rule for integration: $\int x dx = \frac{x^2}{2}$.\nNow evaluate the definite integral using the Fundamental Theorem of Calculus:\n$$ \left[\frac{x^2}{2}\right]_0^1 = \frac{1^2}{2} - \frac{0^2}{2} = \frac{1}{2} - 0 = \frac{1}{2} $$'

    WHEN 'Rolle''s theorem requires the function to be:' THEN
        'Rolle''s Theorem has three conditions for a function $f(x)$ on an interval $[a,b]$:\n1. $f(x)$ must be continuous on the closed interval $[a,b]$.\n2. $f(x)$ must be differentiable on the open interval $(a,b)$.\n3. The values of the function at the endpoints must be equal, i.e., $f(a)=f(b)$.'


    -- From Group B(1).pdf
    WHEN 'Given that a is a positive constant, evaluate \[ \int_{a}^{2a} \left( \frac{2x+1}{x} \right) dx \]' THEN
        'First, simplify the integrand by splitting the fraction:\n$$\frac{2x+1}{x} = \frac{2x}{x} + \frac{1}{x} = 2 + \frac{1}{x}$$\nNow, integrate the simplified expression:\n$$\int_a^{2a} \left(2 + \frac{1}{x}\right) dx = [2x + \ln|x|]_a^{2a}$$\nEvaluate at the upper and lower bounds:\n$$= (2(2a) + \ln|2a|) - (2a + \ln|a|)$$\n$$= 4a + \ln(2a) - 2a - \ln(a)$$\nCombine terms and use the logarithm property $\ln(b) - \ln(a) = \ln(b/a)$:\n$$= 2a + \ln\left(\frac{2a}{a}\right) = 2a + \ln(2)$$
        Since one of the options is \(a + \ln 4\), let''s double-check the provided answer key. My calculation yields \(2a + \ln 2\). The provided option A, \(3a + \ln 4\), seems incorrect based on the question. Let''s assume the intended answer was C, \(a+\ln 4\), which is also not correct. Given the options, there might be a typo in the question or options. The mathematically correct answer is \(2a + \ln 2\).'

    WHEN 'Integrate \[ \int \sec^2 x \tan x dx \]' THEN
        'This integral can be solved using u-substitution.\nLet $u = \tan x$. Then the differential is $du = \sec^2 x dx$.\nSubstitute $u$ and $du$ into the integral:\n$$\int u du = \frac{1}{2}u^2 + C$$\nNow, substitute back for $u$:\n$$\frac{1}{2}\tan^2 x + C$$\nNote: An equivalent answer is $\frac{1}{2}\sec^2 x + C$ because $\tan^2 x = \sec^2 x - 1$, and the constant term can be absorbed into the constant of integration $C$.'

    WHEN 'The nth term of the Maclaurin series expansion of cos 3x is' THEN
        'The general Maclaurin series for $\cos(z)$ is:\n$$\cos z = \sum_{n=0}^\infty \frac{(-1)^n z^{2n}}{(2n)!} = 1 - \frac{z^2}{2!} + \frac{z^4}{4!} - \dots$$\nTo find the series for $\cos(3x)$, we substitute $z=3x$ into the general formula:\n$$\cos(3x) = \sum_{n=0}^\infty \frac{(-1)^n (3x)^{2n}}{(2n)!}$$\nThe nth term of this series is the general expression inside the summation:\n$$\frac{(-1)^n (3x)^{2n}}{(2n)!}$$'

    WHEN 'The Wallis formula for \(\int_{0}^{2\pi} \sin^n x \, dx, n \geq 2\) and \(n\) is an odd number, is' THEN
        'The standard Wallis formula applies to the interval $[0, \pi/2]$. For an odd exponent $n$, the integral over a full period $[0, 2\pi]$ is 0 due to symmetry.\nHowever, the question seems to refer to the pattern for the $[0, \pi/2]$ interval. For an odd $n \geq 3$, the formula is:\n$$\int_0^{\pi/2} \sin^n x dx = \frac{(n-1)(n-3)\dots(2)}{n(n-2)\dots(3)}$$\nThe options provided seem to be mismatched with the standard Wallis formula and the interval. Option C appears to be a misrepresentation of the formulas for even and odd powers combined.'

    -- From Group B-4.pdf
    WHEN 'Which of the following option best describes the reduction formula for \( V_n = \int cosec^n x dx, n \geq 2 \)' THEN
        'This is a standard reduction formula derived using integration by parts.\nTo derive it, you would set $u = \csc^{n-2}x$ and $dv = \csc^2 x dx$.\nThe result of this process is:\n$$V_n = \int \csc^n x dx = -\frac{\csc^{n-2}x \cot x}{n-1} + \frac{n-2}{n-1}\int \csc^{n-2}x dx$$\nIn terms of $V_n$, this is:\n$$V_n = -\frac{1}{n-1}\csc^{n-2}x \cot x + \frac{n-2}{n-1} V_{n-2}$$'
    

    WHEN 'The nth term of the Maclaurin series expansion of cos 3x is' THEN 
        'The general Maclaurin series for $\cos(z)$ is:\n$$\cos z = \sum_{n=0}^\infty \frac{(-1)^n z^{2n}}{(2n)!} = 1 - \frac{z^2}{2!} + \frac{z^4}{4!} - \dots$$\nTo find the series for $\cos(3x)$, we substitute $z=3x$ into the general formula:\n$$\cos(3x) = \sum_{n=0}^\infty \frac{(-1)^n (3x)^{2n}}{(2n)!}$$\nThe nth term of this series is the general expression inside the summation:\n$$\frac{(-1)^n (3x)^{2n}}{(2n)!}$$'

    WHEN 'The Product rule of differentiation formula for the function \( V = r(x)s(x) \) is' THEN 
        'The product rule is a fundamental formula used to find the derivative of a product of two functions.\nIf a function $V$ is the product of two differentiable functions, $r(x)$ and $s(x)$, its derivative is given by:\n$$ \frac{dV}{dx} = r(x)\frac{ds}{dx} + s(x)\frac{dr}{dx} $$\nThis means "the first function times the derivative of the second, plus the second function times the derivative of the first".'

    WHEN 'Which of the following option best describes the reduction formula for \( V_n = \int cosec^n x dx, n \geq 2 \)' THEN 
        'This is a standard reduction formula derived using integration by parts, which allows us to solve integrals of powers of trigonometric functions by reducing the power in each step.\nThe correct formula for the integral of $\csc^n(x)$ is:\n$$V_n = \int \csc^n x dx = -\frac{\csc^{n-2}x \cot x}{n-1} + \frac{n-2}{n-1}\int \csc^{n-2}x dx$$\nIn terms of $V_n$, this is:\n$$V_n = -\frac{1}{n-1}\csc^{n-2}x \cot x + \frac{n-2}{n-1} V_{n-2}$$'
END;