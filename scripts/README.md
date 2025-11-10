# Scripts

This directory contains shell scripts for common development tasks.

## Available Scripts

### `install.sh`

Install all dependencies (root, frontend, backend, and Lambda resolvers).

```bash
./scripts/install.sh
```

### `format.sh`

Format all code with Prettier.

```bash
./scripts/format.sh
```

### `lint.sh`

Lint all code with ESLint.

```bash
./scripts/lint.sh
```

### `test.sh`

Run all tests (backend and frontend if configured).

```bash
./scripts/test.sh
```

### `build.sh`

Build frontend and backend.

```bash
./scripts/build.sh
```

### `check.sh`

Run all checks (format check, lint, and tests).

```bash
./scripts/check.sh
```

## Using Makefile

Alternatively, you can use the Makefile for a more convenient interface:

```bash
make install          # Install all dependencies
make format           # Format all code
make format-check     # Check code formatting
make lint             # Lint all code
make lint-fix         # Lint and fix all code
make test             # Run all tests
make test-watch       # Run tests in watch mode
make test-coverage    # Run tests with coverage
make build            # Build frontend and backend
make build-frontend   # Build frontend only
make build-backend    # Build backend only
make clean            # Clean build artifacts
make dev-frontend     # Start frontend dev server
make dev-backend      # Start backend watch mode
make deploy-backend   # Deploy backend to AWS
make all-tests        # Run all tests
make all-checks       # Run format-check, lint, and tests
make help             # Show all available commands
```

## Examples

### Quick development workflow

```bash
# Install everything
make install

# Run all checks before committing
make all-checks

# Start development
make dev-frontend  # In one terminal
make dev-backend   # In another terminal
```

### Pre-commit workflow

```bash
# Format and lint before committing
make format
make lint-fix
make test
```

### CI/CD workflow

```bash
# Run all checks
make all-checks

# Build everything
make build
```
