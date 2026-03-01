/**
 * Apex Plumbing Co. — Frontend JavaScript
 * ════════════════════════════════════════════════════════
 * Handles interactive elements on the website:
 *   1. Mobile navigation menu (hamburger toggle)
 *   2. Active nav link highlighting based on current page
 *   3. Form submission — POSTs JSON to the backend API
 *   4. Success page initialisation — reads ?type= URL param
 *   5. Smooth scroll for anchor links
 *
 * This is plain "vanilla" JavaScript — no libraries needed.
 * It runs after the entire HTML page has loaded.
 */

document.addEventListener('DOMContentLoaded', function () {

  // ─── 1. MOBILE MENU TOGGLE ─────────────────────────────────────────
  //
  // On small screens, the nav links are hidden in a collapsible menu.
  // Clicking the hamburger button (≡) opens and closes that menu.

  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon   = document.getElementById('menu-icon');

  if (menuToggle && mobileMenu) {

    // Toggle menu open/closed when hamburger button is clicked
    menuToggle.addEventListener('click', function (e) {
      e.stopPropagation(); // prevent the document click handler below from firing
      const isOpen = !mobileMenu.classList.contains('hidden');

      if (isOpen) {
        mobileMenu.classList.add('hidden');
        menuIcon.classList.replace('fa-times', 'fa-bars');   // ✕ → ≡
        menuToggle.setAttribute('aria-expanded', 'false');
      } else {
        mobileMenu.classList.remove('hidden');
        menuIcon.classList.replace('fa-bars', 'fa-times');   // ≡ → ✕
        menuToggle.setAttribute('aria-expanded', 'true');
      }
    });

    // Close the menu if the user clicks anywhere outside of it
    document.addEventListener('click', function () {
      if (!mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        menuIcon.classList.replace('fa-times', 'fa-bars');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }


  // ─── 2. ACTIVE NAV LINK DETECTION ──────────────────────────────────
  //
  // Highlights the current page's nav link.
  // All nav links have a data-nav attribute (e.g. data-nav="about").
  // JS checks window.location.pathname and applies the active style.

  const path = window.location.pathname;

  // Map data-nav key → the filename to match in the URL
  const navHrefs = {
    index:    'index.html',
    services: 'services.html',
    about:    'about.html',
    contact:  'contact.html',
    quote:    'quote.html',
  };

  document.querySelectorAll('[data-nav]').forEach(function (link) {
    const key  = link.dataset.nav;
    const href = navHrefs[key];
    if (!href) return;

    // The home page matches either "/" or "/index.html"
    const isHome   = key === 'index' && (path === '/' || path.endsWith('/'));
    const isActive = isHome || path.endsWith(href);

    if (isActive) {
      // Remove inactive + hover classes, apply active classes
      link.classList.remove('text-slate-600', 'hover:text-blue-700', 'hover:bg-slate-50');
      link.classList.add('text-blue-700', 'bg-blue-50');
    }
  });


  // ─── 3. FORM SUBMISSION ─────────────────────────────────────────────
  //
  // Intercepts form submits, sends data as JSON to the backend API,
  // then redirects to success.html?type=... on success
  // or shows an inline error banner inside the form on failure.

  function submitForm(endpoint, formId, successType) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const statusEl = document.getElementById('form-status');
      const btn      = form.querySelector('button[type="submit"]');
      const btnHtml  = btn ? btn.innerHTML : '';

      // Show loading state
      if (btn) {
        btn.disabled  = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending…';
      }
      if (statusEl) statusEl.innerHTML = '';

      // Collect form fields into a plain object
      const data = Object.fromEntries(new FormData(form).entries());

      try {
        const res  = await fetch('http://localhost:5000' + endpoint, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(data),
        });
        const json = await res.json();

        if (json.ok) {
          window.location.href = 'success.html?type=' + successType;
        } else {
          showFormError(statusEl, json.error || 'Something went wrong. Please try again.');
          if (btn) { btn.disabled = false; btn.innerHTML = btnHtml; }
        }
      } catch (err) {
        showFormError(
          statusEl,
          'Could not connect to the server. Please call us at (212) 555-0180.'
        );
        if (btn) { btn.disabled = false; btn.innerHTML = btnHtml; }
      }
    });
  }

  function showFormError(el, message) {
    if (!el) return;
    el.innerHTML =
      '<div class="flex items-start gap-3 p-4 rounded-xl border ' +
      'bg-red-50 text-red-800 border-red-200 mb-4">' +
      '<i class="fas fa-exclamation-circle text-red-500 mt-0.5"></i>' +
      '<span>' + message + '</span>' +
      '</div>';
  }

  // Register handlers if the forms exist on this page
  submitForm('/api/contact', 'contact-form', 'contact');
  submitForm('/api/quote',   'quote-form',   'quote');


  // ─── 4. SUCCESS PAGE INIT ───────────────────────────────────────────
  //
  // success.html reads the ?type= URL param to show the right message.
  // Default content is for type=contact; JS overrides for type=quote.

  if (document.getElementById('success-page')) {
    const params = new URLSearchParams(window.location.search);
    const type   = params.get('type') || 'contact';

    if (type === 'quote') {
      const titleEl = document.getElementById('success-title');
      const bodyEl  = document.getElementById('success-body');
      const step3El = document.getElementById('success-step3');

      if (titleEl) titleEl.textContent = 'Quote Request Received!';
      if (bodyEl) {
        bodyEl.innerHTML =
          'Thank you for requesting a free quote. We\'ll review your project details and ' +
          'get back to you with a price within <strong>2 hours</strong> during business hours.';
      }
      if (step3El) {
        step3El.textContent = 'We confirm a price and schedule a time that works for you.';
      }
    }
    // type=contact is the default — content is already in the HTML
  }


  // ─── 5. SMOOTH SCROLL FOR ANCHOR LINKS ─────────────────────────────
  //
  // If a link points to a section on the same page (e.g. href="#services"),
  // scroll there smoothly instead of jumping instantly.

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
