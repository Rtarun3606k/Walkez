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




@admin_routes_user.route("/banUser", methods=["POST"])
@jwt_required()
def ban_user():
    claims = get_jwt()

    if claims.get("role") != "admin":
        return jsonify({"message": "Unauthorized"}), 401

    data = request.json
    try:
        user_id = data.get("user_id")
        user_ref = firebaseDataStore.collection('users').document(user_id)

        # Check if the user exists
        user_doc = user_ref.get()
        if not user_doc.exists:
            return jsonify({"message": "User not found"}), 404

        # Get the user data
        user = user_doc.to_dict()

        # Toggle the 'banned' field
        if user.get('banned', False):  # Default to False if 'banned' field doesn't exist
            user_ref.update({"banned": False})
            return jsonify({"message": "User unbanned"}), 200
        else:
            user_ref.update({"banned": True})
            return jsonify({"message": "User banned"}), 200

    except Exception as e:
        print(e, "error")
        return jsonify({"message": str(e)}), 500