(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const form = document.querySelector('#enquiry-form');
  const interest = document.querySelector('select[name="interest"]');
  const context = document.querySelector('.interest-context');
  const label = document.querySelector('#selected-interest');
  const details = document.querySelector('#delivery-details');
  const shortNames = {
    'Diesel Fuel Trading': 'Diesel fuel',
    'Refined Oil Products Trading': 'Refined petroleum products',
    'Offshore Refined Oil Product Trading': 'Offshore refined products',
    'Offshore Crude Oil Trading': 'Offshore crude oil',
    'Other business enquiry': 'Other business enquiry'
  };
  function reflectInterest() {
    if (!interest || !context || !label) return;
    context.hidden = false;
    label.textContent = shortNames[interest.value] || interest.value;
  }
  interest?.addEventListener('change', reflectInterest);
  document.querySelectorAll('.product-enquiry').forEach(link => link.addEventListener('click', () => {
    if (interest) interest.value = link.dataset.interest;
    reflectInterest();
  }));
  reflectInterest();
  const addRequirement = document.querySelector('#add-requirement');
  const targets = ['#detail-specification', '#detail-quantity', '#detail-destination', '#detail-schedule'];
  document.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => {
    if (!addRequirement) return;
    const labels = ['Add product details to your enquiry', 'Add quantity to your enquiry', 'Add destination to your enquiry', 'Add timing to your enquiry'];
    addRequirement.textContent = labels[Number(button.dataset.step)];
    addRequirement.dataset.target = targets[Number(button.dataset.step)];
  }));
  addRequirement?.addEventListener('click', event => {
    if (!details) return;
    event.preventDefault();
    details.open = true;
    details.scrollIntoView({ behavior: reduced.matches ? 'auto' : 'smooth', block: 'center' });
    const target = document.querySelector(addRequirement.dataset.target || targets[0]);
    target?.focus({ preventScroll: true });
  });
  // Motion is an enhancement. Text and actions remain visible without it.
  if (!reduced.matches) document.querySelector('.hero')?.classList.add('hero-arrive');
  const progress = document.querySelector('#page-progress');
  let queued = false;
  function updateProgress() {
    const range = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.transform = `scaleX(${range > 0 ? Math.min(1, Math.max(0, scrollY / range)) : 0})`;
    queued = false;
  }
  window.addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(updateProgress); } }, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();
  const hero = document.querySelector('.hero');
  const art = document.querySelector('.energy-art');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  if (hero && art && finePointer.matches) {
    let x = 0, y = 0, frame = false;
    hero.addEventListener('pointermove', event => {
      if (reduced.matches || document.body.classList.contains('graphics-paused')) return;
      const rect = hero.getBoundingClientRect();
      x = ((event.clientX - rect.left) / rect.width - .5) * 12;
      y = ((event.clientY - rect.top) / rect.height - .5) * 10;
      if (!frame) {
        frame = true;
        requestAnimationFrame(() => { art.style.setProperty('--art-x', x + 'px'); art.style.setProperty('--art-y', y + 'px'); frame = false; });
      }
    });
    hero.addEventListener('pointerleave', () => { art.style.setProperty('--art-x', '0px'); art.style.setProperty('--art-y', '0px'); });
    reduced.addEventListener('change', () => { if (reduced.matches) { art.style.setProperty('--art-x', '0px'); art.style.setProperty('--art-y', '0px'); } });
  }
  form?.addEventListener('reset', () => requestAnimationFrame(reflectInterest));
})();
