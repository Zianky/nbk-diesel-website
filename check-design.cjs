const fs=require('node:fs');const vm=require('node:vm');const assert=require('node:assert/strict');
class Element{
 constructor(id){this.id=id;this.attrs={};this.handlers={};this.hidden=true;this.tabIndex=-1;this.dataset={};this.classes=new Set();this.classList={add:n=>this.classes.add(n),remove:n=>this.classes.delete(n),toggle:(n,v)=>v?this.classes.add(n):this.classes.delete(n)};}
 setAttribute(k,v){this.attrs[k]=v;}getAttribute(k){return this.attrs[k]??null;}removeAttribute(k){delete this.attrs[k];}addEventListener(k,f){this.handlers[k]=f;}focus(){this.focused=true;}
}
function setup(reduce=false){
 const tabs=Array.from({length:4},(_,i)=>new Element('product-tab-'+i));
 const panels=Array.from({length:4},(_,i)=>new Element('product-panel-'+i));
 const buttons=Array.from({length:4},(_,i)=>{const b=new Element();b.dataset.step=String(i);return b;});
 const map=new Map();const el=selector=>{if(!map.has(selector))map.set(selector,new Element());return map.get(selector);};
 const body=new Element('body');const ctx={document:{body,querySelector:el,querySelectorAll(selector){return ({'.product-tab':tabs,'.product-panel':panels,'[data-step]':buttons,'#navigation a[href^="#"]':[]})[selector]||[];}},navigator:{connection:{saveData:false}},matchMedia:q=>({matches:q.includes('reduced-motion')?reduce:false,addEventListener(){}}),window:{addEventListener(){}},requestAnimationFrame:f=>f(),scrollY:0};
 vm.runInNewContext(fs.readFileSync('dist/design.js','utf8'),ctx);
 return{tabs,panels,buttons,el,body};
}
const s=setup();assert.equal(s.panels.filter(p=>!p.hidden).length,1);assert.equal(s.tabs[0].attrs['aria-selected'],'true');assert.equal(s.el('.product-tabs').hidden,false);
s.tabs[2].handlers.click();assert.equal(s.panels[2].hidden,false);assert.equal(s.panels[0].hidden,true);assert.equal(s.tabs[2].tabIndex,0);assert.equal(s.panels[2].attrs['aria-labelledby'],'product-tab-2');
let prevented=false;s.tabs[2].handlers.keydown({key:'End',preventDefault(){prevented=true;}});assert.ok(prevented);assert.equal(s.panels[3].hidden,false);assert.ok(s.tabs[3].focused);
s.tabs[3].handlers.keydown({key:'ArrowRight',preventDefault(){}});assert.equal(s.panels[0].hidden,false);
s.tabs[0].handlers.keydown({key:'ArrowLeft',preventDefault(){}});assert.equal(s.panels[3].hidden,false);
s.tabs[3].handlers.keydown({key:'Home',preventDefault(){}});assert.equal(s.panels[0].hidden,false);
s.buttons[2].handlers.click();assert.equal(s.el('#requirement-title').textContent,'Delivery destination');assert.equal(s.el('.diagram-focus').attrs.cx,'380');assert.equal(s.buttons[2].attrs['aria-pressed'],'true');assert.equal(s.buttons[0].attrs['aria-pressed'],'false');
s.el('#graphics-toggle').handlers.click();assert.ok(s.body.classes.has('graphics-paused'));assert.equal(s.el('#graphics-toggle').attrs['aria-pressed'],'true');
const reduced=setup(true);assert.ok(reduced.body.classes.has('graphics-paused'));assert.equal(reduced.el('#graphics-toggle').textContent,'Play graphic motion');
console.log('PASS: product panels, single active tab, keyboard arrows/Home/End path, ARIA associations, requirement details and SVG coordinates, graphic pause, reduced-motion default.');
