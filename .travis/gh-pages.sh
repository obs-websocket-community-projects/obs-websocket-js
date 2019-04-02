#!/usr/bin/env bash
set -o errexit -o nounset
TARGET_BRANCH="gh-pages"

if [[ "$TRAVIS_PULL_REQUEST" != "false" ]] || [[ "$TRAVIS_BRANCH" != "master" ]]
then
  echo "Skipping $TARGET_BRANCH update."
  exit 0
fi

VERSION="v$(json -f package.json version)"
SHA=$(json -f package.json sha)
COMMIT_MESSAGE=$(git log --oneline -1 | cut -d " " -f 2)

# Use the commit message to determine if the changelog should use the current version.
case $(echo $COMMIT_MESSAGE | tr "[A-Z]" "[a-z]") in
  'release:')
    RELEASE="--future-release=$VERSION";;
  *)
    RELEASE=""
    VERSION="dev";;
esac

# Apply all changes on top of the latest gh-pages commit.
git remote add upstream "https://$GH_TOKEN@$GH_REF"
git fetch upstream
git reset upstream/$TARGET_BRANCH

# Generate a Changelog.
gem install github_changelog_generator
github_changelog_generator -u haganbmj -p obs-websocket-js $RELEASE

# Add all files & ./dist to the new commit.
git add -A
git add CHANGELOG.md ./dist ./types/index.d.ts -f

git commit -m "${TARGET_BRANCH}: (${VERSION}) ${SHA}"
git push -q upstream HEAD:$TARGET_BRANCH

# Tag a new release on GitHub, and publish a new release to npm.
if [[ "$VERSION" != "dev" ]] && [[ "$TRAVIS_EVENT_TYPE" != "cron" ]]
then
  git tag "$VERSION"
  git push upstream --tags
  echo "Tagged ${VERSION} on GitHub"

  echo -e "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ~/.npmrc
  npm publish
  echo "Published ${VERSION} to the npm registry"
fi

echo "Pushed > ${TARGET_BRANCH}: (${VERSION}) ${SHA}"
