from flask import Flask, jsonify, request
import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'Flask server is running'})

@app.route('/api/birds', methods=['GET'])
def get_birds():
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
            return jsonify(response.json())
        else:
            return jsonify({
                'error': f'eBird API request failed with status code {response.status_code}',
                'message': response.text
            }), response.status_code
    
    except Exception as e:
        return jsonify({'error': 'Server error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)