import React from 'react';
import { MathJax, MathJaxContext } from 'better-react-mathjax';

interface MathRendererProps {
  children: string;
  inline?: boolean;
  className?: string;
}

const mathJaxConfig = {
  loader: { load: ["[tex]/html"] },
  tex: {
    packages: { "[+]": ["html"] },
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"]
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"]
    ]
  }
};

export const MathRenderer: React.FC<MathRendererProps> = ({ 
  children, 
  inline = false, 
  className = "" 
}) => {
  // Check if the text contains math expressions
  const containsMath = children.includes('$') || children.includes('\\(') || children.includes('\\[');
  
  if (!containsMath) {
    return <span className={className}>{children}</span>;
  }

  return (
    <MathJaxContext config={mathJaxConfig}>
      <MathJax 
        inline={inline} 
        className={className}
      >
        {children}
      </MathJax>
    </MathJaxContext>
  );
};

// Wrapper component for easy math rendering
export const MathText: React.FC<{ children: string; className?: string }> = ({ 
  children, 
  className 
}) => (
  <MathRenderer inline className={className}>
    {children}
  </MathRenderer>
);

export const MathBlock: React.FC<{ children: string; className?: string }> = ({ 
  children, 
  className 
}) => (
  <MathRenderer inline={false} className={className}>
    {children}
  </MathRenderer>
);

export default MathRenderer;