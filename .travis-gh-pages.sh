set -o errexit -o nounset

TARGET_BRANCH="gh-pages"

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

git add -A .
git commit -m "gh-pages: ${SHA}"
git push -q upstream HEAD:gh-pages
