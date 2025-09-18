#!/bin/bash

# Script to optimize background video for hero section
# Usage:
#   ./optimize-video.sh input.mp4 hero-video

INPUT=$1
BASENAME=$2

if [ -z "$INPUT" ] || [ -z "$BASENAME" ]; then
  echo "Usage: ./optimize-video.sh input.mp4 hero-video"
  exit 1
fi

# 1. MP4 (H.264, 1280px)
ffmpeg -i "$INPUT" \
  -vf "scale=1280:-2,fps=24" \
  -c:v libx264 -preset veryfast -crf 28 -an \
  "${BASENAME}.mp4"

# 2. WebM (VP9, 1280px, three CRF variants)
for CRF in 32 35 38; do
  ffmpeg -i "$INPUT" \
    -vf "scale=1280:-2,fps=24" \
    -c:v libvpx-vp9 -b:v 0 -crf $CRF -cpu-used 4 -an \
    "${BASENAME}-crf${CRF}.webm"
done

# 3. Mobile MP4 (640px)
ffmpeg -i "$INPUT" \
  -vf "scale=640:-2,fps=24" \
  -c:v libx264 -preset veryfast -crf 30 -an \
  "${BASENAME}-mobile.mp4"

# 4. Poster (WebP, 1280px)
ffmpeg -i "$INPUT" -ss 00:00:01.000 -vframes 1 \
  -vf "scale=1280:-2" \
  "${BASENAME}-poster.webp"

echo "✅ Done! Created files:"
echo "  ${BASENAME}.mp4"
echo "  ${BASENAME}-crf32.webm"
echo "  ${BASENAME}-crf35.webm"
echo "  ${BASENAME}-crf38.webm"
echo "  ${BASENAME}-mobile.mp4"
echo "  ${BASENAME}-poster.webp"