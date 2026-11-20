(() => {
  const hero = document.querySelector('#hero-video');
  const toggle = document.querySelector('#motion-toggle');
  if (!hero || !toggle) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const films = [...document.querySelectorAll('.film-frame video')];
  let inView = true;
  let wantsBackground = !reduced.matches && !navigator.connection?.saveData && matchMedia('(min-width: 850px)').matches;
  const ensureSource = video => {
    if (!video.getAttribute('src') && video.dataset.src) {
      video.src = video.dataset.src;
      video.load();
    }
  };
  const reflect = () => {
    toggle.textContent = hero.paused ? 'Play background film' : 'Pause background film';
    toggle.setAttribute('aria-pressed', String(!hero.paused));
  };
  async function playBackground() {
    if (!inView || document.hidden || films.some(video => !video.paused)) return;
    ensureSource(hero);
    try { await hero.play(); } catch { reflect(); }
  }
  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    wantsBackground = hero.paused;
    if (wantsBackground) playBackground(); else hero.pause();
  });
  hero.addEventListener('play', reflect);
  hero.addEventListener('pause', reflect);
  hero.addEventListener('error', () => {
    toggle.textContent = 'Background film unavailable';
    toggle.disabled = true;
  });
  document.querySelectorAll('.film-play').forEach(button => {
    const video = document.getElementById(button.dataset.video);
    if (!video) return;
    button.hidden = false;
    button.addEventListener('click', async () => {
      ensureSource(video);
      try { await video.play(); video.focus(); }
      catch { button.textContent = 'Retry film'; }
    });
    video.addEventListener('play', () => {
      hero.pause();
      films.forEach(other => { if (other !== video) other.pause(); });
      button.hidden = true;
    });
    video.addEventListener('ended', () => { button.hidden = false; });
    video.addEventListener('error', () => {
      button.hidden = false;
      button.textContent = 'Film unavailable';
      button.disabled = true;
    });
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { hero.pause(); films.forEach(video => video.pause()); }
    else if (wantsBackground) playBackground();
  });
  reduced.addEventListener('change', () => {
    if (reduced.matches) { wantsBackground = false; hero.pause(); }
  });
  if ('IntersectionObserver' in window) {
    const mediaObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.target === hero) {
        inView = entry.isIntersecting;
        if (!inView) hero.pause(); else if (wantsBackground) playBackground();
      } else if (!entry.isIntersecting) entry.target.pause();
    }), { threshold: .12 });
    mediaObserver.observe(hero);
    films.forEach(video => mediaObserver.observe(video));
    if (!reduced.matches) {
      const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); reveal.unobserve(entry.target); }
      }), { threshold: .08 });
      document.querySelectorAll('.section-heading,.activity-list article,.about-copy,.steps article,.film-grid figure').forEach(element => {
        element.classList.add('reveal'); reveal.observe(element);
      });
    }
  } else if (wantsBackground) playBackground();
})();
