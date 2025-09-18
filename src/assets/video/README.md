# Video Optimization Instructions

This directory contains scripts and assets for optimizing background videos used in the hero section of the website.

## How to Generate Videos and Posters

1. Place your source video file in this directory and name it `input.mp4`

2. Run the optimization script from this directory:

   ```bash
   ./optimize-video.sh input.mp4 hero-video
   ```

3. The script will generate the following optimized files:
   - `hero-video.mp4` - Main MP4 video (H.264, 1280px width)
   - `hero-video-crf32.webm` - WebM video variant (VP9, CRF 32, 1280px width)
   - `hero-video-crf35.webm` - WebM video variant (VP9, CRF 35, 1280px width)
   - `hero-video-crf38.webm` - WebM video variant (VP9, CRF 38, 1280px width)
   - `hero-video-mobile.mp4` - Mobile-optimized MP4 video (640px width)
   - `hero-video-poster.webp` - Poster image for the video (WebP format)

   After optimization, choose among `hero-video-crf32.webm`, `hero-video-crf35.webm` and `hero-video-crf38.webm` the most appropriate WebM file based on size and quality requirements and rename it to `hero-video.webm`.

## Requirements

- FFmpeg must be installed on your system
- The script works on Unix-like systems (Linux, macOS)

## Notes

- The optimization process will overwrite any existing files with the same names
- All output videos are optimized for web delivery with appropriate compression
