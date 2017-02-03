set -o errexit -o nounset
TARGET_BRANCH="gh-pages"

echo "Pull Request: $TRAVIS_PULL_REQUEST"
echo "Branch: $TRAVIS_BRANCH"

if [[ "$TRAVIS_PULL_REQUEST" != "false" ]] || [[ "$TRAVIS_BRANCH" != "master" ]]
then
  echo "Skipping $TARGET_BRANCH update."
  exit 0
fi

# Info
REPO=`git config remote.origin.url`
SHORT_REPO=${REPO/https:\/\/github.com\/}
SHA=`git rev-parse --verify HEAD`

git config --global user.name "travis-ci"
git config --global user.email "travis@travis-ci.org"

cd dist
git init
git remote add upstream "https://$GH_TOKEN@github.com/$SHORT_REPO"
git fetch upstream
git reset upstream/gh-pages

if [ -z `git diff --exit-code` ]; then
    echo "No generated changes. Canceling deployment of $TARGET_BRANCH."
    exit 0
fi

git add -A .
git commit -m "gh-pages: ${SHA}"
git push -q upstream HEAD:gh-pages
