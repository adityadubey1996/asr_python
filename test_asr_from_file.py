# from transformers import Wav2Vec2Processor, Wav2Vec2ForCTC
# import librosa
# import torch  # Ensure torch is imported if you're using it directly

# # Load the processor and model
# processor = Wav2Vec2Processor.from_pretrained("facebook/mms-1b-all")
# model = Wav2Vec2ForCTC.from_pretrained("facebook/mms-1b-all")

# def speech_to_text(audio_path):
#     # Load the audio file
#     speech, sr = librosa.load(audio_path, sr=16000)

#     # Process the audio input
#     input_values = processor(speech, return_tensors="pt", padding="longest", sampling_rate=sr).input_values

#     # Perform inference
#     with torch.no_grad():
#         logits = model(input_values).logits

#     # Decode the model output
#     predicted_ids = torch.argmax(logits, dim=-1)
#     transcription = processor.batch_decode(predicted_ids)[0]

#     return transcription

# # Example usage
# audio_path = "/Users/adityadubey/heycoach/asr_python/testing_from_fronEnd.wav"
# transcription = speech_to_text(audio_path)
# print("Transcription:", transcription)

from transformers import Wav2Vec2Processor, Wav2Vec2ForCTC
import librosa
import torch  # Ensure torch is imported if you're using it directly
import subprocess
import os

# Load the processor and model
processor = Wav2Vec2Processor.from_pretrained("facebook/mms-1b-all")
model = Wav2Vec2ForCTC.from_pretrained("facebook/mms-1b-all")

def convert_to_wav(input_path, output_path='/Users/adityadubey/heycoach/asr_python/temp.wav'):
    """
    Converts an audio file to WAV format using FFmpeg.
    """
    try:
        subprocess.run(['ffmpeg', '-i', input_path, output_path], check=True)
        return output_path
    except subprocess.CalledProcessError as e:
        print("Failed to convert audio to WAV format:", e)
        return None

def speech_to_text(audio_path):
    """
    Transcribes speech from an audio file using a pretrained model.
    """
    # Attempt to load the audio file with librosa; convert if necessary.
    try:
        speech, sr = librosa.load(audio_path, sr=16000)
    except Exception as e:
        print(f"Error loading audio file: {e}. Attempting conversion to WAV...")
        converted_path = convert_to_wav(audio_path)
        if not converted_path:
            return "Conversion failed. Unable to transcribe audio."
        speech, sr = librosa.load(converted_path, sr=16000)
        os.remove(converted_path)  # Clean up temporary file

    # Process the audio input
    input_values = processor(speech, return_tensors="pt", padding="longest", sampling_rate=sr).input_values

    # Perform inference
    with torch.no_grad():
        logits = model(input_values).logits

    # Decode the model output
    predicted_ids = torch.argmax(logits, dim=-1)
    transcription = processor.batch_decode(predicted_ids)[0]

    return transcription

# Example usage
audio_path = 'https://hc-sales-reports.s3.ap-south-1.amazonaws.com/audio/4874e302-dd56-4c4e-9e53-1c0ba6111328.form-data'
# audio_path = "/Users/adityadubey/heycoach/asr_python/4720171d-5d64-4891-a165-9e79b76baa52.wav"
transcription = speech_to_text(audio_path)
print("Transcription:", transcription)
