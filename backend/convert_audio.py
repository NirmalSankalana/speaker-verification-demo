from pydub import AudioSegment

def webm_to_wav(webm_file_path="backend/uploads/uprecorded_audio.webm", save_wav_file_name="backend/uploads/recorded_audio_wav.wav"):
    audio = AudioSegment.from_file(webm_file_path, format='webm')

    audio.export(save_wav_file_name, format="wav")
    print("Audio conversion completed successfully!")

if __name__ == "__main__":
    webm_to_wav()