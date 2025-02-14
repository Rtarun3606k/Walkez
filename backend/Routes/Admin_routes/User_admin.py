from flask import Blueprint,jsonify,request,send_file
from io import BytesIO
from flask_jwt_extended import create_access_token,create_refresh_token
from config import db,firebaseDataStore,firebaseAuth
from Models.User_moel import User
from Models.Admin_model import Admin
from datetime import timedelta
from flask_jwt_extended import get_jwt_identity,jwt_required

from firebase_admin import auth

admin_routes = Blueprint('admin_routes', __name__)

@admin_routes.route('/admin/users', methods=['GET'])
def get_all_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

@admin_routes.route('/admin/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())

@admin_routes.route('/admin/user', methods=['POST'])
def create_user():
    data = request.get_json()
    new_user = User(**data)
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.to_dict()), 201

@admin_routes.route('/admin/user/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    user = User.query.get_or_404(user_id)
    for key, value in data.items():
        setattr(user, key, value)
    db.session.commit()
    return jsonify(user.to_dict())

@admin_routes.route('/admin/user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return '', 204


@admin_routes.route("/register",methods=["POST"])
def admin_register():
    data = request.json
    admin = Admin.query.filter_by(admin_email=data.get("admin_email")).first()
    if admin:
        return jsonify({'message':'admin already exists'}),401
    new_admin = firebaseAuth.create_user_with_email_and_password(email=data.get("email"),password=data.get("password"))
    print(new_admin['localId'])
    print(new_admin)
    print(type(new_admin))
    new_admin = Admin(admin_id=new_admin['localId'],admin_email=data.get("email") ,firebase_uid=new_admin['localId'],admin_name=data.get("admin_name"))
    firebaseDataStore.collection('admins').document(new_admin.admin_id).set({
        'admin_email':new_admin.admin_email,
        'admin_id':new_admin.admin_id,
        # "last_login":new_admin.last_login,
        # "creation_time":new_admin.creation_time
    })
    db.session.add(new_admin)
    db.session.commit()
    print("Admin created successfully")
    return jsonify({'message':'admin created successfully'}),200


@admin_routes.route("admin/login",methods=["POST"])
def admin_login():
    data = request.get_json()
    admin = Admin.query.filter_by(admin_email=data['admin_email']).first()
    if not admin:
        return jsonify({'message':'admin not found'}),401
    