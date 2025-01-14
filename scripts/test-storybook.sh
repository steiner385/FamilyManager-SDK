#!/bin/bash

set -e  # Exit on error
set -x  # Print commands being executed

echo "Starting Storybook tests in CI mode..."

# Kill any existing storybook processes
echo "Cleaning up any existing storybook processes..."
pkill -f storybook || true

# Start storybook in CI mode
echo "Starting Storybook server..."
storybook dev --ci --port 6010 &
STORYBOOK_PID=$!

# Wait for storybook to be ready
echo "Waiting for Storybook server to be ready..."
wait-on -t 30000 tcp:6010
echo "Storybook server is ready!"

# Run the tests
echo "Running Storybook tests..."
test-storybook --ci --url http://localhost:6010 --timeout 60000 --verbose

# Store the test result
TEST_RESULT=$?
echo "Test execution completed with result: $TEST_RESULT"

# Kill storybook
echo "Cleaning up Storybook processes..."
if [ -n "$STORYBOOK_PID" ]; then
  echo "Killing Storybook process $STORYBOOK_PID..."
  kill $STORYBOOK_PID || true
fi
pkill -f storybook || true

echo "Test run completed!"

# Exit with the test result
exit $TEST_RESULT
