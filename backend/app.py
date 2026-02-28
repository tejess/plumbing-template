"""
Apex Plumbing Co. — Flask Backend
==================================

This file is the "brain" of the web server. It:
  1. Defines all URL routes (which page appears at which address)
  2. Handles contact/quote form submissions and sends emails via SMTP
  3. Renders HTML templates using Flask's built-in Jinja2 engine

HOW TO RUN:
  1. Copy .env.example → .env and fill in your email credentials
  2. pip install -r requirements.txt
  3. flask run   (or: python app.py)
  4. Open http://127.0.0.1:5000 in your browser
"""

import os
from flask import Flask, render_template, request, redirect, url_for, flash
from flask_mail import Mail, Message
from dotenv import load_dotenv

# Load variables from the .env file into the environment.
# This keeps secrets (email password, etc.) out of your source code.
load_dotenv()

# ─── App Setup ────────────────────────────────────────────────────────────────

app = Flask(__name__)

# Secret key is required for Flask's flash message system.
# Change this to any random string in production.
app.secret_key = os.environ.get('SECRET_KEY', 'apex-dev-secret-change-me')

# ─── Email (SMTP) Configuration ───────────────────────────────────────────────
# Flask-Mail reads these settings to know how to send emails.
# All values come from your .env file (see .env.example).
# For Gmail: enable "App Passwords" in Google account → use the 16-char password.

app.config['MAIL_SERVER']         = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT']           = int(os.environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS']        = True
app.config['MAIL_USE_SSL']        = False
app.config['MAIL_USERNAME']       = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD']       = os.environ.get('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_USERNAME')

mail = Mail(app)

# The inbox that receives all form submission emails
RECIPIENT_EMAIL = os.environ.get('RECIPIENT_EMAIL') or os.environ.get('MAIL_USERNAME')


# ─── Routes ───────────────────────────────────────────────────────────────────
# A "route" maps a URL path to a Python function.
# When someone visits /about, Flask calls the about() function
# which returns the rendered HTML for that page.

@app.route('/')
def index():
    """Home page — hero, services preview, reviews, FAQ, CTA banner."""
    return render_template('index.html')


@app.route('/about')
def about():
    """About Us page — company history, team, values."""
    return render_template('about.html')


@app.route('/services')
def services():
    """Services page — full grid of all plumbing services."""
    return render_template('services.html')


@app.route('/contact', methods=['GET', 'POST'])
def contact():
    """
    Contact page.
    GET  → Show the empty contact form.
    POST → Read the submitted data and send an email.
    """
    if request.method == 'POST':
        name    = request.form.get('name', '').strip()
        email   = request.form.get('email', '').strip()
        phone   = request.form.get('phone', '').strip()
        message = request.form.get('message', '').strip()

        if not name or not email or not message:
            flash('Please fill in all required fields.', 'error')
            return render_template('contact.html')

        try:
            msg = Message(
                subject=f'New Contact Form Submission — {name}',
                recipients=[RECIPIENT_EMAIL],
                body=f"""New message from the Apex Plumbing website:

Name:     {name}
Email:    {email}
Phone:    {phone if phone else 'Not provided'}

Message:
{message}
"""
            )
            mail.send(msg)
            return redirect(url_for('success', form_type='contact'))

        except Exception as e:
            flash(
                f'Message could not be sent — please call us at (212) 555-0180. (Error: {e})',
                'error'
            )
            return render_template('contact.html')

    return render_template('contact.html')


@app.route('/quote', methods=['GET', 'POST'])
def quote():
    """
    Free Quote page.
    Same as /contact but includes a service-type dropdown field.
    """
    if request.method == 'POST':
        name    = request.form.get('name', '').strip()
        email   = request.form.get('email', '').strip()
        phone   = request.form.get('phone', '').strip()
        service = request.form.get('service', '').strip()
        message = request.form.get('message', '').strip()

        if not name or not email or not message:
            flash('Please fill in all required fields.', 'error')
            return render_template('quote.html')

        try:
            msg = Message(
                subject=f'Free Quote Request — {name}',
                recipients=[RECIPIENT_EMAIL],
                body=f"""New quote request from the Apex Plumbing website:

Name:     {name}
Email:    {email}
Phone:    {phone if phone else 'Not provided'}
Service:  {service if service else 'Not specified'}

Project Details:
{message}
"""
            )
            mail.send(msg)
            return redirect(url_for('success', form_type='quote'))

        except Exception as e:
            flash(
                f'Request could not be sent — please call us at (212) 555-0180. (Error: {e})',
                'error'
            )
            return render_template('quote.html')

    return render_template('quote.html')


@app.route('/success')
def success():
    """Thank-you page shown after a successful form submission."""
    form_type = request.args.get('form_type', 'contact')
    return render_template('success.html', form_type=form_type)


# ─── Entry Point ──────────────────────────────────────────────────────────────

if __name__ == '__main__':
    # debug=True auto-reloads on file save — great for development.
    # Never use debug=True on a live production server.
    app.run(debug=True)