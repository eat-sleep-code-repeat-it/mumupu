# Video utility scripts

These scripts use [MoviePy 2](https://pypi.org/project/moviepy/). Run the commands below in PowerShell from this folder:

```powershell
cd mumupu\tmp
```

## Setup

Install MoviePy in the Python environment you intend to use:

```powershell
py -m pip install "moviepy>=2,<3"
```

If the `py` launcher is unavailable, use `python` in its place. Confirm that Python and pip refer to the same environment.

## Scripts

The scripts use filenames configured near the top of each `.py` file. Put the required input files in this folder, or edit those constants to use different paths.

### Crop a video

`video_crop.py` reads `output.mp4` and writes `cropped_output.mp4`. It keeps the full width and the top 800 pixels (or the full height if the video is shorter).

```powershell
py .\video_crop.py
```

Place `output.mp4` in this folder before running it.

### Reverse a video

`video_reverse.py` reads `sunrise-1.mp4` and writes `sunrise_reversed.mp4`. The video and its audio are reversed.

```powershell
py .\video_reverse.py
```

Place `sunrise-1.mp4` in this folder before running it.

### Combine the original and reversed videos

`video_combine.py` concatenates `sunrise.mp4` followed by `sunrise_reversed.mp4` and writes `sunrise_combined.mp4`.

```powershell
py .\video_combine.py
```

Place both input files in this folder. To create the reversed input with the provided reverse script, first provide that script's configured input, `sunrise-1.mp4`, and run `video_reverse.py`. Rename or update the configured paths as needed so the reverse script's output is available as `sunrise_reversed.mp4`.

### Match a video to an audio recording

`video_audio_match.py` repeats `sunrise.mp4` as needed to cover the duration of `my_performance.m4a`, then writes `sunrise_performance_video.mp4`.

```powershell
py .\video_audio_match.py
```

Place both `sunrise.mp4` and `my_performance.m4a` in this folder before running it.
