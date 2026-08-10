const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const HTML_DIR = path.join(__dirname, 'stitch_html');
const OUT_DIR = path.join(__dirname, 'stitch_jsx');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

function htmlToJSX(html) {
  let jsx = html;
  // Replace class with className
  jsx = jsx.replace(/class=/g, 'className=');
  // Replace for with htmlFor
  jsx = jsx.replace(/for=/g, 'htmlFor=');
  // Replace inline styles (basic regex, not perfect but handles simple cases)
  // jsx = jsx.replace(/style="([^"]*)"/g, (match, styles) => {
  //   // simplified: just clear it for now or keep as string (react will complain)
  //   // For this design, there are almost no inline styles except font-variation-settings
  //   return `style={{ fontVariationSettings: "'FILL' 1" }}`;
  // });
  jsx = jsx.replace(/style="font-variation-settings: 'FILL' 1;"/g, `style={{ fontVariationSettings: "'FILL' 1" }}`);
  // Handle self-closing tags
  jsx = jsx.replace(/<img(.*?)>/g, (match) => {
    if (match.endsWith('/>')) return match;
    return match.slice(0, -1) + '/>';
  });
  jsx = jsx.replace(/<input(.*?)>/g, (match) => {
    if (match.endsWith('/>')) return match;
    return match.slice(0, -1) + '/>';
  });
  jsx = jsx.replace(/<br>/g, '<br/>');
  jsx = jsx.replace(/<hr(.*?)>/g, '<hr/>');
  // Handle SVG
  jsx = jsx.replace(/clip-rule/g, 'clipRule');
  jsx = jsx.replace(/fill-rule/g, 'fillRule');
  jsx = jsx.replace(/stroke-width/g, 'strokeWidth');
  jsx = jsx.replace(/stroke-linecap/g, 'strokeLinecap');
  jsx = jsx.replace(/stroke-linejoin/g, 'strokeLinejoin');

  // Replace any remaining <!-- --> comments with {/* */}
  jsx = jsx.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');

  return jsx;
}

const files = fs.readdirSync(HTML_DIR);

for (const file of files) {
  if (file.endsWith('.html')) {
    const html = fs.readFileSync(path.join(HTML_DIR, file), 'utf-8');
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // We mainly want the <main> element, but for dashboard_layout we want the sidebar / topnav too.
    let targetElement;
    if (file === 'dashboard_layout.html') {
      // Just take the whole body innerHTML
      targetElement = document.body;
    } else {
      targetElement = document.querySelector('main') || document.body;
    }

    let jsxContent = htmlToJSX(targetElement.innerHTML);

    const outName = file.replace('.html', '.jsx');
    fs.writeFileSync(path.join(OUT_DIR, outName), jsxContent);
    console.log(`Converted ${file} to ${outName}`);
  }
}
