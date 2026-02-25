import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

/**
 * MathRenderer - Renders text with LaTeX mathematical equations
 * 
 * Supports:
 * - Inline math: $equation$ or \(equation\)
 * - Display math: $$equation$$ or \[equation\]
 * 
 * Examples:
 * - "The equation $E = mc^2$ is famous"
 * - "Solve: $$x^2 + 5x + 6 = 0$$"
 * - "What is $\frac{1}{2}$ of 10?"
 */
const MathRenderer = ({ text, className = '' }) => {
  if (!text) return null;

  // Split text by display math ($$...$$ or \[...\])
  const displayMathRegex = /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\])/g;
  const parts = text.split(displayMathRegex);

  return (
    <div className={className}>
      {parts.map((part, index) => {
        // Check if this is display math
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const latex = part.slice(2, -2).trim();
          return (
            <div key={index} className="my-4">
              <BlockMath math={latex} errorColor="#cc0000" />
            </div>
          );
        }
        
        if (part.startsWith('\\[') && part.endsWith('\\]')) {
          const latex = part.slice(2, -2).trim();
          return (
            <div key={index} className="my-4">
              <BlockMath math={latex} errorColor="#cc0000" />
            </div>
          );
        }

        // Process inline math ($...$ or \(...\))
        const inlineMathRegex = /(\$[^\$]+?\$|\\\([^\)]+?\\\))/g;
        const inlineParts = part.split(inlineMathRegex);

        return (
          <React.Fragment key={index}>
            {inlineParts.map((inlinePart, inlineIndex) => {
              if (inlinePart.startsWith('$') && inlinePart.endsWith('$')) {
                const latex = inlinePart.slice(1, -1);
                return (
                  <InlineMath key={inlineIndex} math={latex} errorColor="#cc0000" />
                );
              }
              
              if (inlinePart.startsWith('\\(') && inlinePart.endsWith('\\)')) {
                const latex = inlinePart.slice(2, -2);
                return (
                  <InlineMath key={inlineIndex} math={latex} errorColor="#cc0000" />
                );
              }

              return <span key={inlineIndex}>{inlinePart}</span>;
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default MathRenderer;
