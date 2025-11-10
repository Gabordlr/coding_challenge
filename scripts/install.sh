#!/bin/bash

# Install all dependencies

set -e

echo "Installing dependencies..."

# Install root dependencies
if [ -f "package.json" ]; then
  echo "Installing root dependencies..."
  npm install
fi

# Install frontend dependencies
if [ -d "frontend" ] && [ -f "frontend/package.json" ]; then
  echo "Installing frontend dependencies..."
  cd frontend
  npm install
  cd ..
fi

# Install backend dependencies
if [ -d "backend" ] && [ -f "backend/package.json" ]; then
  echo "Installing backend dependencies..."
  cd backend
  npm install
  cd ..
fi

# Install Lambda resolver dependencies
if [ -d "backend/lib/resolvers/createNote" ] && [ -f "backend/lib/resolvers/createNote/package.json" ]; then
  echo "Installing createNote Lambda dependencies..."
  cd backend/lib/resolvers/createNote
  npm install
  cd ../../../../..
fi

if [ -d "backend/lib/resolvers/getNotes" ] && [ -f "backend/lib/resolvers/getNotes/package.json" ]; then
  echo "Installing getNotes Lambda dependencies..."
  cd backend/lib/resolvers/getNotes
  npm install
  cd ../../../../..
fi

echo "All dependencies installed!"

