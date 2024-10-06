from flask import Blueprint,jsonify,request,send_file
from io import BytesIO
from flask_jwt_extended import create_access_token,create_refresh_token
from config import db
from Models.User_moel import User
from datetime import timedelta
from flask_jwt_extended import get_jwt_identity,jwt_required
import bcrypt
import re



from Models.User_moel import Images

user_profile_route = Blueprint('user_profile_route', __name__)

@user_profile_route.route("/user_profile",methods=["GET"])
@jwt_required()
def user_profile():
    user_id = get_jwt_identity()
    user = User.query.filter_by(user_id=user_id).first()
    if not user:
        return jsonify({'message':'user not found'}),401
    user_data = {'user_name':user.user_name,
                 'user_email':user.user_email,
                 'user_phone':user.user_phone,
                 "user_email_verified":user.user_email_verified,
                    "user_phone_verified":user.user_phone_verified,
                    "user_id":user.user_id
                 }
    return jsonify({"user_data":user_data,"message":"User found "}),200

@user_profile_route.route("/add_profile_image",methods=["POST"])
@jwt_required()
def add_profile_image():
    user_id = get_jwt_identity()
    user = User.query.filter_by(user_id=user_id).first()
    if not user:
        return jsonify({'message':'user not found'}),401
    if 'file' not in request.files:
        return jsonify({'message':'no file part'}),401
    file = request.files['file']
    if file.filename == '':
        return jsonify({'message':'no selected file'}),401
    if file:
        user.user_profile = file.read()
        user.mimetype = file.mimetype
        user.user_profile_image_name = file.filename
        try:
            db.session.commit()
            return jsonify({'message':'file uploaded successfully'}),200
        except Exception as e:
            return jsonify({'message':f'{e}'}),401
    return jsonify({'message':'file not uploaded'}),401



@user_profile_route.route("/get_profile_image/<int:id>",methods=["GET"])
# @jwt_required()
def get_profile_image(id):
    # user_id = get_jwt_identity()
    user = User.query.filter_by(user_id=id).first()
    if not user:
        return jsonify({'message':'user not found'}),401
    if not user.user_profile:
        return jsonify({'message':'no profile image found'}),401
    return send_file(BytesIO(user.user_profile),mimetype=user.mimetype)



@user_profile_route.route("/update_user_profile",methods=["POST"])
@jwt_required()
def update_user_profile():
    user_id = get_jwt_identity()
    user = User.query.filter_by(user_id=user_id).first()
    if not user:
        return jsonify({'message':'user not found'}),401
    get_data = request.form
    user_name = get_data.get("user_name")
    user_email = get_data.get("user_email")
    user_phone = get_data.get("user_phone")
    try:
        user_profile = request.files['profile_image']
        if user_profile:
            user.user_profile = user_profile.read()
            user.mimetype = user_profile.mimetype
            user.user_profile_image_name = user_profile.filename
    except Exception as e:
        pass
    if not user_name and not user_email and not user_phone:
        return jsonify({'message':'please fill all the fields'}),401
    if user_name:
        user.user_name = user_name
    if user_email:
        user.user_email = user_email
    if user_phone:
        user.user_phone = user_phone
    try:
        db.session.commit()
        return jsonify({'message':'user updated successfully'}),200
    except Exception as e:
        print(e)
        return jsonify({'message':f'{e}'}),401