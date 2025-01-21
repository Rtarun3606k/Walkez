from flask import Blueprint,jsonify,request,send_file
from io import BytesIO
from flask_jwt_extended import create_access_token,create_refresh_token
from config import db
from Models.User_moel import User
from datetime import timedelta
from flask_jwt_extended import get_jwt_identity,jwt_required
from email_verification.send_email import send_email
import bcrypt
import re


# firebase imports
from firebase_admin.auth import InvalidIdTokenError,EmailAlreadyExistsError
from firebase_admin import auth,firestore
from config import firebaseDataStore,firebaseAuth



def google_auth(email,disaplayName, photoURL,uId, lastLoginAt , lastSigInAt, creationTime,emailVerified):

    try:

        newPSQLUser = User(user_email=email,user_name=disaplayName,user_email_verified=emailVerified,user_phone_verified=False,firebase_uid=uId)

        db.session.add(newPSQLUser)
        db.session.commit()

        firebaseDataStore.collection('users').document(uId).set({
            'email':email,
            'displayName':disaplayName,
            'photoURL':photoURL,
            'user_firebase_auth_id':uId,
            'lastLoginAt':lastLoginAt,
            'lastSigInAt':lastSigInAt,
            'creationTime':creationTime,
            'emailVerified':emailVerified,
            "user_psql_id":newPSQLUser.user_id
        })
        access_token = create_access_token(identity=uId,expires_delta=timedelta(days=1),additional_claims={"user_id":newPSQLUser.user_id,"user_email":email,"token_type":"access"}) 
        refresh_token = create_refresh_token(identity=uId,expires_delta=timedelta(days=1),additional_claims={"user_id":newPSQLUser.user_id,"user_email":email,"token_type":"refresh"}) 

        return jsonify({"msg":"User Registered",'access_token':access_token,"refresh_token":refresh_token}),20

    except EmailAlreadyExistsError:
        db.session.rollback()
        return jsonify({"msg":"Email already exists"}),400  

    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({"msg":str(e)}),500

