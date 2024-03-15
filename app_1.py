# from flask import Flask

# app = Flask(__name__)

# @app.route('/')
# def index():
#     return 'Hello, World!'



# from flask import Flask, request, jsonify, render_template_string
# from flask_cors import CORS
# from flask_socketio import SocketIO, emit
# from transformers import Wav2Vec2Processor, Wav2Vec2ForCTC
# import torch
# import numpy as np

# app = Flask(__name__)
# CORS(app)  # This will enable CORS for all routes and methods.

# socketio = SocketIO(app, cors_allowed_origins="*")

# processor = Wav2Vec2Processor.from_pretrained("facebook/mms-1b-all")
# model = Wav2Vec2ForCTC.from_pretrained("facebook/mms-1b-all")



# @app.route('/')
# def index():
#     # Here you could also return an actual HTML file with render_template if you have a template directory set up.
#     # For simplicity, we'll return a string directly.
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

# @socketio.on('audio_chunk')
# def handle_audio_chunk(data):
#     # print('data from handle_audio_chunk', data)
#     # Convert data['audio'] from JavaScript Float32Array to numpy array
#     audio_chunk = np.frombuffer(data['audio'], dtype=np.float32)
    
#     try:
#         input_values = processor(audio_chunk, return_tensors="pt", padding="longest", sampling_rate=16000).input_values
#         with torch.no_grad():
#             logits = model(input_values).logits
#         predicted_ids = torch.argmax(logits, dim=-1)
#         transcription = processor.batch_decode(predicted_ids)[0]
#         print('transcription from handle_audio_chunk')
#         print(transcription)
#         emit('transcription_result', {'transcription': transcription})
#     except Exception as e:
#         print(f"Error processing audio chunk: {e}")
#         emit('error', {'error': str(e)})

# if __name__ == '__main__':
#     socketio.run(app, debug=True)



from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from transformers import Wav2Vec2Processor, Wav2Vec2ForCTC
import torch
import numpy as np
import soundfile as sf
import io
import librosa

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes and methods.

socketio = SocketIO(app, cors_allowed_origins="*")

# Consider using a lighter model for faster processing, if available and suitable for your needs.
processor = Wav2Vec2Processor.from_pretrained("facebook/mms-1b-all")
model = Wav2Vec2ForCTC.from_pretrained("facebook/mms-1b-all")
file_write_mode = 'w'  # 'w' for new file/write, 'a' for append
# Utilize GPU for model inference if available.
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
def test_connect():
    print('Client connected')

@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected')

# This is a placeholder function for VAD; you'll need to replace it with actual VAD logic
def voice_activity_detection(audio_chunk):
    # Use PyDub's split_on_silence or another VAD method here
    # For demonstration purposes, let's pretend we're just returning the chunk as is
    return audio_chunk


def speech_to_text(audio_data, sample_rate=48000, target_sample_rate=16000, audio_path="temp_audio.wav"):
    global file_write_mode
    """
    Transcribes speech from raw audio data using a pretrained model.
    """
    try:
        # Convert the binary data to a NumPy array
        speech = np.frombuffer(audio_data, dtype=np.float32)

        if sample_rate != target_sample_rate:
            speech = librosa.resample(speech, orig_sr=sample_rate, target_sr=target_sample_rate)

        # sf.write('', speech, 16000)
        if file_write_mode == 'w':
            # Start a new file
            with sf.SoundFile('/Users/adityadubey/heycoach/asr_python/testing.wav', mode=file_write_mode, samplerate=16000, channels=1) as file:
                file.write(speech)
            # Future chunks will append to the file
            file_write_mode = 'r+' 
        else:
            # Append to the existing file
            with sf.SoundFile('/Users/adityadubey/heycoach/asr_python/testing.wav', mode='r+') as file:
                file.seek(0, io.SEEK_END)  # Seek to the end of the file
                file.write(speech)
        # Assume audio_data is already sampled at 16kHz
        input_values = processor(speech, return_tensors="pt", padding="longest", sampling_rate=16000).input_values

        # Move to GPU if available
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
        print(f"Error transcribing audio: {e}")
        return None


@socketio.on('audio_chunk')
def handle_audio_chunk(*args):
    
   # latest change
    # Process incoming audio data for transcription
    transcription = speech_to_text(args[0])

    if transcription:
        print('Transcription:', transcription)
        emit('transcription_result', {'transcription': transcription})
    else:
        emit('transcription_result', {'transcription': 'No speech detected or unintelligible audio.'})



# @socketio.on('audio_chunk')
# def handle_audio_chunk(*args):
#     # print(args)
#      # The first argument should be the data, but let's check to make sure.
#     # if len(args) == 1 and isinstance(args[0], bytes):
#     data = args[0]
#     # else:
#     #     print("Unexpected data format or arguments")
#     #     emit('error', {'error': 'Unexpected data format or arguments'})
#     #     return
#    # Since we're receiving the audio as a binary blob, let's directly convert it to a numpy array
#     try:
#         # The audio data is received directly as bytes; convert them to a numpy array
#         audio_chunk = np.frombuffer(data, dtype=np.float32)

#         # Assuming the audio is already at the correct sample rate (16kHz)
#         input_values = processor(audio_chunk, return_tensors="pt", padding="longest", sampling_rate=16000).input_values

#         # Move to GPU if available
#         if torch.cuda.is_available():
#             input_values = input_values.to('cuda')

#         with torch.no_grad():
#             logits = model(input_values).logits

#         predicted_ids = torch.argmax(logits, dim=-1)
#         transcription = processor.batch_decode(predicted_ids)[0]

#         if transcription:
#             print('Transcription:', transcription)
#             emit('transcription_result', {'transcription': transcription})
#         else:
#             emit('transcription_result', {'transcription': 'No speech detected or unintelligible audio.'})

#     except Exception as e:
#         print(f"Error processing audio chunk: {e}")
#         emit('error', {'error': str(e)})




if __name__ == '__main__':
    socketio.run(app, debug=True)



