from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'Flask server is running'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)