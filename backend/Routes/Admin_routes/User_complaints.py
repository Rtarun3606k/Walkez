from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required,get_jwt
from config import db, firebaseDataStore, firebaseAuth

from datetime import timedelta

admin_routes_complaints = Blueprint('admin_routes_complaints', __name__)

complaints = firebaseDataStore.collection('complaints')
firebaseUsers = firebaseDataStore.collection('users')


@admin_routes_complaints.route("/get_complaints", methods=["GET"])
@jwt_required()
def get_complaints():
    claims = get_jwt()

    if claims.get('role') != 'admin':
        return jsonify({'message': 'admin not found'}), 401

    try:
        query = complaints.where('complaint_status', '==', False).stream()
        complaints_data = []
        for complaint in query:
            complaint_dict = complaint.to_dict()
            # Add the document ID to the complaint dictionary
            complaint_dict['complaint_id'] = complaint.id
            # Process images if they exist
            complaint_dict['images'] = {image['index']: image['imageURL'] for image in complaint_dict.get('images', [])}
            complaints_data.append(complaint_dict)
        return jsonify({'complaints_data': complaints_data, 'message': "complaints found"}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@admin_routes_complaints.route("/close_complaint", methods=["POST"])
@jwt_required()
def close_complaint():
    claims = get_jwt()

    if claims.get('role') != 'admin':
        return jsonify({'message': 'admin not found'}), 401

    try:
        data = request.get_json()
        complaint_id = data.get('complaint_id')

        complaint = complaints.document(complaint_id)
        complaint.update({'complaint_status': True})
        return jsonify({'message': 'complaint closed'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': str(e)}), 500