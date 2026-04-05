/* ============================================
   GBS — Gadget Bekas Sidoarjo
   Main JavaScript (Animations & Interactions)
   ============================================ */

'use strict';

/* ── Preloader ────────────────────────────── */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  setTimeout(() => {
    preloader.style.opacity = '0';
    preloader.style.transition = 'opacity 0.55s ease';
    preloader.addEventListener('transitionend', () => {
      preloader.remove();
      initReveal();
    }, { once: true });
  }, 2000);
});

/* ── Custom Cursor ────────────────────────── */
(function initCursor() {
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;
  const LAG = 0.14;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function tick() {
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    rx += (mx - rx) * LAG;
    ry += (my - ry) * LAG;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(tick);
  })();

  const hoverSel = 'a, button, .btn, .product-card, .why-card, .kpi-card, .review-card, .about-card, .wa-float';
  document.querySelectorAll(hoverSel).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });

  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
})();

/* ── Navbar Scroll ────────────────────────── */
(function initNavbar() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── Mobile Nav ───────────────────────────── */
(function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const drawer = document.querySelector('.nav-drawer');
  const closeBtn = document.querySelector('.nav-drawer-close');
  if (!toggle || !drawer) return;

  const spans = toggle.querySelectorAll('span');
  const open  = () => {
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
    spans[0].style.transform = 'rotate(45deg) translate(4.5px, 5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(4.5px, -5px)';
  };
  const close = () => {
    drawer.classList.remove('open');
    document.body.style.overflow = '';
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  };

  toggle.addEventListener('click', () => drawer.classList.contains('open') ? close() : open());
  if (closeBtn) closeBtn.addEventListener('click', close);
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
})();

/* ── Typewriter Effect ────────────────────── */
(function initTypewriter() {
  const el = document.querySelector('.typed-word');
  if (!el) return;
  const words = ['Laptop', 'Smartphone', 'Tablet', 'Smartwatch', 'Monitor', 'Keyboard', 'Mouse'];
  let wi = 0, ci = 0, deleting = false;

  function tick() {
    const word = words[wi];
    el.textContent = deleting ? word.slice(0, --ci) : word.slice(0, ++ci);

    let delay = deleting ? 70 : 130;
    if (!deleting && ci === word.length) { deleting = true; delay = 1800; }
    else if (deleting && ci === 0)       { deleting = false; wi = (wi + 1) % words.length; delay = 350; }

    setTimeout(tick, delay);
  }
  tick();
})();

/* ── Scroll Reveal ────────────────────────── */
function initReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('revealed');
      // also kick off counters inside
      e.target.querySelectorAll('[data-count]').forEach(runCounter);
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

  document.querySelectorAll('[data-reveal], [data-stagger]').forEach(el => io.observe(el));

  // standalone counters not inside a reveal container
  const cio = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting || e.target.dataset.counted) return;
      e.target.dataset.counted = '1';
      runCounter(e.target);
      cio.unobserve(e.target);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));
}

/* ── Counter Animation ────────────────────── */
function runCounter(el) {
  const target   = parseFloat(el.dataset.count);
  const suffix   = el.dataset.suffix || '';
  const prefix   = el.dataset.prefix || '';
  const isFloat  = el.dataset.float === '1';
  const duration = 1600;
  const start    = performance.now();

  function step(now) {
    const p  = Math.min((now - start) / duration, 1);
    const e  = 1 - Math.pow(1 - p, 4); // ease-out quartic
    const v  = target * e;
    el.textContent = prefix + (isFloat ? v.toFixed(1) : Math.round(v).toLocaleString('id-ID')) + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ── Card 3-D Tilt ────────────────────────── */
(function initTilt() {
  const cards = document.querySelectorAll('.product-card, .kpi-card');
  const TILT  = 5;
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top)  / r.height - 0.5) * -TILT * 2;
      const ry = ((e.clientX - r.left) / r.width  - 0.5) *  TILT * 2;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();

/* ── Smooth Anchor Scroll ─────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ── Active Nav Link Highlight ────────────── */
(function initActiveNav() {
  const links    = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = [...links].map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if (!sections.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.toggle('active-nav', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-50% 0px -50% 0px' });

  sections.forEach(s => io.observe(s));
})();

/* ── Progress bars (report page) ─────────── */
window.GBS_initProgressBars = function () {
  const bars = document.querySelectorAll('.progress-fill:not([data-pb-watched])');
  if (!bars.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      setTimeout(() => { e.target.style.width = e.target.dataset.width + '%'; }, 100);
      io.unobserve(e.target);
    });
  }, { threshold: 0.5 });
  bars.forEach(b => { b.dataset.pbWatched = '1'; b.style.width = '0%'; io.observe(b); });
};
window.GBS_initProgressBars();

/* ── Init on DOMContentLoaded ─────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initReveal(); // fallback when no preloader (e.g., dev reload)
});
