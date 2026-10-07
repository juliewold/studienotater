export type MathTemplate = {
  label: string;
  name: string;
  latex: string;
  field?: string;
};

export const mathSymbolGroups: { title: string; symbols: MathTemplate[] }[] = [
  { title: "Brøker, potenser og røtter", symbols: [
    { label: "a/b", name: "Brøk", latex: String.raw`\frac{a}{b}`, field: "a" },
    { label: "xⁿ", name: "Potens", latex: String.raw`x^{n}`, field: "n" },
    { label: "xᵢ", name: "Indeks", latex: String.raw`x_{i}`, field: "i" },
    { label: "√x", name: "Kvadratrot", latex: String.raw`\sqrt{x}`, field: "x" },
    { label: "ⁿ√x", name: "N-te rot", latex: String.raw`\sqrt[n]{x}`, field: "x" },
    { label: "(x)", name: "Tilpassede parenteser", latex: String.raw`\left( x \right)` },
    { label: "|x|", name: "Absoluttverdi", latex: String.raw`\left| x \right|` },
    { label: "logₐ x", name: "Logaritme", latex: String.raw`\log_{a}(x)`, field: "a" },
  ] },
  { title: "Summer og produkter", symbols: [
    { label: "Σ", name: "Sum", latex: String.raw`\sum_{i=1}^{n} a_i`, field: "n" },
    { label: "Π", name: "Produkt", latex: String.raw`\prod_{i=1}^{n} a_i`, field: "n" },
    { label: "Σ∞", name: "Uendelig rekke", latex: String.raw`\sum_{n=0}^{\infty} a_n` },
    { label: "n velg k", name: "Binomialkoeffisient", latex: String.raw`\binom{n}{k}`, field: "n" },
    { label: "…", name: "Prikker", latex: String.raw`\cdots ` },
  ] },
  { title: "Integraler, grenser og derivasjon", symbols: [
    { label: "∫", name: "Ubestemt integral", latex: String.raw`\int f(x)\,\mathrm{d}x` },
    { label: "∫ₐᵇ", name: "Bestemt integral", latex: String.raw`\int_{a}^{b} f(x)\,\mathrm{d}x`, field: "a" },
    { label: "∬", name: "Dobbeltintegral", latex: String.raw`\iint_{D} f(x,y)\,\mathrm{d}x\,\mathrm{d}y`, field: "D" },
    { label: "lim", name: "Grenseverdi", latex: String.raw`\lim_{x\to a} f(x)` },
    { label: "f′(x)", name: "Derivert", latex: String.raw`f'(x)` },
    { label: "d/dx", name: "Derivasjon", latex: String.raw`\frac{\mathrm{d}}{\mathrm{d}x} f(x)` },
    { label: "∂/∂x", name: "Partiellderivert", latex: String.raw`\frac{\partial f}{\partial x}` },
    { label: "d²/dx²", name: "Andrederivert", latex: String.raw`\frac{\mathrm{d}^{2}f}{\mathrm{d}x^{2}}` },
    { label: "∇f", name: "Gradient", latex: String.raw`\nabla f` },
  ] },
  { title: "Greske bokstaver", symbols: [
    ["α", "alfa", "alpha"], ["β", "beta", "beta"], ["γ", "gamma", "gamma"],
    ["δ", "delta", "delta"], ["ε", "epsilon", "varepsilon"], ["ζ", "zeta", "zeta"],
    ["η", "eta", "eta"], ["θ", "theta", "theta"], ["ι", "iota", "iota"],
    ["κ", "kappa", "kappa"], ["λ", "lambda", "lambda"], ["μ", "my", "mu"],
    ["ν", "ny", "nu"], ["ξ", "ksi", "xi"], ["π", "pi", "pi"],
    ["ρ", "rho", "rho"], ["σ", "sigma", "sigma"], ["τ", "tau", "tau"],
    ["υ", "ypsilon", "upsilon"], ["φ", "phi", "varphi"], ["χ", "khi", "chi"],
    ["ψ", "psi", "psi"], ["ω", "omega", "omega"], ["Γ", "stor gamma", "Gamma"],
    ["Δ", "stor delta", "Delta"], ["Θ", "stor theta", "Theta"], ["Λ", "stor lambda", "Lambda"],
    ["Σ", "stor sigma", "Sigma"], ["Φ", "stor phi", "Phi"], ["Ω", "stor omega", "Omega"],
  ].map(([label, name, command]) => ({ label, name, latex: `\\${command} ` })) },
  { title: "Sannsynlighet og statistikk", symbols: [
    { label: "P(A)", name: "Sannsynlighet", latex: String.raw`P\left(A\right)` },
    { label: "P(A|B)", name: "Betinget sannsynlighet", latex: String.raw`P\left(A\mid B\right)` },
    { label: "E[X]", name: "Forventning", latex: String.raw`\mathbb{E}\left[X\right]` },
    { label: "Var(X)", name: "Varians", latex: String.raw`\operatorname{Var}(X)` },
    { label: "Cov(X,Y)", name: "Kovarians", latex: String.raw`\operatorname{Cov}(X,Y)` },
    { label: "x̄", name: "Gjennomsnitt", latex: String.raw`\bar{x}`, field: "x" },
    { label: "θ̂", name: "Estimat", latex: String.raw`\hat{\theta}` },
    { label: "N(μ,σ²)", name: "Normalfordeling", latex: String.raw`X\sim\mathcal{N}(\mu,\sigma^2)` },
    { label: "Bin(n,p)", name: "Binomisk fordeling", latex: String.raw`X\sim\operatorname{Bin}(n,p)` },
  ] },
  { title: "Matriser og vektorer", symbols: [
    { label: "2 × 2", name: "Matrise 2 ganger 2", latex: String.raw`\begin{pmatrix} a & b \\ c & d \end{pmatrix}` },
    { label: "3 × 3", name: "Matrise 3 ganger 3", latex: String.raw`\begin{pmatrix} a & b & c \\ d & e & f \\ g & h & i \end{pmatrix}` },
    { label: "[a b; c d]", name: "Matrise med hakeparenteser", latex: String.raw`\begin{bmatrix} a & b \\ c & d \end{bmatrix}` },
    { label: "Kolonnevektor", name: "Kolonnevektor", latex: String.raw`\begin{pmatrix} x \\ y \\ z \end{pmatrix}` },
    { label: "det(A)", name: "Determinant", latex: String.raw`\det(A)` },
    { label: "Aᵀ", name: "Transponert matrise", latex: String.raw`A^{\mathsf{T}}` },
    { label: "v⃗", name: "Vektor", latex: String.raw`\vec{v}`, field: "v" },
    { label: "f(x) = {…", name: "Stykkevis funksjon", latex: String.raw`f(x)=\begin{cases} x^2 & x\ge 0 \\ -x & x<0 \end{cases}` },
  ] },
  { title: "Relasjoner og operatorer", symbols: [
    ["=", "Lik", "="], ["≠", "Ikke lik", String.raw`\ne `], ["≤", "Mindre enn eller lik", String.raw`\le `],
    ["≥", "Større enn eller lik", String.raw`\ge `], ["≈", "Tilnærmet lik", String.raw`\approx `],
    ["≡", "Identisk lik", String.raw`\equiv `], ["∝", "Proporsjonal med", String.raw`\propto `],
    ["±", "Pluss minus", String.raw`\pm `], ["×", "Gange", String.raw`\times `],
    ["·", "Multiplikasjonspunkt", String.raw`\cdot `], ["∞", "Uendelig", String.raw`\infty `],
    ["⇒", "Implikasjon", String.raw`\implies `], ["⇔", "Ekvivalens", String.raw`\iff `],
  ].map(([label, name, latex]) => ({ label, name, latex })) },
  { title: "Mengder og logikk", symbols: [
    ["∈", "Element i", String.raw`\in `], ["∉", "Ikke element i", String.raw`\notin `],
    ["⊆", "Delmengde eller lik", String.raw`\subseteq `], ["⊂", "Delmengde", String.raw`\subset `],
    ["∪", "Union", String.raw`\cup `], ["∩", "Snitt", String.raw`\cap `],
    ["∅", "Tom mengde", String.raw`\emptyset `], ["Aᶜ", "Komplement", "A^c"], ["|A|", "Kardinalitet", "|A|"],
    ["ℝ", "Reelle tall", String.raw`\mathbb{R}`], ["ℕ", "Naturlige tall", String.raw`\mathbb{N}`],
    ["ℤ", "Heltall", String.raw`\mathbb{Z}`], ["¬", "Negasjon", String.raw`\neg `],
    ["∧", "Og", String.raw`\land `], ["∨", "Eller", String.raw`\lor `],
    ["→", "Pil", String.raw`\to `], ["↔", "Pil begge veier", String.raw`\leftrightarrow `],
    ["∀", "For alle", String.raw`\forall `], ["∃", "Det finnes", String.raw`\exists `],
  ].map(([label, name, latex]) => ({ label, name, latex })) },
];

export function insertMathTemplate(value: string, start: number, end: number, template: MathTemplate) {
  // Select the first editable template field, so typing immediately replaces it.
  const fieldStart = template.field ? template.latex.indexOf(`{${template.field}}`) + 1 : 0;
  const selectionStart = start + (fieldStart > 0 ? fieldStart : template.latex.length);
  return {
    value: value.slice(0, start) + template.latex + value.slice(end),
    selectionStart,
    selectionEnd: selectionStart + (fieldStart > 0 ? template.field!.length : 0),
  };
}
