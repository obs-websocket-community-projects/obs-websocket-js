#!/usr/bin/env bash
git config --global user.name "travis-ci"
git config --global user.email "travis@travis-ci.org"

# Determine and write the SHA responsible for this build as well as the current system timestamp.
SHA=$(git rev-parse --verify HEAD)
TIMESTAMP=$(date --rfc-3339=seconds)

echo "SHA: $SHA"
echo "TIMESTAMP: $TIMESTAMP"

# Apply the SHA and Timestamp to package.json
json -I -f package.json -e "this.sha='$SHA'; this.timestamp='$TIMESTAMP'"
