/* Admin panel helpers: character counters and unsaved-change warnings. */
(function () {
  'use strict';

  /* Character counters on SEO fields, so titles and descriptions
     stay inside what Google actually shows. */
  document.querySelectorAll('[data-counter]').forEach(function (el) {
    var limit = Number(el.dataset.counter);
    var out = document.createElement('span');
    out.className = 'counter';
    out.style.cssText = 'display:block;margin-top:.25rem;';

    function update() {
      var n = el.value.length;
      out.textContent = n + ' / ' + limit + ' characters';
      out.dataset.over = n > limit ? 'true' : 'false';
    }

    el.addEventListener('input', update);
    update();
    el.insertAdjacentElement('afterend', out);
  });

  /* Warn before leaving a form with unsaved edits. */
  document.querySelectorAll('form').forEach(function (form) {
    if (form.hasAttribute('data-no-warn')) return;
    if (!form.querySelector('input, textarea, select')) return;

    var dirty = false;
    form.addEventListener('input', function () { dirty = true; });
    form.addEventListener('submit', function () { dirty = false; });

    window.addEventListener('beforeunload', function (e) {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = '';
    });
  });

  /* Live preview when an image is picked from the library. */
  document.querySelectorAll('.picker input[type=radio]').forEach(function (input) {
    input.addEventListener('change', function () {
      var field = document.querySelector('[data-imagefield][name="' + input.name + '"]');
      if (field) field.value = input.value;
    });
  });
})();
