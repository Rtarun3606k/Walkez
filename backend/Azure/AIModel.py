import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

def AIMLForComplaints(imageUrlParam):
    def parse_predictions(response_json):
        predictions = response_json.get('predictions', [])
        parsed_results = []

        for prediction in predictions:
            tag_name = prediction.get('tagName', 'Unknown')
            probability = prediction.get('probability', 0)
            bounding_box = prediction.get('boundingBox', {})
            left = bounding_box.get('left', 0)
            top = bounding_box.get('top', 0)
            width = bounding_box.get('width', 0)
            height = bounding_box.get('height', 0)

            parsed_results.append({
                'tag_name': tag_name,
                'probability': probability,
                'bounding_box': {
                    'left': left,
                    'top': top,
                    'width': width,
                    'height': height
                }
            })

        return parsed_results

    # Set up the headers and endpoint
    prediction_key = os.getenv("PREDICTION_KEY")
    endpoint = os.getenv("ENDPOINT").strip()  # Remove any trailing whitespace or newline characters

    if not prediction_key or not endpoint:
        raise ValueError("Environment variables PREDICTION_KEY and ENDPOINT must be set")

    headers = {
        "Prediction-Key": prediction_key,
        "Content-Type": "application/json"
    }

    # URL of the image
    image_url = imageUrlParam

    # Create the payload with the image URL
    payload = json.dumps({"url": image_url})

    # Send the request
    response = requests.post(endpoint, headers=headers, data=payload)

    # Print the response content for debugging
    print(f"Response Status Code: {response.status_code}")
    print(f"Response Content: {response.content}")

    # Check if the request was successful
    if response.status_code != 200:
        print(f"Error: {response.status_code} - {response.content}")
        response.raise_for_status()

    # Parse the response
    try:
        response_json = response.json()
    except json.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
        print(f"Response Text: {response.text}")
        raise

    parsed_results = parse_predictions(response_json)

    # Print the parsed results
    results_dict = []

    for result in parsed_results:
        if result['probability'] > 0.5:
            result_entry = {
                'tag': result['tag_name'],
                'probability': result['probability'],
                'bounding_box': {
                    'left': result['bounding_box']['left'],
                    'top': result['bounding_box']['top'],
                    'width': result['bounding_box']['width'],
                    'height': result['bounding_box']['height']
                }
            }
            results_dict.append(result_entry)

    # Print the results dictionary
    print(json.dumps(results_dict, indent=4))
    return results_dict


