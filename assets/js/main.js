/* ==========================================================================
   Lead Centers landing page interactions
   ========================================================================== */
(function () {
  'use strict';

  /* --- Mobile nav ------------------------------------------------------- */
  var burger  = document.getElementById('burger');
  var headIn  = document.getElementById('headInner');
  var navDrop = document.getElementById('navDrop');

  if (burger && navDrop) {
    burger.addEventListener('click', function () {
      var open = navDrop.classList.toggle('open');
      if (headIn) headIn.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
    });

    // Close the dropdown after tapping any link inside it
    navDrop.addEventListener('click', function (e) {
      if (!e.target.closest('a')) return;
      navDrop.classList.remove('open');
      if (headIn) headIn.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  }

  /* --- Filter panel ------------------------------------------------------
     Each chip carries a data-w weight. Selecting chips within a group is an
     OR (weights add); selecting across groups narrows the pool (intersection),
     so the running count is scaled down per additional active group.        */
  var BASE_POOL = 1284;

  var countEl = document.getElementById('fCount');
  var labelEl = document.getElementById('fLabel');
  var resetEl = document.getElementById('fReset');
  var groups  = Array.prototype.slice.call(document.querySelectorAll('.chips[data-group]'));

  function format(n) {
    return n.toLocaleString('en-US');
  }

  function groupWeight(group) {
    var active = group.querySelectorAll('.chip[aria-pressed="true"]');
    var sum = 0;
    for (var i = 0; i < active.length; i++) {
      sum += Number(active[i].getAttribute('data-w')) || 0;
    }
    return { count: active.length, share: Math.min(sum, 100) / 100 };
  }

  function recount() {
    var activeGroups = 0;
    var pool = BASE_POOL;

    groups.forEach(function (group) {
      var w = groupWeight(group);
      if (w.count === 0) return;      // no selection in this group = no narrowing
      activeGroups++;
      pool = pool * w.share;
    });

    // Nothing selected at all, show the full pool
    var total = activeGroups === 0 ? BASE_POOL : Math.max(3, Math.round(pool));

    countEl.textContent = format(total);
    labelEl.textContent = activeGroups === 0
      ? 'matching leads available right now'
      : 'matching leads across ' + activeGroups +
        (activeGroups === 1 ? ' active filter' : ' active filters');
  }

  groups.forEach(function (group) {
    group.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (!chip) return;
      var on = chip.getAttribute('aria-pressed') === 'true';
      chip.setAttribute('aria-pressed', String(!on));
      recount();
    });
  });

  if (resetEl) {
    resetEl.addEventListener('click', function () {
      document.querySelectorAll('.chip[aria-pressed="true"]').forEach(function (chip) {
        chip.setAttribute('aria-pressed', 'false');
      });
      recount();
    });
  }

  if (countEl) recount();

  /* --- Reveal on scroll --------------------------------------------------- */
  var revealables = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        // Slight stagger for siblings entering together
        setTimeout(function () { entry.target.classList.add('in'); }, i * 70);
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });

    revealables.forEach(function (el) { io.observe(el); });
  }

  /* --- Footer year -------------------------------------------------------- */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = String(new Date().getFullYear());
})();
