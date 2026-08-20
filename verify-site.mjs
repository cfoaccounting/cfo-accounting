import fs from 'node:fs';
import path from 'node:path';

const root = new URL('.', import.meta.url).pathname;
const pages = fs.readdirSync(root).filter((file) => file.endsWith('.html'));
const routes = new Map(pages.map((file) => [`/${file === 'index.html' ? '' : file.slice(0, -5)}`, file]));
const issues = [];
let linksChecked = 0;
let hashLinksChecked = 0;
let localAssetsChecked = 0;

function hasId(html, id) {
  const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\bid=["']${escaped}["']`).test(html);
}

for (const file of pages) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const ids = new Set([...html.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]));
  if (!/<title>[^<]+<\/title>/i.test(html)) issues.push(`${file}: missing title`);
  if (!/<meta[^>]+name=["']description["']/i.test(html)) issues.push(`${file}: missing meta description`);
  if (!/<h1\b/i.test(html)) issues.push(`${file}: missing H1`);
  if (!/<main\b/i.test(html) || !/<footer\b/i.test(html)) issues.push(`${file}: missing main or footer landmark`);

  for (const match of html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi)) {
    linksChecked += 1;
    const href = match[1];
    if (/^(https?:|mailto:|tel:)/.test(href)) continue;
    const [rawPath, hash] = href.split('#');
    if (!rawPath) {
      hashLinksChecked += 1;
      if (hash && !ids.has(hash)) issues.push(`${file}: missing local target #${hash}`);
      continue;
    }
    if (!rawPath.startsWith('/')) {
      const asset = rawPath.split(/[?#]/)[0];
      localAssetsChecked += 1;
      if (!fs.existsSync(path.join(root, asset))) issues.push(`${file}: missing local file ${asset}`);
      continue;
    }
    const route = rawPath.replace(/\/$/, '') || '/';
    const target = routes.get(route);
    if (!target) {
      issues.push(`${file}: broken route ${href}`);
    } else if (hash) {
      hashLinksChecked += 1;
      const targetHtml = fs.readFileSync(path.join(root, target), 'utf8');
      if (!hasId(targetHtml, hash)) issues.push(`${file}: missing target ${href}`);
    }
  }

  for (const match of html.matchAll(/<(?:img|script)\b[^>]*\bsrc=["']([^"']+)["']/gi)) {
    const src = match[1];
    if (/^(https?:|\/\/)/.test(src)) continue;
    localAssetsChecked += 1;
    const asset = src.split(/[?#]/)[0];
    if (!fs.existsSync(path.join(root, asset))) issues.push(`${file}: missing asset ${asset}`);
  }
}

for (const required of ['privacy-policy.html', 'terms-conditions.html', 'cookie-policy.html']) {
  if (!fs.existsSync(path.join(root, required))) issues.push(`missing legal page ${required}`);
}
for (const endpoint of ['api/contact.js', 'api/callback.js']) {
  if (!fs.existsSync(path.join(root, endpoint))) issues.push(`missing endpoint ${endpoint}`);
}

const report = { pages: pages.length, linksChecked, hashLinksChecked, localAssetsChecked, issues: issues.length };
console.log(JSON.stringify(report, null, 2));
if (issues.length) {
  console.error(issues.join('\n'));
  process.exit(1);
}
