(() => {
  const topbar = document.getElementById('topbar');
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');

  const onScroll = () => topbar && topbar.classList.toggle('scrolled', window.scrollY > 40 || !document.querySelector('.hero'));
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (burger && menu) {
    const setOpen = (open) => {
      burger.classList.toggle('open', open);
      menu.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', () => setOpen(!menu.classList.contains('open')));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  }

  // Aktiven Menüpunkt markieren
  const links = document.querySelectorAll('.menu a[href^="#"]');
  const sections = document.querySelectorAll('main section[id]');
  if (sections.length && 'IntersectionObserver' in window) {
    const so = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => so.observe(s));
  }

  // Bilder-Fächer
  const cards = document.querySelectorAll('#fan .card');
  const captions = document.querySelectorAll('.caption');
  const dots = document.querySelectorAll('#slideDots button');
  if (cards.length) {
    let current = 0;
    let timer;
    const show = (i) => {
      current = (i + cards.length) % cards.length;
      [cards, captions, dots].forEach(list => list.forEach((el, n) => el.classList.toggle('is-active', n === current)));
    };
    const start = () => {
      clearInterval(timer);
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        timer = setInterval(() => show(current + 1), 4500);
      }
    };
    dots.forEach((d, n) => d.addEventListener('click', () => { show(n); start(); }));
    start();
  }

  const items = document.querySelectorAll('.fade');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    items.forEach(el => io.observe(el));
  } else {
    items.forEach(el => el.classList.add('in'));
  }

  // Einwilligung (Google Maps) – Karte lädt nur nach Zustimmung
  const KEY = 'gbr-consent';
  const getConsent = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  const setConsent = (v) => { try { localStorage.setItem(KEY, v); } catch (e) {} };
  const map = document.getElementById('map');
  const banner = document.getElementById('consent');

  const loadMap = () => {
    if (!map || map.querySelector('iframe')) return;
    const f = document.createElement('iframe');
    f.src = map.dataset.src;
    f.title = "Giuliana's Beauty Room auf Google Maps";
    f.loading = 'lazy';
    f.referrerPolicy = 'no-referrer-when-downgrade';
    map.replaceChildren(f);
  };
  const decide = (v) => {
    setConsent(v);
    if (banner) banner.hidden = true;
    if (v === 'yes') loadMap();
    else if (map && map.querySelector('iframe')) location.reload();
  };

  if (getConsent() === 'yes') loadMap();
  else if (getConsent() !== 'no' && banner) banner.hidden = false;

  document.getElementById('consentYes')?.addEventListener('click', () => decide('yes'));
  document.getElementById('consentNo')?.addEventListener('click', () => decide('no'));
  document.getElementById('mapLoad')?.addEventListener('click', () => decide('yes'));
  document.getElementById('consentOpen')?.addEventListener('click', (e) => { e.preventDefault(); if (banner) banner.hidden = false; });

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
