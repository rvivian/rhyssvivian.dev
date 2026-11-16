# rhyssvivian.dev

Professional field journal for Rhyss Vivian, built with Astro, TypeScript, Tailwind CSS, and Markdown content collections.

## Purpose

The site positions Rhyss as a senior technology leader with enterprise infrastructure, cybersecurity, IAM, platform, and hands-on builder credibility. The primary audience is future employers for platform, infrastructure, security, and technology leadership roles. Technical collaborators are the secondary audience.

The visual system combines technical precision with a restrained cartographic vocabulary. It is dark by default with a persistent light-mode toggle, Monaspace structural typography, and IBM Plex Sans for reading. Accessibility remains a first-class requirement: semantic landmarks, skip navigation, visible focus states, current-page navigation state, reduced-motion handling, and high-contrast theme tokens are part of the baseline.

## Commands

Run commands from the project root:

```powershell
npm install
npm run dev
npm test
npm run smoke
npm run check
npm run build
npm run preview
```

## Contribution Workflow

The `main` branch is protected and cannot be committed to directly. Every change must be developed on a new branch and merged through a pull request. Create each branch from the latest `main`, keep it focused on one change, and do not reuse merged branches.

## Project Structure

```text
src/pages/             Astro routes
src/layouts/           Shared document layout
src/components/        Reusable Astro components
src/content/projects/  Markdown project entries
src/content/blog/      Markdown entries published under Thinking
src/data/              Site profile and navigation data
src/scripts/           Small client-side behavior modules
src/styles/            Tailwind and global CSS
test/                  Node tests for client-side behavior, site data, and build configuration
smoke/                 Production smoke check (network; run with npm run smoke)
public/images/         Project-owned image assets
docs/spec.md           Approved project spec
docs/decisions/        Architecture decision records (ADRs)
docs/runbooks/         What to do when an alert fires
```

## Content

Projects are Markdown files in `src/content/projects`. Thinking entries are stored in `src/content/blog`; set `draft: true` to keep an entry out of the built site. Both collections support optional location metadata, which otherwise inherits the Alaska site default.

Contact links live in `src/data/profile.ts`. Verify the email, LinkedIn, and GitHub URLs before publishing.

## Deployment Notes

The production site is hosted by Cloudflare Pages ([ADR-0003](docs/decisions/0003-host-on-cloudflare-pages.md)). Merges to `main` trigger production deployments, while pull-request branches can receive preview deployments.

```text
Build command: npm run build
Build output directory: dist
Root directory: /
```

The build's Node version comes from `.node-version` in the repository root. Do not set a `NODE_VERSION` variable in the Cloudflare Pages dashboard: in practice it overrode `.node-version` without any visible change in the repository, which is how production builds broke on 2026-11-15. To change the Node version, edit `.node-version` in a pull request. `npm test` fails if it falls below the installed Astro's minimum. See [ADR-0001](docs/decisions/0001-node-version-source-of-truth.md).

### Monitoring

- **Production smoke check** (`.github/workflows/production-smoke-check.yml`) runs `npm run smoke` after every merge to `main`, every 6 hours, and on demand. It checks that the latest `main` commit is live, key pages and the RSS feed return 200, the security headers and CSP are in place, and the `www` and `http` redirects work. GitHub emails on failure. Runbook: [docs/runbooks/production-smoke-check.md](docs/runbooks/production-smoke-check.md).
- **Which commit is live:** every page built by Cloudflare Pages carries `<meta name="build-commit" content="<sha>">`, from Cloudflare's `CF_PAGES_COMMIT_SHA`.
- **Deploy failures:** a Cloudflare notification, configured in the dashboard under Notifications → Pages → Project updates, filtered to Production and **Deployment failed**.

## Boundaries

- Do not publish sensitive employer, client, or security implementation details.
- Do not add analytics, forms, or hosting-specific adapters without a decision.
- Do not add a resume link until it is explicitly in scope.
- Do not add inline `style` attributes, unhashed `is:inline` scripts, or third-party resources without updating the CSP. Check with `npm run build` and `npm run preview`, since the CSP does not run in `astro dev`. See [ADR-0002](docs/decisions/0002-content-security-policy.md).
- Keep the tone technical plus executive: credible, direct, and hands-on.
