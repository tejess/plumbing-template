// Base URL for the Flask REST API.
// In development, REACT_APP_API_URL is unset → empty string → CRA proxy forwards to localhost:5000.
// In production (Vercel), falls back to the Render backend URL.
const API_BASE =
    process.env.REACT_APP_API_URL || 'https://plumbing-template.onrender.com';

export default API_BASE;
