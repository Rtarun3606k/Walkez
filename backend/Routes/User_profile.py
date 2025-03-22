from flask import Blueprint, jsonify, request, send_file
from io import BytesIO
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required
from config import db, firebaseDataStore
# from Models.User_moel import User, Images
from datetime import timedelta
import bcrypt
import re

user_profile_route = Blueprint('user_profile_route', __name__)

firebaseUsers = firebaseDataStore.collection('users')

@user_profile_route.route("/user_profile", methods=["GET"])
@jwt_required()
def user_profile():
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify({'message': 'user not found'}), 401
    user_doc = firebaseUsers.document(user_id).get()
    if not user_doc.exists:
        return jsonify({'message': 'user not found'}), 401
    user_data = user_doc.to_dict()
    return jsonify({"user_data": user_data, "message": "User found"}), 200

@user_profile_route.route("/add_profile_image", methods=["POST"])
@jwt_required()
def add_profile_image():
    user_id = get_jwt_identity()
    user_doc = firebaseUsers.document(user_id).get()
    if not user_doc.exists:
        return jsonify({'message': 'user not found'}), 401
    if 'file' not in request.files:
        return jsonify({'message': 'no file part'}), 401
    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'no selected file'}), 401
    if file:
        try:
            firebaseUsers.document(user_id).update({
                'user_profile': file.read(),
                'mimetype': file.mimetype,
                'user_profile_image_name': file.filename
            })
            return jsonify({'message': 'file uploaded successfully'}), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 401
    return jsonify({'message': 'file not uploaded'}), 401

@user_profile_route.route("/get_profile_image/<string:user_id>", methods=["GET"])
def get_profile_image(user_id):
    user_doc = firebaseUsers.document(user_id).get()
    if not user_doc.exists:
        return jsonify({'message': 'user not found'}), 401
    user_data = user_doc.to_dict()
    if 'user_profile' not in user_data:
        return jsonify({'message': 'no profile image found'}), 401
    return send_file(BytesIO(user_data['user_profile']), mimetype=user_data['mimetype'])

@user_profile_route.route("/update_user_profile", methods=["POST"])
@jwt_required()
def update_user_profile():
    user_id = get_jwt_identity()
    user_doc = firebaseUsers.document(user_id).get()
    if not user_doc.exists:
        return jsonify({'message': 'user not found'}), 401
    get_data = request.form
    user_name = get_data.get("user_name")
    user_email = get_data.get("user_email")
    user_phone = get_data.get("user_phone")
    update_data = {}
    try:
        user_profile = request.files['profile_image']
        if user_profile:
            update_data['user_profile'] = user_profile.read()
            update_data['mimetype'] = user_profile.mimetype
            update_data['user_profile_image_name'] = user_profile.filename
    except Exception as e:
        pass
    if not user_name and not user_email and not user_phone:
        return jsonify({'message': 'please fill all the fields'}), 401
    if user_name:
        update_data['user_name'] = user_name
    if user_email:
        update_data['user_email'] = user_email
    if user_phone:
        update_data['user_phone'] = user_phone
    try:
        firebaseUsers.document(user_id).update(update_data)
        return jsonify({'message': 'user updated successfully'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 401