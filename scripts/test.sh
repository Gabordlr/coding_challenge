#!/bin/bash

# Run all tests

set -e

echo "Running tests..."

# Run backend tests
if [ -d "backend" ] && [ -f "backend/package.json" ]; then
  if grep -q "\"test\"" backend/package.json; then
    echo "Running backend tests..."
    cd backend
    npm test
    cd ..
  fi
fi

# Run frontend tests (if configured)
if [ -d "frontend" ] && [ -f "frontend/package.json" ]; then
  if grep -q "\"test\"" frontend/package.json; then
    echo "Running frontend tests..."
    cd frontend
    npm test || true
    cd ..
  fi
fi

echo "All tests complete!"

