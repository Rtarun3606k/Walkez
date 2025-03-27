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
    

@admin_routes_user.route("/deleteUser", methods=["POST"])
@jwt_required()
def delete_user():
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

        # Delete the user
        user_ref.delete()
        return jsonify({"message": "User deleted"}), 200

    except Exception as e:
        print(e, "error")
        return jsonify({"message": str(e)}), 500
    



# tenete routes for parent admin to manage tenents

@admin_routes_user.route("/getTenents", methods=["GET"])
@jwt_required()
def get_tenents():
    claims = get_jwt()
    print(get_jwt_identity())
    print(claims)

    if claims.get("role") != "admin":
        return jsonify({"message": "Unauthorized"}), 401

    tenents = firebaseDataStore.collection('Tenent').stream()
    tenent_list = []
    for tenent in tenents:
        tenent_list.append(tenent.to_dict())
    return jsonify(tenent_list), 200


@admin_routes_user.route("/banTenent", methods=["POST"])
@jwt_required()
def ban_tenent():
    claims = get_jwt()

    if claims.get("role") != "admin":
        return jsonify({"message": "Unauthorized"}), 401

    data = request.json
    try:
        tenent_id = data.get("tenent_id")
        tenent_ref = firebaseDataStore.collection('Tenent').document(tenent_id)

        # Check if the tenent exists
        tenent_doc = tenent_ref.get()
        if not tenent_doc.exists:
            return jsonify({"message": "Tenent not found"}), 404

        # Get the tenent data
        tenent = tenent_doc.to_dict()

        # Toggle the 'banned' field
        if tenent.get('banned', False):  # Default to False if 'banned' field doesn't exist
            tenent_ref.update({"banned": False})
            return jsonify({"message": "Tenent unbanned"}), 200
        else:
            tenent_ref.update({"banned": True})
            return jsonify({"message": "Tenent banned"}), 200

    except Exception as e:
        print(e, "error")
        return jsonify({"message": str(e)}), 500
    

@admin_routes_user.route("/deleteTenent", methods=["POST"])
@jwt_required()
def delete_tenent():
    claims = get_jwt()

    if claims.get("role") != "admin":
        return jsonify({"message": "Unauthorized"}), 401

    data = request.json
    try:
        tenent_id = data.get("tenent_id")
        tenent_ref = firebaseDataStore.collection('Tenent').document(tenent_id)

        # Check if the tenent exists
        tenent_doc = tenent_ref.get()
        if not tenent_doc.exists:
            return jsonify({"message": "Tenent not found"}), 404

        # Delete the tenent
        tenent_ref.delete()
        return jsonify({"message": "Tenent deleted"}), 200

    except Exception as e:
        print(e, "error")
        return jsonify({"message": str(e)}), 500
    

@admin_routes_user.route("/activateTenent", methods=["POST"])
@jwt_required()
def activate_tenent():
    claims = get_jwt()

    if claims.get("role") != "admin":
        return jsonify({"message": "Unauthorized"}), 401

    data = request.json
    try:
        tenent_id = data.get("tenent_id")
        tenent_ref = firebaseDataStore.collection('Tenent').document(tenent_id)

        # Check if the tenent exists
        tenent_doc = tenent_ref.get()
        if not tenent_doc.exists:
            return jsonify({"message": "Tenent not found"}), 404

        # Get the tenent data
        tenent = tenent_doc.to_dict()

        # Toggle the 'account_status' field
        if tenent.get('account_status', False):  # Default to False if 'account_status' field doesn't exist
            tenent_ref.update({"account_status": False})
            return jsonify({"message": "Tenent account deactivated"}), 200
        else:
            tenent_ref.update({"account_status": True})
            return jsonify({"message": "Tenent account activated"}), 200

    except Exception as e:
        print(e, "error")
        return jsonify({"message": str(e)}), 500
    

