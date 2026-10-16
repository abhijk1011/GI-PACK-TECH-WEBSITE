#!/usr/bin/env bash
#
# Prepares a product video for the "Product videos" row on the home page.
#
#   scripts/encode-video.sh <input video> <name>
#
# writes public/video/<name>.mp4 and public/video/<name>.webp, then prints
# the entry to add to content/videos.yml.
#
# What it does to the clip, and why:
#   - crops and scales to 720 x 1280 (9:16). The cards are never shown taller
#     than about 530 points, so this is sharp on a retina screen.
#   - H.264, yuv420p — the one format every browser and every phone plays.
#   - CRF 24 at 30 fps: a 15-second clip lands at roughly 2-4 MB.
#   - drops the sound. The row plays muted, and a sound track is weight with
#     nothing to show for it.
#   - +faststart moves the index to the front, so playback starts before the
#     file has finished downloading.
#   - the still is taken one second in, past any fade from black, and is what
#     shows while the clip loads and to visitors who have turned motion off.
#
# Needs ffmpeg.

set -euo pipefail

if [ "$#" -ne 2 ]; then
  echo "usage: scripts/encode-video.sh <input video> <name>" >&2
  exit 1
fi

input="$1"
name="$2"
if ! [[ "$name" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
  echo "name must be lowercase words joined by hyphens, e.g. evoh-barrier-liner" >&2
  exit 1
fi

root="$(cd "$(dirname "$0")/.." && pwd)"
out="$root/public/video"
mkdir -p "$out"

ffmpeg -hide_banner -loglevel error -y -i "$input" \
  -vf "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,fps=30" \
  -c:v libx264 -profile:v high -preset slow -crf 24 -pix_fmt yuv420p \
  -movflags +faststart -an \
  "$out/$name.mp4"

ffmpeg -hide_banner -loglevel error -y -ss 1 -i "$out/$name.mp4" \
  -frames:v 1 -c:v libwebp -quality 80 \
  "$out/$name.webp"

size=$(du -h "$out/$name.mp4" | cut -f1)
secs=$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$out/$name.mp4" | cut -d. -f1)
echo "public/video/$name.mp4  ($size, ${secs}s)"
echo
echo "Add to content/videos.yml:"
echo
echo "  - file: /video/$name.mp4"
echo "    poster: /video/$name.webp"
echo "    title: "
echo "    line: "
echo "    product: "
