from flask import Flask, send_from_directory, request
from flask_socketio import SocketIO, emit
import os

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

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

@socketio.on('upload_chunk')
def handle_upload_chunk(data):
    session_id = request.sid
    chunk = data['chunk']
    filename = data['fileName']
    file_path = os.path.join(UPLOAD_FOLDER, f"{session_id}_{filename}")
    with open(file_path, 'ab') as f:
        f.write(chunk)
    
    emit('chunk_ack', {'message': 'Chunk received'}, callback=True)  # Acknowledge the reception of the chunk

@socketio.on('end_upload')
def handle_end_upload(data):
    emit('upload_success', {'message': 'File uploaded successfully'})

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
