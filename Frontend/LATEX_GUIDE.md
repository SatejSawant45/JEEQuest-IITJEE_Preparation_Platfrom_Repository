# LaTeX Math Guide for Quiz Questions

## Overview
This quiz platform supports LaTeX mathematical equations in both questions and answer options using KaTeX rendering.

## Basic Syntax

### Inline Math
Use single dollar signs for inline equations:
```
What is the solution to $x^2 + 5x + 6 = 0$?
```
Renders as: What is the solution to x² + 5x + 6 = 0?

### Display Math
Use double dollar signs for centered display equations:
```
Solve the equation:
$$\frac{a^2 + b^2}{c} = d$$
```

## Common LaTeX Commands

### Superscripts and Subscripts
- Superscript: `$x^2$` → x²
- Subscript: `$x_1$` → x₁
- Both: `$x_1^2$` → x₁²

### Fractions
```
$\frac{numerator}{denominator}$
$\frac{a + b}{c - d}$
```

### Roots
- Square root: `$\sqrt{x}$` → √x
- Nth root: `$\sqrt[3]{x}$` → ∛x

### Greek Letters
- Lowercase: `$\alpha, \beta, \gamma, \delta, \theta, \lambda, \mu, \pi, \sigma, \omega$`
- Uppercase: `$\Alpha, \Beta, \Gamma, \Delta, \Theta, \Lambda, \Omega$`

### Mathematical Symbols
- Multiplication: `$\times$` → ×
- Division: `$\div$` → ÷
- Plus/minus: `$\pm$` → ±
- Not equal: `$\neq$` → ≠
- Less/Greater: `$\leq, \geq$` → ≤, ≥
- Approximately: `$\approx$` → ≈
- Infinity: `$\infty$` → ∞

### Trigonometry
```
$\sin(x), \cos(x), \tan(x)$
$\sin^2(x) + \cos^2(x) = 1$
```

### Calculus
- Integral: `$\int_0^1 x^2 dx$`
- Derivative: `$\frac{dy}{dx}$`
- Limit: `$\lim_{x \to \infty}$`
- Summation: `$\sum_{i=1}^{n} i$`

### Matrices
```
$$
\begin{matrix}
a & b \\
c & d
\end{matrix}
$$
```

### Physics Examples
```
Einstein's Equation: $E = mc^2$
Kinetic Energy: $KE = \frac{1}{2}mv^2$
Newton's Law: $F = ma$
Ohm's Law: $V = IR$
```

### Chemistry Examples
```
Water: $H_2O$
Quadratic: $ax^2 + bx + c = 0$
Concentration: $[H^+]$
```

### Programming/Math Logic
- Absolute value: `$|x|$`
- Set notation: `$x \in \mathbb{R}$`
- Arrows: `$\rightarrow, \leftarrow, \Rightarrow, \Leftrightarrow$`

## Tips for Quiz Creation

1. **Always preview**: The CreateQuiz form shows a live preview of your LaTeX
2. **Test rendering**: Try simple equations first before complex ones
3. **Escape special characters**: If you need a literal $, use `\$`
4. **Keep it readable**: Don't overuse complex formatting in options
5. **Mobile-friendly**: Display math ($$...$$) works better for long equations

## Common Mistakes to Avoid

❌ **Wrong**: `$x^2+5x+6=0$` (no spaces, harder to read)
✅ **Correct**: `$x^2 + 5x + 6 = 0$`

❌ **Wrong**: `$$x^2$$` for inline math (too large)
✅ **Correct**: `$x^2$` for inline math

❌ **Wrong**: Missing closing delimiter `$x^2`
✅ **Correct**: Always close: `$x^2$`

## Full LaTeX Reference
For advanced syntax, see: https://katex.org/docs/supported.html
