#!/bin/bash

# Build frontend and backend

set -e

echo "Building project..."

# Build frontend
if [ -d "frontend" ] && [ -f "frontend/package.json" ]; then
  if grep -q "\"build\"" frontend/package.json; then
    echo "Building frontend..."
    cd frontend
    npm run build
    cd ..
    echo "Frontend build complete!"
  fi
fi

# Build backend
if [ -d "backend" ] && [ -f "backend/package.json" ]; then
  if grep -q "\"build\"" backend/package.json; then
    echo "Building backend..."
    cd backend
    npm run build
    cd ..
    echo "Backend build complete!"
  fi
fi

echo "Build complete!"

