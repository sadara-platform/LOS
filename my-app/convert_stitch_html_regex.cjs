const fs = require('fs');
const path = require('path');

const HTML_DIR = path.join(__dirname, 'stitch_html');
const OUT_DIR = path.join(__dirname, 'stitch_jsx');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

function htmlToJSX(html) {
  let jsx = html;
  // Extract main content if it exists
  const mainMatch = jsx.match(/<main[\s\S]*?<\/main>/);
  if (mainMatch) {
    jsx = mainMatch[0];
  } else {
      // If it's the dashboard_layout, grab body
      const bodyMatch = jsx.match(/<body[\s\S]*?<\/body>/);
      if (bodyMatch) jsx = bodyMatch[0];
  }

  // Replace class with className
  jsx = jsx.replace(/class=/g, 'className=');
  // Replace for with htmlFor
  jsx = jsx.replace(/for=/g, 'htmlFor=');
  // Replace style inline
  jsx = jsx.replace(/style="font-variation-settings: 'FILL' 1;"/g, `style={{ fontVariationSettings: "'FILL' 1" }}`);
  // Handle self-closing tags
  jsx = jsx.replace(/<img([^>]*?)>/g, (match, p1) => {
    if (p1.endsWith('/')) return match;
    return `<img${p1}/>`;
  });
  jsx = jsx.replace(/<input([^>]*?)>/g, (match, p1) => {
    if (p1.endsWith('/')) return match;
    return `<input${p1}/>`;
  });
  jsx = jsx.replace(/<br>/g, '<br/>');
  jsx = jsx.replace(/<hr([^>]*?)>/g, (match, p1) => {
      if (p1.endsWith('/')) return match;
      return `<hr${p1}/>`;
  });
  // Handle SVG
  jsx = jsx.replace(/clip-rule/g, 'clipRule');
  jsx = jsx.replace(/fill-rule/g, 'fillRule');
  jsx = jsx.replace(/stroke-width/g, 'strokeWidth');
  jsx = jsx.replace(/stroke-linecap/g, 'strokeLinecap');
  jsx = jsx.replace(/stroke-linejoin/g, 'strokeLinejoin');
  jsx = jsx.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');

  return jsx;
}

const files = fs.readdirSync(HTML_DIR);

for (const file of files) {
  if (file.endsWith('.html')) {
    const html = fs.readFileSync(path.join(HTML_DIR, file), 'utf-8');
    let jsxContent = htmlToJSX(html);
    const outName = file.replace('.html', '.jsx');
    fs.writeFileSync(path.join(OUT_DIR, outName), jsxContent);
    console.log(`Converted ${file} to ${outName}`);
  }
}
