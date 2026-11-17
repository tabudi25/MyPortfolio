(function () {
  'use strict';

  var THEMES = {
    naruto: {
      name: 'Naruto',
      themeBg: 'narutobg.png',
      gameBg: 'narutogamebg.png',
      cover: 'narutocover.jpeg',
      music: 'narutomusic.mp3',
      gifPrefix: 'naruto',
      imagePath: function (i) { return 'naruto' + i + '.png'; }
    },
    op: {
      name: 'One Piece',
      themeBg: 'onepiecebg.png',
      gameBg: 'opgamebg1.png',
      cover: 'onepiececover.jpeg',
      music: 'onepiecemusic.mp3',
      gifPrefix: 'op',
      imagePath: function (i) { return 'op' + i + '.png'; }
    },
    slam: {
      name: 'Slam Dunk',
      themeBg: 'slamD.png',
      gameBg: 'slamdunkgamebg.png',
      cover: 'slamdunkcover.jpeg',
      music: 'slamdunkmusic.mp3',
      gifPrefix: 'slamdunk',
      imagePath: function (i) { return 'Slam' + i + '.png'; }
    },
    db: {
      name: 'Dragon Ball',
      themeBg: 'dragonballbg.png',
      gameBg: 'dbgamebg.png',
      cover: 'dragonballcover.jpeg',
      music: 'dragonballmusic.mp3',
      gifPrefix: 'db',
      imagePath: function (i) { return 'db' + i + '.png'; }
    },
    bleach: {
      name: 'Bleach',
      themeBg: 'bleachbg.png',
      gameBg: 'bleachgamebg.png',
      cover: 'bleachcover.jpeg',
      music: 'bleachmusic.mp3',
      gifPrefix: 'bleach',
      imagePath: function (i) {
        return i === 32 ? 'Bleach32.jpeg' : 'Bleach' + i + '.png';
      }
    }
  };

  var GRID_SETTINGS = {
    4: { pairs: 8, timeLimit: 60, flipLimit: 20, points: 5 },
    6: { pairs: 18, timeLimit: 90, flipLimit: 40, points: 10 },
    8: { pairs: 32, timeLimit: 120, flipLimit: 50, points: 15 }
  };

  var state = {
    theme: 'naruto',
    gridSize: 4,
    cards: [],
    flipped: [],
    firstCard: null,
    secondCard: null,
    score: 0,
    flips: 0,
    timeLeft: 60,
    flipLimit: 20,
    pointsPerMatch: 5,
    timerId: null,
    running: false,
    paused: false,
    locked: false,
    muted: false
  };

  var GIF_SIZES = [4, 6, 8];
  var GIF_CYCLE_MS = 3000;
  var LEADERBOARD_KEY = 'flipMemoryLeaderboard';

  var gifState = {
    running: false,
    index: 0,
    timerId: null
  };

  var music = new Audio();
  var clapSound = new Audio('assets/clapsound.mp3');
  var loseSound = new Audio('assets/losesound.mp3');
  music.loop = true;

  var screens = {
    home: document.getElementById('screen-home'),
    themes: document.getElementById('screen-themes'),
    size: document.getElementById('screen-size'),
    howto: document.getElementById('screen-howto'),
    game: document.getElementById('screen-game')
  };

  var board = document.getElementById('board');
  var hudScore = document.getElementById('hud-score');
  var hudFlips = document.getElementById('hud-flips');
  var hudTime = document.getElementById('hud-time');
  var gameBg = document.getElementById('game-bg');
  var sizeBg = document.getElementById('size-bg');
  var sizeThemeTitle = document.getElementById('size-theme-title');
  var muteBtn = document.getElementById('mute-btn');
  var gifPreview = document.getElementById('gif-preview');
  var sizeButtons = document.querySelectorAll('.tile-btn');

  function assetUrl(file) {
    return 'assets/' + file;
  }

  function getGifPath(size) {
    var theme = THEMES[state.theme];
    return assetUrl('GIF-' + size + 'x' + size + '-' + theme.gifPrefix + '.png');
  }

  function showGifPreview(size, animate) {
    if (!gifPreview) return;
    var src = getGifPath(size);

    if (!animate || !gifPreview.getAttribute('src')) {
      gifPreview.src = src;
      gifPreview.classList.remove('gif-fade');
      return;
    }

    gifPreview.classList.add('gif-fade');
    setTimeout(function () {
      gifPreview.src = src;
      gifPreview.classList.remove('gif-fade');
    }, 180);
  }

  function cycleAutoGifs() {
    if (!gifState.running) return;
    showGifPreview(GIF_SIZES[gifState.index], true);
    gifState.index = (gifState.index + 1) % GIF_SIZES.length;
    gifState.timerId = setTimeout(cycleAutoGifs, GIF_CYCLE_MS);
  }

  function startAutoGifTransitions() {
    stopAutoGifTransitions();
    gifState.running = true;
    gifState.index = 0;
    showGifPreview(GIF_SIZES[0], false);
    gifState.index = 1;
    gifState.timerId = setTimeout(cycleAutoGifs, GIF_CYCLE_MS);
  }

  function stopAutoGifTransitions() {
    gifState.running = false;
    if (gifState.timerId) {
      clearTimeout(gifState.timerId);
      gifState.timerId = null;
    }
  }

  function setupSizeButtonHovers() {
    sizeButtons.forEach(function (btn) {
      var size = parseInt(btn.dataset.size, 10);

      btn.onmouseenter = function () {
        stopAutoGifTransitions();
        showGifPreview(size, true);
      };

      btn.onmouseleave = function () {
        startAutoGifTransitions();
      };
    });
  }

  setupSizeButtonHovers();

  function showScreen(name) {
    Object.keys(screens).forEach(function (key) {
      screens[key].classList.toggle('active', key === name);
    });
  }

  function formatTime(seconds) {
    if (seconds >= 60) {
      var m = Math.floor(seconds / 60);
      var s = seconds % 60;
      return m + ':' + (s < 10 ? '0' : '') + s;
    }
    return seconds + 's';
  }

  function updateHud() {
    hudScore.textContent = state.score;
    hudFlips.textContent = state.flips + '/' + state.flipLimit;
    hudTime.textContent = formatTime(state.timeLeft);
  }

  function stopTimer() {
    if (state.timerId) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  function stopMusic() {
    music.pause();
    music.currentTime = 0;
  }

  function playThemeMusic() {
    if (state.muted) return;
    var theme = THEMES[state.theme];
    music.src = assetUrl(theme.music);
    music.play().catch(function () {});
  }

  function hideOverlays() {
    document.getElementById('overlay-pause').classList.add('hidden');
    document.getElementById('overlay-win').classList.add('hidden');
    document.getElementById('overlay-lose').classList.add('hidden');
  }

  function getLeaderboardEntries() {
    try {
      return JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  function formatThemeName(themeKey) {
    var theme = THEMES[themeKey];
    return theme ? theme.name.toUpperCase() : String(themeKey || '').toUpperCase();
  }

  function refreshLeaderboardPanel() {
    var entries = getLeaderboardEntries();
    var top1El = document.getElementById('leaderboard-top1');
    var bodyEl = document.getElementById('leaderboard-body');

    if (entries.length > 0) {
      var top = entries[0];
      top1El.textContent =
        'Top 1: Score ' + top.score +
        ' | Time ' + top.time_left + 's' +
        ' | Flips ' + top.flips +
        ' | Theme ' + formatThemeName(top.theme);
    } else {
      top1El.textContent = 'Top 1: No records yet';
    }

    bodyEl.innerHTML = '';

    if (entries.length === 0) {
      var emptyRow = document.createElement('tr');
      emptyRow.innerHTML =
        '<td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>' +
        '<td>No leaderboard records available yet.</td>';
      bodyEl.appendChild(emptyRow);
      return;
    }

    entries.forEach(function (entry, index) {
      var row = document.createElement('tr');
      row.innerHTML =
        '<td>' + (index + 1) + '</td>' +
        '<td>' + entry.score + '</td>' +
        '<td>' + entry.time_left + 's</td>' +
        '<td>' + entry.flips + '</td>' +
        '<td>' + formatThemeName(entry.theme) + '</td>' +
        '<td>' + entry.result + '</td>';
      bodyEl.appendChild(row);
    });
  }

  function showLeaderboardPanel() {
    refreshLeaderboardPanel();
    document.getElementById('overlay-leaderboard').classList.remove('hidden');
  }

  function closeLeaderboardPanel() {
    document.getElementById('overlay-leaderboard').classList.add('hidden');
  }

  function saveLeaderboard(result) {
    var entries = getLeaderboardEntries();
    entries.push({
      theme: state.theme,
      score: state.score,
      flips: state.flips,
      time_left: Math.max(0, state.timeLeft),
      result: result,
      timestamp: new Date().toISOString()
    });
    entries.sort(function (a, b) {
      return b.score - a.score || b.time_left - a.time_left || a.flips - b.flips;
    });
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries.slice(0, 20)));
  }

  function gameOver(message, type) {
    state.running = false;
    stopTimer();
    stopMusic();
    saveLeaderboard(message);

    var stats = 'Score: ' + state.score + '\nFlips: ' + state.flips +
      (type === 'flip' ? '/' + state.flipLimit : '') +
      '\nTime Left: ' + (type === 'time' ? '0' : state.timeLeft) + 's';

    hideOverlays();

    if (type === 'win') {
      if (!state.muted) clapSound.play().catch(function () {});
      document.getElementById('win-stats').textContent = stats;
      document.getElementById('overlay-win').classList.remove('hidden');
    } else {
      if (!state.muted) loseSound.play().catch(function () {});
      document.getElementById('lose-title').textContent = message;
      document.getElementById('lose-stats').textContent = stats;
      document.getElementById('overlay-lose').classList.remove('hidden');
    }

    board.querySelectorAll('.card').forEach(function (btn) {
      btn.disabled = true;
    });
  }

  function startTimer() {
    stopTimer();
    state.timerId = setInterval(function () {
      if (!state.running || state.paused) return;
      state.timeLeft -= 1;
      updateHud();
      if (state.timeLeft <= 0) {
        gameOver("Time's up! You lose.", 'time');
      }
    }, 1000);
  }

  function buildDeck() {
    var settings = GRID_SETTINGS[state.gridSize];
    var theme = THEMES[state.theme];
    var pairs = [];

    for (var i = 1; i <= settings.pairs; i++) {
      var src = assetUrl(theme.imagePath(i));
      pairs.push({ id: i - 1, src: src });
    }

    var deck = pairs.concat(pairs.map(function (c) {
      return { id: c.id, src: c.src };
    }));

    for (var j = deck.length - 1; j > 0; j--) {
      var k = Math.floor(Math.random() * (j + 1));
      var tmp = deck[j];
      deck[j] = deck[k];
      deck[k] = tmp;
    }

    return deck;
  }

  function renderBoard() {
    var theme = THEMES[state.theme];
    var cover = assetUrl(theme.cover);

    gameBg.style.backgroundImage = "url('" + assetUrl(theme.gameBg) + "')";
    board.className = 'board size-' + state.gridSize;
    board.innerHTML = '';

    state.cards = buildDeck();
    state.flipped = [];
    state.firstCard = null;
    state.secondCard = null;
    state.locked = false;

    state.cards.forEach(function (card, index) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'card';
      btn.dataset.index = index;
      btn.style.backgroundImage = "url('" + cover + "')";
      btn.addEventListener('click', function () { onCardClick(index, btn, card); });
      board.appendChild(btn);
    });
  }

  function onCardClick(index, btn, card) {
    if (!state.running || state.paused || state.locked) return;
    if (state.flipped.indexOf(index) !== -1) return;
    if (state.firstCard === index) return;

    btn.classList.add('flipping');
    btn.style.backgroundImage = "url('" + card.src + "')";

    setTimeout(function () { btn.classList.remove('flipping'); }, 350);

    if (state.firstCard === null) {
      state.firstCard = index;
      return;
    }

    state.secondCard = index;
    state.locked = true;

    setTimeout(checkMatch, 400);
  }

  function checkMatch() {
    var idx1 = state.firstCard;
    var idx2 = state.secondCard;
    var card1 = state.cards[idx1];
    var card2 = state.cards[idx2];
    var btn1 = board.querySelector('[data-index="' + idx1 + '"]');
    var btn2 = board.querySelector('[data-index="' + idx2 + '"]');
    var theme = THEMES[state.theme];
    var cover = assetUrl(theme.cover);

    if (card1.id === card2.id) {
      state.flipped.push(idx1, idx2);
      state.score += state.pointsPerMatch;
      btn1.classList.add('matched');
      btn2.classList.add('matched');
      btn1.disabled = true;
      btn2.disabled = true;
      updateHud();

      state.firstCard = null;
      state.secondCard = null;
      state.locked = false;

      if (state.flipped.length === state.cards.length) {
        gameOver('You win!', 'win');
      }
    } else {
      state.flips += 1;
      updateHud();

      if (state.flips >= state.flipLimit) {
        btn1.style.backgroundImage = "url('" + cover + "')";
        btn2.style.backgroundImage = "url('" + cover + "')";
        state.firstCard = null;
        state.secondCard = null;
        state.locked = false;
        gameOver('Flip limit reached! You lose.', 'flip');
        return;
      }

      setTimeout(function () {
        btn1.classList.add('flipping');
        btn2.classList.add('flipping');
        btn1.style.backgroundImage = "url('" + cover + "')";
        btn2.style.backgroundImage = "url('" + cover + "')";
        setTimeout(function () {
          btn1.classList.remove('flipping');
          btn2.classList.remove('flipping');
        }, 350);
        state.firstCard = null;
        state.secondCard = null;
        state.locked = false;
      }, 600);
    }
  }

  function startGame() {
    stopAutoGifTransitions();
    var settings = GRID_SETTINGS[state.gridSize];
    state.score = 0;
    state.flips = 0;
    state.timeLeft = settings.timeLimit;
    state.flipLimit = settings.flipLimit;
    state.pointsPerMatch = settings.points;
    state.running = true;
    state.paused = false;

    hideOverlays();
    updateHud();
    renderBoard();
    playThemeMusic();
    startTimer();
    showScreen('game');
  }

  function selectTheme(themeKey) {
    state.theme = themeKey;
    var theme = THEMES[themeKey];
    sizeBg.style.backgroundImage = "url('" + assetUrl(theme.themeBg) + "')";
    sizeThemeTitle.textContent = theme.name + ' — Select Grid Size';
    showScreen('size');
    startAutoGifTransitions();
  }

  function restartGame() {
    stopTimer();
    stopMusic();
    startGame();
  }

  document.getElementById('app').addEventListener('click', function (e) {
    var target = e.target.closest('[data-action], [data-theme], [data-size]');
    if (!target) return;

    if (target.dataset.theme) {
      selectTheme(target.dataset.theme);
      return;
    }

    if (target.dataset.size) {
      state.gridSize = parseInt(target.dataset.size, 10);
      startGame();
      return;
    }

    switch (target.dataset.action) {
      case 'go-home':
        stopTimer();
        stopMusic();
        stopAutoGifTransitions();
        hideOverlays();
        showScreen('home');
        break;
      case 'go-themes':
        stopTimer();
        stopMusic();
        stopAutoGifTransitions();
        hideOverlays();
        showScreen('themes');
        break;
      case 'go-howto':
        showScreen('howto');
        break;
      case 'show-leaderboard':
        showLeaderboardPanel();
        break;
      case 'refresh-leaderboard':
        refreshLeaderboardPanel();
        break;
      case 'close-leaderboard':
        closeLeaderboardPanel();
        break;
      case 'pause':
        if (!state.running) return;
        state.paused = true;
        document.getElementById('overlay-pause').classList.remove('hidden');
        break;
      case 'resume':
        state.paused = false;
        document.getElementById('overlay-pause').classList.add('hidden');
        break;
      case 'restart':
        restartGame();
        break;
      case 'toggle-mute':
        state.muted = !state.muted;
        muteBtn.textContent = state.muted ? '\u{1F507}' : '\u{1F50A}';
        if (state.muted) {
          music.pause();
        } else if (state.running && screens.game.classList.contains('active')) {
          playThemeMusic();
        }
        break;
    }
  });
})();
