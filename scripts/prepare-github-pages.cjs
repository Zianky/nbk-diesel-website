const fs = require('node:fs');
const path = require('node:path');
const out = path.resolve('output/github-pages');
if (fs.existsSync(out)) throw new Error('Pages output already exists; use a fresh checkout or preserve it before rebuilding.');
fs.mkdirSync(out, { recursive: true });
fs.cpSync('dist', out, { recursive: true });
const privacyPath = path.join(out, 'privacy.html');
let privacy = fs.readFileSync(privacyPath, 'utf8');
privacy = privacy.replace('This version is hosted through ChatGPT Sites and Cloudflare infrastructure. The private preview uses ChatGPT sign-in, whose account and session processing is governed by <a href="https://openai.com/policies/privacy-policy/" target="_blank" rel="noopener">OpenAI’s privacy policy</a>.', 'This public website is hosted using GitHub Pages. GitHub may process technical request information and access logs to deliver and protect its services. Its processing is described in the <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener">GitHub General Privacy Statement</a>. The public website does not require a ChatGPT account.');
if (privacy.includes('This version is hosted through ChatGPT Sites')) throw new Error('Hosting notice was not adapted.');
fs.writeFileSync(privacyPath, privacy);
const cookiesPath = path.join(out, 'cookies.html');
let cookies = fs.readFileSync(cookiesPath, 'utf8');
cookies = cookies.replace(/<section><h2>Hosting and private preview<\/h2>[\s\S]*?<\/section>/, '<section><h2>Hosting and technical services</h2><p>This public website is served through GitHub Pages. The hosting infrastructure may process technical information for delivery and security. Any provider processing is described in the <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener">GitHub General Privacy Statement</a>. The website does not require ChatGPT sign-in.</p></section>');
cookies = cookies.replace('Blocking essential platform cookies may prevent access to the private preview.', 'Blocking essential technical mechanisms may affect website delivery or security features.');
fs.writeFileSync(cookiesPath, cookies);
const base = (process.env.PAGES_BASE_PATH || '').replace(/\/$/, '');
if (base && !/^\/[A-Za-z0-9_-]+$/.test(base)) throw new Error('Unexpected Pages base path');
const notFound = path.join(out, '404.html');
let html = fs.readFileSync(notFound, 'utf8').replace(/(href|src)="\//g, `$1="${base}/`);
fs.writeFileSync(notFound, html);
fs.writeFileSync(path.join(out, '.nojekyll'), '');
for (const name of fs.readdirSync(out).filter(name => name.endsWith('.html'))) {
  const text = fs.readFileSync(path.join(out, name), 'utf8');
  if (/Nasser|Alshamsi|Binkhadem|nbk-company-profile-2026\.pdf|info@nbkdiesel\.com/i.test(text)) throw new Error('Disallowed legacy content in '+name);
}
console.log('Prepared public GitHub Pages artifact at output/github-pages; no credentials or project-control files included.');
