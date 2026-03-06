"""
Apex Plumbing Co. — Flask Backend (JSON API)
=============================================

Pure JSON API server — no HTML, no templates.
All pages are served by the separate React frontend.

HOW TO RUN:
  1. Copy .env.example → .env and fill in your credentials
  2. pip install -r requirements.txt
  3. flask run   (listens on http://127.0.0.1:5000)
  4. In a second terminal: cd ../frontend && npm start

ENDPOINTS:
  POST   /api/contact                →  { ok: true }  or  { ok: false, error: "..." }
  POST   /api/quote                  →  { ok: true }  or  { ok: false, error: "..." }
  GET    /api/jobber/clients         →  list of all Jobber clients
  POST   /api/jobber/clients         →  create a Jobber client
  DELETE /api/jobber/clients/<id>    →  delete a Jobber client
"""

import os
import requests as http_requests
from flask import Flask, request, jsonify
from flask_mail import Mail, Message
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

# ─── App Setup ────────────────────────────────────────────────────────────────

app = Flask(__name__)
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

# ─── Jobber API Configuration ─────────────────────────────────────────────────

JOBBER_TOKEN       = os.environ.get('JOBBER_ACCESS_TOKEN')
JOBBER_API_URL     = 'https://api.getjobber.com/api/graphql'
JOBBER_API_VERSION = os.environ.get('JOBBER_API_VERSION', '2025-04-16')


def jobber_request(query, variables=None):
    """Send a GraphQL request to Jobber and return the parsed JSON."""
    headers = {
        'Authorization': f'Bearer {JOBBER_TOKEN}',
        'Content-Type': 'application/json',
        'X-JOBBER-GRAPHQL-VERSION': JOBBER_API_VERSION,
    }
    payload = {'query': query}
    if variables:
        payload['variables'] = variables
    try:
        resp = http_requests.post(JOBBER_API_URL, json=payload, headers=headers, timeout=6)
        resp.raise_for_status()
        return resp.json()
    except http_requests.exceptions.Timeout:
        return {'error': 'Jobber API timed out. Please try again.'}
    except http_requests.exceptions.RequestException as e:
        return {'error': f'Jobber API error: {str(e)}'}


# ─── Email API Routes ─────────────────────────────────────────────────────────

@app.route('/api/contact', methods=['POST'])
def api_contact():
    """Accepts name, email, phone, message — sends an email."""
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
    """Accepts name, email, phone, service, message — sends an email."""
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


# ─── Jobber API Routes ────────────────────────────────────────────────────────

@app.route('/api/jobber/clients', methods=['GET'])
def get_jobber_clients():
    """Fetch all clients from Jobber."""
    query = """
    {
      clients(first: 100) {
        nodes {
          id
          name
          firstName
          lastName
          emails { address }
          phones { number }
          createdAt
        }
      }
    }
    """
    result = jobber_request(query)
    return jsonify(result)


@app.route('/api/jobber/clients', methods=['POST'])
def create_jobber_client():
    """Create a new client in Jobber."""
    data = request.get_json(force=True, silent=True) or {}

    first_name = data.get('firstName', '').strip()
    last_name  = data.get('lastName', '').strip()
    email      = data.get('email', '').strip()
    phone      = data.get('phone', '').strip()

    if not first_name or not last_name:
        return jsonify({'ok': False, 'error': 'First name and last name are required.'}), 400

    query = """
    mutation CreateClient($input: ClientCreateInput!) {
      clientCreate(input: $input) {
        client { id name firstName lastName emails { address } phones { number } createdAt }
        userErrors { message }
      }
    }
    """
    variables = {
        'input': {
            'firstName': first_name,
            'lastName':  last_name,
        }
    }
    if email:
        variables['input']['emails'] = [{'address': email, 'primary': True}]
    if phone:
        variables['input']['phones'] = [{'number': phone, 'primary': True}]

    result = jobber_request(query, variables)
    return jsonify(result)


@app.route('/api/jobber/clients/<path:client_id>', methods=['DELETE'])
def delete_jobber_client(client_id):
    """Delete a client in Jobber by encoded ID."""
    query = """
    mutation DeleteClient($id: EncodedId!) {
      clientDelete(input: { id: $id }) {
        clientId
        userErrors { message }
      }
    }
    """
    result = jobber_request(query, {'id': client_id})
    return jsonify(result)


# ─── Entry Point ──────────────────────────────────────────────────────────────

if __name__ == '__main__':
    app.run(debug=True)
