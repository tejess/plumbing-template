# Apex Plumbing Co. — Website

A professional plumbing company website built with **Flask** (backend) and **Node.js + Tailwind CSS** (frontend tooling).

---

## What This Site Includes

| Page | URL | Description |
|---|---|---|
| Home | `/` | Hero banner, services preview, customer reviews, FAQ |
| Services | `/services` | Full grid of all plumbing services offered |
| About Us | `/about` | Company story, team, and values |
| Contact | `/contact` | Contact form that sends an email |
| Free Quote | `/quote` | Quote request form |
| Success | `/success` | Thank-you page after form submission |

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Backend | **Python / Flask** | Serves pages, handles form submissions, sends email |
| Templating | **Jinja2** (built into Flask) | Fills variables into HTML templates |
| Styling | **Tailwind CSS** | Utility-first CSS framework (classes directly in HTML) |
| Build Tool | **Node.js / npm** | Compiles Tailwind CSS into a single optimised stylesheet |
| Icons | **Font Awesome** (CDN) | Phone, envelope, wrench, star icons, etc. |
| Fonts | **Google Fonts — Inter** (CDN) | Clean, professional typeface |

---

## Project Structure

```
plumbing-template/
│
├── backend/                        ← Flask application lives here
│   ├── app.py                      ← Main server: routes + email logic
│   ├── requirements.txt            ← Python package list
│   ├── .env.example                ← Template for your secret config
│   ├── .env                        ← YOUR secrets (never commit this!)
│   │
│   ├── templates/                  ← HTML pages (Jinja2 templates)
│   │   ├── base.html               ← Shared layout: top bar, nav, footer
│   │   ├── index.html              ← Home page
│   │   ├── about.html              ← About Us page
│   │   ├── services.html           ← Services page
│   │   ├── contact.html            ← Contact form page
│   │   ├── quote.html              ← Free Quote form page
│   │   └── success.html            ← Thank-you page after form submit
│   │
│   └── static/                     ← Files served directly to the browser
│       ├── css/
│       │   ├── tailwind.css        ← Compiled by Node (don't edit this)
│       │   └── style.css           ← Custom styles (safe to edit)
│       └── js/
│           └── main.js             ← Vanilla JS: mobile menu, scroll effects
│
└── frontend/                       ← Node.js build tooling lives here
    ├── package.json                ← npm scripts and dependencies
    ├── tailwind.config.js          ← Tailwind configuration
    └── src/
        ├── css/input.css           ← Tailwind source (feeds into build)
        └── js/main.js              ← JS source (copied to backend/static)
```

---

## One-Time Setup

### Prerequisites
- Python 3.9+ installed
- Node.js installed (see below if not)

### Step 1 — Install Python dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Step 2 — Configure your email credentials

```bash
# In the backend/ folder:
cp .env.example .env
```

Open `.env` in any text editor and fill in your values:

```
SECRET_KEY=any-random-string-you-make-up
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-16-char-app-password
RECIPIENT_EMAIL=inbox-that-gets-the-forms@gmail.com
```

> **Gmail users:** You need an "App Password", not your regular Gmail password.
> Go to [myaccount.google.com](https://myaccount.google.com) → Security → 2-Step Verification → App Passwords → generate one for "Mail".

### Step 3 — Install Node.js dependencies and build CSS

```bash
cd frontend
npm install
npm run build
```

This compiles Tailwind CSS and writes it to `backend/static/css/tailwind.css`.

---

## Running the Site

```bash
cd backend
flask run
```

Then open **http://127.0.0.1:5000** in your browser.

---

## Development Workflow

If you're actively editing HTML templates and want CSS to update automatically:

**Terminal 1 — Flask server:**
```bash
cd backend
flask run
```

**Terminal 2 — Tailwind CSS watcher:**
```bash
cd frontend
npm run dev
```

The watcher re-compiles CSS every time you save a template file. Refresh your browser to see changes.

---

## Node.js Not Installed?

If you don't have Node.js, install it via `nvm` (Node Version Manager):

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Restart your terminal, then install Node
nvm install --lts

# Verify it worked
node --version   # should print v20.x or higher
npm --version
```

---

## Customising the Site

### Change company name, phone, or email
All contact details are in `backend/templates/base.html` (the shared layout).
Search for `Apex Plumbing` or `(212) 555-0180` and replace with your real info.

### Add or remove services
Edit `backend/templates/services.html` and `backend/templates/index.html`.
Each service is its own HTML block — copy, paste, and edit the text.

### Edit the About page
All company story text is in `backend/templates/about.html`.

### Change colours
Colours are Tailwind utility classes in the HTML (e.g. `bg-blue-900`, `text-blue-600`).
Refer to the [Tailwind colour palette](https://tailwindcss.com/docs/customizing-colors) to pick alternatives.

---

## Understanding Jinja2 Templates

Flask uses a templating language called **Jinja2**. Here's a quick reference:

| Syntax | Meaning |
|---|---|
| `{{ variable }}` | Print a variable's value |
| `{% for x in list %}` | Loop over a list |
| `{% if condition %}` | Conditional block |
| `{% block content %}` | A named slot child pages fill in |
| `{% extends "base.html" %}` | Use `base.html` as the layout |
| `{{ url_for('index') }}` | Generate the URL for the `index` route in `app.py` |

---

## Common Issues

**`flask: command not found`**
Make sure you installed requirements: `pip install -r requirements.txt`

**CSS not loading / site looks unstyled**
Run `npm run build` in the `frontend/` folder to compile the stylesheet.

**Email form not sending**
- Check your `.env` file has the correct Gmail App Password
- Make sure 2-Step Verification is enabled on your Google account
- Check the error message shown on screen — it will say what went wrong

**`npm: command not found`**
Node.js is not in your PATH. Run:
```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh"
```
Then try `npm` again. Add that line to your `~/.zshrc` to make it permanent.