(function () {
  var root = document.documentElement;
  window.__siteReady = true;

  // Year
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Nav border once scrolled
  var nav = document.querySelector('.nav');
  function onScroll() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  var menuBtn = document.getElementById('menu-toggle');
  var links = document.getElementById('nav-links');
  function setMenu(open) {
    if (!nav || !menuBtn) return;
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      setMenu(!nav.classList.contains('open'));
    });
  }
  if (links) {
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  // Theme toggle
  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  function currentTheme() {
    var set = root.getAttribute('data-theme');
    if (set === 'light' || set === 'dark') return set;
    return media && media.matches ? 'dark' : 'light';
  }
  var themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  // Reveal on scroll, with a small stagger inside grids
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  var groups = ['.stats-grid', '.grid-3', '.media-grid', '.comm', '.xp'];
  groups.forEach(function (sel) {
    Array.prototype.slice.call(document.querySelectorAll(sel)).forEach(function (parent) {
      Array.prototype.slice.call(parent.querySelectorAll('.reveal')).forEach(function (el, i) {
        el.style.transitionDelay = (i % 4) * 70 + 'ms';
      });
    });
  });

  if (!('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    reveals.forEach(function (el) { io.observe(el); });

    // Highlight the nav link for the section in view
    var navLinks = {};
    Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]')).forEach(function (a) {
      navLinks[a.getAttribute('href').slice(1)] = a;
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = navLinks[entry.target.id];
        if (!link || link.classList.contains('nav-cta')) return;
        if (entry.isIntersecting) {
          Object.keys(navLinks).forEach(function (k) { navLinks[k].classList.remove('active'); });
          link.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(navLinks).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) spy.observe(section);
    });
  }
})();
