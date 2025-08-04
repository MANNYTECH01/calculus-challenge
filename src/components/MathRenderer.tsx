import React, { useEffect, useState } from 'react';

// Simple fallback renderer that doesn't depend on better-react-mathjax
const MathRenderer: React.FC<{ children: string; inline?: boolean; className?: string }> = ({ 
  children, 
  inline = false, 
  className = "" 
}) => {
  const [rendered, setRendered] = useState(false);
  const [content, setContent] = useState(children);

  useEffect(() => {
    console.log('MathRenderer: Processing content:', children);
    
    if (typeof window !== 'undefined' && (window as any).MathJax) {
      const element = document.createElement(inline ? 'span' : 'div');
      element.textContent = children;
      
      (window as any).MathJax.typesetPromise([element]).then(() => {
        console.log('MathJax: Successfully rendered:', children);
        setContent(element.innerHTML);
        setRendered(true);
      }).catch((err: any) => {
        console.error('MathJax rendering error:', err, 'for content:', children);
        setContent(children); // Fallback to original content
        setRendered(true);
      });
    } else {
      console.warn('MathJax not available, showing raw content:', children);
      setContent(children);
      setRendered(true);
    }
  }, [children, inline]);

  if (!rendered) {
    return <span className={className} style={{ opacity: 0.5 }}>Loading...</span>;
  }

  return React.createElement(
    inline ? 'span' : 'div',
    { 
      className: className,
      dangerouslySetInnerHTML: { __html: content }
    }
  );
};

// Wrapper for inline math text (like in buttons or paragraphs)
export const MathText: React.FC<{ children: string; className?: string }> = ({ 
  children, 
  className 
}) => {
  console.log('MathText: Rendering:', children);
  return (
    <MathRenderer inline className={className}>
      {children}
    </MathRenderer>
  );
};

// Wrapper for block-level math equations (displayed on their own line)
export const MathBlock: React.FC<{ children: string; className?: string }> = ({ 
  children, 
  className 
}) => (
  <MathRenderer inline={false} className={className}>
    {children}
  </MathRenderer>
);

export default MathRenderer;