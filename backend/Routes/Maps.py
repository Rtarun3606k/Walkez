from flask import Blueprint, jsonify, request, send_file
from Models.User_moel import User, Images, Complaints
from config import db, firebaseDataStore

complaints = firebaseDataStore.collection('complaints')
firebaseUsers = firebaseDataStore.collection('users')

map_route = Blueprint('map_route', __name__)

@map_route.route("/get_all_images", methods=["GET"])
def get_all_images():
    try:
        images = firebaseDataStore.collection('images').stream()
        image_data = []
        for image in images:
            image_dict = image.to_dict()
            image_data.append({
                "image_id": image_dict.get("image_id"),
                "image_name": image_dict.get("image_name"),
                "mimetype": image_dict.get("mimetype"),
                "longitude": image_dict.get("longitude"),
                "latitude": image_dict.get("latitude"),
                "problem": image_dict.get("problem"),
                "stars": image_dict.get("stars")
            })
        if not image_data:
            return jsonify({'message': 'no images found'}), 204
        return jsonify({'image_data': image_data, 'message': "images found"}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@map_route.route("/get_all", methods=["GET"])
def get_all():
    try:
        query = complaints.where('complaint_status', '==', False).stream()
        complaints_data = []
        for complaint in query:
            complaint_dict = complaint.to_dict()
            complaint_dict['images'] = {image['index']: image['imageURL'] for image in complaint_dict.get('images', [])}
            complaints_data.append(complaint_dict)
        return jsonify({'complaints_data': complaints_data, 'message': "complaints found"}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500


