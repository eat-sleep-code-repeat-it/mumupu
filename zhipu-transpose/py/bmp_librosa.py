import librosa
audio_file = librosa.load('zhangzhaoheng-77.mp3')
y, sr = audio_file
tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)
print('Estimated tempo: {:.2f} beats per minute'.format(tempo))

#beat_times = librosa.frames_to_time(beat_frames, sr=sr)
#beat_times
