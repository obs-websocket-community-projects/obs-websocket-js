TARGET_BRANCH="gh-pages"

echo "Pull Request: $TRAVIS_PULL_REQUEST"
echo "Branch: $TRAVIS_BRANCH"

git config --global user.name "travis-ci"
git config --global user.email "travis@travis-ci.org"

# Info
REPO=`git config remote.origin.url`
SHORT_REPO=${REPO/https:\/\/github.com\/}
SHA=`git rev-parse --verify HEAD`
COMMIT_MESSAGE=`git log --oneline -1 | cut -d " " -f 2`
COMMIT_TYPE=`echo $COMMIT_MESSAGE | cut -d ":" -f 1`

echo "Commit Message: $COMMIT_MESSAGE"
echo "Commit Type: $COMMIT_TYPE"
echo "SHA: $SHA"

git init
git remote add upstream "https://$GH_TOKEN@github.com/$SHORT_REPO"
git fetch upstream --unshallow

# Check the most recent tag on gh-pages.
LAST_TAG=`git describe "$TARGET_BRANCH" --abbrev=0 --tags`

echo "Last Tag: $LAST_TAG"

# Messily determine the next tag.
case `echo $COMMIT_TYPE | tr "[A-Z]" "[a-z]"` in
  'patch')
    SEMVER_GOAL='prepatch';;
  'minor')
    SEMVER_GOAL='preminor';;
  'major')
    SEMVER_GOAL='premajor';;
  'release')
    SEMVER_GOAL='patch';;
  *)
    SEMVER_GOAL='prerelease';;
esac

echo "Semver Goal: $SEMVER_GOAL"

NEXT_TAG=`node -pe "require('semver').inc('$LAST_TAG', '$SEMVER_GOAL')"`;
TIMESTAMP=`date --rfc-3339=seconds`

echo "Next Tag: $NEXT_TAG"

json -I -f package.json -e "this.version='$NEXT_TAG'; this.sourceCommitSHA='$SHA'; this.timestamp='$TIMESTAMP'"
