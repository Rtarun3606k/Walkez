from google.cloud import storage
from flask import jsonify
import os
import logging
from dotenv import load_dotenv

load_dotenv()
# Initialize the Google Cloud Storage client
def initialize_storage_client():
    return storage.Client.from_service_account_json(os.getenv("GOOGLE_APPLICATION_CREDENTIALS_BUCKET"))

def upload_images_to_bucket(image, bucket_name, user_id):
    try:
        client = initialize_storage_client()
        bucket = client.get_bucket(bucket_name)
        file_extension = image.filename.split('.')[-1]
        blob_name = f"complaints/{user_id}.{file_extension}"
        blob = bucket.blob(blob_name)
        blob.upload_from_file(image)
        url = f"https://storage.googleapis.com/{bucket_name}/{blob_name}"
        return url
    except Exception as e:
        raise Exception(f"Image upload failed: {str(e)}")

def delete_image_from_bucket(bucket_name, filename):
    try:
        client = initialize_storage_client()
        bucket = client.get_bucket(bucket_name)
        blob = bucket.blob(filename)
        blob.delete()
        print("Blob deleted")
        return True
    except Exception as e:
        print("Blob not deleted", e)
        return False

def create_bucket(bucket_name):
    try:
        client = initialize_storage_client()
        bucket = client.create_bucket(bucket_name)
        return True
    except Exception as e:
        return False