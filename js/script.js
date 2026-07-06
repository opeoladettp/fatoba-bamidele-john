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
const heroParallax = document.querySelector('.hero-left');
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

/* ─── Contact Form — Formsend Integration ─────────── */
const FORMSEND_ENDPOINT = 'https://api.formsend.ezeroandone.io/submit';
const FORMSEND_API_KEY  = 'YOUR_API_KEY'; // ← replace with your key from the dashboard

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn   = contactForm.querySelector('[type="submit"]');
    const originalHTML = submitBtn.innerHTML;

    // Pull field values
    const name    = contactForm.querySelector('[name="name"]').value.trim();
    const email   = contactForm.querySelector('[name="email"]').value.trim();
    const message = contactForm.querySelector('[name="message"]').value.trim();
    const company = contactForm.querySelector('[name="company"]').value.trim();
    const service = contactForm.querySelector('[name="service"]').value;
    const budget  = contactForm.querySelector('[name="budget"]').value;

    // Build a meaningful subject line from the service field
    const serviceLabel = service
      ? contactForm.querySelector(`[name="service"] option[value="${service}"]`)?.textContent ?? service
      : 'General Enquiry';
    const subject = `New Enquiry — ${serviceLabel} | ${name}`;

    // Loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="material-symbols-outlined" style="animation:spin 1s linear infinite;display:inline-block">progress_activity</span> Sending…`;
    hideFormFeedback();

    try {
      const res = await fetch(FORMSEND_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: FORMSEND_API_KEY,
          name,
          email,
          subject,
          message,
          // Extra fields forwarded as additional rows in the email
          ...(company && { 'Company / Brand': company }),
          ...(service && { 'Service Requested': serviceLabel }),
          ...(budget  && { 'Project Budget': budget }),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showFormFeedback('success', 'check_circle', "Message sent! I'll be in touch within 24 hours.");
        contactForm.reset();
        setTimeout(() => hideFormFeedback(), 8000);
      } else {
        // Surface the API's human-readable error message
        const errMsg = data.message || 'Something went wrong. Please try again.';
        showFormFeedback('error', 'error', errMsg);
      }
    } catch (err) {
      // Network failure / no connection
      showFormFeedback('error', 'wifi_off', 'Could not connect. Please check your internet and try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHTML;
    }
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

/* ─── Lookbook Filtering ─── */
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

if (filterBtns.length > 0 && galleryItems.length > 0) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button styling
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.dataset.filter;

      galleryItems.forEach(item => {
        const category = item.dataset.category;

        if (filterValue === 'all' || category === filterValue) {
          item.classList.remove('hidden');
          // Short delay to allow layout recalculation before transitioning opacity/scale
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
            item.style.pointerEvents = 'all';
          }, 20);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          item.style.pointerEvents = 'none';
          setTimeout(() => {
            if (item.style.opacity === '0') {
              item.classList.add('hidden');
            }
          }, 400); // matches --duration-mid which is 400ms
        }
      });
    });
  });
}

/* ─── Lightbox Details Modal ─── */
const lightbox = document.getElementById('lightbox-modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalCollection = document.getElementById('modal-collection-label');
const modalDesc = document.getElementById('modal-desc');
const modalFabric = document.getElementById('modal-spec-fabric');
const modalDetails = document.getElementById('modal-spec-details');
const modalFit = document.getElementById('modal-spec-fit');
const modalCraft = document.getElementById('modal-spec-craft');
const modalClose = document.getElementById('modal-close');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalInquireBtn = document.getElementById('modal-inquire-btn');

function openLightbox(item) {
  if (!lightbox) return;

  // Bind values from data attributes
  modalImg.src = item.dataset.image;
  modalImg.alt = item.querySelector('img') ? item.querySelector('img').alt : item.dataset.title;
  modalTitle.textContent = item.dataset.title;
  modalCollection.textContent = item.dataset.collection;
  modalDesc.textContent = item.dataset.desc;
  
  modalFabric.textContent = item.dataset.specFabric;
  modalDetails.textContent = item.dataset.specDetails;
  modalFit.textContent = item.dataset.specFit;
  modalCraft.textContent = item.dataset.specCraft;

  // Show modal
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Attach lookbook item click listeners
if (galleryItems.length > 0) {
  galleryItems.forEach(item => {
    item.addEventListener('click', () => openLightbox(item));
    
    // Accessibility: handle Enter or Space keys for keyboard users
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(item);
      }
    });
  });
}

// Close events
if (modalClose) {
  modalClose.addEventListener('click', closeLightbox);
}
if (modalBackdrop) {
  modalBackdrop.addEventListener('click', closeLightbox);
}

// Close on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox && lightbox.classList.contains('open')) {
    closeLightbox();
  }
});

// Inquiry Form Auto-filler
if (modalInquireBtn) {
  modalInquireBtn.addEventListener('click', () => {
    const garmentTitle = modalTitle.textContent;
    const serviceSelect = document.getElementById('contact-service');
    const messageField = document.getElementById('contact-message');
    const contactSection = document.getElementById('contact');

    // 1. Select the "Garment Construction & Bespoke" service
    if (serviceSelect) {
      serviceSelect.value = 'garment-construction';
    }

    // 2. Pre-fill custom inquiry details
    if (messageField) {
      messageField.value = `Hi Fatoba,\n\nI am interested in requesting a bespoke fitting for: "${garmentTitle}" from your Atelier Lookbook. Please let me know your availability for an initial design consultation and fitting schedule.\n\nThank you!`;
    }

    // 3. Close the modal
    closeLightbox();

    // 4. Scroll smoothly to contact section
    if (contactSection) {
      setTimeout(() => {
        const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 80;
        const offsetTop = contactSection.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        
        // Focus the name field to guide the user's next action
        const nameField = document.getElementById('contact-name');
        if (nameField) nameField.focus();
      }, 350);
    }
  });
}

/* ─── Init ───────────────────────────────────────── */
(function init() {
  updateHeader(window.scrollY);
  updateBackToTop(window.scrollY);
  updateActiveNav(window.scrollY);
})();
