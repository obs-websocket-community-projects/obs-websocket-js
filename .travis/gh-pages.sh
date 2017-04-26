set -o errexit -o nounset
TARGET_BRANCH="gh-pages"

# if [[ "$TRAVIS_PULL_REQUEST" != "false" ]] || [[ "$TRAVIS_BRANCH" != "master" ]]
# then
#   echo "Skipping $TARGET_BRANCH update."
#   exit 0
# fi

VERSION=`json -f package.json version`
SHA=`json -f package.json sha`

# Apply all changes on top of the latest gh-pages commit.
git reset upstream/$TARGET_BRANCH

# Add /dist to the new commit.
git add -A .
git add -A ./dist -f
git commit -m "${TARGET_BRANCH}: (v${VERSION}) ${SHA}"
git push -q upstream HEAD:$TARGET_BRANCH

echo "Pushed > ${TARGET_BRANCH}: (v${VERSION}) ${SHA}"
