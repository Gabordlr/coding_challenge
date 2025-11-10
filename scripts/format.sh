#!/bin/bash

# Format all code with Prettier

set -e

echo "Formatting code with Prettier..."

# Format root files
if [ -f "package.json" ]; then
  npm run format
fi

# Format frontend
if [ -d "frontend" ]; then
  echo "Formatting frontend..."
  cd frontend
  npm run format || true
  cd ..
fi

# Format backend
if [ -d "backend" ]; then
  echo "Formatting backend..."
  cd backend
  npm run format || true
  cd ..
fi

echo "Code formatting complete!"

