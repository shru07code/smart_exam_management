const fs = require('fs');
const path = require('path');

const root = __dirname;
const entries = fs.readdirSync(root, { withFileTypes: true });

const htmlFiles = entries
  .filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.html'))
  .map((e) => e.name)
  .filter((name) => name.toLowerCase() !== 'sidebar.html')
  .sort((a, b) => a.localeCompare(b));

const failures = [];

for (const name of htmlFiles) {
  const filePath = path.join(root, name);
  const text = fs.readFileSync(filePath, 'utf8');

  const checks = {
    hasSidebarContainer: /id\s*=\s*["']sidebar-container["']/.test(text),
    hasStyleCss: /href\s*=\s*["']css\/style\.css["']/.test(text),
    hasSidebarJs: /src\s*=\s*["']js\/sidebar\.js["']/.test(text),
    hasHardcodedSidebar: /<div\s+class=["']sidebar["']/.test(text)
  };

  const missing = [];
  if (!checks.hasSidebarContainer) missing.push('missing #sidebar-container');
  if (!checks.hasStyleCss) missing.push('missing css/style.css');
  if (!checks.hasSidebarJs) missing.push('missing js/sidebar.js');
  if (checks.hasHardcodedSidebar) missing.push('contains hardcoded <div class=\"sidebar\">');

  if (missing.length > 0) {
    failures.push({ file: name, issues: missing });
  }
}

if (failures.length > 0) {
  console.error(JSON.stringify({ ok: false, failures }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, filesChecked: htmlFiles.length }, null, 2));

