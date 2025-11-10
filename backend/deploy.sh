#!/bin/bash

# Helper script to deploy CDK stack with the 'personal' AWS profile
# Usage: ./deploy.sh [command]
# Commands: bootstrap, deploy, destroy, synth, diff

set -e

# Set AWS profile
export AWS_PROFILE=personal

# Default command is deploy
COMMAND=${1:-deploy}

echo "Using AWS profile: personal"
echo "Running CDK command: $COMMAND"
echo ""

case $COMMAND in
  bootstrap)
    cdk bootstrap
    ;;
  deploy)
    cdk deploy
    ;;
  destroy)
    cdk destroy
    ;;
  synth)
    cdk synth
    ;;
  diff)
    cdk diff
    ;;
  *)
    echo "Unknown command: $COMMAND"
    echo "Usage: ./deploy.sh [bootstrap|deploy|destroy|synth|diff]"
    exit 1
    ;;
esac

