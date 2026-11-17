/*
 * Projects section: filterable grid + quick-view modal.
 * Data comes from projects-data.js (window.PORTFOLIO_PROJECTS).
 */
(function () {
  'use strict';

  var DATA = window.PORTFOLIO_PROJECTS;
  var grid = document.getElementById('pjGrid');
  if (!DATA || !grid) return;

  var STORAGE_KEY = 'portfolio-project-filters';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  var CATEGORIES = [
    { key: 'all', label: 'All' },
    { key: 'web', label: 'Web & Mobile' },
    { key: 'desktop', label: 'Desktop' },
    { key: 'game', label: 'Games' },
    { key: 'video', label: 'Film & Video' },
    { key: 'design', label: 'Graphic Design' }
  ];
  var CAT_LABEL = {};
  CATEGORIES.forEach(function (c) { CAT_LABEL[c.key] = c.label; });

  var YEARS = [
    { key: 'all', label: 'All years' },
    { key: '1', label: '1st Year' },
    { key: '2', label: '2nd Year' },
    { key: '3', label: '3rd Year' },
    { key: '4', label: '4th Year' }
  ];

  var ICONS = {
    play: '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>',
    external: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></svg>',
    code: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/></svg>',
    download: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14"/></svg>',
    link: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>',
    arrow: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>',
    chevL: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>',
    chevR: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
    film: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/></svg>'
  };

  /* ---------- helpers ---------- */

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function yearKey(label) {
    var first = String(label || '').charAt(0);
    return /[1-4]/.test(first) ? first : '1';
  }

  function isRealLink(url) {
    return !!url && url.indexOf('yourusername') === -1;
  }

  function mediaList(p) {
    var list = (p.images || []).map(function (img) {
      return { type: 'img', src: img.src, label: img.label };
    });
    if (p.cover && !list.some(function (m) { return m.src === p.cover; })) {
      list.unshift({ type: 'img', src: p.cover, label: 'Cover' });
    }
    return list;
  }

  function coverOf(p) {
    if (p.cover) return p.cover;
    return p.images && p.images.length ? p.images[0].src : '';
  }

  function badgeOf(p) {
    if (p.gameEmbed) return { cls: 'live', text: 'Playable' };
    if (p.live) return { cls: 'live', text: 'Live site' };
    if (p.ppt) return { cls: 'soft', text: 'Interactive' };
    if (p.video) return { cls: 'soft', text: 'Video' };
    return null;
  }

  function videoType(src) {
    return /\.mov(\?|$)/i.test(src) ? 'video/quicktime' : 'video/mp4';
  }

  function withTransition(fn) {
    if (document.startViewTransition && !reduceMotion.matches) {
      document.startViewTransition(fn);
    } else {
      fn();
    }
  }

  /* ---------- data ---------- */

  var yearOrder = { '4': 0, '3': 1, '2': 2, '1': 3 };
  var projects = Object.keys(DATA)
    .map(function (id, index) {
      var p = DATA[id];
      return {
        id: id,
        index: index,
        data: p,
        year: yearKey(p.year),
        cat: p.category || 'web',
        haystack: [p.title, p.subtitle, p.summary, (p.tags || []).join(' '), CAT_LABEL[p.category] || '', p.year]
          .join(' ')
          .toLowerCase()
      };
    })
    .filter(function (item) { return !item.data.hidden; })
    .sort(function (a, b) {
      // Newest work first, then data order within a year
      return (yearOrder[a.year] - yearOrder[b.year]) || (a.index - b.index);
    });

  var byId = {};
  projects.forEach(function (item) { byId[item.id] = item; });

  /* ---------- state ---------- */

  var state = { year: 'all', cat: 'all', q: '' };
  try {
    var saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null');
    if (saved && typeof saved === 'object') {
      if (YEARS.some(function (y) { return y.key === saved.year; })) state.year = saved.year;
      // Type filter and search are only restored while their controls exist on the page
      if (document.getElementById('pjCats') && CAT_LABEL[saved.cat]) state.cat = saved.cat;
      if (document.getElementById('pjSearch') && typeof saved.q === 'string') state.q = saved.q;
    }
  } catch (e) { /* storage unavailable: use defaults */ }

  function saveState() {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  function matches(item, s, skip) {
    if (skip !== 'year' && s.year !== 'all' && item.year !== s.year) return false;
    if (skip !== 'cat' && s.cat !== 'all' && item.cat !== s.cat) return false;
    if (s.q) {
      var terms = s.q.toLowerCase().split(/\s+/).filter(Boolean);
      for (var i = 0; i < terms.length; i++) {
        if (item.haystack.indexOf(terms[i]) === -1) return false;
      }
    }
    return true;
  }

  function visibleProjects() {
    return projects.filter(function (item) { return matches(item, state); });
  }

  /* ---------- header stats ---------- */

  (function renderStats() {
    var el = document.getElementById('pjStats');
    if (!el) return;
    var tools = {};
    var demos = 0;
    projects.forEach(function (item) {
      (item.data.tags || []).forEach(function (t) { tools[t.toLowerCase()] = true; });
      if (item.data.gameEmbed || item.data.live) demos++;
    });
    var years = {};
    projects.forEach(function (item) { years[item.year] = true; });
    var stats = [
      [projects.length, 'Projects'],
      [Object.keys(years).length, 'Years of work'],
      [demos, 'Live demos'],
      [Object.keys(tools).length, 'Tools & tech']
    ];
    el.innerHTML = stats.map(function (s) {
      return '<div><dt>' + esc(s[1]) + '</dt><dd>' + esc(s[0]) + '</dd></div>';
    }).join('');
  })();

  /* ---------- filters ---------- */

  var yearsEl = document.getElementById('pjYears');
  var catsEl = document.getElementById('pjCats');
  var searchEl = document.getElementById('pjSearch');
  var resultEl = document.getElementById('pjResult');
  var emptyEl = document.getElementById('pjEmpty');

  yearsEl.innerHTML = YEARS.map(function (y) {
    return '<button type="button" role="tab" class="pj-year" data-year="' + y.key + '">' +
      '<span>' + esc(y.label) + '</span><span class="pj-count"></span></button>';
  }).join('') + '<span class="pj-year-pill" aria-hidden="true"></span>';

  if (catsEl) {
    catsEl.innerHTML = CATEGORIES.map(function (c) {
      return '<button type="button" class="pj-chip" data-cat="' + c.key + '">' +
        esc(c.label) + ' <span class="pj-count"></span></button>';
    }).join('');
  }

  if (searchEl) searchEl.value = state.q;

  function moveYearPill() {
    var active = yearsEl.querySelector('.pj-year.active');
    var pill = yearsEl.querySelector('.pj-year-pill');
    if (!active || !pill) return;
    // x and y: on phones the tabs wrap into rows
    pill.style.width = active.offsetWidth + 'px';
    pill.style.height = active.offsetHeight + 'px';
    pill.style.transform = 'translate(' + active.offsetLeft + 'px, ' + active.offsetTop + 'px)';
  }

  function updateFilterUI() {
    yearsEl.querySelectorAll('.pj-year').forEach(function (btn) {
      var key = btn.getAttribute('data-year');
      var count = projects.filter(function (item) {
        return matches(item, { year: key, cat: state.cat, q: state.q });
      }).length;
      var active = key === state.year;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
      btn.classList.toggle('is-zero', count === 0);
      btn.querySelector('.pj-count').textContent = count;
    });

    if (catsEl) catsEl.querySelectorAll('.pj-chip').forEach(function (btn) {
      var key = btn.getAttribute('data-cat');
      var count = projects.filter(function (item) {
        return matches(item, { year: state.year, cat: key, q: state.q });
      }).length;
      var active = key === state.cat;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      btn.classList.toggle('is-zero', count === 0 && !active);
      btn.querySelector('.pj-count').textContent = count;
    });

    moveYearPill();
  }

  function applyFilters(animate) {
    var shown = 0;
    var update = function () {
      cards.forEach(function (card) {
        var ok = matches(byId[card.getAttribute('data-id')], state);
        card.hidden = !ok;
        if (ok) shown++;
      });
      emptyEl.hidden = shown !== 0;
      if (resultEl) resultEl.textContent = shown === projects.length
        ? 'Showing all ' + shown + ' projects'
        : 'Showing ' + shown + ' of ' + projects.length + ' projects';
      updateFilterUI();
    };
    if (animate) withTransition(update); else update();
    saveState();
  }

  yearsEl.addEventListener('click', function (e) {
    var btn = e.target.closest('.pj-year');
    if (!btn || btn.getAttribute('data-year') === state.year) return;
    state.year = btn.getAttribute('data-year');
    applyFilters(true);
  });

  // Arrow-key navigation inside the year tablist
  yearsEl.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    var tabs = Array.prototype.slice.call(yearsEl.querySelectorAll('.pj-year'));
    var i = tabs.indexOf(document.activeElement);
    if (i === -1) return;
    var next = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
    next.focus();
    next.click();
    e.preventDefault();
  });

  if (catsEl) catsEl.addEventListener('click', function (e) {
    var btn = e.target.closest('.pj-chip');
    if (!btn || btn.getAttribute('data-cat') === state.cat) return;
    state.cat = btn.getAttribute('data-cat');
    applyFilters(true);
  });

  var searchTimer;
  if (searchEl) searchEl.addEventListener('input', function () {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function () {
      state.q = searchEl.value.trim();
      applyFilters(true);
    }, 140);
  });

  if (searchEl) searchEl.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && searchEl.value) {
      searchEl.value = '';
      state.q = '';
      applyFilters(true);
      e.stopPropagation();
    }
  });

  // "/" focuses search (when not typing somewhere else)
  document.addEventListener('keydown', function (e) {
    if (!searchEl || e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
    var tag = (document.activeElement && document.activeElement.tagName) || '';
    if (/INPUT|TEXTAREA|SELECT/.test(tag) || modal.open) return;
    var rect = grid.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight * 1.5) return; // only near the section
    e.preventDefault();
    searchEl.focus();
  });

  document.getElementById('pjReset').addEventListener('click', function () {
    state = { year: 'all', cat: 'all', q: '' };
    if (searchEl) searchEl.value = '';
    applyFilters(true);
  });

  window.addEventListener('resize', moveYearPill);

  // Toolbar gets a glass background only while it is stuck under the navbar
  var toolbarEl = document.querySelector('.pj-toolbar');
  if (toolbarEl && 'IntersectionObserver' in window) {
    var stickTop = parseFloat(getComputedStyle(toolbarEl).top) || 0;
    new IntersectionObserver(function (entries) {
      var e = entries[0];
      toolbarEl.classList.toggle('is-stuck', e.intersectionRatio < 1 && e.boundingClientRect.top <= stickTop + 1 && e.boundingClientRect.bottom > 0);
    }, { rootMargin: '-' + (stickTop + 1) + 'px 0px 0px 0px', threshold: [1] }).observe(toolbarEl);
  }

  /* ---------- cards ---------- */

  function cardHtml(item, i) {
    var p = item.data;
    var cover = coverOf(p);
    var media = mediaList(p);
    var badge = badgeOf(p);
    var tags = p.tags || [];
    var shownTags = tags.slice(0, 3);
    var contain = p.fit === 'contain';

    var mediaInner;
    if (cover) {
      mediaInner =
        (contain ? '<img class="pj-media-bg" src="' + esc(cover) + '" alt="" aria-hidden="true" loading="lazy" decoding="async">' : '') +
        '<img class="pj-media-img" src="' + esc(cover) + '" alt="' + esc(p.title + ' preview') + '" loading="lazy" decoding="async">';
    } else {
      mediaInner =
        '<div class="pj-media-placeholder" aria-hidden="true">' + ICONS.film +
        '<span>' + esc(p.title) + '</span></div>';
    }

    if (p.video && p.preview) {
      mediaInner += '<video class="pj-media-video" muted loop playsinline preload="none" data-src="' + esc(p.video) + '" aria-hidden="true"></video>';
    }

    var scrub = '';
    if (media.length > 1 && !(p.video && p.preview)) {
      scrub = '<div class="pj-scrub" aria-hidden="true">' +
        media.map(function (_, n) { return '<span' + (n === 0 ? ' class="on"' : '') + '></span>'; }).join('') +
        '</div>';
    }

    return '' +
      '<article class="pj-card' + (p.featured ? ' is-featured' : '') + '" data-id="' + esc(item.id) + '"' +
      ' style="--i:' + i + ';view-transition-name:pj-' + esc(item.id) + '">' +
        '<div class="pj-media' + (contain ? ' is-contain' : '') + '">' +
          mediaInner +
          '<div class="pj-media-shade" aria-hidden="true"></div>' +
          '<div class="pj-badges">' +
            '<span class="pj-badge">' + esc(p.year) + '</span>' +
            (badge ? '<span class="pj-badge pj-badge-' + badge.cls + '">' +
              (badge.cls === 'live' ? '<span class="pj-live-dot" aria-hidden="true"></span>' : '') +
              esc(badge.text) + '</span>' : '') +
          '</div>' +
          (p.video ? '<span class="pj-play" aria-hidden="true">' + ICONS.play + '</span>' : '') +
          scrub +
        '</div>' +
        '<div class="pj-body">' +
          '<span class="pj-cat">' + esc(CAT_LABEL[item.cat] || '') + '</span>' +
          '<h3 class="pj-title">' + esc(p.title) + '</h3>' +
          '<p class="pj-sub">' + esc(p.subtitle) + '</p>' +
          '<p class="pj-summary">' + esc(p.summary || p.description) + '</p>' +
          '<ul class="pj-tags">' +
            shownTags.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') +
            (tags.length > 3 ? '<li class="pj-tag-more" title="' + esc(tags.slice(3).join(', ')) + '">+' + (tags.length - 3) + '</li>' : '') +
          '</ul>' +
          '<div class="pj-card-foot">' +
            '<button type="button" class="pj-open" aria-haspopup="dialog">' +
              '<span class="pj-sr">' + esc(p.title) + ': </span>Quick view' +
            '</button>' +
            '<a class="pj-link" href="project.html?id=' + encodeURIComponent(item.id) + '">' +
              'Case study ' + ICONS.arrow +
            '</a>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  grid.innerHTML = projects.map(cardHtml).join('');
  var cards = Array.prototype.slice.call(grid.querySelectorAll('.pj-card'));

  // Scroll reveal (staggered)
  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    cards.forEach(function (card) { io.observe(card); });
  } else {
    cards.forEach(function (card) { card.classList.add('is-in'); });
  }

  // Pointer effects: spotlight + image scrub + hover video preview
  var rafId = 0;
  var pending = null;

  grid.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    pending = e;
    if (rafId) return;
    rafId = requestAnimationFrame(function () {
      rafId = 0;
      var ev = pending;
      var card = ev.target.closest && ev.target.closest('.pj-card');
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (ev.clientX - r.left) + 'px');
      card.style.setProperty('--my', (ev.clientY - r.top) + 'px');

      var mediaEl = ev.target.closest('.pj-media');
      if (mediaEl) scrubTo(card, mediaEl, ev.clientX);
    });
  });

  function scrubTo(card, mediaEl, clientX) {
    var item = byId[card.getAttribute('data-id')];
    var media = mediaList(item.data);
    var img = mediaEl.querySelector('.pj-media-img');
    if (!img || media.length < 2 || (item.data.video && item.data.preview)) return;
    var r = mediaEl.getBoundingClientRect();
    var idx = Math.min(media.length - 1, Math.max(0, Math.floor(((clientX - r.left) / r.width) * media.length)));
    if (String(idx) === img.getAttribute('data-idx')) return;
    img.setAttribute('data-idx', idx);
    img.src = media[idx].src;
    var bg = mediaEl.querySelector('.pj-media-bg');
    if (bg) bg.src = media[idx].src;
    mediaEl.querySelectorAll('.pj-scrub span').forEach(function (s, n) { s.classList.toggle('on', n === idx); });
  }

  function preload(item) {
    if (item.preloaded) return;
    item.preloaded = true;
    mediaList(item.data).forEach(function (m) { var im = new Image(); im.src = m.src; });
  }

  var hoverTimer = null;

  grid.addEventListener('pointerover', function (e) {
    if (e.pointerType !== 'mouse') return;
    var card = e.target.closest('.pj-card');
    if (!card || card.contains(e.relatedTarget)) return;
    preload(byId[card.getAttribute('data-id')]);

    var video = card.querySelector('.pj-media-video');
    if (!video || reduceMotion.matches) return;
    clearTimeout(hoverTimer);
    hoverTimer = setTimeout(function () {
      if (!video.src) {
        video.src = video.getAttribute('data-src');
        video.addEventListener('playing', function () { card.classList.add('is-previewing'); });
      }
      var playing = video.play();
      if (playing && playing.catch) playing.catch(function () { /* autoplay blocked: keep the cover */ });
      if (video.readyState > 2) card.classList.add('is-previewing');
    }, 220);
  });

  grid.addEventListener('pointerout', function (e) {
    if (e.pointerType !== 'mouse') return;
    var card = e.target.closest('.pj-card');
    if (!card || card.contains(e.relatedTarget)) return;
    clearTimeout(hoverTimer);
    card.classList.remove('is-previewing');
    var video = card.querySelector('.pj-media-video');
    if (video && video.src) video.pause();

    var mediaEl = card.querySelector('.pj-media');
    var img = mediaEl && mediaEl.querySelector('.pj-media-img');
    if (img && img.getAttribute('data-idx') && img.getAttribute('data-idx') !== '0') {
      scrubTo(card, mediaEl, mediaEl.getBoundingClientRect().left);
    }
  });

  // Whole card opens the quick view; the case-study link keeps its own behaviour
  grid.addEventListener('click', function (e) {
    if (e.target.closest('.pj-link')) return;
    var card = e.target.closest('.pj-card');
    if (!card) return;
    openModal(card.getAttribute('data-id'), card.querySelector('.pj-open'));
  });

  /* ---------- quick-view modal ---------- */

  var modal = document.getElementById('pjModal');
  var stageEl = document.getElementById('pjStage');
  var thumbsEl = document.getElementById('pjThumbs');
  var stageTabs = document.getElementById('pjStageTabs');
  var current = { id: null, media: [], index: 0, stage: 'gallery', returnFocus: null };

  function stageItems(p) {
    var items = [];
    var images = mediaList(p);
    if (p.video) {
      items.push({ type: 'video', src: p.video, poster: coverOf(p), label: 'Watch' });
      // The cover is already the video poster; do not repeat it as an image
      if (p.cover) images = images.filter(function (m) { return m.src !== p.cover; });
    }
    return items.concat(images);
  }

  function demoOf(p) {
    if (p.gameEmbed) {
      return { src: p.gameEmbed, title: p.embedTitle || p.title, note: p.embedNote || 'Pick a theme and grid size, then match every pair before time runs out.', label: 'Try it live' };
    }
    if (p.pdf) {
      return { src: p.pdf + '#toolbar=1&navpanes=0', title: p.title + ' slides', note: 'Slides preview. Download the PPT and press F5 to play with working hyperlinks.', label: 'View slides' };
    }
    return null;
  }

  function renderStage() {
    var p = byId[current.id].data;
    modal.classList.toggle('is-demo', current.stage === 'demo');

    if (current.stage === 'demo') {
      var demo = demoOf(p);
      stageEl.innerHTML =
        '<div class="pj-demo">' +
          '<p class="pj-demo-note">' + esc(demo.note) + '</p>' +
          '<iframe src="' + esc(demo.src) + '" title="' + esc(demo.title) + '" allow="autoplay; fullscreen" loading="lazy"></iframe>' +
        '</div>';
      thumbsEl.hidden = true;
      return;
    }

    var items = current.media;
    if (!items.length) {
      stageEl.innerHTML = '<div class="pj-media-placeholder pj-stage-empty">' + ICONS.film + '<span>No preview yet</span></div>';
      thumbsEl.hidden = true;
      return;
    }

    var m = items[current.index];
    var view;
    if (m.type === 'video') {
      view = '<video controls playsinline preload="metadata"' + (m.poster ? ' poster="' + esc(m.poster) + '"' : '') + '>' +
        '<source src="' + esc(m.src) + '" type="' + videoType(m.src) + '">' +
        '<source src="' + esc(m.src) + '" type="video/mp4">' +
        '</video>';
    } else {
      view = '<img src="' + esc(m.src) + '" alt="' + esc(p.title + ' — ' + m.label) + '">';
    }

    var multi = items.length > 1;
    stageEl.innerHTML =
      '<figure class="pj-stage-figure">' + view +
        '<figcaption><span>' + esc(m.label) + '</span>' +
        (multi ? '<span class="pj-stage-count">' + (current.index + 1) + ' / ' + items.length + '</span>' : '') +
        '</figcaption>' +
      '</figure>' +
      (multi
        ? '<button type="button" class="pj-stage-btn prev" data-step="-1" aria-label="Previous image">' + ICONS.chevL + '</button>' +
          '<button type="button" class="pj-stage-btn next" data-step="1" aria-label="Next image">' + ICONS.chevR + '</button>'
        : '');

    thumbsEl.hidden = !multi;
    thumbsEl.querySelectorAll('button').forEach(function (b, n) {
      var on = n === current.index;
      b.classList.toggle('active', on);
      b.setAttribute('aria-current', on ? 'true' : 'false');
      if (on && b.scrollIntoView) b.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });
  }

  function renderThumbs(p) {
    thumbsEl.innerHTML = current.media.map(function (m, n) {
      var src = m.type === 'video' ? m.poster : m.src;
      return '<button type="button" data-index="' + n + '" aria-label="' + esc(m.label) + '">' +
        (src ? '<img src="' + esc(src) + '" alt="" loading="lazy">' : '<span class="pj-thumb-blank"></span>') +
        (m.type === 'video' ? '<span class="pj-thumb-play">' + ICONS.play + '</span>' : '') +
        '</button>';
    }).join('');
  }

  function step(delta) {
    var n = current.media.length;
    if (n < 2 || current.stage !== 'gallery') return;
    current.index = (current.index + delta + n) % n;
    renderStage();
  }

  function fillModal(id) {
    var item = byId[id];
    var p = item.data;
    current.id = id;
    current.media = stageItems(p);
    current.index = 0;
    current.stage = 'gallery';

    var badge = badgeOf(p);
    document.getElementById('pjModalMeta').innerHTML =
      '<span class="pj-badge">' + esc(p.year) + '</span>' +
      '<span class="pj-badge pj-badge-soft">' + esc(CAT_LABEL[item.cat] || '') + '</span>' +
      (badge && badge.cls === 'live' ? '<span class="pj-badge pj-badge-live"><span class="pj-live-dot" aria-hidden="true"></span>' + esc(badge.text) + '</span>' : '');
    document.getElementById('pjModalTitle').textContent = p.title;
    document.getElementById('pjModalSub').textContent = p.subtitle || '';
    document.getElementById('pjModalDesc').textContent = p.description || p.summary || '';
    document.getElementById('pjModalTags').innerHTML = (p.tags || []).map(function (t) {
      return '<span>' + esc(t) + '</span>';
    }).join('');

    var actions = [];
    if (p.gameEmbed) actions.push('<a class="pj-btn pj-btn-primary" href="' + esc(p.gameEmbed) + '" target="_blank" rel="noopener">' + ICONS.play + ' Play full screen</a>');
    if (p.live) actions.push('<a class="pj-btn pj-btn-primary" href="' + esc(p.live) + '" target="_blank" rel="noopener noreferrer">Visit live site ' + ICONS.external + '</a>');
    if (isRealLink(p.github)) actions.push('<a class="pj-btn" href="' + esc(p.github) + '" target="_blank" rel="noopener noreferrer">' + ICONS.code + ' Source code</a>');
    if (p.ppt) actions.push('<a class="pj-btn" href="' + esc(p.ppt) + '" download>' + ICONS.download + ' Download PPT</a>');
    actions.push('<a class="pj-btn pj-btn-ghost" href="project.html?id=' + encodeURIComponent(id) + '">Full case study ' + ICONS.arrow + '</a>');
    actions.push('<button type="button" class="pj-btn pj-btn-ghost pj-copy" data-label="Copy link">' + ICONS.link + ' <span>Copy link</span></button>');
    document.getElementById('pjModalActions').innerHTML = actions.join('');

    var demo = demoOf(p);
    stageTabs.hidden = !demo;
    if (demo) {
      stageTabs.querySelector('[data-stage="demo"]').innerHTML = '<span class="pj-live-dot" aria-hidden="true"></span> ' + esc(demo.label);
      stageTabs.querySelectorAll('button').forEach(function (b) {
        b.classList.toggle('active', b.getAttribute('data-stage') === 'gallery');
      });
    }

    var list = navList();
    var pos = list.indexOf(id);
    document.getElementById('pjModalCount').textContent = list.length > 1 ? (pos + 1) + ' of ' + list.length : '';
    document.getElementById('pjPrev').disabled = list.length < 2;
    document.getElementById('pjNext').disabled = list.length < 2;

    renderThumbs(p);
    renderStage();
    modal.querySelector('.pj-modal-info').scrollTop = 0;
  }

  // Prev/next walks the currently filtered list (falls back to everything)
  function navList() {
    var list = visibleProjects().map(function (item) { return item.id; });
    if (list.indexOf(current.id) === -1) list = projects.map(function (item) { return item.id; });
    return list;
  }

  function goProject(delta) {
    var list = navList();
    var pos = list.indexOf(current.id);
    var nextId = list[(pos + delta + list.length) % list.length];
    var swap = function () { fillModal(nextId); setUrl(nextId); };
    if (!reduceMotion.matches) {
      modal.classList.add('is-swapping');
      setTimeout(function () { swap(); modal.classList.remove('is-swapping'); }, 160);
    } else {
      swap();
    }
  }

  function setUrl(id) {
    try {
      var url = new URL(window.location.href);
      if (id) url.searchParams.set('project', id); else url.searchParams.delete('project');
      url.hash = 'projects';
      history.replaceState(history.state, '', url.toString());
    } catch (e) { /* ignore */ }
  }

  function lockScroll(lock) {
    var root = document.documentElement;
    if (lock) {
      root.style.setProperty('--pj-scrollbar', (window.innerWidth - root.clientWidth) + 'px');
      root.classList.add('pj-lock');
    } else {
      root.classList.remove('pj-lock');
      root.style.removeProperty('--pj-scrollbar');
    }
  }

  function openModal(id, trigger) {
    if (!byId[id]) return;
    current.returnFocus = trigger || document.activeElement;
    fillModal(id);
    if (typeof modal.showModal === 'function') {
      if (!modal.open) modal.showModal();
    } else {
      modal.setAttribute('open', '');
    }
    lockScroll(true);
    setUrl(id);
    document.getElementById('pjClose').focus({ preventScroll: true });
  }

  function closeModal() {
    if (!modal.open) return;
    var finish = function () {
      modal.classList.remove('is-closing');
      stageEl.innerHTML = ''; // stops any video or demo that is still running
      if (typeof modal.close === 'function') modal.close(); else modal.removeAttribute('open');
      lockScroll(false);
      setUrl(null);
      if (current.returnFocus && current.returnFocus.focus) current.returnFocus.focus({ preventScroll: true });
    };
    if (reduceMotion.matches) { finish(); return; }
    modal.classList.add('is-closing');
    setTimeout(finish, 180);
  }

  document.getElementById('pjClose').addEventListener('click', closeModal);
  document.getElementById('pjPrev').addEventListener('click', function () { goProject(-1); });
  document.getElementById('pjNext').addEventListener('click', function () { goProject(1); });

  // Native Esc closes the dialog instantly; route it through the animated close
  modal.addEventListener('cancel', function (e) { e.preventDefault(); closeModal(); });

  // Click on the dimmed backdrop closes
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });

  stageEl.addEventListener('click', function (e) {
    var btn = e.target.closest('.pj-stage-btn');
    if (btn) step(Number(btn.getAttribute('data-step')));
  });

  thumbsEl.addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-index]');
    if (!btn) return;
    current.index = Number(btn.getAttribute('data-index'));
    renderStage();
  });

  stageTabs.addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-stage]');
    if (!btn || btn.getAttribute('data-stage') === current.stage) return;
    current.stage = btn.getAttribute('data-stage');
    stageTabs.querySelectorAll('button').forEach(function (b) { b.classList.toggle('active', b === btn); });
    renderStage();
  });

  document.getElementById('pjModalActions').addEventListener('click', function (e) {
    var btn = e.target.closest('.pj-copy');
    if (!btn) return;
    var label = btn.querySelector('span');
    var done = function (ok) {
      label.textContent = ok ? 'Copied' : 'Copy failed';
      btn.classList.toggle('is-done', ok);
      setTimeout(function () { label.textContent = 'Copy link'; btn.classList.remove('is-done'); }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(window.location.href).then(function () { done(true); }, function () { done(false); });
    } else {
      done(false);
    }
  });

  // Keyboard: ←/→ images, Shift+←/→ projects
  modal.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    var tag = (e.target && e.target.tagName) || '';
    if (tag === 'VIDEO' || tag === 'INPUT') return;
    var delta = e.key === 'ArrowRight' ? 1 : -1;
    if (e.shiftKey || current.media.length < 2 || current.stage !== 'gallery') goProject(delta);
    else step(delta);
    e.preventDefault();
  });

  // Touch swipe on the stage
  var touchX = null;
  stageEl.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
  stageEl.addEventListener('touchend', function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) > 45) step(dx < 0 ? 1 : -1);
  });

  /* ---------- boot ---------- */

  applyFilters(false);
  // Pill needs real layout widths (fonts may still be loading)
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveYearPill);

  // Deep link: index.html?project=<id>#projects opens that project
  try {
    var deepId = new URL(window.location.href).searchParams.get('project');
    if (deepId && byId[deepId]) openModal(deepId);
  } catch (e) { /* ignore */ }
})();
