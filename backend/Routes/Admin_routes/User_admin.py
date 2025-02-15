from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required
from config import db, firebaseDataStore, firebaseAuth
from Models.User_moel import User  # Corrected import statement
from Models.Admin_model import Admin
from datetime import timedelta

admin_routes = Blueprint('admin_routes', __name__)

@admin_routes.route('/admin/users', methods=['GET'])
@jwt_required()
def get_all_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

@admin_routes.route('/admin/user/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())

@admin_routes.route('/admin/user', methods=['POST'])
@jwt_required()
def create_user():
    data = request.get_json()
    new_user = User(**data)
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.to_dict()), 201

@admin_routes.route('/admin/user/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    data = request.get_json()
    user = User.query.get_or_404(user_id)
    for key, value in data.items():
        setattr(user, key, value)
    db.session.commit()
    return jsonify(user.to_dict())

@admin_routes.route('/admin/user/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return '', 204

@admin_routes.route("/register", methods=["POST"])
def admin_register():
    data = request.json
    admin = Admin.query.filter_by(admin_email=data.get("admin_email")).first()
    if admin:
        return jsonify({'message': 'admin already exists'}), 401

    new_admin = firebaseAuth.create_user_with_email_and_password(email=data.get("email"), password=data.get("password"))
    print(new_admin['localId'])
    print(new_admin)
    print(type(new_admin))

    new_adminP = Admin(admin_id=new_admin['localId'], admin_email=data.get("email"), firebase_uid=new_admin['localId'], admin_name=data.get("admin_name"))

    # Corrected the way to set the document in Firestore
    firebaseDataStore.collection('admins').document(new_adminP.admin_id).set({
        'admin_email': new_adminP.admin_email,
        'admin_id': new_adminP.admin_id,
        # "last_login": new_admin.last_login,  # Uncomment if these fields are available
        # "creation_time": new_admin.creation_time  # Uncomment if these fields are available
    })

    db.session.add(new_adminP)
    db.session.commit()
    print(type(new_admin))
    print(new_admin['localId'])

    access_token = create_access_token(identity=new_admin['localId'], expires_delta=timedelta(days=1))
    refresh_token = create_refresh_token(identity=new_admin['localId'], expires_delta=timedelta(days=2))
    print("Admin created successfully")
    return jsonify({'message': 'admin created successfully', "tokens": {"access_token": access_token, "refresh_token": refresh_token}}), 200

@admin_routes.route("/login", methods=["POST"])
def admin_login():
    data = request.json
    print(data)
    email = data.get('admin_email')
    try:
        user = firebaseAuth.sign_in_with_email_and_password(email=data.get('admin_email'), password=data.get('admin_password'))
        access_token = create_access_token(identity=user['localId'], expires_delta=timedelta(days=1))
        refresh_token = create_refresh_token(identity=user['localId'], expires_delta=timedelta(days=2))
        return jsonify({'message': 'login successful', "tokens": {"access_token": access_token, "refresh_token": refresh_token}}), 200
    except Exception as e:
        return jsonify({'message': 'invalid credentials'}), 401