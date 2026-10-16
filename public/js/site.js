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

  /* --------------------------------------------------- product videos
   *
   * Each clip plays, muted and looping, only while most of it is on screen,
   * and pauses as soon as it leaves — so the page is never decoding six
   * videos at once, and a clip that is never scrolled to is never downloaded
   * (they are preload="none"). A clip the visitor paused stays paused. With
   * reduced motion turned on nothing plays by itself; the button still works.
   */
  var vrail = document.querySelector('[data-vrail]');
  if (vrail) {
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var clips = vrail.querySelectorAll('[data-vplay]');

    clips.forEach(function (video) {
      var media = video.parentNode;
      var toggle = media.querySelector('[data-vtoggle]');
      var sync = function () {
        var playing = !video.paused;
        media.setAttribute('data-state', playing ? 'playing' : 'paused');
        if (toggle) toggle.setAttribute('aria-label', playing ? 'Pause video' : 'Play video');
      };
      video.addEventListener('play', sync);
      video.addEventListener('pause', sync);
      if (toggle) {
        toggle.addEventListener('click', function () {
          if (video.paused) {
            video.removeAttribute('data-user-paused');
            var started = video.play();
            if (started && started.catch) started.catch(function () {});
          } else {
            video.setAttribute('data-user-paused', '');
            video.pause();
          }
        });
      }
    });

    if (!reduceMotion && 'IntersectionObserver' in window) {
      var watcher = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            var video = entry.target;
            if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
              if (video.hasAttribute('data-user-paused')) return;
              var started = video.play();
              // A browser that refuses autoplay leaves the play button showing.
              if (started && started.catch) started.catch(function () {});
            } else if (!video.paused) {
              video.pause();
            }
          });
        },
        { threshold: [0, 0.6] }
      );
      clips.forEach(function (video) { watcher.observe(video); });
    }

    /* The arrows move a page of whole cards; snapping squares it up. The bar
       under the row only shows when there is somewhere to scroll to. */
    var bar = document.querySelector('[data-vrail-bar]');
    var thumb = bar && bar.querySelector('[data-vrail-progress]');
    var prev = bar && bar.querySelector('[data-vrail-prev]');
    var next = bar && bar.querySelector('[data-vrail-next]');

    var pageWidth = function () {
      var card = vrail.querySelector('.vcard');
      var style = window.getComputedStyle(vrail);
      var gap = parseFloat(style.columnGap) || 0;
      var per = card ? card.getBoundingClientRect().width + gap : vrail.clientWidth;
      var room = vrail.clientWidth - (parseFloat(style.paddingLeft) || 0) - (parseFloat(style.paddingRight) || 0);
      return Math.max(1, Math.floor((room + gap) / per)) * per;
    };
    var go = function (dir) {
      vrail.scrollBy({ left: dir * pageWidth(), behavior: reduceMotion ? 'auto' : 'smooth' });
    };
    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });

    var railQueued = false;
    var updateRail = function () {
      railQueued = false;
      var max = vrail.scrollWidth - vrail.clientWidth;
      if (bar) bar.hidden = max <= 2;
      if (max <= 2) return;
      var shown = vrail.clientWidth / vrail.scrollWidth;
      var along = vrail.scrollLeft / max;
      if (thumb) {
        thumb.style.width = shown * 100 + '%';
        thumb.style.left = along * (1 - shown) * 100 + '%';
      }
      if (prev) prev.disabled = vrail.scrollLeft <= 2;
      if (next) next.disabled = vrail.scrollLeft >= max - 2;
    };
    var queueRail = function () {
      if (railQueued) return;
      railQueued = true;
      window.requestAnimationFrame(updateRail);
    };
    updateRail();
    vrail.addEventListener('scroll', queueRail, { passive: true });
    window.addEventListener('resize', queueRail, { passive: true });
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
