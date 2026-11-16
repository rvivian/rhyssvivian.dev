# Runbook: Production smoke check failed

**Means:** the live site at `rhyssvivian.dev` is down, is serving an old deploy, or has lost part of its security baseline (headers, CSP, redirects). The failing test name in the workflow log says which.

**First check:** open the failed run under **Actions → Production smoke check** and read the first failing test:

- `Fail if the production deploy failed` (a step, before any test): Cloudflare's production build failed. Same first check as the next item.
- `production is serving the expected commit`: the latest merge did not deploy. Open the Cloudflare Pages dashboard → `rhyssvivian-dev` → **Deployments** and read the failed build's log. Causes so far: the Node version ([ADR-0001](../decisions/0001-node-version-source-of-truth.md)) and a build error on `main`. The previous deploy keeps serving, so the site is still up.
- `… returns 200 HTML` or `RSS feed …`: a page is missing or erroring. Run `curl -sI https://rhyssvivian.dev/<path>` to confirm, then check whether the latest merge removed or renamed it.
- `security headers …`: `public/_headers` changed or Cloudflare stopped applying it ([ADR-0002](../decisions/0002-content-security-policy.md)).
- `page CSP …`: `security.csp` in `astro.config.mjs` changed, or `'unsafe-inline'` was added.
- `… redirects to …`: a Cloudflare dashboard setting changed. `www` → apex is a zone Redirect Rule ([ADR-0003](../decisions/0003-host-on-cloudflare-pages.md)); `http` → `https` is Cloudflare's default.

To re-run after a fix: **Actions → Production smoke check → Run workflow**, or locally with `npm run smoke`.

**Roll back:** Cloudflare Pages dashboard → **Deployments** → the last good production deployment → **Rollback to this deployment**. Then revert the bad commit on `main` through a pull request. Auto-merge ([ADR-0004](../decisions/0004-auto-merge-on-green-checks.md)) merges the revert once its checks pass.

**Escalate to:** site owner (no on-call rotation).
