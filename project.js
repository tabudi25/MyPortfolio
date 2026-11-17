// Project data lives in projects-data.js (shared with the Projects section on index.html)
const projectsData = window.PORTFOLIO_PROJECTS || {};

function getProjectId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function getYearKey(yearLabel) {
  if (yearLabel.indexOf('1') === 0) return '1';
  if (yearLabel.indexOf('2') === 0) return '2';
  if (yearLabel.indexOf('3') === 0) return '3';
  if (yearLabel.indexOf('4') === 0) return '4';
  return '1';
}

function rememberProjectYear(project) {
  const year = getYearKey(project.year || '');
  sessionStorage.setItem('portfolio-project-year', year);
  return year;
}

function setBackLinks(year) {
  const projectsUrl = 'index.html#projects';
  document.querySelectorAll('.back-link, .project-not-found .btn').forEach(function (link) {
    link.setAttribute('href', projectsUrl);
  });
  // Keep year in storage so index restores the correct tab
  if (year) {
    sessionStorage.setItem('portfolio-project-year', year);
  }
}

function renderProject(project) {
  const content = document.getElementById('projectContent');
  const notFound = document.getElementById('projectNotFound');
  const year = rememberProjectYear(project);
  setBackLinks(year);

  document.title = project.title + ' | JAO';

  let tagsHtml = '';
  project.tags.forEach(function (tag) {
    tagsHtml += '<span>' + tag + '</span>';
  });

  let imagesHtml = '';
  if (project.images.length > 0) {
    imagesHtml = '<div class="project-detail-images">';
    project.images.forEach(function (img) {
      imagesHtml +=
        '<div class="project-screenshot">' +
        '<img src="' + img.src + '" alt="' + img.label + '">' +
        '<span>' + img.label + '</span>' +
        '</div>';
    });
    imagesHtml += '</div>';
  }

  let videoHtml = '';
  if (project.video) {
    const isMov = project.video.endsWith('.mov');
    const videoType = isMov ? 'video/quicktime' : 'video/mp4';
    videoHtml =
      '<div class="project-detail-video">' +
      '<video controls preload="metadata" playsinline>' +
      '<source src="' + project.video + '" type="' + videoType + '">' +
      '</video>' +
      '<p class="video-fallback">Video not playing? <a href="' + project.video + '" download>Download the video</a> instead.</p>' +
      '</div>';
  }

  let gameHtml = '';
  if (project.gameEmbed) {
    const note = project.embedNote || 'Play the game below. Choose a theme, pick a grid size, and match all card pairs before time runs out.';
    const title = project.embedTitle || project.title || 'Interactive demo';
    const height = project.embedHeight || '620px';
    const openLabel = project.embedNote ? 'Open in full screen' : 'Open in full screen';
    gameHtml =
      '<div class="project-detail-game">' +
      '<p class="game-note">' + note + '</p>' +
      '<div class="game-viewer">' +
      '<iframe class="game-embed" style="height:' + height + '" src="' + project.gameEmbed + '" title="' + title + '" allow="autoplay"></iframe>' +
      '</div>' +
      '<p class="game-fallback">Not loading? <a href="' + project.gameEmbed + '" target="_blank" rel="noopener noreferrer">' + openLabel + '</a></p>' +
      '</div>';
  }

  let pptHtml = '';
  if (project.ppt) {
    const pdfFile = project.pdf || project.ppt;
    pptHtml =
      '<div class="project-detail-ppt">' +
      '<div class="ppt-actions">' +
      '<a href="' + pdfFile + '" class="btn" target="_blank" rel="noopener noreferrer">Open Fullscreen</a>' +
      '<a href="' + project.ppt + '" class="btn-small" download>Open in PowerPoint</a>' +
      '<a href="' + project.ppt + '" class="btn-small" download>Download PPT</a>' +
      '</div>' +
      '<p class="ppt-note">View the presentation below. Click hyperlinks inside the slides, or use <strong>Open in PowerPoint</strong> and press <strong>F5</strong> for slideshow mode.</p>' +
      '<div class="ppt-viewer">' +
      '<iframe class="ppt-embed" src="' + pdfFile + '#toolbar=1&navpanes=0" title="Presentation preview"></iframe>' +
      '</div>' +
      '</div>';
  }

  let actionsHtml = '';
  let actionLinks = '';
  if (project.live) {
    actionLinks += '<a href="' + project.live + '" target="_blank" rel="noopener noreferrer" class="btn">Visit Live Site</a>';
  }
  if (!project.ppt && project.github) {
    actionLinks += '<a href="' + project.github + '" target="_blank" rel="noopener noreferrer" class="btn">View on GitHub</a>';
  }
  if (actionLinks) {
    actionsHtml = '<div class="project-detail-actions">' + actionLinks + '</div>';
  }

  content.innerHTML =
    '<article class="project-detail-card">' +
    '<span class="project-detail-year">' + project.year + '</span>' +
    '<h1>' + project.title + '</h1>' +
  (project.subtitle ? '<p class="project-detail-subtitle">' + project.subtitle + '</p>' : '') +
    '<p class="project-detail-desc">' + project.description + '</p>' +
    '<div class="project-tags">' + tagsHtml + '</div>' +
    gameHtml +
    pptHtml +
    videoHtml +
    actionsHtml +
    imagesHtml +
    '</article>';

  notFound.style.display = 'none';
  content.style.display = 'block';
}

const projectId = getProjectId();
const projectContent = document.getElementById('projectContent');
const projectNotFound = document.getElementById('projectNotFound');

if (projectId && projectsData[projectId]) {
  renderProject(projectsData[projectId]);
} else {
  projectContent.style.display = 'none';
  projectNotFound.style.display = 'block';
}

// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.querySelector('.nav-links');

if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', function () {
    navLinks.classList.toggle('active');
  });

  document.querySelectorAll('.nav-links a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('active');
    });
  });
}
