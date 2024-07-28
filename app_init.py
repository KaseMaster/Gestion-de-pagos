from flask import Flask
from routes import register_routes

# The app initialization must be done in this module to avoid circular dependency problems.

def create_initialized_flask_app():
    # DO NOT INSTANTIATE THE FLASK APP IN ANOTHER MODULE.
    app = Flask(__name__, static_folder='static')

    # Initialize database
    # from models import db
    # app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///your_database.db'
    # db.init_app(app)
    # DO NOT INITIALIZE db IN ANOTHER MODULE.

    # Initialize migrations
    # Just write SQL queries for example to add a column to an existing table if missing

    register_routes(app)

    return app