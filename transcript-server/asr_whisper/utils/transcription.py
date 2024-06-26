import whisper

class Transcriber:
    def __init__(self, model_name="large-v3"):
        print("Loading the Model")
        self.model = whisper.load_model(model_name)

    def create_format_for_segments(self, result):
        final_text_string = ""
        for segment in result["segments"]:
            final_text_string += f"\nTime: {segment['start']} - {segment['end']} [{segment['text']}]"
        return final_text_string

    def split_text_into_chunks(self, long_text):
        """
        Splits a long text in the format Time: Start time - End time [Text] into chunks whenever the text length increases 5000.
        Each chunk includes both the timestamps and text in the same chunk.

        Args:
            long_text (str): A long text in the format Time: Start time - End time [Text]

        Returns:
            A list of chunks where each chunk is a string in the same format as long_text.
        """
        max_length = 3500
        chunks = []
        current_chunk = ""
        current_length = 0
        lines = long_text.split("\n")

        for line in lines:
            if current_length + len(line) > max_length:
                chunks.append(current_chunk.strip())
                current_chunk = ""
                current_length = 0
            current_chunk += line + "\n"
            current_length += len(line)

        if current_chunk.strip():
            chunks.append(current_chunk.strip())

        return chunks

    def transcribe_audio(self, audio_file):
        print("Starting Transcription")
        result = self.model.transcribe(audio_file, task="transcribe", language="en")
        print("Transcription completed")
        transcript_string = self.create_format_for_segments(result)
        transcript_chunks = self.split_text_into_chunks(transcript_string)
        return transcript_chunks

if __name__ == '__main__':
    sample_audio_path = '/Users/tnluser/Documents/github_doc/asr_python/asr_whisper/Monologue.mp3'
    transcriber = Transcriber()
    print(transcriber.transcribe_audio(sample_audio_path))
