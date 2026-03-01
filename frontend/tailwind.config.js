/**
 * Tailwind CSS Configuration
 * ════════════════════════════════════════════════════════
 * Scans frontend HTML files and JS for Tailwind class names.
 * Only includes CSS for classes actually used — keeps output small.
 *
 * Run `npm run build` (in this folder) to compile the CSS.
 * Output: frontend/css/tailwind.css
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Scan all HTML files in the frontend
    "./*.html",
    // Scan JavaScript files too (in case they add classes dynamically)
    "./js/**/*.js",
    './src/**/*.{html,js}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
