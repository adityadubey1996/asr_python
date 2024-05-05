from moviepy.editor import VideoFileClip

def convert_video_to_audio(video_file, audio_file):
    video = VideoFileClip(video_file)
    audio = video.audio
    audio.write_audiofile(audio_file)
    video.close()
    audio.close()