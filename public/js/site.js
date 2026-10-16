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
   * One clip plays at a time, once through, and only when the visitor asks
   * for it:
   *
   *   - with a mouse or trackpad nothing plays by itself. A click plays that
   *     clip; clicking another stops the first.
   *   - on a touchscreen the card in focus — the one most of the way on
   *     screen — plays, and the card peeking in from the edge does not until
   *     it is swiped to.
   *
   * Decided by the kind of pointer, not the window's width, so a narrow
   * laptop window still waits for a click and a tablet behaves like a phone.
   *
   * Loading is staged so a clip starts at once without the page downloading
   * six videos up front. Nothing loads until the row is close to the screen
   * (they are preload="none"); then each fetches its header and opening
   * frames. A clip about to be wanted — under the mouse, or the next card on
   * a phone — buffers ahead properly. With reduced motion turned on nothing
   * starts by itself on either kind of device.
   */
  var vrail = document.querySelector('[data-vrail]');
  if (vrail) {
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var clickToPlay = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var cards = Array.prototype.slice.call(vrail.querySelectorAll('.vcard'));
    var clips = cards.map(function (card) { return card.querySelector('[data-vplay]'); });
    var focused = null;

    var start = function (video) {
      var started = video.play();
      // A browser that refuses to play leaves the play button showing.
      if (started && started.catch) started.catch(function () {});
    };
    var warm = function (video) {
      if (video.preload !== 'auto') video.preload = 'auto';
    };

    clips.forEach(function (video, i) {
      var card = cards[i];
      var media = video.parentNode;
      var toggle = media.querySelector('[data-vtoggle]');
      var sync = function () {
        var playing = !video.paused && !video.ended;
        media.setAttribute('data-state', playing ? 'playing' : 'paused');
        if (toggle) toggle.setAttribute('aria-label', playing ? 'Pause video' : 'Play video');
      };
      video.addEventListener('play', function () {
        sync();
        clips.forEach(function (other) {
          if (other !== video && !other.paused) other.pause();
        });
      });
      video.addEventListener('pause', sync);
      video.addEventListener('ended', sync);
      // How far through the clip, for the line along the bottom of the card.
      video.addEventListener('timeupdate', function () {
        if (video.duration) media.style.setProperty('--played', (video.currentTime / video.duration).toFixed(4));
      });

      // The whole frame is the control, and the button inside it is the same
      // control for a keyboard: its click bubbles up to here.
      media.addEventListener('click', function () {
        // On a phone, tapping the card peeking in from the edge brings it
        // into focus, and coming into focus is what starts it.
        if (!clickToPlay && !reduceMotion && video !== focused) {
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
          return;
        }
        if (video.paused || video.ended) start(video);
        else video.pause();
      });

      if (clickToPlay) {
        card.addEventListener('pointerenter', function () { warm(video); });
        card.addEventListener('focusin', function () { warm(video); });
      }
    });

    if ('IntersectionObserver' in window) {
      // Close to the screen: every clip fetches its header and opening frames.
      var approach = new IntersectionObserver(
        function (entries) {
          if (!entries.some(function (entry) { return entry.isIntersecting; })) return;
          approach.disconnect();
          clips.forEach(function (video) {
            if (video.preload !== 'none') return;
            video.preload = 'metadata';
            if (video.readyState === 0) video.load();
          });
        },
        { rootMargin: '600px 0px' }
      );
      approach.observe(vrail);

      var shown = clips.map(function () { return 0; });
      var watcher = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            shown[clips.indexOf(entry.target)] = entry.isIntersecting ? entry.intersectionRatio : 0;
          });

          if (clickToPlay) {
            // A clip scrolled away stops; nothing else changes on its own.
            clips.forEach(function (video, i) {
              if (shown[i] < 0.25 && !video.paused) video.pause();
            });
            return;
          }

          // The card most of the way on screen is the one in focus.
          var best = -1;
          shown.forEach(function (ratio, i) {
            if (ratio >= 0.6 && (best < 0 || ratio > shown[best])) best = i;
          });
          var next = best >= 0 ? clips[best] : null;
          if (next !== focused) {
            if (focused && !focused.paused) focused.pause();
            focused = next;
            if (focused && !reduceMotion) {
              warm(focused);
              start(focused);
            }
          }
          // Whatever is partly in view buffers ahead, so a swipe to it plays
          // without a wait.
          shown.forEach(function (ratio, i) {
            if (ratio > 0) warm(clips[i]);
          });
        },
        { threshold: [0, 0.25, 0.6, 0.8, 1] }
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
