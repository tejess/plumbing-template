/**
 * Tailwind CSS Configuration
 * ════════════════════════════════════════════════════════
 * This tells Tailwind which files to scan for class names.
 * Tailwind only includes CSS for the classes it actually finds —
 * this keeps the final CSS file small and fast.
 *
 * Run `npm run build` (in this folder) to compile the CSS.
 * The output goes to: backend/static/css/tailwind.css
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Scan all HTML templates in the Flask backend
    '../backend/templates/**/*.html',
    // Scan JavaScript files too (in case they add classes dynamically)
    '../backend/static/js/**/*.js',
    './src/**/*.{html,js}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
