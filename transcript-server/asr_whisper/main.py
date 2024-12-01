# main.py
import os
import json
from services.file_downloader import FileDownloader
from services.transcription_service import TranscriptionService
from services.parameter_service import ParameterService
from services.summary_service import SummaryService
from services.audit_service import AuditService, AuditTranscript
# from services.database_service import MySQLDatabase
from utils.audit_parameters import AuditParameters
from config import Config

class MainProcessor:
    def __init__(self, openai_api_key=Config.OPENAI_API_KEY, groq_api_key=Config.GROQ_API_KEY):
        self.downloader = FileDownloader()
        self.transcription_service = TranscriptionService(model_name='base')
        self.parameter_service = ParameterService()
        self.summary_service = SummaryService(api_key=openai_api_key)
        self.groq_api_key = groq_api_key
        # self.db = MySQLDatabase()

    def process_file(self, file_url):
        # Step 1: Download the File
        # downloaded_file = self.downloader.download_file(file_url)
        # print(f"Downloaded file to: {downloaded_file}")
        downloaded_file = file_url
        # Step 2: Convert to Audio if it's a video
        if downloaded_file.lower().endswith(('.mp4', '.mov', '.avi', '.mkv')):
            audio_file = os.path.splitext(downloaded_file)[0] + '.mp3'
            from utils.audio_utils import AudioUtils
            AudioUtils.convert_video_to_audio(downloaded_file, audio_file)
            print(f"Converted video to audio: {audio_file}")
        else:
            audio_file = downloaded_file

        # Step 3: Transcribe the Audio and Save SRT
        transcript, segments = self.transcription_service.transcribe_audio(audio_file)
        srt_file = os.path.splitext(audio_file)[0] + '.srt'
        self.transcription_service.save_srt(segments, srt_file)
        print(f"Transcription saved to: {srt_file}")

        # Step 4: Get Parameters
        answers_str = self.parameter_service.get_parameters()
        audit_parameters = AuditParameters.determine_audit_parameters(answers_str)
        print("Audit Parameters:", audit_parameters)

        # Step 5: Generate Summary
        existing_summary = "This is the existing summary of the transcript."
        transcript_chunk = transcript  # In a real scenario, you might process this in chunks
        summary_prompt = AuditParameters.generate_summary_prompt(audit_parameters, existing_summary, transcript_chunk)
        print(summary_prompt)
        summary = self.summary_service.generate_summary(summary_prompt)
        print("Generated Summary:", summary)

        # Step 6: Generate Audit Report
        audit_service = AuditService(audit_parameters, summary)
        audit_report = audit_service.generate_audit_report()
        json_output = os.path.splitext(audio_file)[0] + '.json'
        with open(json_output, 'w') as f:
            json.dump(audit_report, f, indent=4)
        print(f"Audit report saved to: {json_output}")

        return {
            "srt_file": srt_file,
            "json_output": json_output
        }

    def close(self):
        print("closed")
        # self.db.close_connection()

if __name__ == "__main__":
    # Example file URL
    # file_url = "https://file-examples.com/wp-content/storage/2017/11/file_example_MP3_700KB.mp3"
    # file_url = "/Users/abhisrivastava/Documents/Github/asr_python/transcript-server/asr_whisper/uploads/Harvard list 01.wav"
    file_url = "/Users/abhisrivastava/Documents/Github/asr_python/transcript-server/asr_whisper/uploads/lep2mzjad6E4ufLGAAAD_YOU WONT BELIEVE WHAT THIS STUDENT DID.mp4"
    processor = MainProcessor()
    try:
        output = processor.process_file(file_url)
        print("Process completed successfully.")
        print(f"SRT File: {output['srt_file']}")
        print(f"JSON Output: {output['json_output']}")
    finally:
        processor.close()