/**
 * FATOBA BAMIDELE JOHN — Personal Brand Website
 * script.js | Version 1.0
 */

'use strict';

/* ─── Constants ──────────────────────────────────── */
const HEADER_SCROLL_THRESHOLD = 60;
const PARALLAX_STRENGTH_BG    = 0.35;
const PARALLAX_STRENGTH_TEXT  = 0.12;
const REVEAL_THRESHOLD        = 0.14;

/* ─── DOM References ─────────────────────────────── */
const header      = document.getElementById('site-header');
const menuToggle  = document.getElementById('menu-toggle');
const mobileNav   = document.getElementById('mobile-nav');
const mobileLinks = mobileNav ? mobileNav.querySelectorAll('a') : [];
const backToTop   = document.getElementById('back-to-top');
const navLinks    = document.querySelectorAll('.nav-links a[href^="#"]');
const contactForm = document.getElementById('contact-form');
const formFeedback = document.getElementById('form-feedback');

/* Parallax elements */
const heroBg       = document.querySelector('.hero-bg');
const manifestoBg  = document.querySelector('.manifesto-bg');
const servicesBg   = document.querySelector('.services-bg');

/* Reveal elements */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

/* ─── Utility Functions ──────────────────────────── */
const lerp = (start, end, t) => start + (end - start) * t;
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

/* ─── Header Scroll Behavior ─────────────────────── */
let lastScrollY = 0;
let ticking = false;

function updateHeader(scrollY) {
  if (scrollY > HEADER_SCROLL_THRESHOLD) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

/* ─── Parallax Scroll ────────────────────────────── */
function updateParallax(scrollY) {
  // Hero background
  if (heroBg) {
    const offset = scrollY * PARALLAX_STRENGTH_BG;
    heroBg.style.transform = `translate3d(0, ${offset}px, 0)`;
  }

  // Hero text layer — subtle upward drift (applied to hero-left directly, animations are complete by scroll time)
  if (heroParallax) {
    const offset = scrollY * PARALLAX_STRENGTH_TEXT;
    heroParallax.style.transform = `translate3d(0, ${offset}px, 0)`;
  }

  // Manifesto background
  if (manifestoBg) {
    const manifestoSection = manifestoBg.closest('section');
    if (manifestoSection) {
      const rect = manifestoSection.getBoundingClientRect();
      const sectionOffset = -rect.top * PARALLAX_STRENGTH_BG;
      manifestoBg.style.transform = `translate3d(0, ${sectionOffset}px, 0)`;
    }
  }

  // Services background
  if (servicesBg) {
    const servicesSection = servicesBg.closest('section');
    if (servicesSection) {
      const rect = servicesSection.getBoundingClientRect();
      const sectionOffset = -rect.top * PARALLAX_STRENGTH_BG;
      servicesBg.style.transform = `translate3d(0, ${sectionOffset}px, 0)`;
    }
  }
}

/* ─── Back to Top ────────────────────────────────── */
function updateBackToTop(scrollY) {
  if (scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

/* ─── Scroll Event Handler ───────────────────────── */
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (!ticking) {
    requestAnimationFrame(() => {
      updateHeader(scrollY);
      updateParallax(scrollY);
      updateBackToTop(scrollY);
      checkReveal();
      updateActiveNav(scrollY);
      ticking = false;
    });
    ticking = true;
  }
  lastScrollY = scrollY;
}, { passive: true });

/* ─── Reveal on Scroll ───────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.05,
    rootMargin: '0px 0px 0px 0px',
  }
);

function checkReveal() {
  // Fallback for browsers without IntersectionObserver support
  revealEls.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const triggerY = window.innerHeight * (1 - REVEAL_THRESHOLD);
    if (rect.top < triggerY) {
      el.classList.add('revealed');
    }
  });
}

// Initialize IntersectionObserver for reveals
if ('IntersectionObserver' in window) {
  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  checkReveal();
}

// Immediately reveal anything already in view on load
document.addEventListener('DOMContentLoaded', () => {
  checkReveal();
});

/* ─── Active Nav Link ────────────────────────────── */
const sections = document.querySelectorAll('section[id]');

function updateActiveNav(scrollY) {
  let currentSection = '';
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    if (scrollY >= sectionTop) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

/* ─── Mobile Navigation ──────────────────────────── */
function openMobileNav() {
  mobileNav.classList.add('open');
  menuToggle.classList.add('open');
  menuToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
  mobileNav.classList.remove('open');
  menuToggle.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.contains('open');
    isOpen ? closeMobileNav() : openMobileNav();
  });
}

mobileLinks.forEach((link) => {
  link.addEventListener('click', closeMobileNav);
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
    closeMobileNav();
  }
});

/* ─── Smooth Scroll Navigation ───────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 80;
    const offsetTop = target.getBoundingClientRect().top + window.scrollY - headerH;
    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
  });
});

/* ─── Back to Top Button ─────────────────────────── */
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ─── Contact Form ───────────────────────────────── */
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="material-symbols-outlined" style="animation:spin 1s linear infinite;display:inline-block">progress_activity</span> Sending…`;

    // Simulate async form submission (replace with actual endpoint)
    await new Promise((resolve) => setTimeout(resolve, 1600));

    // Success feedback
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
    showFormFeedback('success', 'check_circle', 'Message sent! I\'ll be in touch within 24 hours.');
    contactForm.reset();

    // Hide feedback after 6 seconds
    setTimeout(() => hideFormFeedback(), 6000);
  });
}

function showFormFeedback(type, icon, message) {
  if (!formFeedback) return;
  formFeedback.className = `form-feedback ${type}`;
  formFeedback.innerHTML = `<span class="material-symbols-outlined icon-filled">${icon}</span> ${message}`;
}

function hideFormFeedback() {
  if (!formFeedback) return;
  formFeedback.className = 'form-feedback';
  formFeedback.innerHTML = '';
}

/* ─── Animated Count-up Numbers ─────────────────── */
function animateCount(el, target, duration = 1800, suffix = '+') {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start) + suffix;
    if (start >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    }
  }, 16);
}

// Observer for count-up animation
const countEls = document.querySelectorAll('[data-count]');
const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '+';
        animateCount(el, target, 1800, suffix);
        countObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 }
);

countEls.forEach((el) => countObserver.observe(el));

/* ─── Cursor Glow Effect ─────────────────────────── */
const cursor = document.createElement('div');
cursor.id = 'cursor-glow';
cursor.style.cssText = `
  position: fixed;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
  transform: translate(-50%, -50%);
  transition: opacity 0.3s ease;
  top: 0;
  left: 0;
`;
document.body.appendChild(cursor);

let cursorX = 0, cursorY = 0;
let cursorTargetX = 0, cursorTargetY = 0;

document.addEventListener('mousemove', (e) => {
  cursorTargetX = e.clientX;
  cursorTargetY = e.clientY;
});

function animateCursor() {
  cursorX = lerp(cursorX, cursorTargetX, 0.08);
  cursorY = lerp(cursorY, cursorTargetY, 0.08);
  cursor.style.left = cursorX + 'px';
  cursor.style.top = cursorY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Hide cursor glow on mobile
const isMobile = window.matchMedia('(max-width: 768px)');
if (isMobile.matches) cursor.style.display = 'none';

/* ─── CSS spin keyframe for loading ─────────────── */
const spinStyle = document.createElement('style');
spinStyle.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(spinStyle);

/* ─── Hover tilt effect on service cards ─────────── */
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;
    const rotX = clamp(((y - midY) / midY) * -4, -4, 4);
    const rotY = clamp(((x - midX) / midX) * 4, -4, 4);
    card.style.transform = `translateY(-8px) perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ─── Init ───────────────────────────────────────── */
(function init() {
  updateHeader(window.scrollY);
  updateBackToTop(window.scrollY);
  updateActiveNav(window.scrollY);
})();
