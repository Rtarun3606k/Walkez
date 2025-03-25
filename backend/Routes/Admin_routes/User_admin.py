from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required
from config import db, firebaseDataStore, firebaseAuth

from datetime import timedelta

admin_routes = Blueprint('admin_routes', __name__)


@admin_routes.route("/register", methods=["POST"])
def admin_register():
    data = request.json
   
    

    new_admin = firebaseAuth.create_user_with_email_and_password(email=data.get("email"), password=data.get("password"))
    print(new_admin['localId'])
    print(new_admin)
    print(type(new_admin))

   
    firebaseDataStore.collection('admins').document(new_admin['localId']).set({
        'email': data.get('email'),
        'name': data.get('name'),
        'phone': data.get('phone'),
        'role': 'admin'
    })


    access_token = create_access_token(identity=new_admin['localId'], expires_delta=timedelta(days=1))
    refresh_token = create_refresh_token(identity=new_admin['localId'], expires_delta=timedelta(days=2))
    print("Admin created successfully")
    return jsonify({'message': 'admin created successfully', "tokens": {"access_token": access_token, "refresh_token": refresh_token}}), 200

@admin_routes.route("/login", methods=["POST"])
def admin_login():
    data = request.json
    print(data)
    # email = data.get('admin_email')
    try:
        user = firebaseAuth.sign_in_with_email_and_password(email=data.get('admin_email'), password=data.get('admin_password'))
        print(user)
        access_token = create_access_token(identity=user['localId'], expires_delta=timedelta(days=1), additional_claims={"role": "admin"})
        refresh_token = create_refresh_token(identity=user['localId'], expires_delta=timedelta(days=2) ,   additional_claims={"role": "admin"})
        return jsonify({'message': 'login successful', "tokens": {"access_token": access_token, "refresh_token": refresh_token}}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'invalid credentials'}), 401
    


