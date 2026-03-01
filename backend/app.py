"""
Apex Plumbing Co. — Flask Backend (JSON API)
=============================================

Pure JSON API server — no HTML, no templates.
All pages are served by the separate frontend static file server.

HOW TO RUN:
  1. Copy .env.example → .env and fill in your email credentials
  2. pip install -r requirements.txt
  3. flask run   (listens on http://127.0.0.1:5000)
  4. In a second terminal: cd ../frontend && python -m http.server 3000
  5. Open http://localhost:3000 in your browser

ENDPOINTS:
  POST /api/contact  →  { ok: true }  or  { ok: false, error: "..." }
  POST /api/quote    →  { ok: true }  or  { ok: false, error: "..." }
"""

import os
from flask import Flask, request, jsonify
from flask_mail import Mail, Message
from flask_cors import CORS
from dotenv import load_dotenv

# Load variables from the .env file into the environment.
load_dotenv()

# ─── App Setup ────────────────────────────────────────────────────────────────

app = Flask(__name__)

# Allow cross-origin requests from the frontend (port 3000)
CORS(app)

# ─── Email (SMTP) Configuration ───────────────────────────────────────────────

app.config['MAIL_SERVER']         = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT']           = int(os.environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS']        = True
app.config['MAIL_USE_SSL']        = False
app.config['MAIL_USERNAME']       = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD']       = os.environ.get('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_USERNAME')

mail = Mail(app)

RECIPIENT_EMAIL = os.environ.get('RECIPIENT_EMAIL') or os.environ.get('MAIL_USERNAME')


# ─── API Routes ───────────────────────────────────────────────────────────────

@app.route('/api/contact', methods=['POST'])
def api_contact():
    """
    Accepts a JSON body with name, email, phone, message.
    Sends an email and returns { ok: true } on success.
    """
    data    = request.get_json(force=True, silent=True) or {}
    name    = data.get('name', '').strip()
    email   = data.get('email', '').strip()
    phone   = data.get('phone', '').strip()
    message = data.get('message', '').strip()

    if not name or not email or not message:
        return jsonify({'ok': False, 'error': 'Please fill in all required fields.'}), 400

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
        return jsonify({'ok': True})

    except Exception as e:
        return jsonify({
            'ok': False,
            'error': f'Message could not be sent — please call us at (212) 555-0180. (Error: {e})'
        }), 500


@app.route('/api/quote', methods=['POST'])
def api_quote():
    """
    Accepts a JSON body with name, email, phone, service, message.
    Sends an email and returns { ok: true } on success.
    """
    data    = request.get_json(force=True, silent=True) or {}
    name    = data.get('name', '').strip()
    email   = data.get('email', '').strip()
    phone   = data.get('phone', '').strip()
    service = data.get('service', '').strip()
    message = data.get('message', '').strip()

    if not name or not email or not message:
        return jsonify({'ok': False, 'error': 'Please fill in all required fields.'}), 400

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
        return jsonify({'ok': True})

    except Exception as e:
        return jsonify({
            'ok': False,
            'error': f'Request could not be sent — please call us at (212) 555-0180. (Error: {e})'
        }), 500


# ─── Entry Point ──────────────────────────────────────────────────────────────

if __name__ == '__main__':
    app.run(debug=True)
