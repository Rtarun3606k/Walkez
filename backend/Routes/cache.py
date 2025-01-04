from flask import Blueprint, jsonify, current_app
from flask_caching import Cache

cache_bp = Blueprint('cache', __name__)
cache = Cache()

def init_cache(app):
    cache_config = {
        'CACHE_TYPE': 'FileSystemCache',
        'CACHE_DIR': 'cache',  # Directory for cached data
        'CACHE_DEFAULT_TIMEOUT': 300  # Cache timeout in seconds
    }
    cache.init_app(app, config=cache_config)

@cache_bp.route('/map_route/get_all_images', methods=['GET'])
@cache.cached()
def get_all_images():
    current_app.logger.info("Cache miss: Fetching data from source")
    data = {
        "image_data": [
            {"image_id": 1, "latitude": 12.971598, "longitude": 77.594566},
            {"image_id": 2, "latitude": 13.082680, "longitude": 80.270718},
        ]
    }
    return jsonify(data)
