#!/bin/bash
# Helper script to run ESLint on frontend files from the frontend directory
cd frontend
# Get files relative to frontend directory
files=()
for file in "$@"; do
  # Remove 'frontend/' prefix if present
  relative_file="${file#frontend/}"
  files+=("$relative_file")
done
npx eslint --fix "${files[@]}"

