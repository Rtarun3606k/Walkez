from config import db, app

class User(db.Model):
    user_id = db.Column(db.Integer(),nullable = False,primary_key=True)
    user_name = db.Column(db.String(100),nullable = False)
    user_email = db.Column(db.String(150),nullable = False,unique= True)
    user_password = db.Column(db.String(150),nullable = False)