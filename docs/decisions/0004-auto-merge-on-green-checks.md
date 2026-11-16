# ADR-0004: Auto-merge pull requests when required checks pass

## Status

Accepted

## Date

2026-11-15

## Context

`main` is protected by the "Protect main" ruleset: changes arrive only through pull requests, with zero required approvals. Until now, every PR was merged by hand once the owner had looked at it, and no checks were required. The only check on a PR was Cloudflare's preview build, so `npm test`, `astro check`, and `npm audit` never ran on PRs at all.

The site owner wants PRs to merge themselves, and their branches to be deleted, once their checks succeed.

## Decision

- **CI on every PR** (`.github/workflows/ci.yml`, job `verify`): `npm ci`, `npm test`, `npm run check`, `npm run build`, `npm audit --omit=dev --audit-level=high`.
- **Required status checks** in the "Protect main" ruleset: `verify` (GitHub Actions) and `Cloudflare Pages` (the preview deploy). Branches do not have to be up to date with `main`, so queued PRs do not block each other.
- **Auto-merge** (`.github/workflows/auto-merge.yml`) enables GitHub's native auto-merge, using merge commits, on every non-draft PR opened from this repository. GitHub performs the merge only after the required checks pass. Fork PRs are excluded.
- **Repository settings:** "Allow auto-merge" on, and "Automatically delete head branches" on.
- **Opting out:** open the PR as a draft (marking it ready for review enables auto-merge), or run `gh pr merge --disable-auto <number>`.
- **Post-merge verification** moves from the smoke check's `push` trigger to Cloudflare's `Cloudflare Pages` check run on `main`, because merges performed with the workflow token do not trigger `push` workflows.

## Alternatives Considered

### Opt-in label (`automerge`)

- Pros: nothing merges without a deliberate signal.
- Cons: every PR needs a manual step, which is what the owner wanted to remove.
- Rejected; drafts give an opt-out instead.

### Merge directly from a workflow when CI passes

- Pros: no repository setting needed.
- Cons: re-implements what native auto-merge already does, and races with the other required check.
- Rejected.

### Personal access token or GitHub App so merges trigger `push` workflows

- Pros: `push` workflows keep working after automated merges.
- Cons: a long-lived credential to create, store, and rotate.
- Rejected; Cloudflare's check run is a better post-deploy signal anyway, because it arrives when production has actually changed.

## Consequences

- No human looks at a PR before it reaches production unless they choose to. The checks are the only gate, so a change that passes tests but is wrong (bad content, a broken layout the tests don't cover) ships on its own. The production smoke check and Cloudflare's rollback are the safety net.
- Strengthening the gate means adding checks to `verify`, not adding reviewers.
- `npm audit` failures on new advisories block every PR until fixed, including PRs unrelated to dependencies.
- Pushing more commits to an open PR re-runs the checks, and auto-merge waits for them. Auto-merge stays enabled.
- Changing the job name `verify` or Cloudflare's check name breaks the required-check match: PRs would then wait forever. Update the ruleset in the same change.
