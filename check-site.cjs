const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');
const root=path.resolve('dist');let pages=0,links=0;
for(const file of fs.readdirSync(root).filter(f=>f.endsWith('.html'))){
 const html=fs.readFileSync(path.join(root,file),'utf8');pages++;
 assert.equal((html.match(/<h1\b/g)||[]).length,1,`${file}: one h1`);
 assert.match(html,/<html lang="en">/);assert.match(html,/<title>[^<]+<\/title>/);assert.match(html,/name="viewport"/);
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,`${file}: unique ids`);
 for(const m of html.matchAll(/\b(?:href|src|poster|data-src)="([^"]+)"/g)){
  const ref=m[1];if(/^(?:https?:|mailto:|data:)/.test(ref))continue;
  const [pathname,anchor]=ref.split('#');const resolved=pathname?path.join(root,pathname.replace(/^\//,'')):path.join(root,file);
  const actual=pathname==='/'?path.join(root,'index.html'):resolved;
  assert.ok(fs.existsSync(actual),`${file}: missing ${ref}`);links++;
  if(anchor&&actual.endsWith('.html'))assert.ok(fs.readFileSync(actual,'utf8').includes(`id="${anchor}"`),`${file}: missing anchor ${ref}`);
 }
 assert.ok(!/fonts\.(googleapis|gstatic)\.com/.test(html),`${file}: remote fonts`);
 assert.ok(!html.includes('nbk-company-profile-2026.pdf'),`${file}: profile download`);
}
const main=fs.readFileSync(path.join(root,'index.html'),'utf8');assert.match(main,/<fieldset id="enquiry-fields" disabled>/);assert.match(main,/<noscript>/);assert.match(main,/class="menu" hidden/);
for(const asset of ['site.css','script.js','interactions.js'])assert.ok(main.includes(asset));
for(const video of ['refinery-film.mp4','logistics-film.mp4']){const b=fs.readFileSync(path.join(root,'assets/media',video));assert.equal(b.toString('ascii',4,8),'ftyp',`${video}: MP4 signature`);}
for(const p of ['DM-Sans-OFL.txt','Manrope-OFL.txt'])assert.match(fs.readFileSync(path.join(root,'assets/fonts',p),'utf8'),/SIL OPEN FONT LICENSE/i);
function luminance(hex){const rgb=hex.match(/\w\w/g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;}
function contrast(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
const ratios=[['625d68','ffffff'],['625d68','f6f5f8'],['6d3bc9','ffffff'],['ffffff','6d3bc9'],['c6bdd2','181421']].map(([a,b])=>{const r=contrast(a,b);assert.ok(r>=4.5,`Contrast ${a}/${b}: ${r}`);return r.toFixed(2);});
console.log(`PASS: ${pages} HTML pages; ${links} local media/link references; unique IDs and anchors; metadata; no profile download; no remote font requests; MP4 signatures; font licences; text colour contrast ratios ${ratios.join(', ')}.`);
