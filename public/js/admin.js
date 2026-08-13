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
      var set = input.closest('[data-imgset]');
      var field = set
        ? set.querySelector('[data-imagefield]')
        : document.querySelector('[data-imagefield][name="' + input.name + '"]');
      if (field) {
        field.value = input.value;
        field.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  });

  /*
   * Image fields upload in place.
   *
   * Setting a picture used to mean leaving the page for the media library and
   * coming back, which loses whatever else was being edited. Each field now
   * takes a file directly — dropped on the box or chosen with the button —
   * posts it to /admin-panel/upload, and writes the returned path into the
   * field. The file is still recorded in the library, so nothing stops being
   * reusable. Only the path changes here; it is saved with the form as before.
   */
  document.querySelectorAll('[data-imgset]').forEach(function (set) {
    var field = set.querySelector('[data-imagefield]');
    var drop = set.querySelector('[data-imgdrop]');
    var preview = set.querySelector('[data-imgpreview]');
    var empty = set.querySelector('[data-imgempty]');
    var picker = set.querySelector('[data-imgpick]');
    var clear = set.querySelector('[data-imgclear]');
    var status = set.querySelector('[data-imgstatus]');
    if (!field || !drop) return;

    var form = set.closest('form');
    var tokenField = form && form.querySelector('input[name=_csrf]');

    function render() {
      var value = field.value.trim();
      if (preview) {
        preview.src = value;
        preview.hidden = !value;
      }
      if (empty) empty.hidden = Boolean(value);
      if (clear) clear.hidden = !value;
    }

    function say(text, isError) {
      if (!status) return;
      status.textContent = text || '';
      status.dataset.error = isError ? 'true' : 'false';
    }

    function send(file) {
      if (!file) return;
      if (!tokenField) {
        say('Reload the page and try again.', true);
        return;
      }
      var body = new FormData();
      body.append('_csrf', tokenField.value);
      body.append('images', file);

      drop.dataset.busy = 'true';
      say('Uploading ' + file.name + '…');

      fetch('/admin-panel/upload', {
        method: 'POST',
        body: body,
        headers: { Accept: 'application/json' },
        credentials: 'same-origin',
      })
        .then(function (res) {
          return res.json().then(function (data) {
            if (!res.ok) throw new Error(data.error || 'Upload failed.');
            return data;
          });
        })
        .then(function (data) {
          var uploaded = (data.files || [])[0];
          if (!uploaded) throw new Error('Nothing was uploaded.');
          field.value = uploaded.path;
          // Picking from the library afterwards must not resubmit a stale
          // choice alongside the new path.
          set.querySelectorAll('.picker input[type=radio]:checked').forEach(function (r) {
            r.checked = false;
          });
          render();
          say('Uploaded. Save the form to keep it.');
          field.dispatchEvent(new Event('input', { bubbles: true }));
        })
        .catch(function (err) {
          say(err.message || 'Upload failed.', true);
        })
        .finally(function () {
          delete drop.dataset.busy;
        });
    }

    if (picker) {
      picker.addEventListener('change', function () {
        send(picker.files && picker.files[0]);
        picker.value = '';
      });
    }

    if (clear) {
      clear.addEventListener('click', function () {
        field.value = '';
        set.querySelectorAll('.picker input[type=radio]:checked').forEach(function (r) {
          r.checked = false;
        });
        render();
        say('Cleared. Save the form to keep it.');
      });
    }

    field.addEventListener('change', render);
    field.addEventListener('input', render);

    ['dragenter', 'dragover'].forEach(function (type) {
      drop.addEventListener(type, function (e) {
        e.preventDefault();
        drop.dataset.over = 'true';
      });
    });
    ['dragleave', 'dragend'].forEach(function (type) {
      drop.addEventListener(type, function () {
        delete drop.dataset.over;
      });
    });
    drop.addEventListener('drop', function (e) {
      e.preventDefault();
      delete drop.dataset.over;
      var dropped = e.dataTransfer && e.dataTransfer.files;
      if (dropped && dropped.length) send(dropped[0]);
    });

    render();
  });
})();
