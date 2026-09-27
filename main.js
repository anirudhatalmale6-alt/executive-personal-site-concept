/* Concept build — behaviour layer.
   Everything here is progressive: with JavaScript off the page still renders
   complete, readable and navigable. Nothing below owns the visibility of content
   except the reveal class, which is itself gated on html.js. */
(function () {
  'use strict';
  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- design direction ---------- */
  var dirButtons = $$('.dirswitch button');
  function setDirection(dir) {
    root.setAttribute('data-direction', dir);
    dirButtons.forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.dir === dir));
    });
    try { localStorage.setItem('hm-direction', dir); } catch (e) {}
  }
  dirButtons.forEach(function (b) {
    b.addEventListener('click', function () { setDirection(b.dataset.dir); });
  });
  setDirection(root.getAttribute('data-direction') || 'chancery');

  /* ---------- masthead ---------- */
  var masthead = $('#masthead');
  var onScroll = function () {
    masthead.classList.toggle('is-stuck', window.scrollY > 24);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile drawer ---------- */
  var burger = $('.burger'), drawer = $('#drawer');
  function closeDrawer() {
    drawer.hidden = true;
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  burger.addEventListener('click', function () {
    var open = burger.getAttribute('aria-expanded') === 'true';
    if (open) { closeDrawer(); return; }
    drawer.hidden = false;
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  });
  $$('#drawer a').forEach(function (a) { a.addEventListener('click', closeDrawer); });

  /* ---------- reveal on scroll ---------- */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e, i) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var sibs = Array.prototype.slice.call(el.parentNode.children).indexOf(el);
        el.style.transitionDelay = Math.min(sibs, 5) * 90 + 'ms';
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- hero entrance ---------- */
  requestAnimationFrame(function () {
    $$('.hero .reveal').forEach(function (el, i) {
      el.style.transitionDelay = (120 + i * 160) + 'ms';
      el.classList.add('is-in');
    });
  });

  /* ---------- expertise index ---------- */
  $$('.index__head').forEach(function (head) {
    head.addEventListener('click', function () {
      var row = head.closest('.index__row');
      var open = head.getAttribute('aria-expanded') === 'true';
      $$('.index__row').forEach(function (r) {
        r.classList.remove('is-open');
        $('.index__head', r).setAttribute('aria-expanded', 'false');
      });
      if (!open) { row.classList.add('is-open'); head.setAttribute('aria-expanded', 'true'); }
    });
  });

  /* ---------- writing filters ---------- */
  var filterBtns = $$('.filters button');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.dataset.filter;
      filterBtns.forEach(function (b) { b.classList.toggle('is-on', b === btn); });
      $$('.writing-list li').forEach(function (li) {
        li.hidden = !(f === 'all' || li.dataset.cat === f);
      });
      var feature = $('.feature');
      feature.style.display = (f === 'all' || feature.dataset.cat === f) ? '' : 'none';
    });
  });

  /* ---------- gallery lightbox ---------- */
  var figs = $$('.mosaic__item');
  var box = $('#lightbox'), boxImg = $('#lightbox img'), boxCap = $('#lightbox figcaption');
  var at = 0;
  function show(i) {
    at = (i + figs.length) % figs.length;
    var img = $('img', figs[at]);
    boxImg.src = img.currentSrc || img.src;
    boxImg.alt = img.alt || '';
    boxCap.textContent = $('figcaption span', figs[at]).textContent + ' · ' +
                         $('figcaption i', figs[at]).textContent;
    box.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function hide() { box.hidden = true; document.body.style.overflow = ''; }
  figs.forEach(function (f, i) {
    f.addEventListener('click', function () { show(i); });
  });
  $('.lightbox__close').addEventListener('click', hide);
  $('.lightbox__nav--prev').addEventListener('click', function () { show(at - 1); });
  $('.lightbox__nav--next').addEventListener('click', function () { show(at + 1); });
  box.addEventListener('click', function (e) { if (e.target === box) hide(); });
  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') hide();
    if (e.key === 'ArrowLeft') show(at - 1);
    if (e.key === 'ArrowRight') show(at + 1);
  });

  /* ---------- current section: rail mark + nav ---------- */
  var railText = $('#railmark-text');
  var sections = $$('section[data-rail]');
  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var id = e.target.id;
        railText.textContent = e.target.dataset.rail;
        $$('.masthead__nav a').forEach(function (a) {
          a.classList.toggle('is-current', a.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- enquiry form (demo only — no endpoint) ---------- */
  var form = $('.enq__form'), status = $('.enq__status');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = false;
    $$('input[required],textarea[required]', form).forEach(function (el) {
      var ok = el.value.trim() !== '' && (el.type !== 'email' || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value));
      el.closest('.field').classList.toggle('is-bad', !ok);
      if (!ok) bad = true;
    });
    status.textContent = bad
      ? 'Please complete the highlighted fields.'
      : 'Thank you — in the live build this routes to your inbox. (Demo: nothing was sent.)';
  });
})();
