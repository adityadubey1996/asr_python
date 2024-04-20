sample = "/Users/tnluser/Documents/github_doc/asr_python/4720171d-5d64-4891-a165-9e79b76baa52.wav"
# result = pipe(sample)
# print(result["text"])

from utils.audio_utils import convert_video_to_audio
from utils.transcription import transcribe_audio
from utils.audit import audit_transcript
import os

def main():
    print('starting main')
    input_file = input("asr_whisper/videoplayback.mp4")
    print('input_file', input_file)

    file_ext = os.path.splitext(input_file)[1].lower()
    print('file_ext', file_ext)
    if file_ext in [".mp3", ".wav", ".flac"]:
        audio_file = input_file
    elif file_ext in [".mp4", ".mov", ".avi"]:
        print('inside vudeo to audio conversion')
        audio_file = os.path.splitext(input_file)[0] + ".wav"
        convert_video_to_audio(input_file, audio_file)
    else:
        print("Unsupported file format. Please provide an audio or video file.")
        return
    # audio_file = sample
    transcript = transcribe_audio(audio_file)


    audit_report = audit_transcript(transcript)

    print("\nTranscript:")
    print(transcript)
    print("\nAudit Report:")
    print(audit_report)

if __name__ == "__main__":
    main()