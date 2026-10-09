/* ============================================================
   Dr. Abhijeet R Nalkar — Main Script
   ============================================================ */
(function () {
  'use strict';
/* ---------- MOBILE MENU FALLBACK — Generate if missing ---------- */
(function generateMobileMenuIfMissing() {
  const existing = document.querySelector('[data-mobile-menu]');
  if (existing) return; // Already exists, skip

  // Build mobile menu HTML
  const navItems = [
    { href: 'about.html', label: 'About' },
    { href: 'treatments.html', label: 'Treatments' },
    { href: 'locations.html', label: 'Locations' },
    { href: 'faq.html', label: 'FAQ' },
    { href: 'blog.html', label: 'Blog' },
    { href: 'contact.html', label: 'Contact' }
  ];

  const linksHTML = navItems.map(item =>
    `<a href="${item.href}">${item.label}</a>`
  ).join('');

  const menuHTML = `
    <div class="mobile-menu" id="mobile-menu" data-mobile-menu aria-hidden="true" role="dialog" aria-modal="true" aria-label="Main menu">
      <div class="mobile-menu-backdrop" data-menu-backdrop></div>
      <div class="mobile-menu-panel">
        <div class="mobile-menu-header">
          <a href="index.html" class="logo">
            <span class="logo-mark"><img src="images/logo.png" alt="" /></span>
            <span class="logo-text"><strong>Dr. Nalkar</strong><span>Orthopaedic Clinic</span></span>
          </a>
          <button class="mobile-menu-close" type="button" data-menu-close aria-label="Close menu">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          </button>
        </div>
        <nav class="mobile-menu-nav" aria-label="Mobile">
          ${linksHTML}
        </nav>
        <div class="mobile-menu-footer">
          <a href="appointment.html" class="btn btn-primary btn-block btn-lg">Book Appointment</a>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', menuHTML);
})();
  /* ---------- HEADER SCROLL ---------- */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 12) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- MOBILE MENU (with touch support) ---------- */
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const menuClose = document.querySelector('[data-menu-close]');

  function openMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  }

  if (menuToggle) {
    const handleToggle = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = mobileMenu && mobileMenu.classList.contains('open');
      if (isOpen) closeMenu();
      else openMenu();
    };

    menuToggle.addEventListener('click', handleToggle);
    menuToggle.addEventListener('touchstart', handleToggle, { passive: false });
  }

  if (menuClose) {
    menuClose.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeMenu();
    });
  }

  const backdrop = document.querySelector('[data-menu-backdrop]');
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', closeMenu);
    });
  }

  /* ---------- DOCTOR POPUP — Tap to Toggle (Mobile) ---------- */
  const doctorPhoto = document.querySelector('.doctor-photo-wrap');
  if (doctorPhoto) {
    doctorPhoto.addEventListener('click', (e) => {
      // Only on touch devices (mobile/tablet)
      if (window.matchMedia('(hover: none)').matches) {
        // Don't toggle if user clicked the "Book Appointment" link inside popup
        if (e.target.closest('.popup-cta')) return;
        e.preventDefault();
        doctorPhoto.classList.toggle('popup-open');
      }
    });

    // Close popup when clicking outside (mobile)
    document.addEventListener('click', (e) => {
      if (!window.matchMedia('(hover: none)').matches) return;
      if (!doctorPhoto.contains(e.target) && doctorPhoto.classList.contains('popup-open')) {
        doctorPhoto.classList.remove('popup-open');
      }
    });
  }

  /* ---------- TREATMENT EXPLORER (tabs) ---------- */
  const explorer = document.querySelector('[data-explorer]');
  if (explorer) {
    const tabs = explorer.querySelectorAll('[role="tab"]');
    const panels = explorer.querySelectorAll('[role="tabpanel"]');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.setAttribute('aria-selected', 'false'));
        tab.setAttribute('aria-selected', 'true');
        const target = tab.getAttribute('aria-controls');
        panels.forEach((p) => { p.hidden = p.id !== target; });
      });
    });
  }

  /* ---------- FAQ ACCORDION ---------- */
  document.querySelectorAll('[data-faq-trigger]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const panel = trigger.nextElementSibling;
      if (!panel) return;
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      const list = trigger.closest('.faq-list');
      if (list) {
        list.querySelectorAll('[data-faq-trigger]').forEach((t) => {
          if (t !== trigger) {
            t.setAttribute('aria-expanded', 'false');
            const p = t.nextElementSibling;
            if (p) p.classList.remove('open');
          }
        });
      }
      trigger.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      panel.classList.toggle('open', !isOpen);
    });
  });

    /* ---------- APPOINTMENT FORM → WHATSAPP ---------- */
  const form = document.querySelector('[data-appointment-form]');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.querySelector('#name');
      const mobile = form.querySelector('#mobile');
      const errors = {};

      // Validation
      if (!name.value.trim()) errors.name = 'Please enter your name.';

      const mobileVal = mobile.value.trim();
      if (!mobileVal) errors.mobile = 'Please enter your mobile number.';
      else if (!/^[+\d\s-]{7,15}$/.test(mobileVal))
        errors.mobile = 'Please enter a valid mobile number.';

      // Clear previous errors
      form.querySelectorAll('.error').forEach((el) => el.remove());
      [name, mobile].forEach((el) => el.removeAttribute('aria-invalid'));

      if (Object.keys(errors).length) {
        Object.entries(errors).forEach(([key, msg]) => {
          const input = form.querySelector('#' + key);
          if (!input) return;
          input.setAttribute('aria-invalid', 'true');
          const errorEl = document.createElement('p');
          errorEl.className = 'error';
          errorEl.id = key + '-error';
          errorEl.textContent = msg;
          input.setAttribute('aria-describedby', key + '-error');
          input.parentElement.appendChild(errorEl);
        });
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Collect form data
      const data = {
        name: form.querySelector('#name')?.value.trim() || '',
        mobile: form.querySelector('#mobile')?.value.trim() || '',
        location: form.querySelector('#location')?.value || 'Not specified',
        date: form.querySelector('#date')?.value || 'Not specified',
        time: form.querySelector('#time')?.value || 'Not specified',
        concern: form.querySelector('#concern')?.value || 'Not specified',
        message: form.querySelector('#message')?.value.trim() || 'No message'
      };

      // Build WhatsApp message
      const waNumber = form.dataset.whatsapp || '919999999999';
      const text =
        `*New Appointment Request*%0A%0A` +
        `*Name:* ${encodeURIComponent(data.name)}%0A` +
        `*Mobile:* ${encodeURIComponent(data.mobile)}%0A` +
        `*Preferred Location:* ${encodeURIComponent(data.location)}%0A` +
        `*Preferred Date:* ${encodeURIComponent(data.date)}%0A` +
        `*Preferred Time:* ${encodeURIComponent(data.time)}%0A` +
        `*Treatment/Concern:* ${encodeURIComponent(data.concern)}%0A` +
        `*Message:* ${encodeURIComponent(data.message)}`;

      const waURL = `https://wa.me/${waNumber}?text=${text}`;

      // Show success message
      const success = document.createElement('div');
      success.className = 'form-success';
      success.setAttribute('role', 'status');
      success.setAttribute('aria-live', 'polite');
      success.innerHTML =
        '<h3>Thank You...</h3>' +
        '<p>Your details are ready to send. If WhatsApp does not open automatically, ' +
        '<a href="' + waURL + '" target="_blank" rel="noopener noreferrer">click here to send</a>.</p>';
      form.replaceWith(success);

      // Open WhatsApp
      window.open(waURL, '_blank');
    });
  }

  /* ---------- SCROLL REVEAL ---------- */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const revealEls = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '-80px 0px', threshold: 0.05 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- YEAR ---------- */
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();

  /* ---------- PRESS IMAGE LIGHTBOX ---------- */
  const pressImages = document.querySelectorAll('.press-image img');
  if (pressImages.length) {
    // Create lightbox element
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <span class="lightbox-close" aria-label="Close">&times;</span>
      <img src="" alt="" />
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');

    pressImages.forEach((img) => {
      img.parentElement.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('open');
        document.body.classList.add('no-scroll');
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      document.body.classList.remove('no-scroll');
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }