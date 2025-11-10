.PHONY: help install format format-check lint test test-watch test-coverage build clean dev-frontend dev-backend deploy-frontend deploy-backend all-tests all-checks

# Default target
help:
	@echo "Available commands:"
	@echo "  make install          - Install all dependencies"
	@echo "  make format           - Format all code with Prettier"
	@echo "  make format-check     - Check code formatting"
	@echo "  make lint             - Lint all code"
	@echo "  make test             - Run all tests"
	@echo "  make test-watch       - Run tests in watch mode"
	@echo "  make test-coverage    - Run tests with coverage"
	@echo "  make build            - Build frontend and backend"
	@echo "  make build-frontend   - Build frontend only"
	@echo "  make build-backend    - Build backend only"
	@echo "  make clean            - Clean build artifacts"
	@echo "  make dev-frontend     - Start frontend dev server"
	@echo "  make dev-backend      - Start backend dev server (CDK watch)"
	@echo "  make deploy-backend   - Deploy backend to AWS"
	@echo "  make all-tests        - Run all tests (frontend + backend)"
	@echo "  make all-checks       - Run format-check, lint, and tests"

# Install dependencies
install:
	@echo "Installing root dependencies..."
	@npm install
	@echo "Installing frontend dependencies..."
	@cd frontend && npm install
	@echo "Installing backend dependencies..."
	@cd backend && npm install
	@echo "Installing Lambda resolver dependencies..."
	@cd backend/lib/resolvers/createNote && npm install
	@cd backend/lib/resolvers/getNotes && npm install
	@echo "All dependencies installed!"

# Format code
format:
	@echo "Formatting code with Prettier..."
	@npm run format
	@cd frontend && npm run format || true
	@echo "Code formatted!"

# Check formatting
format-check:
	@echo "Checking code formatting..."
	@npm run format:check
	@echo "Format check complete!"

# Lint code
lint:
	@echo "Linting code..."
	@cd frontend && npm run lint
	@echo "Linting complete!"

# Run all tests
test:
	@echo "Running backend tests..."
	@cd backend && npm test
	@echo "All tests complete!"

# Run tests in watch mode
test-watch:
	@echo "Running tests in watch mode..."
	@cd backend && npm run test:watch

# Run tests with coverage
test-coverage:
	@echo "Running tests with coverage..."
	@cd backend && npm run test:coverage

# Build everything
build: build-backend build-frontend
	@echo "Build complete!"

# Build frontend
build-frontend:
	@echo "Building frontend..."
	@cd frontend && npm run build
	@echo "Frontend build complete!"

# Build backend
build-backend:
	@echo "Building backend..."
	@cd backend && npm run build
	@echo "Backend build complete!"

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	@rm -rf frontend/.next
	@rm -rf frontend/out
	@rm -rf frontend/node_modules/.cache
	@rm -rf backend/node_modules/.cache
	@rm -rf backend/coverage
	@rm -rf backend/cdk.out
	@rm -rf .next
	@rm -rf out
	@echo "Clean complete!"

# Development servers
dev-frontend:
	@echo "Starting frontend dev server..."
	@cd frontend && npm run dev

dev-backend:
	@echo "Starting backend watch mode..."
	@cd backend && npm run watch

# Deploy backend
deploy-backend:
	@echo "Deploying backend to AWS..."
	@cd backend && npm run deploy

# Run all tests (frontend + backend)
all-tests: test
	@echo "All tests complete!"

# Run all checks (format, lint, tests)
all-checks: format-check lint test
	@echo "All checks complete!"

