from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required
from config import db, firebaseDataStore, firebaseAuth
from firebase_admin.auth import UserNotFoundError,EmailAlreadyExistsError

from datetime import timedelta

Tenent_admin_register_login = Blueprint('tenet_routes', __name__)


@Tenent_admin_register_login.route("/register", methods=["POST"])
def tenent_register():
    data = request.json
   
    
    try:

        new_admin = firebaseAuth.create_user_with_email_and_password(email=data.get("email"), password=data.get("password"))
        print(new_admin['localId'])
        print(new_admin)
        print(type(new_admin))

    
        firebaseDataStore.collection('Tenent').document(new_admin['localId']).set({
            'email': data.get('email'),
            'name': data.get('name'),
            'phone': data.get('phone'),
            'city': data.get('city'),
            'state': data.get('state'),
            'role': 'Tenent',
            'complaints_closed': [] ,
            'account_status': False   

            
        })

    except EmailAlreadyExistsError as e:
        print(e)
        return jsonify({'message': 'email already exists'}), 400
    
    except Exception as e:
        print(e)
        return jsonify({'message': 'user already exists'}), 400


    access_token = create_access_token(identity=new_admin['localId'], expires_delta=timedelta(days=1),additional_claims={"role": "Tenent"})
    refresh_token = create_refresh_token(identity=new_admin['localId'], expires_delta=timedelta(days=2),additional_claims={"role": "Tenent"})
    print("Admin created successfully")
    return jsonify({'message': 'admin created successfully', "tokens": {"access_token": access_token, "refresh_token": refresh_token}}), 200



@Tenent_admin_register_login.route("/login", methods=["POST"])
def Tenent_login():
    data = request.json
    print(data)

    try:
        user = firebaseAuth.sign_in_with_email_and_password(email=data.get('email'), password=data.get('password'))
        print(user)

        check_account_status = firebaseDataStore.collection('Tenent').document(user['localId']).get().to_dict()

        if check_account_status['account_status'] == False:
            return jsonify({'message': "Account not activated please contact support!"}), 401
        
        if check_account_status['role'] != 'Tenent':
            return jsonify({'message': 'Unauthorized'}), 401
        
        if not user:
            return jsonify({'message': 'invalid credentials'}), 401 
        
        if check_account_status['banned'] == True:
            return jsonify({'message': 'Account banned'}), 401

        access_token = create_access_token(identity=user['localId'], expires_delta=timedelta(days=1), additional_claims={"role": "Tenent"})
        refresh_token = create_refresh_token(identity=user['localId'], expires_delta=timedelta(days=2) ,   additional_claims={"role": "Tenent"})
        return jsonify({'message': 'login successful', "tokens": {"access_token": access_token, "refresh_token": refresh_token}}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'invalid credentials'}), 401
    