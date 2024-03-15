# from flask import Flask, render_template_string
# from flask_socketio import SocketIO, emit
# from flask_cors import CORS
# from transformers import Wav2Vec2Processor, Wav2Vec2ForCTC
# import numpy as np
# import soundfile as sf
# import librosa
# import torch

# app = Flask(__name__)
# CORS(app)
# socketio = SocketIO(app, cors_allowed_origins="*")

# processor = Wav2Vec2Processor.from_pretrained("facebook/wav2vec2-base-960h")
# model = Wav2Vec2ForCTC.from_pretrained("facebook/wav2vec2-base-960h")
# if torch.cuda.is_available():
#     model.to('cuda')

# class AudioBufferState:
#     def __init__(self, target_duration=5):
#         self.buffer = np.array([], dtype=np.float32)
#         self.duration = 0  # Duration in seconds
#         self.target_duration = target_duration  # Target duration for each block (e.g., 5 seconds)

#     def add_chunk(self, chunk, sample_rate):
#         # Add new chunk to the buffer
#         self.buffer = np.concatenate((self.buffer, chunk))
#         # Update the total duration of the buffer
#         self.duration += len(chunk) / sample_rate

#     def process_and_clear_buffer(self, process_function):
#         # Calculate how many samples correspond to the target duration
#         target_samples = int(self.target_duration * sample_rate)
#         # While the buffer has enough samples for the target duration
#         while len(self.buffer) >= target_samples:
#             # Process the first target_duration of audio
#             process_function(self.buffer[:target_samples])
#             # Remove the processed audio
#             self.buffer = self.buffer[target_samples:]
#             # Update duration
#             self.duration = len(self.buffer) / sample_rate

#         # Note: Any remaining audio under target_duration is left in the buffer for the next chunk

# audio_state = AudioBufferState()

# @app.route('/')
# def index():
#     return render_template_string("""
#         <!DOCTYPE html>
#         <html>
#         <head>
#             <title>Live Transcription Service</title>
#         </head>
#         <body>
#             <h1>Welcome to the Live Transcription Service</h1>
#             <p>Connect via WebSocket to start sending audio chunks for transcription.</p>
#         </body>
#         </html>
#     """)

# @socketio.on('connect')
# def test_connect():
#     print('Client connected')

# @socketio.on('disconnect')
# def test_disconnect():
#     print('Client disconnected')

# def process_audio(audio_buffer, target_sample_rate=16000):
#     try:
#         # Resample audio to target sample rate if needed
#         resampled_audio = librosa.resample(audio_buffer, orig_sr=48000, target_sr=target_sample_rate)
        
#         # Process with the ASR model
#         input_values = processor(resampled_audio, return_tensors="pt", sampling_rate=target_sample_rate).input_values
#         if torch.cuda.is_available():
#             input_values = input_values.to('cuda')
        
#         with torch.no_grad():
#             logits = model(input_values).logits
        
#         predicted_ids = torch.argmax(logits, dim=-1)
#         transcription = processor.batch_decode(predicted_ids)[0]
        
#         return transcription
#     except Exception as e:
#         print(f"Error processing audio: {e}")
#         return None

# @socketio.on('audio_chunk')
# def handle_audio_chunk(*args):
#     global audio_state
#     chunk = np.frombuffer(args[0], dtype=np.float32)
#     audio_state.add_chunk(chunk, sample_rate=48000)  # Assuming the sample_rate is 48kHz

#     if audio_state.duration >= 5:  # 5 seconds worth of audio
#         # Process the buffered audio
#         transcription = process_audio(audio_state.buffer)
        
#         # Emit the transcription result
#         if transcription:
#             emit('transcription_result', {'transcription': transcription})
#         else:
#             emit('transcription_result', {'transcription': 'Unable to transcribe audio.'})
        
#         # Clear the buffer for the next audio chunks
#         audio_state.process_and_clear_buffer()

# if __name__ == '__main__':
#     socketio.run(app, debug=True)


from flask import Flask, render_template_string
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from transformers import Wav2Vec2Processor, Wav2Vec2ForCTC, pipeline
import numpy as np
import soundfile as sf
import librosa
import torch

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

processor = Wav2Vec2Processor.from_pretrained("facebook/wav2vec2-base-960h")
model = Wav2Vec2ForCTC.from_pretrained("facebook/wav2vec2-base-960h")
if torch.cuda.is_available():
    model.to('cuda')

class AudioBufferState:
    def __init__(self):
        self.buffer = np.array([], dtype=np.float32)
        self.duration = 0  # Duration in seconds

    def add_chunk(self, chunk, sample_rate):
        self.buffer = np.concatenate((self.buffer, chunk))
        self.duration += len(chunk) / sample_rate

    def clear(self):
        self.buffer = np.array([], dtype=np.float32)
        self.duration = 0

audio_state = AudioBufferState()

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
def test_connect():
    print('Client connected')

@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected')

def process_audio(audio_buffer, target_sample_rate=16000):
    print('inside process_audio')
    try:
        # Resample audio to target sample rate if needed
        resampled_audio = librosa.resample(audio_buffer, orig_sr=48000, target_sr=target_sample_rate)
        print(resampled_audio)
        # Process with the ASR model
        input_values = processor(resampled_audio, return_tensors="pt", sampling_rate=target_sample_rate).input_values
        if torch.cuda.is_available():
            input_values = input_values.to('cuda')
        
        with torch.no_grad():
            logits = model(input_values).logits
        
        predicted_ids = torch.argmax(logits, dim=-1)
        transcription = processor.batch_decode(predicted_ids)[0]
        print('transcription')
        print(transcription)
        return transcription
    except Exception as e:
        print(f"Error processing audio: {e}")
        return None

@socketio.on('audio_chunk')
def handle_audio_chunk(*args):
    global audio_state
    chunk = np.frombuffer(args[0], dtype=np.float32)
    audio_state.add_chunk(chunk, sample_rate=48000)  # Assuming the sample_rate is 48kHz

    if audio_state.duration >= 1:  # 5 seconds worth of audio
        # Process the buffered audio
        transcription = process_audio(audio_state.buffer)
        
        # Emit the transcription result
        if transcription:
            emit('transcription_result', {'transcription': transcription})
        else:
            emit('transcription_result', {'transcription': 'Unable to transcribe audio.'})
        
        # Clear the buffer for the next audio chunks
        audio_state.clear()

if __name__ == '__main__':
    socketio.run(app, debug=True)

