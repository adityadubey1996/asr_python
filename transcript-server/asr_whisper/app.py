from flask import Flask, send_from_directory, request
from flask_socketio import SocketIO, emit
from google.cloud import storage
import time
from google.api_core import retry
import os
from google.api_core.exceptions import TooManyRequests
import random

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
storage_client = storage.Client()
bucket_name = 'user_files_asr'  # Replace with your actual bucket name
bucket = storage_client.bucket(bucket_name)
UPLOAD_FOLDER = './uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/uploads/<filename>')
def download_uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@socketio.on('connect')
def test_connect():
    print('Client connected')
    emit('connect_ack', {'message': 'Connected successfully'})

@socketio.on('start_upload')
def handle_start_upload(data):
    print('Handling start upload with data:', data)
    session_id = request.sid
    filename = data['fileName']
    emit('start_ack', {'message': 'Ready to start upload'})

def upload_chunk_with_retry(blob, chunk):
    """Upload a chunk with retry, implementing exponential backoff."""
    for n in range(0, 5):  # Retry up to 5 times
        try:
            blob.upload_from_string(chunk, content_type='application/octet-stream')
            return True
        except TooManyRequests as e:
            wait = 2 ** n + (random.randint(0, 1000) / 1000)  # Exponential backoff with jitter
            print(f"Rate limit exceeded, retrying in {wait} seconds...")
            time.sleep(wait)
    return False

@socketio.on('upload_chunk')
def handle_upload_chunk(data):
    session_id = request.sid
    chunk = data['chunk']
    filename = data['fileName']
    unique_filename = f"{session_id}_{filename}"
    blob = bucket.blob(unique_filename)
    # blob.upload_from_string(chunk, content_type='application/octet-stream')
    if not upload_chunk_with_retry(blob, chunk):
        emit('error', {'message': 'Failed to upload after retries'})
    file_path = os.path.join(UPLOAD_FOLDER, f"{session_id}_{filename}")
    with open(file_path, 'ab') as f:
        f.write(chunk)
    
    emit('chunk_ack', {'message': 'Chunk received'}, callback=True)  # Acknowledge the reception of the chunk

@socketio.on('end_upload')
def handle_end_upload(data):
    emit('upload_success', {'message': 'File uploaded successfully'})

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5005)
