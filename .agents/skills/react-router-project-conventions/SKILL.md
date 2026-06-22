---
name: react-router-project-conventions
description: Add or modify routes in this project's React Router v7 showcase app. Use when creating or editing a page, layout, or resource/api route under app/showcase/, or touching app/routes.ts. Covers the config-based route table (NOT flat-routes), the modular route-module pattern (route.ts barrel + route.component/route.loader), and common gotchas. This is the project-specific contribution layer on top of the generic react-router-framework-mode skill.
---

# React Router project conventions

crescent-ui is a **single** React Router v7 app: the component **showcase** (the gallery that documents and demos the registry). It is server-rendered (`ssr: true`, the v8 future flags are on in `react-router.config.ts`). There is no dashboard, no marketing site, no auth, no database — just the showcase.

For generic React Router v7 questions (data flow, error boundaries, navigation, framework config), defer to the `react-router-framework-mode` skill. **This skill is the project-specific overlay** — the two conventions that are local to this repo: (1) routes are declared in a config table, not by folder name, and (2) each route splits its concerns across single-responsibility module files.

All commands run from the **repo root** (`bun run dev`, `bun run typecheck`, `bun run registry:build`). This is a single-package repo — there are no sub-packages to `cd` into.

## Routes are configured, not flat (the first thing to know)

Routes are declared explicitly in `app/routes.ts` using the config helpers (`route()`, `layout()`, `index()`) — this repo does **not** use `flatRoutes()`, so folder names carry no routing magic. A folder under `app/showcase/` is a route only because `app/routes.ts` points at its `route.ts`.

```ts
// app/routes.ts — the source of truth for what URLs exist.
import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  // Resource route (loader only): resolves a shadcn /create preset code to its
  // CSS variables server-side, so the Preset Lab can preview under it.
  route("resources/preset", "showcase/preset-resource.ts"),
  // The showcase IS the site: a pathless layout (tab nav + chrome) wrapping an
  // index that redirects to the first component, and a `/:component` detail view.
  layout("showcase/route.ts", [
    index("showcase/_index/route.ts"),
    route(":component", "showcase/$component/route.ts"),
  ]),
] satisfies RouteConfig;
```

To add a URL you **edit `app/routes.ts`** and add the module folder — creating a folder alone does nothing. A landing page can later take over `/` by swapping the `index()` child.

## The one rule: `route.ts` re-exports, it does not implement

Every route folder splits its concerns across single-responsibility files, and `route.ts` is **only** a barrel export.

```ts
// route.ts — re-export only what the folder actually defines.
export { Component as default } from "./route.component";
export { loader } from "./route.loader";
```

Only re-export what exists. A layout/index that only loads data exports just `loader` (see `app/showcase/_index/route.ts`); a detail view that only renders exports just `default` (see `app/showcase/$component/route.ts`). Matching `.ts` vs `.tsx` on the barrel is interchangeable — match the surrounding routes.

## File responsibilities

| File | Exports | When to include |
| --- | --- | --- |
| `route.ts` | re-exports only | Always. This is what `app/routes.ts` points at. |
| `route.component.tsx` | `Component` (barrel re-exports as `default`) | Any page/layout route. Omit only for pure resource routes (e.g. `preset-resource.ts`). |
| `route.loader.ts` | `loader` | Route needs server data, dynamic params, or returns a `Response`. Type with `Route.LoaderArgs`. |
| colocated components | route-only React components | A `components/` subfolder (see `app/showcase/components/`). Promote to `~/components/` only on the second consumer. |

Read loader data with `useLoaderData<Route.ComponentProps["loaderData"]>()` (or the `useLoaderData()` hook); types come from `./+types/route`, which is **generated** by `bun run typecheck` — until you run it once, `./+types/route` won't resolve and every `Route.*` reference shows as an error.

## Resource routes

A resource route returns a `Response` and has no component; the barrel re-exports only its `loader` (or `action`). Canonical example: `app/showcase/preset-resource.ts`, wired in `app/routes.ts` as `route("resources/preset", …)`.

## Add a new route (checklist)

1. **Create the module folder** under `app/showcase/` (e.g. `app/showcase/about/`).
2. **`route.component.tsx`** — export a `Component`.
3. **`route.loader.ts`** if it needs data (`Route.LoaderArgs`, import server-only modules from `~/lib/*`).
4. **`route.ts`** re-exporting `default` plus whatever you created. Nothing else.
5. **Register it in `app/routes.ts`** with `route()` / `index()` / `layout()` — this is the step folder-name conventions would otherwise do for you, and the one that's easy to forget here.
6. **Run `bun run typecheck`** (from the repo root). This generates `.react-router/types/.../+types/route.d.ts`; until you do, `Route.*` references look broken.
7. **Verify:** `bun run dev`, visit the URL.

## Gotchas and anti-patterns

- **Expecting flat-routes.** Creating a folder does not create a route — you must add it to `app/routes.ts`. There is no folder-name → URL translation in this repo.
- **Implementation in `route.ts`.** It's a barrel. Move logic to a sibling module file and re-export.
- **Forgetting `bun run typecheck` after creating a folder.** `./+types/route` is generated, not real — every `Route.*` reference looks broken until you run it once.
- **Importing server-only code into a client component.** Reach server-only utilities through a `loader`. Vite excludes `.server` modules from the client bundle.
- **Lifting components too early.** Route-only components stay colocated in the route's `components/` folder; promote to `~/components/` on the second consumer, not the first.
