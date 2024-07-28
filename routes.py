from flask import render_template, request, jsonify
from flask import current_app as app
import csv
import io
from datetime import datetime, timedelta

def register_routes(app):
    @app.route("/")
    def home_route():
        return render_template("home.html")

    @app.route('/upload', methods=['POST'])
    def upload_file():
        return app.view_functions['upload_csv']()