from flask import Flask, send_from_directory, request
from flask_socketio import SocketIO, emit
from google.cloud import storage
import time
from google.api_core import retry
import os
from google.api_core.exceptions import TooManyRequests
import random
from dotenv import load_dotenv
from datetime import datetime, timedelta
from flask import Flask, send_from_directory, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import text
from sqlalchemy.exc import SQLAlchemyError
from flask_socketio import SocketIO, emit, disconnect
import os
import jwt


load_dotenv()

# Dictionary to store expiration time for each file

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")



# Setup database connection
DATABASE_URI = 'mysql+pymysql://{user}:{pw}@{host}:{port}/{db}'\
    .format(
        user=os.getenv('DB_USER'),
        pw=os.getenv('DB_PASSWORD'),
        host=os.getenv('DB_HOST'),
        port=os.getenv('DB_PORT'),
        db=os.getenv('DB_NAME')
    )

if os.getenv('ENVIRONMENT') == 'PROD':
    app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URI
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        'connect_args': {
            'ssl': {
                'ca': os.getenv('DB_ROOT_CERT'),
                'key': os.getenv('DB_KEY'),
                'cert': os.getenv('DB_CERT'),
            }
        }
    }
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URI

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)



storage_client = storage.Client()
bucket_name = 'user_files_asr'  # Replace with your actual bucket name
bucket = storage_client.bucket(bucket_name)
UPLOAD_FOLDER = './uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)



uploads = {}

@app.route('/uploads/<filename>')
def download_uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@socketio.on('connect')
def test_connect():
       # Extract token from query parameters
    token = request.args.get('token')
    
    if not token:
        print('No token provided')
        disconnect()
        return False
    
    try:
        decoded_user = jwt.decode(token, os.getenv('JWT_SECRET'), algorithms=['HS256'])
        print('decoded_user', decoded_user)
        
        # Retrieve user from database using raw SQL query
        user = get_user_by_token(decoded_user['id'], token)
        if not user:
            print('User not found')
            disconnect()
            return False
        print('Client authenticated and connected')
        print('Client connected')
        emit('connect_ack', {'message': 'Connected successfully'})
    except Exception as error:
        print('error while getting user', error)
        disconnect()

@socketio.on('start_upload')
def handle_start_upload(data):
    print('Handling start upload with data:', data)
    session_id = request.sid
    print('sessionId recorded', session_id)
    filename = data['fileName']
    uploads[session_id] = {
        'fileId': data['fileId'],
        'filename': filename,
        'blob': bucket.blob(f"{session_id}_{filename}"),
        'complete': False
    }
    print('uploads in start_upload', uploads)
    emit('start_ack', {'message': 'Ready to start upload', 'file' : data['fileName']})

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
    print('started uploading chunks for userId', data['fileName'])
    session_id = request.sid
    session = uploads.get(session_id)
    chunk = data['chunk']
    if session and not session['complete']:
        print('upload in progress')
        session['blob'].upload_from_string(chunk, content_type='application/octet-stream')
        emit('chunk_ack', {'message': 'Chunk received'})

    # else:
    #     emit('chunk_did_not_received', {'message' : 'Error'})

@socketio.on('end_upload')
def handle_end_upload(data):
    print('from end upload')
    # emit('upload_success', {'message': 'File uploaded successfully'})
    session_id = request.sid
    session = uploads.get(session_id)
    print('session outside the if condition', session)
    if session and not session['complete']:
        session['complete'] = True
        url = session['blob'].public_url
        print('session from end_upload', session)
        emit('upload_success', {'url': url, 'message': 'File uploaded successfully', 'fileId' : session['fileId']})
    else:
        emit('upload_failed', {'fileId' : session['fileId']})

def get_user_by_token(user_id, access_token):
    try:
        with db.engine.connect() as connection:
            sql_query = text("""
                SELECT * FROM Users WHERE id = :user_id AND access_token = :access_token
            """)
            result = connection.execute(sql_query, {'user_id': user_id, 'access_token': access_token})
            exists = result.scalar()
            print('exists', exists)
            return bool(exists)
    except SQLAlchemyError as e:
        print(f"Database error occurred: {e}")
        return False

if __name__ == '__main__':
    socketio.run(app,host='0.0.0.0',port=5005)
