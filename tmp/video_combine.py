
from moviepy import VideoFileClip, concatenate_videoclips


VIDEO_PATH_1 = "sunrise.mp4"
VIDEO_PATH_2 = "sunrise_reversed.mp4"
OUTPUT_PATH = "sunrise_combined.mp4"

video1 = None
video2 = None
combined = None

try:
    # Load both videos
    video1 = VideoFileClip(VIDEO_PATH_1)
    video2 = VideoFileClip(VIDEO_PATH_2)

    # Combine: original first, reversed second
    combined = concatenate_videoclips(
        [video1, video2],
        method="compose"
    )

    # Export the combined video
    combined.write_videofile(
        OUTPUT_PATH,
        codec="libx264",
        audio_codec="aac",
        fps=video1.fps
    )

    print(f"Done! Saved as {OUTPUT_PATH}")
    print(f"Combined duration: {combined.duration:.2f} seconds")

finally:
    if combined is not None:
        combined.close()
    if video1 is not None:
        video1.close()
    if video2 is not None:
        video2.close()
