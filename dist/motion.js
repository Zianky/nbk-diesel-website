// Content remains visible if scripts or animation APIs are unavailable.
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const heroVideo=document.querySelector('#hero-video');
const motionButton=document.querySelector('#motion-toggle');
let userWantsMotion=!reduceMotion.matches && !navigator.connection?.saveData;
function loadVideo(video){if(!video.getAttribute('src')){video.src=video.dataset.src;video.load();}}
function reflectMotion(){const playing=!heroVideo.paused;motionButton.textContent=playing?'Pause background film':'Play background film';motionButton.setAttribute('aria-pressed',String(playing));}
async function playHero(){loadVideo(heroVideo);try{await heroVideo.play();}catch{reflectMotion();}}
motionButton.addEventListener('click',()=>{userWantsMotion=heroVideo.paused;if(userWantsMotion)playHero();else heroVideo.pause();});
heroVideo.addEventListener('play',reflectMotion);heroVideo.addEventListener('pause',reflectMotion);
heroVideo.addEventListener('error',()=>{motionButton.textContent='Background film unavailable';motionButton.disabled=true;});
if(userWantsMotion)playHero();
document.addEventListener('visibilitychange',()=>{if(document.hidden)heroVideo.pause();else if(userWantsMotion)playHero();});
reduceMotion.addEventListener('change',()=>{if(reduceMotion.matches){userWantsMotion=false;heroVideo.pause();document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));}});
const filmVideos=[...document.querySelectorAll('.film-frame video')];
document.querySelectorAll('.film-play').forEach(button=>{button.addEventListener('click',async()=>{const video=document.getElementById(button.dataset.video);filmVideos.forEach(other=>{if(other!==video)other.pause();});loadVideo(video);try{await video.play();button.hidden=true;video.focus();}catch{button.textContent='Retry playback';}});});
filmVideos.forEach(video=>{video.addEventListener('play',()=>{heroVideo.pause();filmVideos.forEach(other=>{if(other!==video)other.pause();});const b=video.parentElement.querySelector('.film-play');if(b)b.hidden=true;});});
if('IntersectionObserver' in window){
 const visibility=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.target===heroVideo){if(!entry.isIntersecting)heroVideo.pause();else if(userWantsMotion && !document.hidden && !filmVideos.some(v=>!v.paused))playHero();}else if(!entry.isIntersecting)entry.target.pause();}),{threshold:.15});
 visibility.observe(heroVideo);filmVideos.forEach(v=>visibility.observe(v));
 if(!reduceMotion.matches){const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');reveal.unobserve(entry.target);}}),{threshold:.08});document.querySelectorAll('.about>div,.section-heading,.activity-list article,.story-photo,.story-copy,.approach>div,.sectors>div,.principles>div,.film-grid figure,.contact>div,.contact form').forEach(el=>{el.classList.add('reveal');reveal.observe(el);});}
}
const progress=document.querySelector('.reading-progress');let scheduled=false;
function updateProgress(){const max=document.documentElement.scrollHeight-window.innerHeight;progress.style.transform=`scaleX(${max>0?window.scrollY/max:0})`;scheduled=false;}
window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateProgress);}},{passive:true});updateProgress();
