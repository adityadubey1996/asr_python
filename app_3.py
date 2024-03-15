from flask import Flask, render_template_string
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from transformers import WhisperProcessor, WhisperForConditionalGeneration
import librosa
import numpy as np
import torch

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

processor = WhisperProcessor.from_pretrained("openai/whisper-base")
model = WhisperForConditionalGeneration.from_pretrained("openai/whisper-base")
if torch.cuda.is_available():
    model.to('cuda')

@app.route('/')
def index():
    return render_template_string("""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Live Transcription Service</title>
        </head>
        <body>
            <h1>Welcome to the Live Transcription Service</h1>
            <p>Connect via WebSocket to start sending audio chunks for transcription.</p>
        </body>
        </html>
    """)

@socketio.on('connect')
def on_connect():
    print('Client connected')

@socketio.on('disconnect')
def on_disconnect():
    print('Client disconnected')

@socketio.on('audio_chunk')
def handle_audio_chunk(*args):
    # Convert the binary audio_data to a numpy array
    audio_chunk = np.frombuffer(args[0], dtype=np.float32)
    
    # Resample the audio to 16kHz, which is the input requirement for the Whisper model
    audio_chunk_resampled = librosa.resample(audio_chunk, orig_sr=48000, target_sr=16000)

    # Prepare the audio data for the model
    inputs = processor(audio_chunk_resampled, return_tensors="pt", sampling_rate=16000)
    
    # Move tensors to GPU if available
    if torch.cuda.is_available():
        inputs = inputs.to('cuda')

    # Generate transcription
    with torch.no_grad():
        outputs = model.generate(**inputs)
    
    # Decode the output tokens to text
    transcription = processor.batch_decode(outputs, skip_special_tokens=True)[0]
    print('transcription')
    print(transcription)
    # Emit the transcription result back to the client
    emit('transcription_result', {'transcription': transcription})

if __name__ == '__main__':
    socketio.run(app, debug=True)
