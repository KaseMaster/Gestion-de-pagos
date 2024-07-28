import logging
from gunicorn.app.base import BaseApplication
from app_init import create_initialized_flask_app
from flask import request, jsonify, send_file
import csv
import io
from datetime import datetime, timedelta

# Flask app creation should be done by create_initialized_flask_app to avoid circular dependency problems.
app = create_initialized_flask_app()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class StandaloneApplication(BaseApplication):
    def __init__(self, app, options=None):
        self.application = app
        self.options = options or {}
        super().__init__()

    def load_config(self):
        # Apply configuration to Gunicorn
        for key, value in self.options.items():
            if key in self.cfg.settings and value is not None:
                self.cfg.set(key.lower(), value)

    def load(self):
        return self.application

@app.route('/upload', methods=['POST'])
def upload_csv():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and file.filename.endswith('.csv'):
        stream = io.StringIO(file.stream.read().decode("UTF8"), newline=None)
        csv_input = csv.reader(stream)
        data = []
        for row in csv_input:
            if len(row) >= 2:
                portfolio = row[0]
                amount = row[1]
                data.append({
                    'start_date': '',  # User will input manually
                    'end_grace_period': '',  # Will be calculated
                    'name': '',  # User will input manually
                    'portfolio': portfolio,
                    'initial_capital': amount,
                    'return_percentage': '',  # User will input manually
                    'next_payment_date': '',  # Will be calculated
                    'total_to_pay': '',  # Will be calculated
                    'notes': ''  # User will input manually
                })
        return jsonify(data), 200
    return jsonify({'error': 'Invalid file format'}), 400

def get_next_monday():
    today = datetime.now()
    days_ahead = 7 - today.weekday()
    if days_ahead <= 0:
        days_ahead += 7
    return today + timedelta(days=days_ahead)

@app.route('/download_manual', methods=['GET'])
def download_manual():
    return send_file('manual.txt', as_attachment=True)
    return send_file('manual_instalacion.txt', as_attachment=True)

if __name__ == "__main__":
    options = {
        "bind": "0.0.0.0:8080",
        "workers": 4,
        "loglevel": "info",
        "accesslog": "-"
    }
    StandaloneApplication(app, options).run()