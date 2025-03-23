from email_verification.send_email import send_email
from flask import Blueprint,jsonify,request,send_file,render_template
from io import BytesIO
from config import db
# from Models.User_moel import User
from datetime import timedelta
from flask_jwt_extended import get_jwt_identity,jwt_required
import bcrypt
import re
from config import db, firebaseDataStore


# from Models.User_moel import User

verification_route = Blueprint('verification', __name__)
fireBaseUser = firebaseDataStore.collection('users')

@verification_route.route("/send_verification_email",methods=["POST"])
@jwt_required()
def send_verification_email():
    user_id = get_jwt_identity()
    user = fireBaseUser.document(user_id).get()
    if not user.exists:
        return jsonify({'message':'user not found'}),401
    user_data = user.to_dict()
    if user_data['user_email_verified']:
        return jsonify({'message':'email already verified'}),401
    flag = send_email(user_data['user_name'],user_data['user_email'],user_id)
    if flag is None:
        return jsonify({'message':'error in sending email'}),401
    return jsonify({'message':f'verification email sent successfully {flag}'}),200



@verification_route.route("/verify_email/<string:user_id>/verify_email",methods=["GET"])
def verify_email(user_id):
    user = fireBaseUser.document(user_id).get()
    if not user.exists:
        return render_template('email_verification_failed.html')
    user_data = user.to_dict()
    if user_data['user_email_verified']:
        return render_template('email_already_verified.html')
    fireBaseUser.document(user_id).update({'user_email_verified': True})
    return render_template('email_verification_success.html')
