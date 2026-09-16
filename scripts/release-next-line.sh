#!/usr/bin/env bash
set -euo pipefail

if [[ "$(git branch --show-current)" != main || -n "$(git status --porcelain)" ]]; then
    echo "Release requires a clean main branch. Commit the version change first." >&2
    exit 1
fi

release_commit=$(git rev-parse HEAD)
release_tag=$(node -p 'const p = require("./package.json"); p.name + "@" + p.version')
git check-ref-format "refs/tags/$release_tag"
git fetch origin main
if [[ "$(git rev-parse FETCH_HEAD)" != "$release_commit" ]]; then
    echo "Push main to origin before releasing." >&2
    exit 1
fi
remote_tag=$(git ls-remote --tags origin "refs/tags/$release_tag")
if git show-ref --verify --quiet "refs/tags/$release_tag" || [[ -n "$remote_tag" ]]; then
    echo "Release tag $release_tag already exists." >&2
    exit 1
fi

yarn build --package prettier --clean
node -e 'const assert = require("node:assert/strict"); const source = require("./package.json"); const built = require("./dist/prettier/package.json"); assert.equal(built.name, source.name); assert.equal(built.version, source.version);'
if [[ "$(git rev-parse HEAD)" != "$release_commit" || -n "$(git status --porcelain)" ]]; then
    echo "Build changed the release checkout; refusing to publish." >&2
    exit 1
fi

npm publish ./dist/prettier --access public
# Preserve the published commit locally even if the remote push fails.
git tag --annotate "$release_tag" "$release_commit" --message "Release $release_tag."
if ! git push origin "refs/tags/$release_tag"; then
    echo "npm publication succeeded. Retry: git push origin refs/tags/$release_tag" >&2
    exit 1
fi
