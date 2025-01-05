from flask import jsonify
from config import blob_service_client




def uploadImagesToContainer(image,container,userId):
    try:
        blobContainername = blob_service_client.get_container_client(container)
        fileExtension = image.filename.split('.')[-1]
        blobName = f"{userId}.{fileExtension}"
        blobClient = blobContainername.upload_blob(blobName,image)
        url = blobClient.url
        return url
    except Exception as e:
        return jsonify({'message': 'Image upload failed', "error":e}),400
    

def DeleteImagesFromContainer(container,filename):
    try:
        blobContainername = blob_service_client.get_container_client(container)
        blobClient = blobContainername.get_blob_client(filename)
        blobClient.delete_blob()
        print("blob deleted")
        return True
    except Exception as e:
        print("blob not deleted",e)
        return False
    

def createContainer(container):
    try:
        blob_service_client.create_container(container)
        return True
    except Exception as e:
        return False