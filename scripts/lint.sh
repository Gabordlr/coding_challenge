#!/bin/bash

# Lint all code

set -e

echo "Linting code..."

# Lint frontend
if [ -d "frontend" ]; then
  echo "Linting frontend..."
  cd frontend
  npm run lint
  cd ..
fi

# Lint backend (if configured)
if [ -d "backend" ] && [ -f "backend/package.json" ]; then
  if grep -q "\"lint\"" backend/package.json; then
    echo "Linting backend..."
    cd backend
    npm run lint || true
    cd ..
  fi
fi

echo "Linting complete!"

