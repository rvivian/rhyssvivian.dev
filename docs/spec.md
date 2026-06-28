# Spec: rhyssvivian.dev

## Objective

Build a personal/professional website that positions Rhyss Vivian as a senior technology leader with enterprise infrastructure, cybersecurity, IAM, compliance, platform, and hands-on builder credibility.

Primary audience: future employers for Senior Manager/Director-level to CIO/CTO-track roles.

Secondary audience: technical collaborators.

Success means a reader can understand in under 60 seconds that Rhyss is a strong leader with credible technical depth, enterprise infrastructure experience, cybersecurity context, and an active transition toward platform and business leadership.

## Tech Stack

- Astro
- TypeScript
- Tailwind CSS
- Markdown content collections
- Static output
- npm package management
- Dark-first visual system with persistent light-mode toggle

Hosting remains portable between GitHub Pages and Cloudflare Pages.

## Commands

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
src/components/        Reusable UI sections
src/content/projects/  Markdown project entries
src/content/blog/      Markdown blog drafts and future posts
src/data/              Site profile and navigation data
src/scripts/           Client-side behavior modules
src/styles/            Tailwind and global CSS
test/                  Node tests for behavior modules
public/images/         Static image assets
docs/                  Project documentation
```

## Code Style

Use focused Astro components, typed content collections, semantic HTML, and Tailwind utilities. Keep styling restrained and professional.

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---

<BaseLayout title="About">
  <section class="mx-auto max-w-6xl px-4 py-16 sm:px-6">
    <h1 class="text-4xl font-semibold tracking-normal text-slate-950">
      Technical leadership with enterprise infrastructure depth.
    </h1>
  </section>
</BaseLayout>
```

## Testing Strategy

- `npm run check` validates Astro, TypeScript, and content collection typing.
- `npm run build` verifies the static production output.
- Manual browser checks cover desktop and mobile layout before publishing.
- Accessibility checks cover semantic landmarks, keyboard focus visibility, skip navigation, color contrast, current-page navigation state, and reduced-motion behavior.
- Add Playwright later only when the site gains meaningful interactions or regression risk.

## Boundaries

Always:

- Keep the site static-first for v1.
- Use accessible, semantic markup.
- Keep dark mode as the default presentation and preserve the light-mode toggle.
- Maintain WCAG AA-oriented contrast and keyboard access.
- Validate with `npm run check` and `npm run build`.
- Keep enterprise and cybersecurity project details safely anonymized.

Ask first:

- Final hosting choice.
- Analytics.
- Contact form or any backend service.
- Public resume link.
- New dependencies.
- Employer-specific or client-specific project details.

Never:

- Commit secrets.
- Publish sensitive implementation details.
- Overstate ownership or scope.
- Turn the site into a resume dump.
- Add backend complexity for v1.

## Success Criteria

- The site builds cleanly as a static Astro site.
- Pages exist for Home, About, Projects, Blog, and Contact.
- Projects are powered by Markdown content entries.
- Blog is structurally ready for future writing.
- The tone is technical plus executive.
- Dark mode is the primary visual mode, with a working light mode.
- Core pages meet the project's accessibility baseline.
- Deployment remains viable on GitHub Pages or Cloudflare Pages.

## Out of Scope for v1

- Resume download link.
- CMS.
- Authentication.
- Database.
- Contact form.
- Analytics.
- Hosting-specific adapter.
