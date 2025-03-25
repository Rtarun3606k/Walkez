from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required,get_jwt
from config import db, firebaseDataStore, firebaseAuth

from datetime import timedelta

admin_routes_user = Blueprint('admin_routes_user', __name__)

@admin_routes_user.route("/getUsers", methods=["GET"])
@jwt_required()
def get_users():
    claims = get_jwt()
    print(get_jwt_identity())
    print(claims)

    if claims.get("role") != "admin":
        return jsonify({"message": "Unauthorized"}), 401

    users = firebaseDataStore.collection('users').stream()
    user_list = []
    for user in users:
        user_list.append(user.to_dict())
    return jsonify(user_list), 200