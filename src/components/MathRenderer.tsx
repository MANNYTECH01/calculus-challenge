import React from 'react';
import { MathJax } from 'better-react-mathjax';

// A simplified, general-purpose MathRenderer component
const MathRenderer: React.FC<{ children: string; inline?: boolean; className?: string }> = ({ 
  children, 
  inline = false, 
  className = "" 
}) => {
  return (
    <MathJax 
      inline={inline} 
      className={className}
      // Hide the initial text until it's rendered to prevent flash of raw TeX
      hideUntilTypeset={"first"} 
    >
      {children}
    </MathJax>
  );
};

// Wrapper for inline math text (like in buttons or paragraphs)
export const MathText: React.FC<{ children: string; className?: string }> = ({ 
  children, 
  className 
}) => (
  <MathRenderer inline className={className}>
    {children}
  </MathRenderer>
);

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