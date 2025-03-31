from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required,get_jwt
from config import db, firebaseDataStore, firebaseAuth
from firebase_admin.auth import UserNotFoundError,EmailAlreadyExistsError
from firebase_admin import firestore
from datetime import timedelta

Tenent_admin_home = Blueprint('tenet_home', __name__)

@Tenent_admin_home.route("/getComplaints", methods=["GET"])
@jwt_required()
def get_complaints():
    claims = get_jwt()
    print(get_jwt_identity())
    print(claims)

    if claims.get("role") != "Tenent":
        return jsonify({"message": "Unauthorized"}), 401

    try:
        # Fetch tenant data from Firestore
        tenent_doc = firebaseDataStore.collection('Tenent').document(get_jwt_identity()).get()
        if not tenent_doc.exists:
            return jsonify({"message": "Unauthorized"}), 401

        tenentData = tenent_doc.to_dict()
        if tenentData.get('banned') or not tenentData.get('account_status') or tenentData.get('role') != "Tenent":
            return jsonify({"message": "Unauthorized"}), 401

        # Get the tenant's city
        tenentCity = tenentData['city']
        print(tenentCity, "tenentCity")

        # Fetch complaints from Firestore
        complaints = firebaseDataStore.collection('complaints').where('city', '==', tenentCity).where('complaint_status', '==', False).stream()
        print(complaints, "complaints")

        # Convert the complaints to a list of dictionaries, including the complaint ID
        complaint_list = [{"id": complaint.id, **complaint.to_dict()} for complaint in complaints]
        print(complaint_list, "complaint_list")
        return jsonify(complaint_list), 200

    except Exception as e:
        print(f"Error fetching complaints: {e}")
        return jsonify({"message": "Internal Server Error"}), 500
    
@Tenent_admin_home.route("/closeComplaint", methods=["POST"])
@jwt_required()
def close_complaint():
    claims = get_jwt()
    print(get_jwt_identity())
    print(claims)

    if claims.get("role") != "Tenent":
        return jsonify({"message": "Unauthorized"}), 401

    data = request.json
    complaint_id = data.get('complaint_id')

    try:
        # Fetch tenant data from Firestore
        tenent_doc = firebaseDataStore.collection('Tenent').document(get_jwt_identity()).get()
        if not tenent_doc.exists:
            return jsonify({"message": "Unauthorized"}), 401

        tenentData = tenent_doc.to_dict()
        if tenentData.get('banned') or not tenentData.get('account_status') or tenentData.get('role') != "Tenent":
            return jsonify({"message": "Unauthorized"}), 401

        # Update the complaint status in Firestore
        complaint_ref = firebaseDataStore.collection('complaints').document(complaint_id)
        complaint_ref.update({
            'complaint_closed_by': get_jwt_identity(),
            'closed_time': firestore.SERVER_TIMESTAMP,
            "complaint_status": True,
            "complaint_closed_reason": data.get('complaint_closed_reason'),
            "complaint_closed_comment": data.get('complaint_closed_comment'),
            "complaint_banned": False,
            "complaint_closed_rating": data.get('complaint_closed_rating'),
        })

        # Add the closed complaint to the tenant's closed complaints list
        firebaseDataStore.collection('Tenent').document(get_jwt_identity()).update({
            'complaints_closed': firestore.ArrayUnion([complaint_id])
        })

        return jsonify({"message": "Complaint closed successfully"}), 200

    except Exception as e:
        print(f"Error closing complaint: {e}")
        return jsonify({"message": "Internal Server Error"}), 500
