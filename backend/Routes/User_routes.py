from flask import Blueprint,jsonify,request
from flask_jwt_extended import create_access_token,create_refresh_token
from config import db
from Models.User_moel import User
from datetime import timedelta
import bcrypt
import re

user_route = Blueprint('user_route', __name__)

@user_route.route("/login",methods=["POST"])
def login():
    user_email = request.json.get("user_email")
    user_password = request.json.get("user_password")
    print(user_email,user_password)
    if not user_email or not user_password:
        return jsonify({'message':'please fill all the fields'}),401
    user = User.query.filter_by(user_email=user_email).first()
    if not user:
        return jsonify({'message':'user not found'}),401
    if bcrypt.checkpw(user_password.encode('utf-8'), user.user_password):
        print("checked password")
        access_token = create_access_token(identity=user.user_id,expires_delta=timedelta(hours=1),additional_claims={"token_type": "access_token"})
        refresh_token = create_refresh_token(identity=user.user_id, expires_delta=timedelta(days=1),additional_claims={"token_type": "refresh_token"})
        print(access_token,refresh_token,"token")
        return jsonify({'access_token':access_token,'refresh_token':refresh_token,"message":"login success"}),200
    return jsonify({'message':'invalid credentials'}),401




@user_route.route("/register",methods=["POST"])
def register():
    get_data = request.json
    user_email = get_data.get("user_email")
    user_name = get_data.get("user_name")
    user_password = get_data.get("user_password")
    user_password_retype = get_data.get("user_password_retype")
    print(user_email,user_password)
    if not user_email or not user_password or not user_name:
        print('please fill all the fields')
        return jsonify({'message':'please fill all the fields'}),401
    if user_password != user_password_retype:
        print('passwords are not matching!')
        return jsonify({'message':'passwords are not matching!'}),401

    if not re.match(r"[^@]+@[^@]+\.[^@]+", user_email):
        return jsonify({'message':'invalid email'}),401
    if len(user_password) < 6:
        return jsonify({'message':'password must be 6 characters or more'}),401
    if len(user_name) < 6:
        return jsonify({'message':'username must be 6 characters or more'}),401
    hashed = bcrypt.hashpw(user_password.encode('utf-8'), bcrypt.gensalt())
    new_user = User(user_name=user_name,user_email=user_email,user_password=hashed)
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message":'registerd successfully'}),200
    except Exception as e:
        print(e)
        return jsonify({'message':f'{e}'}),401

