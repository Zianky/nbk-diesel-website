const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
function setup(reduce=false){
 const elements=new Map();
 function el(key){if(!elements.has(key)){const classes=new Set();elements.set(key,{value:'',hidden:true,textContent:'',dataset:{},style:{transform:'',setProperty(){}},handlers:{},classList:{add(n){classes.add(n);},contains(n){return classes.has(n);}},addEventListener(t,fn){this.handlers[t]=fn;},focus(options){this.focused=true;this.focusOptions=options;},scrollIntoView(options){this.scrollOptions=options;}});}return elements.get(key);}
 el('select[name="interest"]').value='Diesel Fuel Trading';
 const product=el('.product-enquiry');product.dataset.interest='Offshore Crude Oil Trading';
 const steps=[0,1,2,3].map(n=>{const e=el('step'+n);e.dataset.step=String(n);return e;});
 const ctx={matchMedia:q=>({matches:q.includes('reduced-motion')?reduce:false,addEventListener(){}}),document:{body:el('body'),documentElement:{scrollHeight:3000},querySelector:el,querySelectorAll:q=>q==='.product-enquiry'?[product]:q==='[data-step]'?steps:[]},window:{addEventListener(){}},innerHeight:1000,scrollY:1000,requestAnimationFrame:fn=>fn()};
 vm.runInNewContext(fs.readFileSync('dist/experience.js','utf8'),ctx);return{el,steps};
}
const s=setup();assert.equal(s.el('#selected-interest').textContent,'Diesel fuel');assert.equal(s.el('.interest-context').hidden,false);
s.el('.product-enquiry').handlers.click();assert.equal(s.el('select[name="interest"]').value,'Offshore Crude Oil Trading');assert.equal(s.el('#selected-interest').textContent,'Offshore crude oil');
s.steps[2].handlers.click();assert.equal(s.el('#add-requirement').textContent,'Add destination to your enquiry');
let prevented=false;s.el('#add-requirement').handlers.click({preventDefault(){prevented=true;}});assert.ok(prevented);assert.equal(s.el('#delivery-details').open,true);assert.equal(s.el('#detail-destination').focused,true);assert.equal(s.el('#detail-destination').focusOptions.preventScroll,true);assert.equal(s.el('#page-progress').style.transform,'scaleX(0.5)');
const r=setup(true);r.steps[1].handlers.click();r.el('#add-requirement').handlers.click({preventDefault(){}});assert.equal(r.el('#delivery-details').scrollOptions.behavior,'auto');assert.equal(r.el('#detail-quantity').focused,true);assert.equal(r.el('.hero').classList.contains('hero-arrive'),false);
console.log('PASS: product-to-form context, diagram-to-field focus, delivery detail expansion, reading progress and reduced-motion behavior.');
