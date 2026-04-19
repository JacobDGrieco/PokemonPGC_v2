#!/bin/sh
echo "MSG=$VERCEL_GIT_COMMIT_MESSAGE"

if echo "$VERCEL_GIT_COMMIT_MESSAGE" | grep -q "\[deploy\]"; then
  echo "Build allowed"
  exit 1
else
  echo "Build skipped"
  exit 0
fi