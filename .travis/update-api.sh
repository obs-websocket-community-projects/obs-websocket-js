#!/usr/bin/env bash
set +e
TARGET_BRANCH="master"

if [[ "$TRAVIS_PULL_REQUEST" != "false" ]] || [[ "$TRAVIS_BRANCH" != "$TARGET_BRANCH" ]]
then
  echo "Skipping $TARGET_BRANCH api update."
  exit 0
fi

npm run update-api

# Apply all changes on top of the latest master commit.
# git remote add upstream "https://$GH_TOKEN@$GH_REF"
git fetch upstream
git reset upstream/$TARGET_BRANCH
git add lib/API.js
git commit -m "api(ci): Update available obs-websocket methods"
git push -q upstream HEAD:$TARGET_BRANCH
