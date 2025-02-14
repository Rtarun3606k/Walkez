from config import db, app
from sqlalchemy.dialects.postgresql import JSON
from datetime import datetime



class Admin(db.Model):
    admin_id = db.Column(db.String(150),nullable = False,primary_key=True)
    admin_name = db.Column(db.String(100),nullable = False)
    admin_email = db.Column(db.String(150),nullable = False,unique= True)
    # user_password = db.Column(db.String(150),nullable = False)
  

    # firebase UID
    firebase_uid = db.Column(db.String(150), nullable=False, unique=True)

    admin_info = db.Column(db.JSON(), nullable=True)
    # above field will store the user info data in json format
    # user_info = {
    #     "user_address": "address",
    #     "user_city": "city",
    #     "user_state": "state",
    #     "user_country": "country",
    #     "user_zip": "zip"
    # },

    
    # above field will store the user profile data in json format 
    # user_profile = {
    #     "profile_image": "image_url",
    #     "profile_img_name": "image.png"
    #     "profile_mimeType": "image/png"
    # },

#firebase
# { no of compliants solved : 
    #by departmant :
    # state
    # city
    # war no :
    # position:
    # verified : 
    # }