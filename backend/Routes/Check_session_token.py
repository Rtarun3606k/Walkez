from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt,create_access_token
from datetime import timedelta
from flask_jwt_extended import verify_jwt_in_request, create_access_token, create_refresh_token, get_jwt_identity, get_jwt, jwt_required
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError

check_session_token = Blueprint('check_session_token', __name__)

@check_session_token.route('/check_session_token', methods=['POST'])
@jwt_required()
def check():
    token_identity = get_jwt_identity()
    token_claims = get_jwt()

    if "token_type" in token_claims:
        token_type = token_claims["token_type"]
        if token_type == "access_token":
            print("Access token is valid")
            return jsonify({"msg": "Access token is valid"}), 200
        elif token_type == "refresh_token":
            print("Refresh token is valid")
            return jsonify({"msg": "Refresh token is valid"}), 200
    else:
        return jsonify({"msg": "Invalid token type"}), 400

    return jsonify({"msg": "Token is valid"}), 200


@check_session_token.route('/refresh_session_token', methods=['POST'])
@jwt_required(refresh=True) #takes refresh token and returns new access token
def refresh_token():
    token_identity = get_jwt_identity()
    if token_identity:
            refresh_token = create_access_token(identity=token_identity, expires_delta=timedelta(minutes=1) ,additional_claims={"token_type": "access_token"})
            return jsonify({"access_token": refresh_token,"msg":"created refresh token"}), 200
    return jsonify({"msg":"Signature Invalid " }), 401


@check_session_token.route('/check_token', methods=['POST'])
def check_token():
    try:
        verify_jwt_in_request()
        return jsonify({"msg": "Token is valid"}), 200
    except ExpiredSignatureError:
        return jsonify({"msg": "Token is expired"}), 401
    except InvalidTokenError:
        return jsonify({"msg": "Invalid token"}), 401
    except Exception as e:
        return jsonify({"msg": str(e)}), 401