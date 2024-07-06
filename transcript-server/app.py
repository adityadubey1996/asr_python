from flask import Flask, send_from_directory, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import text
from sqlalchemy.exc import SQLAlchemyError
from flask_socketio import SocketIO, emit, disconnect
import os
import jwt

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
# Load environment variables from a .env file
from dotenv import load_dotenv
load_dotenv()


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



UPLOAD_FOLDER = './uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.teardown_appcontext
def shutdown_session(exception=None):
    db.session.remove()

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
    socketio.run(app, host='0.0.0.0', port=5005)
