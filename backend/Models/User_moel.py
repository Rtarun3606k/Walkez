from config import db, app
from sqlalchemy.dialects.postgresql import JSON
from datetime import datetime


class User(db.Model):
    user_id = db.Column(db.Integer(),nullable = False,primary_key=True)
    user_name = db.Column(db.String(100),nullable = False)
    user_email = db.Column(db.String(150),nullable = False,unique= True)
    # user_password = db.Column(db.String(150),nullable = False)
    user_phone = db.Column(db.String(15), nullable=True)
    user_email_verified = db.Column(db.Boolean(), nullable=True)
    user_phone_verified = db.Column(db.Boolean(), nullable=True)

    # firebase UID
    firebase_uid = db.Column(db.String(150), nullable=False, unique=True)

    user_info = db.Column(db.JSON(), nullable=True)
    # above field will store the user info data in json format
    # user_info = {
    #     "user_address": "address",
    #     "user_city": "city",
    #     "user_state": "state",
    #     "user_country": "country",
    #     "user_zip": "zip"
    # },

    user_profile = db.Column(db.JSON(), nullable=True)
    # above field will store the user profile data in json format 
    # user_profile = {
    #     "profile_image": "image_url",
    #     "profile_img_name": "image.png"
    #     "profile_mimeType": "image/png"
    # },
    



class Complaints(db.Model):
    complaint_id = db.Column(db.Integer(), nullable=False, primary_key=True)
    complaint_description = db.Column(db.Text(), nullable=False)
    user_id = db.Column(db.Integer(), db.ForeignKey('user.user_id', ondelete='CASCADE'), nullable=False)
    complaint_created_at = db.Column(db.DateTime(), nullable=False, default=datetime.utcnow)
    complaint_status = db.Column(db.String(50), nullable=False, default="open")
    complaint_closed_at = db.Column(db.DateTime(), nullable=True)
    complaint_closed_by = db.Column(db.Integer(), nullable=True)
    complaint_closed_reason = db.Column(db.Text(), nullable=True)
    complaint_closed_comment = db.Column(db.Text(), nullable=True)
    complaint_closed_rating = db.Column(db.Integer(), nullable=True)
    complaint_closed_rating_comment = db.Column(db.Text(), nullable=True)
    complaint_JSON = db.Column(JSON, nullable=True)

    user = db.relationship('User', backref=db.backref('complaints', lazy=True))

    # under json column we will store the json data of the complaint
    
    # before_image_url = db.Column(db.String(500), nullable=True) => array of images having 2 fields every index will have 2 fields image name and image url

    # after_image_array = db.Column(db.String(500), nullable=True) => array of images having 2 fields every index will have 2 fields image name and image url
    
    
    



class Images(db.Model):
    image = db.Column(db.LargeBinary, nullable=False)
    mimetype = db.Column(db.String(50), nullable=False)
    image_name = db.Column(db.String(50), nullable=False)
    image_id = db.Column(db.Integer(), nullable=False, primary_key=True)
    user_id = db.Column(db.Integer(), db.ForeignKey('user.user_id'), nullable=False)
    user = db.relationship('User', backref=db.backref('images', lazy=True))
    longitude = db.Column(db.String(50), nullable=True)
    latitude = db.Column(db.String(50), nullable=True)
    problem = db.Column(db.String(50), nullable=True)
    stars = db.Column(db.Integer(), nullable=True)
