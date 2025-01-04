
from flask import Blueprint,jsonify,request,send_file
from Models.User_moel import User,Images



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


