
from moviepy import VideoFileClip, vfx

INPUT_PATH = "sunrise-1.mp4"
OUTPUT_PATH = "sunrise_reversed.mp4"

video = None
reversed_video = None

try:
    video = VideoFileClip(INPUT_PATH)

    # Reverse the video and its audio
    reversed_video = video.with_effects([vfx.TimeMirror()])

    reversed_video.write_videofile(
        OUTPUT_PATH,
        codec="libx264",
        audio_codec="aac",
        fps=video.fps,
    )

    print(f"Done! Saved as {OUTPUT_PATH}")

finally:
    if reversed_video is not None:
        reversed_video.close()
    if video is not None:
        video.close()
