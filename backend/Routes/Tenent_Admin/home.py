from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required
from config import db, firebaseDataStore, firebaseAuth
from firebase_admin.auth import UserNotFoundError,EmailAlreadyExistsError

from datetime import timedelta

Tenent_admin_home = Blueprint('tenet_home', __name__)