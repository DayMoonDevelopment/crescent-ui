# crescent UI

A [shadcn](https://ui.shadcn.com) component registry of card-styled, [Base UI](https://base-ui.com)-powered components — designed as a faithful **extension** of shadcn/ui. Components consume the consumer's theme tokens (colors + `--radius`), so they re-skin to whatever style preset a project picked at `/create`.

This repo is two things at once:

- **A registry** — distributed as a [namespaced shadcn registry](https://ui.shadcn.com/docs/registry/namespace) served from `crescentui.com`. We can't use shadcn's GitHub-repo mode because our components are authored in `cn-*` semantic tokens that a build step resolves into concrete utilities per style; the raw repo source isn't installable as-is. Consumers register the `@crescent-ui` namespace once, with their chosen `<base>-<style>` variant in the `style` field:

  ```jsonc
  // components.json
  {
    "style": "base-vega",
    "registries": {
      "@crescent-ui": "https://crescentui.com/r/{style}/{name}.json"
    }
  }
  ```

  Then install any component — the `{style}` placeholder resolves to the variant, so the command stays slug-free:

  ```bash
  pnpm dlx shadcn@latest add @crescent-ui/choicebox
  ```

- **A presentation site** — a [React Router](https://reactrouter.com) v7 app (`app/`) whose showcase gallery renders each component live from the same `registry/bases/*` source it distributes, so demos can never drift from what users install.

## Project layout

```
registry.json                  # registry manifest (schema-valid index)
registry/bases/<base>/ui/      # canonical component source, authored in cn-* tokens
registry/styles/style-*.css    # per-style cn-* → utility maps (one CSS file per style)
scripts/build-registry.ts      # transform: emits registry-dist/<base>-<style>/<name>.json
registry-dist/<base>-<style>/  # built, self-contained registry items (the distributed artifact)
app/                           # React Router presentation site
  showcase/                    # the live component gallery (the site itself)
  registry-serve/              # resource route: serves /r/<variant>/<name>.json (+ install counts)
  ui/                          # app-only chrome (tabs, button, tooltip)
.agents/skills/                # agent skills (shadcn, compound-components, central-icons, ...)
```

## Development

```bash
bun install
bun run dev          # http://localhost:5173 — the showcase gallery
bun run typecheck
bun run build
bun run registry:build   # emit registry JSON to registry-dist/ (the HTTP/branded-URL channel)
```

The registry JSON is served by the app at `/r/<variant>/<name>.json` (a resource
route under `app/registry-serve/`, which bundles `registry-dist/` at build time),
not as static files — so installs can be counted. Analytics is opt-in via env
vars (see `.env.example`); with none set the registry still serves, just without
counting.

Adding a component: author it in `registry/bases/<base>/ui/` with `cn-*` tokens, add it to the `BASES` list in `scripts/build-registry.ts`, run `bun run registry:build`, then add a `*-demo.tsx` and a line in `app/showcase/components/demos.tsx`.
