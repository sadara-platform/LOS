const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'BrandActivationPage.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add dir="rtl" to the root div
content = content.replace(
  /<div \s*className={`min-h-screen font-sans selection:bg-brand-red selection:text-white bg-brand-bg text-brand-text`}/,
  '<div \n      dir="rtl"\n      className={`min-h-screen font-sans selection:bg-brand-red selection:text-white bg-brand-bg text-brand-text`}'
);

// Replace physical classes with logical ones
const replacements = [
  { regex: /\bml-/g, replace: 'ms-' },
  { regex: /\bmr-/g, replace: 'me-' },
  { regex: /\bpl-/g, replace: 'ps-' },
  { regex: /\bpr-/g, replace: 'pe-' },
  { regex: /\bleft-0\b/g, replace: 'start-0' },
  { regex: /\bright-0\b/g, replace: 'end-0' },
  { regex: /\bborder-l\b/g, replace: 'border-s' },
  { regex: /\bborder-r\b/g, replace: 'border-e' },
  { regex: /\bborder-l-/g, replace: 'border-s-' },
  { regex: /\bborder-r-/g, replace: 'border-e-' },
  { regex: /\brounded-l\b/g, replace: 'rounded-s' },
  { regex: /\brounded-r\b/g, replace: 'rounded-e' },
  { regex: /\brounded-l-/g, replace: 'rounded-s-' },
  { regex: /\brounded-r-/g, replace: 'rounded-e-' }
];

replacements.forEach(({ regex, replace }) => {
  content = content.replace(regex, replace);
});

// We should NOT flip `left-1/2` or `right-1/2` if they are used for centering with `translate-x-1/2`.
// The regexes above only target `left-0` and `right-0`. We might need to check if there are others like `left-4`.
// Let's do a more robust regex for all left/right positioning EXCEPT 1/2.
// Actually, Tailwind logical properties are `start-*` and `end-*`.
content = content.replace(/\bleft-(?!1\/2)([0-9a-zA-Z\[\]-]+)/g, 'start-$1');
content = content.replace(/\bright-(?!1\/2)([0-9a-zA-Z\[\]-]+)/g, 'end-$1');
// Also fix `-left` and `-right`
content = content.replace(/\b-left-(?!1\/2)([0-9a-zA-Z\[\]-]+)/g, '-start-$1');
content = content.replace(/\b-right-(?!1\/2)([0-9a-zA-Z\[\]-]+)/g, '-end-$1');

// Text alignment
content = content.replace(/\btext-left\b/g, 'text-start');
content = content.replace(/\btext-right\b/g, 'text-end');

fs.writeFileSync(filePath, content, 'utf8');
console.log("RTL replacements completed successfully on BrandActivationPage.tsx");
