#!/usr/bin/env bash
#
# Prepares a product video for the "Product videos" row on the home page.
#
#   scripts/encode-video.sh [--landscape] <input video> <name> [still at, in seconds]
#
# writes public/video/<name>.mp4 and public/video/<name>.webp, then prints
# the entry to add to content/videos.yml.
#
# What it does to the clip, and why:
#   - crops to 9:16 and scales down to 720 x 1280. The cards are never shown
#     taller than about 530 points, so this is sharp on a retina screen. A
#     clip smaller than that (one sent through WhatsApp arrives at about 480
#     wide) is kept at its own size: scaling it up adds blur, not detail.
#   - H.264, yuv420p — the one format every browser and every phone plays.
#   - CRF 28 at 30 fps: handheld footage lands at roughly 150 KB a second, so
#     a 24-second clip is about 3.5 MB. Shown at under 300 points wide, it is
#     indistinguishable from a file half as compressed again. For a long clip,
#     CRF=32 scripts/encode-video.sh ... squeezes harder; a minute of footage
#     then comes in around 5 MB with the detail still intact at card size.
#   - drops the sound. The row plays muted, and a sound track is weight with
#     nothing to show for it.
#   - +faststart moves the index to the front, so playback starts before the
#     file has finished downloading.
#   - the still is what shows while the clip loads and to visitors who have
#     turned motion off, so it should be the frame that best explains the
#     product. It is taken one second in (past any fade from black) unless a
#     time is given.
#
# --landscape is for footage shot sideways, including a sideways clip a phone
# has saved inside an upright frame with black bars above and below. Cropping
# that to 9:16 would keep a narrow slice of the scene, so instead the bars are
# found and trimmed, the whole shot is set sharp across the middle of the
# card, and the space above and below is filled with a blurred, slightly
# darkened copy of the same footage — the treatment Instagram and TikTok give
# landscape video.
#
# Needs ffmpeg.

set -euo pipefail

landscape=0
if [ "${1:-}" = "--landscape" ]; then
  landscape=1
  shift
fi

if [ "$#" -lt 2 ] || [ "$#" -gt 3 ]; then
  echo "usage: scripts/encode-video.sh [--landscape] <input video> <name> [still at, in seconds]" >&2
  exit 1
fi

input="$1"
name="$2"
still_at="${3:-1}"
crf="${CRF:-28}"
if ! [[ "$name" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
  echo "name must be lowercase words joined by hyphens, e.g. evoh-barrier-liner" >&2
  exit 1
fi

root="$(cd "$(dirname "$0")/.." && pwd)"
out="$root/public/video"
mkdir -p "$out"

if [ "$landscape" = 1 ]; then
  # The picture's real extent: the crop cropdetect reports most often over
  # the first few seconds, so one dark frame cannot skew it.
  picture=$(ffmpeg -hide_banner -ss 1 -t 8 -i "$input" -vf cropdetect=limit=24:round=2 -f null - 2>&1 \
    | grep -o 'crop=[0-9:]*' | sort | uniq -c | sort -rn | head -1 | awk '{print $2}')
  picture="${picture:-crop=iw:ih:0:0}"
  echo "picture area: ${picture#crop=}"
  ffmpeg -hide_banner -loglevel error -y -i "$input" \
    -filter_complex "[0:v]${picture},split=2[sharp][soft];\
[soft]scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,boxblur=40:3,eq=brightness=-0.08:saturation=0.85[back];\
[sharp]scale=720:-2[front];\
[back][front]overlay=(W-w)/2:(H-h)/2,fps=30,format=yuv420p[v]" \
    -map "[v]" -c:v libx264 -profile:v high -preset slow -crf "$crf" \
    -movflags +faststart -an \
    "$out/$name.mp4"
else
  ffmpeg -hide_banner -loglevel error -y -i "$input" \
    -vf "crop='trunc(min(iw,ih*9/16)/2)*2':'trunc(min(ih,iw*16/9)/2)*2',scale='min(720,iw)':-2,setsar=1,fps=30" \
    -c:v libx264 -profile:v high -preset slow -crf "$crf" -pix_fmt yuv420p \
    -movflags +faststart -an \
    "$out/$name.mp4"
fi

ffmpeg -hide_banner -loglevel error -y -ss "$still_at" -i "$out/$name.mp4" \
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
