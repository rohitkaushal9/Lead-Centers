/* ==========================================================================
   Lead Centers | Request a demo form
   Client-side validation and success state. No backend is wired up yet:
   swap the submit handler's TODO for a real POST when the endpoint exists.
   ========================================================================== */
(function () {
  'use strict';

  var form = document.getElementById('demoForm');
  if (!form) return;

  var card        = document.getElementById('fcard');
  var done        = document.getElementById('fdone');
  var doneName    = document.getElementById('doneName');
  var consentWrap = document.getElementById('consentWrap');

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

    // Collect the payload, ready for a real endpoint
    var payload = {};
    new FormData(form).forEach(function (v, k) { payload[k] = v; });

    // TODO: POST `payload` to the demo-request endpoint, then show the success
    // state on a 2xx and surface an error message otherwise.
    if (window.console && console.info) console.info('Demo request payload', payload);

    var first = (payload.name || '').trim().split(/\s+/)[0];
    if (doneName && first) doneName.textContent = first;

    if (card && done) {
      card.classList.add('is-done');
      done.classList.add('is-on');
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
})();
