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

  /* --- Reveal on scroll --------------------------------------------------
     Each .reveal element gets a stagger delay based on its position among its
     revealing siblings, so grids cascade instead of all landing at once.   */
  var revealables = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  var reduced = window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('in'); });
  } else {
    revealables.forEach(function (el) {
      var sibs = Array.prototype.filter.call(el.parentNode.children, function (c) {
        return c.classList && c.classList.contains('reveal');
      });
      var i = sibs.indexOf(el);
      // cap the cascade so long grids do not leave the last card hanging
      el.style.setProperty('--d', Math.min(i, 7) * 75 + 'ms');
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

    revealables.forEach(function (el) { io.observe(el); });
  }

  /* --- Scroll progress bar + header state --------------------------------- */
  var bar  = document.getElementById('progress');
  var head = document.querySelector('.site-head');
  var ticking = false;

  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;

    if (bar) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var pct = max > 0 ? Math.min(y / max, 1) : 0;
      bar.style.transform = 'scaleX(' + pct + ')';
    }

    if (head) head.classList.toggle('is-stuck', y > 8);

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(onScroll);
  }, { passive: true });

  onScroll();

  /* --- Footer year -------------------------------------------------------- */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = String(new Date().getFullYear());
})();
