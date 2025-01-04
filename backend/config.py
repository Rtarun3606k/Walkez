from flask import  Flask, request, jsonify
import logging
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_cors import CORS 
from azure.storage.blob import BlobServiceClient
import os

from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# app = Flask(__name__)
app = Flask(__name__, template_folder='templates')
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


# Initialize Azure Blob Storage
azure_blob_connection_string = os.getenv('AzureBlobStorageConnectionString')
blob_service_client = BlobServiceClient.from_connection_string(azure_blob_connection_string)