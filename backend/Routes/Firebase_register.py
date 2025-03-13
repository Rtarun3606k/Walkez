from flask import Blueprint, jsonify, request, send_file
from io import BytesIO
from flask_jwt_extended import create_access_token, create_refresh_token
from config import db
from Models.User_moel import User
from datetime import timedelta
from flask_jwt_extended import get_jwt_identity, jwt_required
from email_verification.send_email import send_email
import bcrypt
import re

# firebase imports
from firebase_admin.auth import InvalidIdTokenError, EmailAlreadyExistsError
from firebase_admin import auth, firestore
from config import firebaseDataStore, firebaseAuth

def google_auth(email, display_name, photo_url, uId, last_login_at, last_sign_in_at, creation_time, email_verified, isLogin=False, isUId=""):
    print(email, display_name, photo_url, uId, last_login_at, last_sign_in_at, creation_time, email_verified, isLogin, isUId)
    try:
        if isLogin and len(isUId) > 5:
            print("User already exists in PSQL")
            access_token = create_access_token(identity=isUId, expires_delta=timedelta(days=1), additional_claims={"user_id": isUId, "user_email": email, "token_type": "access"})
            refresh_token = create_refresh_token(identity=isUId, expires_delta=timedelta(days=1), additional_claims={"user_id": isUId, "user_email": email, "token_type": "refresh"})
            return jsonify({"msg": "User Logged in", 'access_token': access_token, "refresh_token": refresh_token}), 200
        else:
            newPSQLUser = User(user_email=email, user_name=display_name, user_email_verified=email_verified, user_phone_verified=False, firebase_uid=uId, user_id=uId)
            db.session.add(newPSQLUser)
            db.session.commit()
            print("User added to PSQL", newPSQLUser.user_id)
            firebaseDataStore.collection('users').document(uId).set({
                'email': email,
                'displayName': display_name,
                'photoURL': photo_url,
                'user_firebase_auth_id': uId,
                'lastLoginAt': last_login_at,
                'lastSigInAt': last_sign_in_at,
                'creationTime': creation_time,
                'emailVerified': email_verified,
                "user_psql_id": newPSQLUser.user_id
            })
            access_token = create_access_token(identity=uId, expires_delta=timedelta(days=1), additional_claims={"user_id": newPSQLUser.user_id, "user_email": email, "token_type": "access"})
            refresh_token = create_refresh_token(identity=uId, expires_delta=timedelta(days=1), additional_claims={"user_id": newPSQLUser.user_id, "user_email": email, "token_type": "refresh"})
            return jsonify({"msg": "User Registered", 'access_token': access_token, "refresh_token": refresh_token}), 200
    except EmailAlreadyExistsError:
        db.session.rollback()
        return jsonify({"msg": "Email already exists"}), 400
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({"msg": str(e)}), 500




