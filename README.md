# rhyssvivian.dev

Personal and professional website for Rhys Vivian, built with Astro, TypeScript, Tailwind CSS, and Markdown content collections.

## Purpose

The site positions Rhys as a senior technology leader with enterprise infrastructure, cybersecurity, IAM, platform, and hands-on builder credibility. The primary audience is future employers for platform, infrastructure, security, and technology leadership roles. Technical collaborators are the secondary audience.

## Commands

Run commands from the project root:

```powershell
npm install
npm run dev
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
src/content/blog/      Markdown blog drafts and future posts
src/data/              Site profile and navigation data
src/styles/            Tailwind and global CSS
public/images/         Project-owned image assets
docs/spec.md           Approved project spec
```

## Content

Projects are Markdown files in `src/content/projects`. Blog posts are Markdown files in `src/content/blog`; set `draft: true` to keep a post out of the built site.

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
