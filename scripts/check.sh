#!/bin/bash

# Run all checks (format, lint, tests)

set -e

echo "Running all checks..."

# Check formatting
echo "Checking code formatting..."
if [ -f "package.json" ]; then
  npm run format:check || {
    echo "Format check failed! Run 'make format' to fix."
    exit 1
  }
fi

# Lint code
echo "Linting code..."
if [ -d "frontend" ]; then
  cd frontend
  npm run lint || {
    echo "Linting failed! Run 'make lint-fix' to fix."
    exit 1
  }
  cd ..
fi

# Run tests
echo "Running tests..."
if [ -d "backend" ] && [ -f "backend/package.json" ]; then
  if grep -q "\"test\"" backend/package.json; then
    cd backend
    npm test || {
      echo "Tests failed!"
      exit 1
    }
    cd ..
  fi
fi

echo "All checks passed!"

