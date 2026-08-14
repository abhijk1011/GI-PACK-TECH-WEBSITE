/* GI PackTech — front-end behaviour. Small, no dependencies. */
(function () {
  'use strict';

  /* ---------------------------------------------------- nav dropdowns */
  var dropdowns = document.querySelectorAll('[data-dropdown]');
  dropdowns.forEach(function (dd) {
    var toggle = dd.querySelector('.nav__toggle');
    if (!toggle) return;

    function open(state) {
      dd.dataset.open = state ? 'true' : 'false';
      toggle.setAttribute('aria-expanded', state ? 'true' : 'false');
    }

    dd.addEventListener('mouseenter', function () { open(true); });
    dd.addEventListener('mouseleave', function () { open(false); });
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      open(dd.dataset.open !== 'true');
    });
    dd.addEventListener('focusout', function (e) {
      if (!dd.contains(e.relatedTarget)) open(false);
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    dropdowns.forEach(function (dd) {
      dd.dataset.open = 'false';
      var t = dd.querySelector('.nav__toggle');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  });

  /* ------------------------------------------------------- mobile nav */
  var burger = document.querySelector('[data-burger]');
  var mobilenav = document.querySelector('[data-mobilenav]');
  if (burger && mobilenav) {
    burger.addEventListener('click', function () {
      var open = mobilenav.dataset.open === 'true';
      mobilenav.dataset.open = open ? 'false' : 'true';
      burger.setAttribute('aria-expanded', open ? 'false' : 'true');
      burger.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
    });
  }

  /* --------------------------------------------------- product gallery */
  var gallery = document.querySelector('[data-gallery]');
  if (gallery) {
    var main = gallery.querySelector('[data-gallery-main]');
    var caption = gallery.querySelector('[data-gallery-caption]');
    gallery.querySelectorAll('.gallery__thumb').forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        if (!main) return;
        main.src = thumb.dataset.src;
        main.alt = thumb.dataset.alt || '';
        if (caption) caption.textContent = thumb.dataset.caption || '';
        gallery.querySelectorAll('.gallery__thumb').forEach(function (t) {
          t.setAttribute('aria-selected', t === thumb ? 'true' : 'false');
        });
      });
    });
  }

  /* -------------------------------------------------- reveal on scroll */
  var revealables = document.querySelectorAll('[data-reveal]');
  if (revealables.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* --------------------------------- highlight the active anchor link
   *
   * Worked out from where the sections are rather than from intersection
   * events. An observer only fires on a change, which left two visible faults:
   * nothing was marked until the first scroll, and a section skipped past —
   * by a jump to an anchor, or a flick of the wheel — never fired at all, so
   * the highlight stayed on a heading that had long since scrolled away.
   */
  var anchorNav = document.querySelector('.anchor-nav');
  if (anchorNav) {
    var anchors = [];
    anchorNav.querySelectorAll('a[href^="#"]').forEach(function (a) {
      var section = document.getElementById(a.getAttribute('href').slice(1));
      if (section) anchors.push({ link: a, section: section });
    });

    if (anchors.length) {
      var current = null;
      var queued = false;

      var markActive = function () {
        queued = false;
        // The line a heading has to cross to count as the section being read.
        var line = anchorNav.getBoundingClientRect().bottom + 8;
        var active = anchors[0];
        anchors.forEach(function (a) {
          if (a.section.getBoundingClientRect().top <= line) active = a;
        });
        if (active === current) return;
        if (current) current.link.removeAttribute('aria-current');
        active.link.setAttribute('aria-current', 'true');
        current = active;
      };

      var onScroll = function () {
        if (queued) return;
        queued = true;
        window.requestAnimationFrame(markActive);
      };

      markActive();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
    }
  }
})();
