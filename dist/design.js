(() => {
  const tabs = [...document.querySelectorAll('.product-tab')];
  const panels = [...document.querySelectorAll('.product-panel')];
  const tablist = document.querySelector('.product-tabs');
  const explorer = document.querySelector('.product-explorer');
  if (tabs.length === panels.length && tabs.length && tablist && explorer) {
    function selectProduct(index, focus = false) {
      tabs.forEach((tab, i) => {
        tab.setAttribute('aria-selected', String(i === index));
        tab.tabIndex = i === index ? 0 : -1;
        panels[i].hidden = i !== index;
        panels[i].classList.remove('panel-enter');
      });
      panels[index].classList.add('panel-enter');
      if (focus) tabs[index].focus();
    }
    panels.forEach((panel, i) => {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tabs[i].id);
    });
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => selectProduct(i));
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (i + 1) % tabs.length;
        if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (i + tabs.length - 1) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next !== undefined) { event.preventDefault(); selectProduct(next, true); }
      });
    });
    tablist.hidden = false;
    explorer.classList.add('explorer-ready');
    selectProduct(0);
    const compact = matchMedia('(max-width: 850px)');
    const reflectOrientation = () => tablist.setAttribute('aria-orientation', compact.matches ? 'horizontal' : 'vertical');
    reflectOrientation(); compact.addEventListener('change', reflectOrientation);
  }
  const requirements = [
    { title: 'Product and specification', copy: 'Identify the product and required grade or specification. Include supporting technical requirements where relevant.', x: 70, y: 250 },
    { title: 'Quantity and frequency', copy: 'State the required quantity and unit of measure, and whether the enquiry concerns a single delivery or a recurring requirement.', x: 220, y: 95 },
    { title: 'Delivery destination', copy: 'Provide the delivery point or destination port and any proposed delivery terms. This helps define the commercial scope of the enquiry.', x: 380, y: 250 },
    { title: 'Indicative schedule', copy: 'Include the expected delivery period and any important deadlines. Timing, availability and final terms require written agreement.', x: 530, y: 95 }
  ];
  const controls = document.querySelector('.requirement-controls');
  const stepButtons = [...document.querySelectorAll('[data-step]')];
  const detail = document.querySelector('.requirement-detail');
  const focusDot = document.querySelector('.diagram-focus');
  if (controls && detail && focusDot) {
    controls.hidden = false;
    stepButtons.forEach(button => button.addEventListener('click', () => {
      const item = requirements[Number(button.dataset.step)];
      if (!item) return;
      stepButtons.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
      document.querySelector('#requirement-title').textContent = item.title;
      document.querySelector('#requirement-copy').textContent = item.copy;
      focusDot.setAttribute('cx', String(item.x)); focusDot.setAttribute('cy', String(item.y));
      detail.classList.remove('detail-enter');
      requestAnimationFrame(() => detail.classList.add('detail-enter'));
    }));
  }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const graphicsToggle = document.querySelector('#graphics-toggle');
  let paused = reduced.matches || Boolean(navigator.connection?.saveData);
  const reflectGraphics = () => {
    document.body.classList.toggle('graphics-paused', paused);
    if (graphicsToggle) {
      graphicsToggle.textContent = paused ? 'Play graphic motion' : 'Pause graphic motion';
      graphicsToggle.setAttribute('aria-pressed', String(paused));
    }
  };
  if (graphicsToggle) { graphicsToggle.hidden = false; graphicsToggle.addEventListener('click', () => { paused = !paused; reflectGraphics(); }); }
  reduced.addEventListener('change', () => { if (reduced.matches) { paused = true; reflectGraphics(); } });
  reflectGraphics();
  const header = document.querySelector('header');
  let pending = false;
  window.addEventListener('scroll', () => {
    if (!pending) { pending = true; requestAnimationFrame(() => { header?.classList.toggle('is-scrolled', scrollY > 20); pending = false; }); }
  }, { passive: true });
  if ('IntersectionObserver' in window) {
    const links = [...document.querySelectorAll('#navigation a[href^="#"]')];
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(link => {
        if (link.getAttribute('href') === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }), { rootMargin: '-20% 0px -55% 0px' });
    links.forEach(link => { const target = document.querySelector(link.getAttribute('href')); if (target) observer.observe(target); });
  }
})();
