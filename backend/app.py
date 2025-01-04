from flask import Flask, request, jsonify, Blueprint
from config import app, db
from flask_jwt_extended import verify_jwt_in_request, create_access_token, create_refresh_token, get_jwt_identity, get_jwt, jwt_required
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError

# importing all files from models folder

# importing all files from routes folder
from Routes.User_routes import user_route
from Routes.Check_session_token import check_session_token
from Routes.User_profile import user_profile_route
from Routes.Verification import verification_route
from Routes.Map import map_route
from Routes.cache import cache_bp, init_cache
init_cache(app) # Import cache blueprint

app.register_blueprint(user_route, url_prefix='/user_route')
app.register_blueprint(check_session_token, url_prefix='/check_session_token')
app.register_blueprint(user_profile_route, url_prefix='/user_profile_route')
app.register_blueprint(verification_route, url_prefix='/verification')
app.register_blueprint(map_route, url_prefix='/map_route')
app.register_blueprint(cache_bp)

# app.register_blueprint(admin,url_prefix='/admin')
# app.register_blueprint(check_session_token,url_prefix='/check_session_token')