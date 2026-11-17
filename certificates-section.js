/*
 * Certificates section: category tabs (All / Awardee / Recognition / Attendance / Courses).
 * Reuses the sliding-pill tab styles from projects-section.css.
 */
(function () {
  'use strict';

  var tabsEl = document.getElementById('ctTabs');
  var grid = document.getElementById('ctGrid');
  if (!tabsEl || !grid) return;

  var STORAGE_KEY = 'portfolio-cert-tab';
  var tabs = Array.prototype.slice.call(tabsEl.querySelectorAll('.pj-year'));
  var cards = Array.prototype.slice.call(grid.querySelectorAll('.ct-card'));
  var pill = tabsEl.querySelector('.pj-year-pill');

  // Counts; hide tabs that have nothing in them
  tabs.forEach(function (tab) {
    var cat = tab.getAttribute('data-cat');
    var n = cat === 'all' ? cards.length : cards.filter(function (c) { return c.getAttribute('data-cat') === cat; }).length;
    tab.querySelector('.pj-count').textContent = n;
    if (n === 0) tab.hidden = true;
  });

  function movePill() {
    var active = tabsEl.querySelector('.pj-year.active');
    if (!active || !pill) return;
    // x and y: on phones the tabs wrap into rows
    pill.style.width = active.offsetWidth + 'px';
    pill.style.height = active.offsetHeight + 'px';
    pill.style.transform = 'translate(' + active.offsetLeft + 'px, ' + active.offsetTop + 'px)';
  }

  function select(cat, save) {
    var valid = tabs.some(function (t) { return t.getAttribute('data-cat') === cat && !t.hidden; });
    if (!valid) cat = 'all';

    tabs.forEach(function (tab) {
      var on = tab.getAttribute('data-cat') === cat;
      tab.classList.toggle('active', on);
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
      tab.tabIndex = on ? 0 : -1;
    });

    cards.forEach(function (card) {
      card.hidden = cat !== 'all' && card.getAttribute('data-cat') !== cat;
    });

    movePill();
    if (save) {
      try { sessionStorage.setItem(STORAGE_KEY, cat); } catch (e) { /* storage unavailable */ }
    }
  }

  tabsEl.addEventListener('click', function (e) {
    var tab = e.target.closest('.pj-year');
    if (tab) select(tab.getAttribute('data-cat'), true);
  });

  // Arrow keys move between tabs
  tabsEl.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    var shown = tabs.filter(function (t) { return !t.hidden; });
    var i = shown.indexOf(document.activeElement);
    if (i === -1) return;
    var next = shown[(i + (e.key === 'ArrowRight' ? 1 : -1) + shown.length) % shown.length];
    next.focus();
    select(next.getAttribute('data-cat'), true);
    e.preventDefault();
  });

  window.addEventListener('resize', movePill);

  /* ---------- lightbox ---------- */

  var ICON = {
    close: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    prev: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>',
    next: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
    arrow: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>'
  };

  var modal = document.createElement('dialog');
  modal.className = 'ct-modal';
  modal.setAttribute('aria-labelledby', 'ctModalTitle');
  modal.innerHTML =
    '<div class="ct-modal-inner">' +
      '<div class="ct-modal-stage">' +
        '<img id="ctModalImg" alt="">' +
        '<button type="button" class="ct-modal-btn ct-modal-prev" aria-label="Previous certificate">' + ICON.prev + '</button>' +
        '<button type="button" class="ct-modal-btn ct-modal-next" aria-label="Next certificate">' + ICON.next + '</button>' +
        '<button type="button" class="ct-modal-btn ct-modal-close" aria-label="Close">' + ICON.close + '</button>' +
      '</div>' +
      '<div class="ct-modal-info">' +
        '<div class="ct-modal-text">' +
          '<span class="ct-badge" id="ctModalBadge"></span>' +
          '<h3 id="ctModalTitle"></h3>' +
          '<p id="ctModalMeta"></p>' +
        '</div>' +
        '<div class="ct-modal-actions">' +
          '<span class="ct-modal-count" id="ctModalCount"></span>' +
          '<a class="ct-modal-link" id="ctModalLink" href="#">Details ' + ICON.arrow + '</a>' +
        '</div>' +
      '</div>' +
    '</div>';
  grid.parentNode.appendChild(modal);

  var mImg = modal.querySelector('#ctModalImg');
  var mBadge = modal.querySelector('#ctModalBadge');
  var mTitle = modal.querySelector('#ctModalTitle');
  var mMeta = modal.querySelector('#ctModalMeta');
  var mCount = modal.querySelector('#ctModalCount');
  var mLink = modal.querySelector('#ctModalLink');
  var mPrev = modal.querySelector('.ct-modal-prev');
  var mNext = modal.querySelector('.ct-modal-next');
  var currentCard = null;
  var returnFocus = null;

  function visibleCards() {
    return cards.filter(function (c) { return !c.hidden; });
  }

  function fill(card) {
    currentCard = card;
    var img = card.querySelector('.ct-thumb img');
    var badge = card.querySelector('.ct-badge');
    mImg.src = img.getAttribute('src');
    mImg.alt = img.alt;
    mBadge.className = badge.className;
    mBadge.textContent = badge.textContent;
    mTitle.textContent = card.querySelector('.ct-title').textContent;
    var venue = card.querySelector('.ct-venue');
    mMeta.textContent = [
      card.querySelector('.ct-org').textContent,
      card.querySelector('time').textContent,
      venue ? venue.textContent.trim() : ''
    ].filter(Boolean).join(' · ');
    mLink.href = card.getAttribute('href');

    var list = visibleCards();
    var multi = list.length > 1;
    mCount.textContent = multi ? (list.indexOf(card) + 1) + ' / ' + list.length : '';
    mPrev.hidden = !multi;
    mNext.hidden = !multi;
  }

  function lockScroll(lock) {
    var rootEl = document.documentElement;
    if (lock) {
      rootEl.style.setProperty('--pj-scrollbar', (window.innerWidth - rootEl.clientWidth) + 'px');
      rootEl.classList.add('pj-lock');
    } else {
      rootEl.classList.remove('pj-lock');
      rootEl.style.removeProperty('--pj-scrollbar');
    }
  }

  function openModal(card) {
    returnFocus = card;
    fill(card);
    if (typeof modal.showModal === 'function') {
      if (!modal.open) modal.showModal();
    } else {
      modal.setAttribute('open', '');
    }
    lockScroll(true);
    modal.querySelector('.ct-modal-close').focus({ preventScroll: true });
  }

  function closeModal() {
    if (!modal.open) return;
    if (typeof modal.close === 'function') modal.close(); else modal.removeAttribute('open');
    lockScroll(false);
    if (returnFocus) returnFocus.focus({ preventScroll: true });
  }

  function go(delta) {
    var list = visibleCards();
    if (list.length < 2) return;
    var i = list.indexOf(currentCard);
    fill(list[(i + delta + list.length) % list.length]);
  }

  // Card click opens the lightbox; Ctrl/Cmd/middle click still opens the details page
  grid.addEventListener('click', function (e) {
    var card = e.target.closest('.ct-card');
    if (!card || e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    openModal(card);
  });

  mPrev.addEventListener('click', function () { go(-1); });
  mNext.addEventListener('click', function () { go(1); });
  modal.querySelector('.ct-modal-close').addEventListener('click', closeModal);
  modal.addEventListener('cancel', function (e) { e.preventDefault(); closeModal(); });
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  modal.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { go(-1); e.preventDefault(); }
    if (e.key === 'ArrowRight') { go(1); e.preventDefault(); }
  });

  var saved = 'all';
  try { saved = sessionStorage.getItem(STORAGE_KEY) || 'all'; } catch (e) { /* storage unavailable */ }
  select(saved, false);

  // Pill needs real widths once fonts load
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(movePill);
})();
