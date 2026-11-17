// Timeline
const timelineData = {
  1: {
    badge: 'Year 2024-2025',
    title: 'First Year',
    description: 'When I started college, everything was new to me. I was nervous because I did not know what to expect. I met new classmates, new teachers, and learned many new subjects. We were taught Java and Python, which introduced me to programming. At first, it was hard to adjust, but I did my best to attend classes, finish my assignments, and learn from my mistakes. My first year helped me become more responsible and confident.'
  },
  2: {
    badge: 'Year 2025-2026',
    title: 'Second Year',
    description: 'In my second year, I became more comfortable with college life. I learned how to manage my time better and work with my classmates on different projects. I also became an officer as an SBO Representative, which helped me grow as a leader and serve my fellow students. We were taught Human-Computer Interaction (HCI), which helped me understand how to design better user experiences. Some subjects were difficult, but I did not give up. I asked for help when I needed it and continued to improve my skills. This year taught me the importance of teamwork, patience, and hard work.'
  },
  3: {
    badge: 'Year 2026-2027',
    title: 'Third Year',
    description: 'My third year was more challenging because the subjects became more advanced. We had many projects, presentations, and practical activities. I was appointed and became SBO President, which gave me more responsibility in leading and serving the student body. I developed a game and built Paws & Play, a smart pet daycare system with an automatic food dispenser using CodeIgniter, PHP, MySQL, and Arduino. I also learned Laravel and Adobe Photoshop, which helped me improve my web development and design skills. I gained more knowledge in my course and became more confident in my abilities. Even though there were stressful days, I stayed focused on my goals. I learned that success comes from dedication, perseverance, and continuous learning.'
  },
  4: {
    badge: 'Year 2027-2028',
    title: 'Fourth Year',
    description: 'My fourth year is the final stretch of my BSIT journey. Our capstone project is SPC Hotel, a web-based hotel management simulation platform for hospitality students built with Laravel, PHP, Tailwind CSS, and Supabase, where students design a hotel and run its Front Desk, Rooms, Restaurant, Housekeeping, and Maintenance in simulation. I also developed TripWise, a nationwide travel package booking platform using Ionic React, PHP, MySQL, and OpenAI, where travelers book trips from verified agencies. This year is teaching me how to plan, build, and deliver complete systems for real users, and it is preparing me to start my career in the IT industry.'
  }
};

const progressWidths = { 1: '0%', 2: '33%', 3: '66%', 4: '100%' };

const timelineSteps = document.querySelectorAll('.md-step');
const timelineDescription = document.getElementById('timelineDescription');
const lockedMessage = document.getElementById('lockedMessage');
const timelineProgress = document.getElementById('timelineProgress');

function updateTimeline(year) {
  const data = timelineData[year];
  timelineDescription.classList.remove('fade-in');
  void timelineDescription.offsetWidth;
  timelineDescription.classList.add('fade-in');
  timelineDescription.innerHTML =
    '<span class="md-badge">' + data.badge + '</span>' +
    '<h3>' + data.title + '</h3>' +
    '<p>' + data.description + '</p>';
  timelineProgress.style.width = progressWidths[year];
}

timelineSteps.forEach(function (stepBtn) {
  stepBtn.addEventListener('click', function () {
    if (stepBtn.classList.contains('locked')) {
      timelineDescription.style.display = 'none';
      lockedMessage.classList.add('show');
      timelineSteps.forEach(function (btn) {
        btn.classList.remove('active');
      });
      timelineProgress.style.width = '75%';
      return;
    }

    lockedMessage.classList.remove('show');
    timelineDescription.style.display = 'block';

    const year = stepBtn.getAttribute('data-year');

    timelineSteps.forEach(function (btn) {
      btn.classList.remove('active');
    });
    stepBtn.classList.add('active');

    updateTimeline(year);
  });
});

// Projects section lives in projects-section.js

const menuBtn = document.getElementById('menuBtn');
const navLinks = document.querySelector('.md-links');

menuBtn.addEventListener('click', function () {
  const open = navLinks.classList.toggle('active');
  menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
});

// Close menu when a link is clicked
document.querySelectorAll('.md-links a').forEach(function (link) {
  link.addEventListener('click', function () {
    navLinks.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
  });
});

// Nav gets a stronger edge once the page is scrolled
const mdNav = document.querySelector('.md-nav');
function updateNavShadow() {
  if (mdNav) mdNav.classList.toggle('is-scrolled', window.scrollY > 20);
}
window.addEventListener('scroll', updateNavShadow, { passive: true });
updateNavShadow();

// Scroll reveal for the modern sections (.md-reveal)
(function () {
  const items = document.querySelectorAll('.md-reveal');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-in'); });
    return;
  }
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  items.forEach(function (el, i) {
    // Small stagger for elements that start on screen (hero)
    el.style.transitionDelay = (el.closest('.md-hero') ? i * 80 : 0) + 'ms';
    io.observe(el);
  });
})();

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('portfolio-theme');

if (savedTheme === 'light') {
  document.body.classList.add('light-mode');
}

if (themeToggle) {
  themeToggle.addEventListener('click', function () {
    document.body.classList.toggle('light-mode');
    const mode = document.body.classList.contains('light-mode') ? 'light' : 'dark';
    localStorage.setItem('portfolio-theme', mode);
  });
}

// Contact form handling
// Messages are delivered by Web3Forms (https://web3forms.com) to your email.
// Paste your access key below. It is safe to keep in public code: it can only send mail to you.
const WEB3FORMS_ACCESS_KEY = '3c408a26-0460-4dbd-8686-591bc87ad122';

const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const submitBtn = contactForm.querySelector('.contact-submit');
const submitLabel = submitBtn ? submitBtn.querySelector('span') : null;

function showFormMessage(text, type) {
  formMessage.textContent = text;
  formMessage.className = 'form-message ' + type;
}

contactForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  if (name === '' || email === '' || subject === '' || message === '') {
    showFormMessage('Please fill in all fields.', 'error');
    return;
  }

  if (WEB3FORMS_ACCESS_KEY.indexOf('PASTE-') === 0) {
    showFormMessage('The contact form is not set up yet. Please email me at oraoalexes@gmail.com.', 'error');
    return;
  }

  if (submitBtn) submitBtn.disabled = true;
  if (submitLabel) submitLabel.textContent = 'Sending...';
  showFormMessage('', '');

  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: 'Portfolio: ' + subject,
      from_name: name,
      name: name,
      email: email,
      message: message,
      botcheck: ''
    })
  })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data && data.success) {
        showFormMessage('Thank you, ' + name + '! Your message has been sent.', 'success');
        contactForm.reset();
      } else {
        showFormMessage('Sorry, your message could not be sent. Please email me at oraoalexes@gmail.com.', 'error');
      }
    })
    .catch(function () {
      showFormMessage('Network error. Please try again or email me at oraoalexes@gmail.com.', 'error');
    })
    .finally(function () {
      if (submitBtn) submitBtn.disabled = false;
      if (submitLabel) submitLabel.textContent = 'Send Message';
    });
});

// Highlight active nav link on scroll
const sections = document.querySelectorAll('section');
const navAnchors = document.querySelectorAll('.md-links a');
const pageDots = document.querySelectorAll('.page-dots span');

function setActiveSection(current) {
  navAnchors.forEach(function (link) {
    const isActive = link.getAttribute('href') === '#' + current;
    link.classList.toggle('active', isActive);
  });

  const sectionOrder = ['home', 'about', 'skills', 'projects'];
  const activeIndex = sectionOrder.indexOf(current);
  pageDots.forEach(function (dot, index) {
    dot.classList.toggle('active', index === (activeIndex >= 0 ? activeIndex : 0));
  });
}

window.addEventListener('scroll', function () {
  let current = 'home';

  sections.forEach(function (section) {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  setActiveSection(current);
});

setActiveSection('home');

// Typing effect
const typingPhrases = ['I am a Vibe Coder', 'I am a Web Developer', 'I am a Project Manager'];
const typingEl = document.getElementById('typingText');
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  if (!typingEl) return;

  const currentPhrase = typingPhrases[phraseIndex];

  if (isDeleting) {
    typingEl.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingEl.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
  }

  let speed = isDeleting ? 50 : 100;

  if (!isDeleting && charIndex === currentPhrase.length) {
    speed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % typingPhrases.length;
    speed = 500;
  }

  setTimeout(typeEffect, speed);
}

typeEffect();



// CV viewer: "View CV" opens the PDF in a modal on wide screens.
// Phones and small tablets often cannot show PDFs inside a page, so there the link opens a new tab.
(function () {
  var viewBtn = document.getElementById('cvView');
  var modal = document.getElementById('cvModal');
  var frame = document.getElementById('cvFrame');
  var closeBtn = document.getElementById('cvClose');
  if (!viewBtn || !modal || !frame || typeof modal.showModal !== 'function') return;

  function closeModal() {
    if (!modal.open) return;
    modal.close();
    document.documentElement.classList.remove('pj-lock');
    viewBtn.focus({ preventScroll: true });
  }

  viewBtn.addEventListener('click', function (e) {
    if (window.innerWidth < 768 || e.ctrlKey || e.metaKey || e.shiftKey) return;
    e.preventDefault();
    if (!frame.getAttribute('src')) frame.src = viewBtn.getAttribute('href') + '#view=FitH';
    modal.showModal();
    document.documentElement.classList.add('pj-lock');
    closeBtn.focus({ preventScroll: true });
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('cancel', function (e) { e.preventDefault(); closeModal(); });
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
})();

// Phone carousels: Projects, Certificates and Skills swipe sideways (CSS in modern.css).
// Adds a small progress bar under each one.
(function () {
  var mq = window.matchMedia('(max-width: 768px)');
  var rails = [
    document.getElementById('pjGrid'),
    document.getElementById('ctGrid'),
    document.querySelector('.md-skills-grid')
  ].filter(Boolean);

  rails.forEach(function (rail) {
    var bar = document.createElement('div');
    bar.className = 'md-rail-bar';
    bar.setAttribute('aria-hidden', 'true');
    bar.innerHTML = '<span></span>';
    rail.parentNode.insertBefore(bar, rail.nextSibling);
    var fill = bar.firstChild;

    function update() {
      var max = rail.scrollWidth - rail.clientWidth;
      bar.hidden = !mq.matches || max <= 4;
      if (bar.hidden) return;
      var ratio = rail.clientWidth / rail.scrollWidth;
      var progress = Math.min(1, Math.max(0, rail.scrollLeft / max));
      fill.style.width = (ratio * 100) + '%';
      fill.style.transform = 'translateX(' + (progress * (1 / ratio - 1) * 100) + '%)';
    }

    rail.mdUpdate = update;
    rail.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    window.addEventListener('load', update);
    update();
  });

  // After a tab filter changes the cards, jump back to the first card
  document.addEventListener('click', function (e) {
    var tabs = e.target.closest('.pj-years');
    if (!tabs) return;
    var section = tabs.closest('section');
    setTimeout(function () {
      rails.forEach(function (rail) {
        if (section && !section.contains(rail)) return;
        rail.scrollLeft = 0;
        rail.mdUpdate();
      });
    }, 60);
  });
})();
