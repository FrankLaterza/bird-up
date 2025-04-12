from flask import Flask, jsonify, request
import requests
import os
import re
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'Flask server is running'})

def clean_bird_data(bird_data):
    """
    Clean the bird sighting data by:
    1. Keeping only comName, lat, lng, and obsDt fields
    2. Cleaning comName to match the naming convention (removing apostrophes, separating words by underscores)
    
    Args:
        bird_data (list): List of bird sighting data from eBird API
        
    Returns:
        list: Cleaned bird sighting data
    """
    cleaned_data = []
    
    for bird in bird_data:
        # Extract only the required fields
        cleaned_bird = {
            'comName': bird.get('comName'),
            'lat': bird.get('lat'),
            'lng': bird.get('lng'),
            'obsDt': bird.get('obsDt')
        }
        
        # Clean the comName to match the naming convention
        if cleaned_bird['comName']:
            # Remove apostrophes and 's' after apostrophes
            name = re.sub(r"'s\b", '', cleaned_bird['comName'])
            # Replace spaces and hyphens with underscores
            name = re.sub(r'[ -]+', '_', name)
            cleaned_bird['comName'] = name
        
        cleaned_data.append(cleaned_bird)
    
    return cleaned_data

# GET /api/get-bird-sightings?lat=37.7749&lng=-122.4194 HTTP/1.1    
@app.route('/api/get-bird-sightings', methods=['GET'])
def get_bird_sightings():
    # Get latitude and longitude from query parameters
    lat = request.args.get('lat')
    lng = request.args.get('lng')
    
    # Validate parameters
    if not lat or not lng:
        return jsonify({'error': 'Missing required parameters: lat and lng'}), 400
    
    try:
        # Get eBird API token from environment variables
        ebird_api_token = os.getenv('EBIRD_API_TOKEN')
        if not ebird_api_token:
            return jsonify({'error': 'eBird API token not configured'}), 500
        
        # Make request to eBird API
        url = f"https://api.ebird.org/v2/data/obs/geo/recent"
        headers = {
            'X-eBirdApiToken': ebird_api_token
        }
        params = {
            'lat': lat,
            'lng': lng
        }
        
        response = requests.get(url, headers=headers, params=params)
        
        # Check if request was successful
        if response.status_code == 200:
            # Clean the bird data before returning
            bird_data = response.json()
            cleaned_data = clean_bird_data(bird_data)
            return jsonify(cleaned_data)
        else:
            return jsonify({
                'error': f'eBird API request failed with status code {response.status_code}',
                'message': response.text
            }), response.status_code
    
    except Exception as e:
        return jsonify({'error': 'Server error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)