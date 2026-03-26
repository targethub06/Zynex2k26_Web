// ============================================================
//  PSNA CET CSE AIML DEPARTMENT WEBSITE
//  Main JavaScript — Animations, SPA Navigation, Slideshow
// ============================================================

/* ========================
   NEURAL NETWORK CANVAS
   ======================== */
(function initGlobalCanvas() {
  const canvas = document.getElementById('globalCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let nodes = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); initNodes(); });

  function initNodes() {
    nodes = [];
    const count = Math.min(150, Math.floor((window.innerWidth * window.innerHeight) / 8000));
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        r: Math.random() * 2.5 + 1.0
      });
    }
  }
  initNodes();

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 212, 255, 0.8)';
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(0, 212, 255, 1)';
      ctx.fill();
    });
    ctx.shadowBlur = 0; // reset for lines
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
        if (d < 180) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${0.45 * (1 - d / 180)})`;
          ctx.lineWidth = 1.0;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ========================
   SPA NAVIGATION
   ======================== */
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-links a[data-page]');
const hamburger = document.querySelector('.nav-hamburger');
const navLinksMenu = document.querySelector('.nav-links');

function showPage(pageId) {
  pages.forEach(p => p.classList.remove('active'));
  navLinks.forEach(l => l.classList.remove('active'));
  const target = document.getElementById('page-' + pageId);
  if (target) { target.classList.add('active'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  const activeLink = document.querySelector(`.nav-links a[data-page="${pageId}"]`);
  if (activeLink) activeLink.classList.add('active');
  // re-trigger animations
  if (typeof triggerFadeUps === 'function') triggerFadeUps();
  // Close mobile nav
  if (navLinksMenu) navLinksMenu.classList.remove('open');
  if (hamburger) hamburger.classList.remove('open');
  document.body.classList.remove('nav-open');
}

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    showPage(link.dataset.page);
  });
});

// Also nav-action buttons in pages
document.addEventListener('click', e => {
  if (e.target.dataset && e.target.dataset.navTo) { 
    e.preventDefault();
    showPage(e.target.dataset.navTo); 
  }
});

// Init
showPage('home');

/* ========================
   HAMBURGER MENU
   ======================== */
if (hamburger) {
  hamburger.addEventListener('click', () => {
    if (navLinksMenu) navLinksMenu.classList.toggle('open');
    hamburger.classList.toggle('open');
    document.body.classList.toggle('nav-open');
  });
}

/* ========================
   NAVBAR SCROLL EFFECT
   ======================== */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
  // Scroll top button
  const st = document.querySelector('.scroll-top');
  if (st) { if (window.scrollY > 300) st.classList.add('show'); else st.classList.remove('show'); }
}, { passive: true });

/* ========================
   SCROLL TO TOP
   ======================== */
const scrollTopBtn = document.querySelector('.scroll-top');
if (scrollTopBtn) scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ========================
   HERO SLIDESHOW
   ======================== */
(function initSlideshow() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slide-dot');
  if (!slides.length) return;
  let current = 0, timer = null;

  function goTo(n) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function autoPlay() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5000);
  }

  dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); autoPlay(); }));

  const prevArr = document.getElementById('slidePrev');
  const nextArr = document.getElementById('slideNext');
  if (prevArr) prevArr.addEventListener('click', () => { goTo(current - 1); autoPlay(); });
  if (nextArr) nextArr.addEventListener('click', () => { goTo(current + 1); autoPlay(); });

  slides[0].classList.add('active');
  if (dots[0]) dots[0].classList.add('active');
  autoPlay();
})();

/* ========================
   COUNTER ANIMATION
   ======================== */
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  let current = 0;
  const increment = Math.ceil(target / 60);
  const timer = setInterval(() => {
    current = Math.min(current + increment, target);
    el.textContent = current + suffix;
    if (current >= target) clearInterval(timer);
  }, 25);
}

/* ========================
   INTERSECTION OBSERVER
   ======================== */
function triggerFadeUps() {
  const fadeEls = document.querySelectorAll('.fade-up');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  fadeEls.forEach(el => { el.classList.remove('visible'); io.observe(el); });

  // Counter observer
  const counters = document.querySelectorAll('[data-target]');
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); cio.unobserve(e.target); } });
  }, { threshold: 0.5 });
  counters.forEach(el => cio.observe(el));
}
triggerFadeUps();

/* ========================
   FLOATING ROBOT TOOLTIP
   ======================== */
const floatRobot = document.getElementById('floatRobot');
if (floatRobot) {
  floatRobot.addEventListener('click', () => {
    showPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ========================
   NEWS TICKER
   ======================== */
(function initTicker() {
  const ticker = document.getElementById('newsTicker');
  if (!ticker) return;
  const items = ticker.querySelectorAll('.ticker-item');
  let idx = 0;
  items[0].classList.add('active');
  setInterval(() => {
    items[idx].classList.remove('active');
    idx = (idx + 1) % items.length;
    items[idx].classList.add('active');
  }, 3500);
})();

/* ========================
   GLITCH TEXT EFFECT
   ======================== */
const glitchEls = document.querySelectorAll('.glitch');
glitchEls.forEach(el => {
  el.setAttribute('data-text', el.textContent);
});
