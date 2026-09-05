If your file is MP3 and you want to avoid generation loss:

Convert once to WAV
Apply volume
Encode back to MP3 at high bitrate

```bash

# Check loudness:
ffmpeg -i "I:\git\git-repos\zhipu-transpose\swan-Feb 23 at 9-18 PM.m4a" -af "volumedetect" -f null NUL

# Quick increase by +5 dB and overwrite original (creates a temp file then moves it):

ffmpeg -i "I:\git\git-repos\zhipu-transpose\swan-Feb 23 at 9-18 PM.m4a" -filter:a "volume=5dB" -c:a aac -b:a 256k -y "I:\git\git-repos\zhipu-transpose\swan-Feb 23 at 9-18 PM.tmp.m4a" && move /Y "I:\git\git-repos\zhipu-transpose\swan-Feb 23 at 9-18 PM.tmp.m4a" "I:\git\git-repos\zhipu-transpose\swan-Feb 23 at 9-18 PM.m4a"

# Loudness normalization (recommended) and overwrite:
ffmpeg -i "I:\git\git-repos\zhipu-transpose\swan-Feb 23 at 9-18 PM.m4a" -af "loudnorm=I=-16:TP=-1.5:LRA=11" -c:a aac -b:a 256k -y "I:\git\git-repos\zhipu-transpose\swan-Feb 23 at 9-18 PM.tmp.m4a" && move /Y "I:\git\git-repos\zhipu-transpose\swan-Feb 23 at 9-18 PM.tmp.m4a" "I:\git\git-repos\zhipu-transpose\swan-Feb 23 at 9-18 PM.m4a"

# trim first 3 seconds
ffmpeg -ss 3 -i "swan-Feb 23 at 9-18 PM.m4a" -c copy "swan-output-Feb 23 at 9-18 PM.m4a"

# keep first 2:46 minutes
ffmpeg -i "swan-output-Feb 23 at 9-18 PM.m4a" -t 00:02:46 -c copy "swan-output-output-Feb 23 at 9-18 PM.m4a"


# covert m4a to wav to prevent further quality loss
ffmpeg -i input.m4a output.wav