/*
 * Intro screen: a loading ring fills while the page loads, then the logo
 * waits for a tap. Tapping it fires a spark burst, a chime, and splits the
 * curtains to reveal the portfolio. Markup lives at the top of index.html.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var intro = document.getElementById('jaoIntro');
  if (!intro) return;
  if (!root.classList.contains('intro-on')) {
    intro.parentNode.removeChild(intro);
    return;
  }

  // Stop the browser from restoring an old scroll spot (or jumping to a #section) under the intro
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  var SEEN_KEY = 'jao-intro-seen';
  var MIN_LOAD_MS = 1800;   // keep the loader up at least this long
  var MAX_LOAD_MS = 4000;   // never wait longer than this for window.load
  var PLAY_SOUND = true;    // the "charan!" chime on tap

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var logo = intro.querySelector('.ji-logo');
  var bar = intro.querySelector('.ji-ring-bar');
  var count = intro.querySelector('.ji-count');
  var hintVerb = intro.querySelector('.ji-hint-verb');
  var skip = intro.querySelector('.ji-skip');
  var burst = intro.querySelector('.ji-burst');
  var ring = 339.3; // 2 * PI * 54

  if (hintVerb && window.matchMedia('(hover: none)').matches) hintVerb.textContent = 'Tap';

  // Split the name into letters for the staggered rise
  var name = intro.querySelector('.ji-name');
  if (name) {
    var text = name.textContent.trim();
    var n = 0;
    name.setAttribute('aria-label', text);
    name.textContent = '';
    text.split(/\s+/).forEach(function (word, w) {
      if (w) name.appendChild(document.createTextNode(' '));
      var wrap = document.createElement('span');
      wrap.className = 'ji-word';
      wrap.setAttribute('aria-hidden', 'true');
      for (var i = 0; i < word.length; i++) {
        var s = document.createElement('span');
        s.textContent = word[i];
        s.style.animationDelay = (0.35 + n++ * 0.045) + 's';
        wrap.appendChild(s);
      }
      name.appendChild(wrap);
    });
  }

  // ---------- Loading progress ----------
  var loaded = document.readyState === 'complete';
  var start = performance.now();
  var progress = 0;
  var ready = false;
  var entering = false;

  window.addEventListener('load', function () { loaded = true; });
  setTimeout(function () { loaded = true; }, MAX_LOAD_MS);

  function setProgress(p) {
    bar.style.strokeDashoffset = String(ring * (1 - p / 100));
    count.textContent = 'Loading ' + Math.floor(p) + '%';
  }

  // Time-based so it looks the same at any frame rate:
  // ease toward 90% during MIN_LOAD_MS, then run 90 -> 100 once the page is loaded
  var finishFrom = 0;
  function tick() {
    if (entering) return;
    var now = performance.now();
    var t = Math.min(1, (now - start) / MIN_LOAD_MS);
    var p = 90 * (1 - Math.pow(1 - t, 3));
    if (loaded && t >= 1) {
      if (!finishFrom) finishFrom = now;
      p = 90 + Math.min(1, (now - finishFrom) / 450) * 10;
    }
    progress = Math.max(progress, p);
    setProgress(progress);
    if (progress >= 100) return becomeReady();
    requestAnimationFrame(tick);
  }

  function becomeReady() {
    ready = true;
    intro.classList.add('is-ready');
    logo.removeAttribute('aria-disabled');
    logo.focus({ preventScroll: true });
  }

  // ---------- Enter ----------
  function sparks() {
    var colors = ['#ff2d6a', '#c71585', '#ff7a59', '#ffd1dc', '#ffffff'];
    var frag = document.createDocumentFragment();
    var wave = document.createElement('span');
    wave.className = 'ji-wave';
    frag.appendChild(wave);
    for (var i = 0; i < 34; i++) {
      var a = (Math.PI * 2 * i) / 34 + Math.random() * 0.3;
      var d = 120 + Math.random() * 240;
      var sp = document.createElement('span');
      sp.className = 'ji-spark';
      sp.style.setProperty('--x', Math.cos(a) * d + 'px');
      sp.style.setProperty('--y', Math.sin(a) * d + 'px');
      sp.style.setProperty('--s', (4 + Math.random() * 7) + 'px');
      sp.style.setProperty('--c', colors[i % colors.length]);
      sp.style.animationDelay = Math.random() * 0.08 + 's';
      frag.appendChild(sp);
    }
    burst.appendChild(frag);
  }

  function chime() {
    if (!PLAY_SOUND) return;
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      var ctx = new Ctx();
      var t = ctx.currentTime;
      var master = ctx.createGain();
      master.gain.value = 0.18;
      master.connect(ctx.destination);
      // Rising sweep, then a bright major chord: "cha-ran!"
      var sweep = ctx.createOscillator();
      var sg = ctx.createGain();
      sweep.type = 'triangle';
      sweep.frequency.setValueAtTime(260, t);
      sweep.frequency.exponentialRampToValueAtTime(1050, t + 0.22);
      sg.gain.setValueAtTime(0.0001, t);
      sg.gain.exponentialRampToValueAtTime(0.6, t + 0.05);
      sg.gain.exponentialRampToValueAtTime(0.0001, t + 0.26);
      sweep.connect(sg).connect(master);
      sweep.start(t);
      sweep.stop(t + 0.3);
      [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
        var o = ctx.createOscillator();
        var g = ctx.createGain();
        var at = t + 0.2 + i * 0.05;
        o.type = 'sine';
        o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, at);
        g.gain.exponentialRampToValueAtTime(0.5, at + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, at + 1.4);
        o.connect(g).connect(master);
        o.start(at);
        o.stop(at + 1.5);
      });
      setTimeout(function () { ctx.close(); }, 2200);
    } catch (e) { /* audio is optional */ }
  }

  function finish() {
    root.classList.remove('intro-on', 'intro-leaving');
    if (intro.parentNode) intro.parentNode.removeChild(intro);
    try { sessionStorage.setItem(SEEN_KEY, '1'); } catch (e) { /* storage unavailable */ }
    // The intro always lands on Home: drop any #section from the URL and start at the top
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    window.scrollTo(0, 0);
    document.dispatchEvent(new CustomEvent('jao:intro-done'));
  }

  function enter(fast) {
    if (entering) return;
    entering = true;
    if (fast || reduceMotion) {
      intro.classList.add('is-leaving');
      root.classList.add('intro-leaving');
      setTimeout(finish, reduceMotion ? 450 : 700);
      return;
    }
    intro.classList.add('is-entering');
    sparks();
    chime();
    setTimeout(function () {
      intro.classList.add('is-leaving');
      root.classList.add('intro-leaving');
    }, 420);
    setTimeout(finish, 1500);
  }

  logo.addEventListener('click', function () { if (ready) enter(false); });
  skip.addEventListener('click', function () { enter(true); });
  document.addEventListener('keydown', function (e) {
    if (!document.body.contains(intro)) return;
    if (e.key === 'Escape') enter(true);
  });

  setProgress(0);
  requestAnimationFrame(tick);
})();
