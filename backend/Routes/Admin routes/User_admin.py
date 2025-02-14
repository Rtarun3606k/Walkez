from flask import Blueprint,jsonify,request,send_file
from io import BytesIO
from flask_jwt_extended import create_access_token,create_refresh_token
from config import db
from Models.User_moel import User
from Models.Admin_model import Admin
from datetime import timedelta
from flask_jwt_extended import get_jwt_identity,jwt_required

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