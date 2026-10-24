# python -m pip install "moviepy>=2,<3"
# python .\match_video_audio.py
from moviepy import (
    VideoFileClip,
    AudioFileClip,
    concatenate_videoclips,
)

VIDEO_PATH = "sunrise.mp4"
AUDIO_PATH = "my_performance.m4a"
OUTPUT_PATH = "sunrise_performance_video.mp4"


def main():
    video = None
    audio = None
    repeated_video = None
    final_video = None

    try:
        video = VideoFileClip(VIDEO_PATH)
        audio = AudioFileClip(AUDIO_PATH)

        video_duration = video.duration
        audio_duration = audio.duration

        if video_duration <= 0 or audio_duration <= 0:
            raise ValueError("Video and audio must have valid durations.")

        # Calculate the number of video copies needed
        copies = int(audio_duration // video_duration)
        if copies * video_duration < audio_duration:
            copies += 1

        print(f"Video duration: {video_duration:.2f} seconds")
        print(f"Audio duration: {audio_duration:.2f} seconds")
        print(f"Repeating video {copies} time(s)...")

        # Repeat the video until it covers the entire audio
        repeated_video = concatenate_videoclips(
            [video] * copies,
            method="compose",
        )

        # Trim to audio length and attach the audio
        final_video = (
            repeated_video
            .subclipped(0, audio_duration)
            .with_audio(audio)
        )

        # Export the final MP4
        final_video.write_videofile(
            OUTPUT_PATH,
            codec="libx264",
            audio_codec="aac",
            fps=video.fps,
        )

        print(f"\nSuccess! Final video saved to: {OUTPUT_PATH}")
        print(f"Final duration: {audio_duration:.2f} seconds")

    except FileNotFoundError as error:
        print(f"File not found: {error.filename}")
        print("Make sure both input files are in this script's folder.")

    except Exception as error:
        print(f"An error occurred: {error}")

    finally:
        # Close clips safely
        if final_video is not None:
            final_video.close()
        if repeated_video is not None:
            repeated_video.close()
        if audio is not None:
            audio.close()
        if video is not None:
            video.close()


if __name__ == "__main__":
    main()
