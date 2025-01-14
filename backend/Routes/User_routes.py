from flask import Blueprint,jsonify,request,send_file
from io import BytesIO
from flask_jwt_extended import create_access_token,create_refresh_token
from config import db
from Models.User_moel import User
from datetime import timedelta
from flask_jwt_extended import get_jwt_identity,jwt_required
import bcrypt
import re
# import io



# firebase imports
from firebase_admin.auth import InvalidIdTokenError,EmailAlreadyExistsError
from firebase_admin import auth,firestore
from config import firebaseDataStore,firebaseAuth



from Models.User_moel import Images

user_route = Blueprint('user_route', __name__)

@user_route.route("/login",methods=["POST"])
def login():
    user_email = request.json.get("user_email")
    user_password = request.json.get("user_password")
    print(user_email,user_password)
    if not user_email or not user_password:
        return jsonify({'message':'please fill all the fields'}),401
    
    try:
        checkFirebaseUser = firebaseAuth.sign_in_with_email_and_password(user_email,user_password)
        print(checkFirebaseUser)
        return jsonify({'message':'login success'}),200

    except InvalidIdTokenError:
        return jsonify({'message':'invalid credentials'}),401
    except Exception as e:
        print(e)
        return jsonify({'message':str(e)}),401


        print("checked password")
        access_token = create_access_token(identity=user.user_id,expires_delta=timedelta(hours=1),additional_claims={"token_type": "access_token"})
        refresh_token = create_refresh_token(identity=user.user_id, expires_delta=timedelta(days=1),additional_claims={"token_type": "refresh_token"})
        print(access_token,refresh_token,"token")
        return jsonify({'access_token':access_token,'refresh_token':refresh_token,"message":"login success"}),200
    return jsonify({'message':'invalid credentials'}),401

    # user = User.query.filter_by(user_email=user_email).first()
    # if not user:
    #     return jsonify({'message':'user not found'}),401
    # if bcrypt.checkpw(user_password.encode('utf-8'), user.user_password):


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
    
    # initilise firebase new user
    try:
        newFireBaseUser = auth.create_user(email=user_email,password=user_password,display_name=user_name)

        # add user to firestore
        print(newFireBaseUser)
        firebaseDataStore.collection('users').document(newFireBaseUser.uid).set(
            {"user_email":newFireBaseUser.email,"user_id":newFireBaseUser.uid}
        )
        newPSQLUser = User(user_email=user_email,user_name=user_name,user_email_verified=False,user_phone_verified=False,firebase_uid=newFireBaseUser.uid)
        print(newPSQLUser)


        db.session.add(newPSQLUser)
        db.session.commit()
        print(newPSQLUser.user_id)
        firebaseDataStore.collection('users').document(newFireBaseUser.uid).set(
            {"user_email":newFireBaseUser.email,"user_psql_id":newPSQLUser.user_id, "user_firebase_auth_id":newFireBaseUser.uid}
        )

        return jsonify({'message':'user registered successfully'}),200

    except EmailAlreadyExistsError:
        return jsonify({'message':'email already exists'}),401
    except InvalidIdTokenError:
        return jsonify({'message':'invalid email or password'}),401
    except Exception as e:
        print(e)
        return jsonify({'message':str(e), "error":str(e)}),401
    



@user_route.route("/get_user",methods=["GET"])
@jwt_required()
def get_user():
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify({'message':'Your not authorized to use this function'}),401
    user = User.query.filter_by(user_id=user_id).first()
    user_img = Images.query.filter_by(user_id=user_id).all()
    print(user_img)
    user_img_data = []
    for i in user_img:
        print(i)
        user_img_data.append({
            "image_id":i.image_id,
            "image_name":i.image_name,
            "mimetype":i.mimetype,
            "longitude":i.longitude,
            "latitude":i.latitude,
            "problem":i.problem,
            "stars":i.stars
        })
    print(user_img_data)
    if not user:
        return jsonify({'message':'user not found'}),401
    user_data = {
        "user_id":user.user_id,
        "user_name":user.user_name,
        "user_email":user.user_email,
        "user_images":user_img_data,
        "user_phone":user.user_phone,
        "user_email_verified":user.user_email_verified,
        "user_phone_verified":user.user_phone_verified,
        # "user_profile":user.user_profile,
    }
    if user.user_profile:
        user_data["mimetype"] = user.mimetype
        user_data["profile_image"] = True
        # user_profile_image_name = user.user_profile_image_name
    else:

        user_data["profile_image"] = False
        

    return jsonify({'user_data':user_data,'message':"welcome to profile page"}),200


@user_route.route("/update_user",methods=["PUT"])
@jwt_required()
def update_user():
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify({'message':'Your not authorized to use this function'}),401
    user = User.query.filter_by(user_id=user_id).first()
    if not user:
        return jsonify({'message':'user not found'}),401
    get_data = request.json
    user_name = get_data.get("user_name")
    user_email = get_data.get("user_email")
    user_phone = get_data.get("user_phone")
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


@user_route.route("/add_image",methods=["POST"])
@jwt_required()
def add_image():
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify({'message':'Your not authorized to use this function'}),401
    user = User.query.filter_by(user_id=user_id).first()
    if not user:
        return jsonify({'message':'user not found'}),401
    image = request.files['images']
    image_name = image.filename
    mimetype = image.mimetype
    image_data = image.read()
    longitude = request.form.get("longitude")
    latitude = request.form.get("latitude")
    problem = request.form.get("path_type")
    stars = request.form.get("rating")
    new_image = Images(image=image_data,mimetype=mimetype,image_name=image_name,user_id=user_id,longitude=longitude,latitude=latitude,problem=problem,stars=stars)
    print(new_image)
    try:
        db.session.add(new_image)
        db.session.commit()
        return jsonify({'message':'image added successfully'}),200
    except Exception as e:
        print(e)
        return jsonify({'message':f'{e}'}),401
    


@user_route.route("/get_images",methods=["GET"])
@jwt_required()
def get_images():
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify({'message':'Your not authorized to use this function'}),401
    user = User.query.filter_by(user_id=user_id).first()
    if not user:
        return jsonify({'message':'user not found'}),401
    images = Images.query.filter_by(user_id=user_id).all()
    if not images:
        return jsonify({'message':'no images found'}),401
    image_data = []
    for image in images:
        image_data.append({
            "image_id":image.image_id,
            "image_name":image.image_name,
            "mimetype":image.mimetype,
            "longitude":image.longitude,
            "latitude":image.latitude,
            "problem":image.problem,
            "stars":image.stars
        })
    return jsonify({'image_data':image_data,'message':"images found"}),200

@user_route.route("/image/<int:image_id>",methods=["GET"])
def get_image(image_id):
    image = Images.query.filter_by(image_id=image_id).first()
    if not image:
        return jsonify({'message':'image not found'}),401
    return send_file(BytesIO(image.image),mimetype=image.mimetype)



@user_route.route("/delete_image/<int:image_id>",methods=["DELETE"])
@jwt_required()
def delete_image(image_id):
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify({'message':'Your not authorized to use this function'}),401
    user = User.query.filter_by(user_id=user_id).first()
    if not user:
        return jsonify({'message':'user not found'}),401
    image = Images.query.filter_by(image_id=image_id).first()
    if not image:
        return jsonify({'message':'image not found'}),401
    try:
        db.session.delete(image)
        db.session.commit()
        return jsonify({'message':'image deleted successfully'}),200
    except Exception as e:
        print(e)
        return jsonify({'message':f'{e}'}),401