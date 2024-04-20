import whisper

def transcribe_audio(audio_file):
    print('before transcribing')
    model = whisper.load_model("large-v3")
    result = model.transcribe(audio_file)
    print('after transcribing')
    return result["text"]