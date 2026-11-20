const fs=require('node:fs');const vm=require('node:vm');const assert=require('node:assert/strict');
const code=fs.readFileSync('dist/script.js','utf8');
function setup(data,valid=true,clipboardMode='ok'){
 const els=new Map();let destination='',copied='';
 const el=key=>{if(!els.has(key))els.set(key,{value:'',hidden:true,textContent:'',handlers:{},addEventListener(type,fn){this.handlers[type]=fn;},getAttribute(){return 'false';},setAttribute(){},querySelectorAll(){return [];},classList:{toggle(){},remove(){},add(){}},focus(){this.focused=true;},select(){this.selected=true;},reportValidity(){return valid;}});return els.get(key);};
 const product=el('.product-enquiry');product.dataset={interest:'Offshore Crude Oil Trading'};
 const context={document:{querySelector:el,querySelectorAll(selector){return selector==='.product-enquiry'?[product]:[];},addEventListener(){}},FormData:class{get(k){return data[k];}},Date,encodeURIComponent,navigator:{clipboard:{writeText:async text=>{if(clipboardMode==='fail')throw Error('denied');copied=text;}}},window:{location:{set href(v){destination=v;},get href(){return destination;}}}};
 vm.runInNewContext(code,context);return {el,destination:()=>destination,copied:()=>copied,submit(){return el('#enquiry-form').handlers.submit({preventDefault(){},currentTarget:el('#enquiry-form')});},copy(){return el('#copy-enquiry').handlers.click();}};
}
(async()=>{
 const data={name:'Test User',company:'A&B + UAE',email:'test@example.com',interest:'Diesel Fuel Trading',message:'Price? Quantity 1000 MT\nDestination: Dubai & Jebel Ali + delivery'};
 const test=setup(data);assert.equal(test.el('#enquiry-fields').disabled,false);test.el('.product-enquiry').handlers.click();assert.equal(test.el('select[name="interest"]').value,'Offshore Crude Oil Trading');test.submit();const url=new URL(test.destination());assert.equal(url.protocol,'mailto:');assert.equal(url.pathname,'info@nbkdiesel.com');assert.equal(url.searchParams.get('subject'),'Commercial enquiry — Diesel Fuel Trading — A&B + UAE');assert.ok(url.searchParams.get('body').includes(data.message));assert.ok(url.searchParams.get('body').includes(data.email));assert.equal(test.el('#enquiry-preview').hidden,false);assert.ok(test.el('#form-status').textContent.includes('Nothing has been sent'));await test.copy();assert.equal(test.copied(),test.el('#prepared-enquiry').value);
 const invalid=setup(data,false);invalid.submit();assert.equal(invalid.destination(),'');assert.equal(invalid.el('#enquiry-preview').hidden,true);
 const long=setup({...data,message:'A'.repeat(4000)});long.submit();assert.equal(long.destination(),'');assert.ok(long.el('#prepared-enquiry').value.includes('A'.repeat(4000)));assert.ok(long.el('#form-status').textContent.includes('too long'));
 const fallback=setup(data,true,'fail');fallback.submit();await fallback.copy();assert.equal(fallback.el('#prepared-enquiry').selected,true);
 const html=fs.readFileSync('dist/index.html','utf8');assert.ok(!html.includes('nbk-company-profile-2026.pdf'));assert.ok(!fs.existsSync('dist/assets/nbk-company-profile-2026.pdf'));for(const name of ['name','company','email','message'])assert.match(html,new RegExp('name="'+name+'"[^>]*required'));
 console.log('PASS: destination, encoded subject/body, all form fields, invalid form guard, long-message fallback, clipboard copy/fallback, removal of 3 profile links and hosted PDF. No email sent.');
})().catch(e=>{console.error(e);process.exitCode=1;});
