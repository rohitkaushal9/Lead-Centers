/* ==========================================================================
   Lead Centers | Request a demo form
   Client-side validation, then POSTs to FormSubmit, which relays the entry to
   ENDPOINT_EMAIL. Swap ENDPOINT for your own API if you move off FormSubmit.
   ========================================================================== */
(function () {
  'use strict';

  // Where demo requests are delivered. FormSubmit relays the submission by
  // email with no server of our own. The first submission triggers a one-off
  // confirmation email that must be accepted before entries start arriving.
  var ENDPOINT_EMAIL = 'kaushalrohit482@gmail.com';
  var ENDPOINT = 'https://formsubmit.co/ajax/' + ENDPOINT_EMAIL;

  var form = document.getElementById('demoForm');
  if (!form) return;

  var card        = document.getElementById('fcard');
  var done        = document.getElementById('fdone');
  var doneName    = document.getElementById('doneName');
  var consentWrap = document.getElementById('consentWrap');
  var errBox      = document.getElementById('formError');

  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  // Free-mail domains are allowed, but we nudge toward a work address
  var PHONE = /^[+()\-\s\d]{7,20}$/;

  function wrapOf(el) { return el.closest('[data-field]'); }

  function setError(el, on) {
    var w = wrapOf(el);
    if (w) w.classList.toggle('is-error', on);
  }

  function validate(el) {
    var val = (el.value || '').trim();

    if (el.hasAttribute('required') && !val) { setError(el, true); return false; }
    if (el.type === 'email' && val && !EMAIL.test(val)) { setError(el, true); return false; }
    if (el.type === 'tel' && val && !PHONE.test(val)) { setError(el, true); return false; }

    setError(el, false);
    return true;
  }

  // Validate a field once the user leaves it, then live-correct as they retype
  var fields = Array.prototype.slice.call(
    form.querySelectorAll('input:not([type="checkbox"]), select, textarea')
  );

  fields.forEach(function (el) {
    el.addEventListener('blur', function () { validate(el); });
    el.addEventListener('input', function () {
      var w = wrapOf(el);
      if (w && w.classList.contains('is-error')) validate(el);
    });
    if (el.tagName === 'SELECT') {
      el.addEventListener('change', function () { validate(el); });
    }
  });

  var consent = form.querySelector('input[name="consent"]');
  if (consent) {
    consent.addEventListener('change', function () {
      if (consent.checked && consentWrap) consentWrap.classList.remove('is-error');
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var ok = true;
    var firstBad = null;

    fields.forEach(function (el) {
      if (!validate(el)) {
        ok = false;
        if (!firstBad) firstBad = el;
      }
    });

    if (consent && !consent.checked) {
      ok = false;
      if (consentWrap) consentWrap.classList.add('is-error');
      if (!firstBad) firstBad = consent;
    }

    if (!ok) {
      if (firstBad) {
        firstBad.focus();
        firstBad.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    var data = new FormData(form);
    data.append('_subject', 'New demo request from ' + (data.get('company') || 'a visitor'));
    data.append('_template', 'table');
    data.append('_captcha', 'false');

    var btn = form.querySelector('button[type="submit"]');
    var label = btn ? btn.textContent : '';
    if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
    if (errBox) errBox.textContent = '';

    fetch(ENDPOINT, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    })
      .then(function (res) { return res.json(); })
      .then(function (json) {
        // FormSubmit answers 200 even when it refuses the submission, so the
        // JSON body is the only reliable signal. Never trust res.ok alone.
        var ok = json && String(json.success) === 'true';
        if (!ok) throw new Error(json && json.message ? json.message : 'rejected');

        var first = String(data.get('name') || '').trim().split(/\s+/)[0];
        if (doneName && first) doneName.textContent = first;
        if (card && done) {
          card.classList.add('is-done');
          done.classList.add('is-on');
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      })
      .catch(function (err) {
        if (btn) { btn.disabled = false; btn.textContent = label; }
        if (!errBox) return;

        var msg = String((err && err.message) || '');

        if (/web server|HTML files/i.test(msg)) {
          // Opening the page straight off disk: the origin is null and the
          // relay refuses it. Nothing the visitor can fix.
          errBox.textContent = 'This form only works when the site is served over http, ' +
                               'not opened as a local file. Run it through a web server, ' +
                               'or message us on WhatsApp at +91 7018761328.';
        } else if (/[Aa]ctivat/i.test(msg)) {
          errBox.textContent = 'The form is not activated yet. Check the inbox for ' +
                               'an "Activate Form" email and click the link, then try again.';
        } else {
          errBox.textContent = 'Something went wrong sending that. Please try again, ' +
                               'or message us on WhatsApp at +91 7018761328.';
        }
      });
  });
})();
