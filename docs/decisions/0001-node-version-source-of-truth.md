# ADR-0001: `.node-version` is the single source of truth for the build's Node version

## Status

Accepted

## Date

2026-11-15

## Context

On 2026-11-15 an `npm audit fix` (PR #2) moved `astro` from 7.0.3 to 7.4.12 within the declared `^7.0.3` range. Astro 7.4.12 requires Node `>=22.23.4`. Production deploys on Cloudflare Pages then failed:

```text
Node.js v22.16.0 is not supported by Astro!
Please upgrade Node.js to a supported version: ">=22.23.4"
```

Three things let this through:

- `package.json` declared `engines.node: ">=22.12.0"`, below what the installed Astro actually needed.
- The 22.16.0 came from a `NODE_VERSION` variable in the Pages dashboard (Production environment), not from Cloudflare's default (22.23.4 in the current build image). Nothing in the repository could see or check that variable.
- Local verification ran on Node 24, so `npm test`, `npm run check`, and `npm run build` all passed.

## Decision

- A `.node-version` file at the repository root pins the exact Node version used to build the site (currently `24.7.0`, the version all local checks run on).
- No `NODE_VERSION` variable is set in Cloudflare Pages, for Production or Preview. After `.node-version` was added, the dashboard variable still controlled the production build until it was changed (observed 2026-11-15). Cloudflare's [build image docs](https://developers.cloudflare.com/pages/configuration/build-image/#override-default-versions) list both methods but do not document which wins, so the safe rule is to use only one.
- `engines.node` in `package.json` states the real minimum (currently `>=22.23.4`, matching Astro).
- `test/node-version.test.mjs` fails if `.node-version` or `engines.node` falls below the installed Astro's `engines.node` minimum.

## Alternatives Considered

### Keep `NODE_VERSION` in the Cloudflare dashboard only

- Pros: no repository change.
- Cons: invisible to code review and to tests; it is the setup that caused the outage.
- Rejected.

### Keep both the dashboard variable and `.node-version`, kept in sync by hand

- Pros: works today.
- Cons: two sources that can drift, and in practice the dashboard one won. A test can only check the file.
- Rejected.

### Pin `astro` to an exact version instead

- Pros: prevents surprise engine bumps.
- Cons: also blocks security fixes like the ones PR #2 applied; the Node floor still has to be met eventually.
- Rejected. The test catches engine bumps at review time instead.

## Consequences

- Upgrading Node for the build means editing `.node-version` in a pull request, where the preview deployment proves it before production.
- When an Astro upgrade raises its Node floor, `npm test` fails until `.node-version` and `engines.node` are raised to match.
- If someone re-adds `NODE_VERSION` in the Cloudflare dashboard, it can override this file without any signal in the repository. The Deployment Notes in the README say not to.
- Not yet confirmed: the first production build after the dashboard variable was removed should log `nodejs@24.7.0` under "Detected the following tools from environment". If it does not, Cloudflare is not reading `.node-version` and this decision needs revisiting.
