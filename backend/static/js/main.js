/**
 * Apex Plumbing Co. — Frontend JavaScript
 * ════════════════════════════════════════════════════════
 * Handles interactive elements on the website:
 *   1. Mobile navigation menu (hamburger toggle)
 *   2. Auto-dismiss flash messages after 5 seconds
 *   3. Smooth scroll for anchor links
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


  // ─── 2. AUTO-DISMISS FLASH MESSAGES ────────────────────────────────
  //
  // Flask "flash" messages (success/error alerts) automatically fade out
  // after 5 seconds so they don't clutter the page permanently.

  document.querySelectorAll('.flash-message').forEach(function (msg) {
    setTimeout(function () {
      msg.style.transition = 'opacity 0.5s ease';
      msg.style.opacity    = '0';
      setTimeout(function () { msg.remove(); }, 500); // remove after fade
    }, 5000); // wait 5 seconds before starting fade
  });


  // ─── 3. SMOOTH SCROLL FOR ANCHOR LINKS ─────────────────────────────
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
