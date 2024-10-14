from config import db, app

class User(db.Model):
    user_id = db.Column(db.Integer(),nullable = False,primary_key=True)
    user_name = db.Column(db.String(100),nullable = False)
    user_email = db.Column(db.String(150),nullable = False,unique= True)
    user_password = db.Column(db.String(150),nullable = False)
    user_profile = db.Column(db.LargeBinary, nullable=True)  # Large binary for image
    mimetype = db.Column(db.String(50), nullable=True)
    user_profile_image_name = db.Column(db.String(50), nullable=True)
    user_phone = db.Column(db.String(15), nullable=True)
    user_email_verified = db.Column(db.Boolean(), nullable=True)
    user_phone_verified = db.Column(db.Boolean(), nullable=True)



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
