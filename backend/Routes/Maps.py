
from flask import Blueprint,jsonify,request,send_file
from Models.User_moel import User,Images,Complaints
from config import db,firebaseDataStore

complaints = firebaseDataStore.collection('complaints')

map_route = Blueprint('map_route', __name__)


@map_route.route("/get_all_images",methods=["GET"])
def get_all_images():
    images = Images.query.all()
    if not images:
        return jsonify({'message':'no images found'}),204
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

@map_route.route("/get_all", methods=["GET"])
def get_all():
    query = complaints.where('complaint_status', '==', False).stream()
    complaints_data = []
    for complaint in query:
        complaint_dict = complaint.to_dict()
        complaint_dict['images'] = {image['index']: image['imageURL'] for image in complaint_dict.get('images', [])}
        complaints_data.append(complaint_dict)
    print(complaints_data)

    return jsonify({'complaints_data': complaints_data, 'message': "complaints found"}), 200