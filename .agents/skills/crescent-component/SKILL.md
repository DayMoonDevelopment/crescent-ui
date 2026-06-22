---
name: crescent-component
description: Author or maintain a crescent UI registry component so it is indistinguishable from one shadcn shipped — dual Base UI + Radix variants, token-faithful styling, icon-library agnostic, correct layout/spacing/shadow/focus standards, and the registry.json wiring. Use whenever adding a new component to registry/, refactoring an existing one, or reviewing a component for shadcn-fidelity. Canonical reference: registry/base/ui/choicebox.tsx + registry/radix/ui/choicebox.tsx.
---

# Authoring a crescent UI component

crescent is a **shadcn/ui registry extension** by Day Moon Development. We ship the
components shadcn and ReUI don't — but every one must read, behave, and theme **exactly
as though shadcn authored it**. A consumer who installs a crescent component alongside
`@shadcn/button` should not be able to tell which registry it came from.

This skill is the crescent-specific layer. The shadcn rules it builds on are vendored in
this repo — **read them, don't restate them:**

- [`../shadcn/rules/styling.md`](../shadcn/rules/styling.md) — semantic colors, `cn()`, `gap-*` not `space-*`, `size-*`, no manual `dark:` colors.
- [`../shadcn/rules/composition.md`](../shadcn/rules/composition.md) — items inside their group, Card/Tabs/etc. structure.
- [`../shadcn/rules/base-vs-radix.md`](../shadcn/rules/base-vs-radix.md) — `asChild` (radix) vs `render` (base), ToggleGroup `type` vs `multiple`, Slider/Accordion/Select API deltas.
- [`../shadcn/rules/icons.md`](../shadcn/rules/icons.md) — `data-icon`, no sizing classes on icons, pass icons as components.
- [`../compound-components/SKILL.md`](../compound-components/SKILL.md) — namespaced multi-part families (every crescent component with parts follows this).

---

## 1. Two variants, one design — the headline rule

shadcn ships every primitive in a **Base UI** and a **Radix** variant. crescent does the
same. Each component is two files:

```
registry/base/ui/<name>.tsx     # Base UI (@base-ui/react)
registry/radix/ui/<name>.tsx    # Radix    (radix-ui)
```

**The Tailwind class strings are byte-for-byte identical between the two files.** Only
these differ:

| | Base UI | Radix |
|---|---|---|
| primitive import | `@base-ui/react/<part>` | `radix-ui` (namespaced: `X.Root`, `X.Item`) |
| prop types | the primitive's own `X.Props` | `React.ComponentProps<typeof X.Root>` |
| composition | `render={<C />}` (+ `nativeButton={false}` for non-buttons) | `asChild` |
| group selection API | `multiple` boolean, value always an array | `type="single" \| "multiple"`, value string \| array |

Because the visual style (mira/nova/vega/…) only swaps **tokens** (see §3), one class
string covers every style. The *only* axis that needs two files is the **primitive
library**. Keep the two files' class strings in sync — when you touch one, touch both.

**Match selected/active state for both primitives in the shared string.** Base UI emits
`data-pressed`; Radix emits `data-[state=on]`. Write both:

```tsx
"data-pressed:border-primary data-pressed:bg-accent",
"data-[state=on]:border-primary data-[state=on]:bg-accent",
```

and for descendants reacting to the selected item, write both group selectors:

```tsx
"group-data-pressed/choicebox-item:text-primary",
"group-data-[state=on]/choicebox-item:text-primary",
```

Checkbox/radio-style state uses `data-checked` (Base UI) — mirror shadcn's checkbox/radio
which also pair it with `aria-checked`.

---

## 2. Structure & API conventions (the shadcn "tells")

- **`data-slot` on every element**, kebab-cased from the part name (`data-slot="choicebox-item-icon"`). It is the styling/query handle and the strongest shadcn fingerprint.
- **Compound, namespaced parts** — `Choicebox`, `ChoiceboxItem`, `ChoiceboxItemIcon`, … Shared state rides a context + a `use<Name>()` hook that throws outside the provider. Follow [`compound-components`](../compound-components/SKILL.md).
- **`cva` for multi-class variants** (size/variant), `defaultVariants` set, export the `…Variants` fn alongside the components.
- **Expose layout-shaping choices as data attributes** on the part that owns them: `data-orientation`, `data-size`, `data-variant`. Style off them (`data-[size=sm]:…`).
- **`"use client"`** at the top of any file using hooks/context/handlers — the CLI strips it for non-RSC consumers and keeps it for RSC ones. Card-like pure-`div` components omit it.
- **Components own their internals; consumers own layout.** `className` is for layout overrides only, never colors/typography (styling.md).

---

## 3. Tokens, layout, spacing, shadow — the per-style standards

A shadcn **style** changes only the **token layer** (colors, `--radius`, fonts). Components
never hardcode those — they reference tokens, so a component authored once re-skins under
every style and every `/create` preset automatically. **Author against tokens; never
against a specific style's look.**

Use these exact conventions (verified against shadcn's `mira` source) so spacing/shadow/
focus read as native:

**Color — semantic tokens only.** `bg-card text-card-foreground`, `bg-muted text-muted-foreground`, `bg-primary text-primary-foreground`, `bg-accent`, `border-input`, `border-primary`, `border-destructive`. Never raw colors, never `dark:` color overrides.

**Radius — scale tokens that track `--radius`.** `rounded-md` / `rounded-lg` for surfaces, `rounded-sm` for small controls (checkbox), `rounded-[min(var(--radius-md),8px)]` for `sm` sizes. **`rounded-full` only for intrinsically circular shapes** (radio dot, avatar, spinner) — these legitimately stay round under hard-edge presets. Never hardcode `rounded-[0.4rem]` or px radii on themeable corners.

**Focus ring.** `focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50` (controls/cards) or `ring-2 ring-ring/30` (smaller, e.g. checkbox). Always the `ring` token — never `ring-primary` for focus.

**Invalid.** `aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40`.

**Disabled.** `disabled:pointer-events-none disabled:opacity-50` (or `disabled:cursor-not-allowed` for checkbox/radio).

**Borders & elevation.** Interactive selectable surfaces: `border border-input` + `shadow-xs`. Pure display cards: shadcn uses `ring-1 ring-foreground/10` instead of a border. Pick the one that matches the shadcn component closest in kind.

**Spacing/layout.** `gap-*` never `space-x/y-*`; `size-*` when w==h; `flex`/`grid` for layout. Drive padding/gap from a `cva` `size` variant (`default` → `p-4 gap-3`, `sm` → `p-3 gap-2.5`). For container-relative spacing, mirror shadcn's `--card-spacing` var pattern (`[--card-spacing:--spacing(4)]` consumed via `px-(--card-spacing)`).

**Logical properties for RTL.** This registry sets `rtl: true`. Use `start`/`end` and `ps`/`pe`/`ms`/`me` (e.g. `end-3`), not `left`/`right`/`pl`/`pr`.

---

## 4. Icons — library agnostic

A consumer may use lucide, tabler, hugeicons, phosphor, or remixicon (see icons.md). A
crescent component must not force one.

- **Consumer-provided icons** (e.g. a leading icon slot) take whatever the consumer passes — never import an icon library for these. Size them via the slot's CSS (`[&_svg:not([class*='size-'])]:size-5`), not on the icon.
- **Built-in glyphs** the component itself must render (a checkmark indicator, a chevron) — render an **inline `<svg>` with `currentColor`**, no icon-library dependency. This is what keeps `registry.json` `dependencies` free of any icon package. (See the indicator in `choicebox.tsx`.)
- Never ship `@central-icons/*` or `lucide-react` as a hard dependency of a crescent component.

---

## 5. registry.json wiring

Each component is **two items** — the Base UI variant as `<name>` and the Radix variant as
`<name>-radix` — both targeting `components/ui/<name>.tsx`:

```jsonc
{
  "name": "choicebox",
  "type": "registry:ui",
  "title": "Choicebox",
  "description": "…",
  "dependencies": ["@base-ui/react", "class-variance-authority"],
  "files": [{ "path": "registry/base/ui/choicebox.tsx", "type": "registry:ui", "target": "components/ui/choicebox.tsx" }]
},
{
  "name": "choicebox-radix",
  "dependencies": ["radix-ui", "class-variance-authority"],
  "files": [{ "path": "registry/radix/ui/choicebox.tsx", "type": "registry:ui", "target": "components/ui/choicebox.tsx" }]
}
```

- `dependencies` lists only real npm packages the file imports — never an icon library, never `@/lib/utils` (that comes from the consumer's `shadcn init`).
- Source files import `cn` from **`@/lib/utils`** (the shadcn-standard alias the CLI rewrites to each consumer's alias). In this repo, `@/*` is aliased to `app/*` so the showcase resolves it; published files keep `@/`.
- Add a `*-demo.tsx` under `app/showcase/components/` and a line in `demos.tsx`. The showcase (a Base UI / `base` project) imports the **base** variant via `@registry/base/ui/<name>`.

> **Distribution note (auto base-selection).** GitHub-mode install (`shadcn add DayMoon/crescent-ui/choicebox`) is explicit per-item. For shadcn's own "`components.json` pulls the right variant automatically" behaviour, crescent must also be served as an **HTTP namespaced registry** with a `{style}` placeholder (like ReUI: `https://crescent-ui.com/r/{style}/{name}.json`) so the consumer's `base-*`/`radix-*` style resolves to the right file. That is a registry-build/deploy task, tracked separately — author both variant files now so it's ready.

---

## 6. New-component checklist

1. Confirm it doesn't already exist in `@shadcn`, `@reui`, or shadcnblocks (`shadcn search`). crescent only fills genuine gaps.
2. Author `registry/base/ui/<name>.tsx` (Base UI) following §1–§4.
3. Copy to `registry/radix/ui/<name>.tsx`, swap imports/primitive/types/API per §1 — **class strings stay identical**.
4. Add both items to `registry.json` (§5).
5. Add `app/showcase/components/<name>-demo.tsx` + register in `demos.tsx`.
6. `bun run typecheck && bun run build` (both variants typecheck; `radix-ui` is a devDependency for this).
7. Preview in the showcase under several `/create` presets (incl. a `radius: none` one) and light/dark — confirm it re-skins purely via tokens.
