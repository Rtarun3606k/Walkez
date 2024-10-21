from email_verification.send_email import send_email
from flask import Blueprint,jsonify,request,send_file,render_template
from io import BytesIO
from config import db
from Models.User_moel import User
from datetime import timedelta
from flask_jwt_extended import get_jwt_identity,jwt_required
import bcrypt
import re


from Models.User_moel import User

verification_route = Blueprint('verification', __name__)

@verification_route.route("/send_verification_email",methods=["POST"])
@jwt_required()
def send_verification_email():
    user_id = get_jwt_identity()
    user = User.query.filter_by(user_id=user_id).first()
    if not user:
        return jsonify({'message':'user not found'}),401
    if user.user_email_verified:
        return jsonify({'message':'email already verified'}),401
    flag  = send_email(user.user_name,user.user_email,user.user_id, True)
    if flag is None:
        return jsonify({'message':'error in sending email'}),401
    
    return jsonify({'message':f'verification email sent successfully {flag}'}),200

@verification_route.route("/verify_email/<int:id>/verify_email",methods=["GET"])
def verify_email(id):
    user_id = id
    user = User.query.filter_by(user_id=user_id).first()
    if not user:
        return render_template('email_verification_failed.html')
    if user.user_email_verified:
        return render_template('email_already_verified.html')
    user.user_email_verified = True
    db.session.commit()
    return render_template('email_verification_success.html')

# path change_password/int_id

@verification_route.route("/change_password/<int:id>/change_password",methods=["GET","POST"])
def change_password(id):
    user_id = id
    user = User.query.filter_by(user_id=user_id).first()
    if not user:
        return render_template('password_change_failed.html')
    if request.method == "POST":
        user_id = id
        user = User.query.filter_by(user_id=user_id).first()
        if not user:
            print("User not found")
            return render_template('change_password_template.html',message = "Some error occured")
        password = request.form['password']
        confirm_password = request.form['retype_password']
        print(password,confirm_password)
        if password != confirm_password:
            print("Passwords do not match")
            return render_template('change_password_template.html',message = "Passwords do not match", flag = False,user_name = user.user_name)
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        user.user_password = hashed
        db.session.commit()
        print("Password changed successfully")
        return render_template('change_password_template.html',message = "Password changed successfully" , flag = True,user_name = user.user_name)


    return render_template('change_password_template.html',user_name = user.user_name,user_id = user_id, flag = "NO")



@verification_route.route("/send_change_password",methods=["POST"])
@jwt_required()
def send_password_change():
    user_id = get_jwt_identity()
    user = User.query.filter_by(user_id=user_id).first()
    if not user:
        return jsonify({'message':'user not found'}),401
    if user.user_email_verified:
        return jsonify({'message':'email already verified'}),401
    flag  = send_email(user.user_name,user.user_email,user.user_id, False)
    if flag is None:
        return jsonify({'message':'error in sending email'}),401
    
    return jsonify({'message':f'password change email sent successfully {flag}'}),200