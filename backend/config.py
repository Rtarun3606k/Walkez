from flask import  Flask, request, jsonify
import logging
from flask_cors import CORS 
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///prototype.db'
app.logger.setLevel(logging.DEBUG)

# You can add a StreamHandler to log to the terminal
stream_handler = logging.StreamHandler()
stream_handler.setLevel(logging.DEBUG)
app.logger.addHandler(stream_handler)
db = SQLAlchemy(app)
app.config["JWT_SECRET_KEY"] = "super-secret"  # Change this!
jwt = JWTManager(app)
migrate = Migrate(app, db)