TARGET_BRANCH="gh-pages"

echo "Pull Request: $TRAVIS_PULL_REQUEST"
echo "Branch: $TRAVIS_BRANCH"

# Info
REPO=`git config remote.origin.url`
SHORT_REPO=${REPO/https:\/\/github.com\/}
SHA=`git rev-parse --verify HEAD`
COMMIT_MESSAGE=`git log --oneline -1 | cut -d " " -f 2`
COMMIT_TYPE=`echo $COMMIT_MESSAGE | cut -d ":" -f 1`

# Check the most recent tag on gh-pages.
LAST_TAG=`git describe $TARGET_BRANCH --abbrev=0 --tags`

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

NEXT_TAG=`node -pe "require('semver').inc($LAST_TAG, $SEMVER_GOAL)"`;
TIMESTAMP=`date --rfc-3339=seconds`

json -I -f package.json -e "this.version='$NEXT_TAG'; this.sourceCommitSHA='$SHA'; this.timestamp='$TIMESTAMP'"
