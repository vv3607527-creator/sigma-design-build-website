#!/usr/bin/env bash
# Build the scroll film: cut the six source clips into one continuous, all-intra
# master (plus a poster) and refresh the per-chapter stills.
# Source clips live one level above the project (the supplied asset folder).
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ASSET_ROOT="$(cd "$PROJECT_ROOT/.." && pwd)"
OUT="$PROJECT_ROOT/public/media/film"
mkdir -p "$OUT"

SOURCES=(
  "Camera_descending_tower_facade_1080p_20261020144733.mp4|01-descent"
  "Drone_flying_through_building_an…_20261020144511.mp4|02-arrival"
  "Sliding_doors_opening_to_interior_20261020144826.mp4|03-threshold"
  "Camera_moving_through_penthouse_…_20261020144939.mp4|04-interior"
  "Camera_flying_through_industrial…_1080p_20261020145056.mp4|05-floor"
  "Camera_rises_over_factory_floor_20261020145155.mp4|06-finale"
)

# 1. Chapter posters, still used by the systems grid and the enquiry modal.
for entry in "${SOURCES[@]}"; do
  src="${entry%%|*}"
  slug="${entry##*|}"
  echo "== poster $slug"
  ffmpeg -v error -y -ss 0.4 -i "$ASSET_ROOT/$src" -frames:v 1 \
    -vf "scale=1440:-2:flags=lanczos" -q:v 4 "$OUT/$slug-poster.jpg"
done

# 2. The master. One continuous take per width so the scrubber drives a single
#    decoder: -g 1 makes every frame a keyframe, so a seek resolves in one decode.
build_master() {
  local width="$1" height="$2" crf="$3" name="$4"
  local args=() filters=""
  for entry in "${SOURCES[@]}"; do
    args+=(-i "$ASSET_ROOT/${entry%%|*}")
  done
  for index in "${!SOURCES[@]}"; do
    filters+="[$index:v]scale=${width}:${height}:force_original_aspect_ratio=increase,"
    filters+="crop=${width}:${height},setsar=1,fps=24[v$index];"
  done
  for index in "${!SOURCES[@]}"; do
    filters+="[v$index]"
  done
  filters+="concat=n=${#SOURCES[@]}:v=1:a=0[v]"

  echo "== master $name (${width}x${height})"
  ffmpeg -v error -y "${args[@]}" \
    -filter_complex "$filters" -map "[v]" -an \
    -c:v libx264 -preset slow -crf "$crf" -g 1 -keyint_min 1 -bf 0 -sc_threshold 0 \
    -pix_fmt yuv420p -movflags +faststart "$OUT/$name"
}

build_master 960 540 28 "film-master-960.mp4"
build_master 854 480 28 "film-master-854.mp4"

echo "== poster film-master-poster.jpg"
ffmpeg -v error -y -ss 0.15 -i "$OUT/film-master-960.mp4" -frames:v 1 \
  -q:v 4 "$OUT/film-master-poster.jpg"

echo "ALL ENCODES COMPLETE"
du -sh "$OUT"
