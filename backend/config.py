from flask import Flask, request, jsonify
import logging
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_cors import CORS 
import os

from dotenv import load_dotenv

# firebase configuration
import firebase_admin
from firebase_admin import credentials, auth, firestore

# azure configuration
from azure.storage.blob import BlobServiceClient

# Load environment variables from .env file
load_dotenv()

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

# Initialize Firebase
cred = credentials.Certificate(os.getenv('GOOGLE_APPLICATION_CREDENTIALS_SERVICE_ACCOUNT'))
firebase_admin.initialize_app(cred)
firebaseDataStore = firestore.client()

# Initialize Azure Blob Storage
azure_blob_connection_string = os.getenv('AzureBlobStorageConnectionString')
if azure_blob_connection_string is None:
    raise ValueError("AzureBlobStorageConnectionString environment variable is not set")

blob_service_client = BlobServiceClient.from_connection_string(azure_blob_connection_string)