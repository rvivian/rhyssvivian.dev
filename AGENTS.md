## Development

### Git workflow

The `main` branch is protected by a GitHub branch ruleset and only accepts changes through pull requests.

- Never commit directly to `main`.
- Before every discrete change, create a new branch from the latest `main`.
- Use the `codex/` prefix for branches created by Codex.
- Keep each branch focused on one change, push it to the remote, and merge it through a pull request.
- Do not reuse a previously merged branch for later work.

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
