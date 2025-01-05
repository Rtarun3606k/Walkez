from dotenv import load_dotenv
load_dotenv()
import os

# Firebase configurations stored in .env file
firebaseConfig = {
    "apiKey": os.getenv("apiKey"),
    "authDomain": os.getenv("authDomain"),
    "databaseURL": os.getenv("databaseURL"),  
    "projectId": os.getenv("projectId"),
    "storageBucket": os.getenv("storageBucket"),
    "messagingSenderId": os.getenv("messagingSenderId"),
    "appId": os.getenv("appId"),
    "measurementId": os.getenv("measurementId")
}

# print(firebaseConfig)