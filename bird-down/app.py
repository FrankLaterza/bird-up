import json
from flask import Flask, jsonify, request, send_from_directory
import requests
import os
import re
import uuid
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
from flask_cors import CORS
from birds import BirdSightingManager
from ml.image_processing import process_image

load_dotenv()

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'bird_images')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'Flask server is running'})

def load_bird_descriptions(file_path):
    descriptions = {}
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    entries = re.split(r'\n\d+\.\s*', content)[1:]
    for entry in entries:
        lines = entry.strip().split('\n', 1)
        if len(lines) == 2:
            name, desc = lines
            name = (re.sub(r'^\d+\.\s*', '', name.strip())).lower()
            key = re.sub(r'[ -]+', '_', name)
            descriptions[key] = desc.strip()
    return descriptions


BIRD_DESCRIPTION_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'bird_descs.txt')
bird_descriptions = load_bird_descriptions(BIRD_DESCRIPTION_FILE)
print(bird_descriptions)

def clean_bird_data(bird_data):
    cleaned_data = []
    for bird in bird_data:
        cleaned_bird = {
            'comName': bird.get('comName'),
            'lat': bird.get('lat'),
            'lng': bird.get('lng'),
            'obsDt': bird.get('obsDt')
        }
        if cleaned_bird['comName']:
            name = re.sub(r"'s\b", '', cleaned_bird['comName'])
            name = re.sub(r'[ -]+', '_', name)
            cleaned_bird['comName'] = name
        cleaned_data.append(cleaned_bird)
    return cleaned_data

@app.route('/api/get-bird-sightings', methods=['GET'])
def get_bird_sightings():
    lat = request.args.get('lat')
    lng = request.args.get('lng')
    if not lat or not lng:
        return jsonify({'error': 'Missing required parameters: lat and lng'}), 400
    
    try:
        ebird_api_token = os.getenv('EBIRD_API_TOKEN')
        if not ebird_api_token:
            return jsonify({'error': 'eBird API token not configured'}), 500

        url = f"https://api.ebird.org/v2/data/obs/geo/recent"
        headers = {'X-eBirdApiToken': ebird_api_token}
        params = {'lat': lat, 'lng': lng}
        response = requests.get(url, headers=headers, params=params)

        if response.status_code == 200:
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

# GET /api/get-gallery-data
@app.route('/api/get-gallery-data', methods=['GET'])
def get_gallery_data():
    try:
        # Read the bird_report.json file
        with open('bird_report.json', 'r') as f:
            bird_data = json.load(f)
        return jsonify(bird_data)
    except Exception as e:
        return jsonify({'error': 'Error loading gallery data', 'message': str(e)}), 500

# Route to serve bird images
@app.route('/bird_images/<path:filename>', methods=['GET'])
def serve_bird_image(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/api/upload-image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image part in the request'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No image selected'}), 400

    if allowed_file(file.filename):
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4()}_{filename}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(file_path)

        results, quality_score = process_image(file_path, "input")
        best_bird, best_prob = results[0]
        print(best_bird, best_prob, file_path, quality_score)


        normalized_bird_name = (re.sub(r'[ -]+', '_', re.sub(r'^\d+\.\s*', '', best_bird.strip()))).lower()
        print(normalized_bird_name)
        description = bird_descriptions.get(normalized_bird_name, "No description available.")

        bird_db = BirdSightingManager()
        bird_db.add_sighting('DEFAULT_USER', best_bird, file_path, quality_score, description)

        output_json_file = f"bird_report.json"
        bird_db.export_user_sightings_to_json('DEFAULT_USER', output_json_file)

        return jsonify({
            'success': True,
            'message': 'Image uploaded successfully',
            'filename': unique_filename,
            'path': file_path
        })
    
    return jsonify({'error': 'File type not allowed'}), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
