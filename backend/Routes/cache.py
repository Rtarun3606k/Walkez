from flask import Blueprint, jsonify
from flask_caching import Cache

cache_bp = Blueprint('cache', __name__)
cache = Cache()

def init_cache(app):
    cache_config = {
        'CACHE_TYPE': 'FileSystemCache',
        'CACHE_DIR': 'cache',
        'CACHE_DEFAULT_TIMEOUT': 300
    }
    cache.init_app(app, config=cache_config)

# Caching the homepage API response
@cache_bp.route('/api/home')
@cache.cached()
def cached_home():
    # Example response for the homepage
    data = {
        "message": "Welcome to the cached homepage!",
        "featured_items": ["item1", "item2", "item3"]
    }
    return jsonify(data)