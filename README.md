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
npm run check
npm run build
npm run preview
```

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
test/                  Node tests for client-side behavior
public/images/         Project-owned image assets
docs/spec.md           Approved project spec
```

## Content

Projects are Markdown files in `src/content/projects`. Thinking entries are stored in `src/content/blog`; set `draft: true` to keep an entry out of the built site. Both collections support optional location metadata, which otherwise inherits the Alaska site default.

Contact links live in `src/data/profile.ts`. Verify the email, LinkedIn, and GitHub URLs before publishing.

## Deployment Notes

The site is static-first and builds to `dist`, so it can deploy to GitHub Pages or Cloudflare Pages.

Cloudflare Pages:

```text
Build command: npm run build
Build output directory: dist
Root directory: /
```

GitHub Pages:

- Use GitHub Actions for Astro static deployment.
- Build with `npm run build`.
- Publish the generated `dist` directory.
- Add `rhyssvivian.dev` as the custom domain in repository Pages settings.

## Boundaries

- Do not publish sensitive employer, client, or security implementation details.
- Do not add analytics, forms, or hosting-specific adapters without a decision.
- Do not add a resume link until it is explicitly in scope.
- Keep the tone technical plus executive: credible, direct, and hands-on.
