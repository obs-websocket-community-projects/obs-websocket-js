set -o errexit -o nounset
TARGET_BRANCH="gh-pages"

if [[ "$TRAVIS_PULL_REQUEST" != "false" ]] || [[ "$TRAVIS_BRANCH" != "master" ]]
then
  echo "Skipping $TARGET_BRANCH update."
  exit 0
fi

# Info
REPO=`git config remote.origin.url`
SHORT_REPO=${REPO/https:\/\/github.com\/}
SHA=`git rev-parse --verify HEAD`
COMMIT_MESSAGE=`git log --oneline -1 | cut -d " " -f 2`
COMMIT_TYPE=`echo $COMMIT_MESSAGE | cut -d ":" -f 1`

git config --global user.name "travis-ci"
git config --global user.email "travis@travis-ci.org"

# Revise the .gitignore strategy for gh-pages. Includes build distributables.
cp .gh-pages.gitignore .gitignore --force

# Reset changes on top of existing gh-pages
git init
git remote add upstream "https://$GH_TOKEN@github.com/$SHORT_REPO"
git fetch upstream
git reset upstream/gh-pages

# Check if a any changes impacted distributables or documentation.
if [ -z `git diff --exit-code` ]; then
    echo "No generated changes. Canceling deployment of $TARGET_BRANCH."
    exit 0
fi

# Add all necessary files according to the gh-pages.gitignore.
git add -A .

CURRENT_TAG=`node -pe "require('./package.json').version"`
IS_PRERELEASE=`node -pe "require('semver').prerelease($CURRENT_TAG)"`

git commit -m "gh-pages: ($SHA) v$CURRENT_TAG"

if [ "null" == "$IS_PRERELEASE" ]
then
  git tag "v$CURRENT_TAG"
  npm publish
fi

git push -q upstream HEAD:gh-pages --tags
