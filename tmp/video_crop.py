
from moviepy import VideoFileClip, vfx

INPUT_PATH = "output.mp4"
OUTPUT_PATH = "cropped_output.mp4"

CROP_HEIGHT = 800  # Keep the top 1000 pixels

video = None
cropped_video = None

try:
    video = VideoFileClip(INPUT_PATH)

    width, height = video.size

    # Ensure the crop does not exceed the original height
    crop_height = min(CROP_HEIGHT, height)

    # Keep the full width and the top portion of the video
    cropped_video = video.with_effects([
        vfx.Crop(
            x1=0,
            y1=0,
            x2=width,
            y2=crop_height,
        )
    ])

    cropped_video.write_videofile(
        OUTPUT_PATH,
        codec="libx264",
        audio_codec="aac",
        fps=video.fps,
    )

    print(f"Saved cropped video: {OUTPUT_PATH}")
    print(f"Original dimensions: {width}x{height}")
    print(f"Cropped dimensions: {width}x{crop_height}")

finally:
    if cropped_video is not None:
        cropped_video.close()
    if video is not None:
        video.close()
