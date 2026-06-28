/*
 * Registry build — the crescent-ui analogue of shadcn's apps/v4 build-registry.
 *
 * For every base × style combination it resolves the component's `cn-*` semantic
 * classes into that style's concrete utilities and writes a self-contained
 * registry-item JSON. The resolution is shadcn's own pipeline, reused verbatim
 * from the published `shadcn` package:
 *
 *   createStyleMap(styleCss)  -> { "cn-choicebox-item": "rounded-lg border ...", ... }
 *   transformStyle(src, {map}) -> component source with every cn-* token replaced
 *                                 inline (via tailwind-merge) and removed.
 *
 * Output: registry-dist/<base>-<style>/<name>.json — what a consumer fetches on
 * `shadcn add`. Served (dynamically, so installs can be counted) from
 * https://crescentui.com/r/<base>-<style>/<name>.json, which is the
 * `{style}/{name}.json` shape the @crescent-ui namespace resolves (the
 * consumer's components.json `style` field carries the <base>-<style> slug). The
 * resource route at app/registry-serve bundles this dir at build time.
 * The cn-* source itself is what the showcase renders live (it resolves the same
 * classes through a `.style-<name>` wrapper instead).
 */
import { promises as fs } from "node:fs";
import path from "node:path";

import { createStyleMap, transformStyle } from "shadcn/utils";

type Item = {
  name: string;
  type: string;
  title: string;
  description: string;
  dependencies: string[];
  // Other registry items this one installs alongside (shadcn `shadcn add`
  // resolves these too) — e.g. modal builds on the consumer's dialog + button.
  registryDependencies?: string[];
  // Arbitrary CSS the item injects into the consumer's stylesheet (keyframes,
  // data-slot rules). Same shape shadcn's registry-item `css` field expects.
  css?: Record<string, unknown>;
  // Source path relative to registry/bases/<base>/, and install target.
  file: string;
  target: string;
};

type Base = {
  name: string;
  items: Item[];
};

const ROOT = process.cwd();
const REGISTRY_ITEM_SCHEMA = "https://ui.shadcn.com/schema/registry-item.json";

// Styles we ship a registry/styles/style-<name>.css for. Add a name here (and the
// CSS file) to publish another style — no component change required.
const STYLES = [
  "vega",
  "nova",
  "maia",
  "lyra",
  "mira",
  "luma",
  "sera",
  "rhea",
] as const;

const CHOICEBOX_BASE_DESCRIPTION =
  "A card-styled selection group for single and multi select, built on the Base UI Toggle Group.";
const CHOICEBOX_RADIX_DESCRIPTION =
  "The Radix variant of Choicebox, built on the Radix Toggle Group (type=\"single\" | \"multiple\").";

const MODAL_DESCRIPTION =
  "A composable modal-layout system on top of the Dialog primitive: a pinned header, a single scrolling body, an optional muted-aside column, replace-style inner navigation (ModalViews), and a pinned footer — all combinable.";

// Modal source is base-agnostic (it composes the consumer's dialog + button via
// `@/ui/*`, never a base primitive), so both variants ship the same file and
// pull in whichever dialog the consumer's base provides.
const MODAL_REGISTRY_DEPENDENCIES = ["dialog", "button"];

// The ModalViews replace-style transition. Injected into the consumer's
// stylesheet on install; the showcase mirrors it in app/app.css.
const MODAL_CSS: Record<string, unknown> = {
  "@keyframes modal-view-forward": {
    from: { opacity: "0", transform: "translateY(0.5rem)" },
    to: { opacity: "1", transform: "translateY(0)" },
  },
  "@keyframes modal-view-back": {
    from: { opacity: "0", transform: "translateY(-0.375rem)" },
    to: { opacity: "1", transform: "translateY(0)" },
  },
  "[data-slot=modal-view]": {
    animation: "modal-view-forward 200ms ease-out",
  },
  "[data-slot=modal-view][data-direction=back]": {
    "animation-name": "modal-view-back",
  },
  "[data-slot=modal-view][data-direction=none]": {
    animation: "none",
  },
  "@media (prefers-reduced-motion: reduce)": {
    "[data-slot=modal-view]": { animation: "none" },
  },
};

const BASES: Base[] = [
  {
    name: "base",
    items: [
      {
        name: "choicebox",
        type: "registry:ui",
        title: "Choicebox",
        description: CHOICEBOX_BASE_DESCRIPTION,
        dependencies: ["@base-ui/react", "class-variance-authority"],
        file: "ui/choicebox.tsx",
        target: "components/ui/choicebox.tsx",
      },
      {
        name: "modal",
        type: "registry:ui",
        title: "Modal",
        description: MODAL_DESCRIPTION,
        dependencies: [],
        registryDependencies: MODAL_REGISTRY_DEPENDENCIES,
        css: MODAL_CSS,
        file: "ui/modal.tsx",
        target: "components/ui/modal.tsx",
      },
    ],
  },
  {
    name: "radix",
    items: [
      {
        name: "choicebox",
        type: "registry:ui",
        title: "Choicebox (Radix)",
        description: CHOICEBOX_RADIX_DESCRIPTION,
        dependencies: ["radix-ui", "class-variance-authority"],
        file: "ui/choicebox.tsx",
        target: "components/ui/choicebox.tsx",
      },
      {
        name: "modal",
        type: "registry:ui",
        title: "Modal",
        description: MODAL_DESCRIPTION,
        dependencies: [],
        registryDependencies: MODAL_REGISTRY_DEPENDENCIES,
        css: MODAL_CSS,
        file: "ui/modal.tsx",
        target: "components/ui/modal.tsx",
      },
    ],
  },
];

async function loadStyleMaps() {
  const entries = await Promise.all(
    STYLES.map(async (style) => {
      const css = await fs.readFile(
        path.join(ROOT, "registry", "styles", `style-${style}.css`),
        "utf8",
      );
      return [style, createStyleMap(css)] as const;
    }),
  );
  return new Map(entries);
}

async function build() {
  const styleMaps = await loadStyleMaps();
  const outRoot = path.join(ROOT, "registry-dist");
  // Start clean so a renamed/removed style can't leave a stale variant dir behind.
  await fs.rm(outRoot, { recursive: true, force: true });
  let written = 0;
  let remainingCn = 0;

  for (const base of BASES) {
    for (const item of base.items) {
      const source = await fs.readFile(
        path.join(ROOT, "registry", "bases", base.name, item.file),
        "utf8",
      );

      for (const style of STYLES) {
        const styleMap = styleMaps.get(style)!;
        const content = await transformStyle(source, { styleMap });

        // The distributed output must not leak cn-* tokens (other than the
        // CLI-handled allowlist). Surface any that survive so a missing style
        // rule can't ship silently. Comments are stripped first — transformStyle
        // rewrites class strings, not prose, so cn-* mentioned in doc comments is
        // expected and harmless.
        const codeOnly = content
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .replace(/\/\/.*$/gm, "");
        const leaked = codeOnly.match(/\bcn-[\w-]+\b/g) ?? [];
        remainingCn += leaked.length;
        if (leaked.length > 0) {
          console.warn(
            `   ⚠️  ${base.name}-${style}/${item.name}: unresolved ${[...new Set(leaked)].join(", ")}`,
          );
        }

        const registryItem = {
          $schema: REGISTRY_ITEM_SCHEMA,
          name: item.name,
          type: item.type,
          title: item.title,
          description: item.description,
          dependencies: item.dependencies,
          ...(item.registryDependencies
            ? { registryDependencies: item.registryDependencies }
            : {}),
          files: [
            {
              path: `registry/${base.name}-${style}/${item.file}`,
              type: item.type,
              target: item.target,
              content,
            },
          ],
          ...(item.css ? { css: item.css } : {}),
        };

        const dir = path.join(outRoot, `${base.name}-${style}`);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(
          path.join(dir, `${item.name}.json`),
          `${JSON.stringify(registryItem, null, 2)}\n`,
          "utf8",
        );
        written += 1;
        console.log(`   ✅ ${base.name}-${style}/${item.name}.json`);
      }
    }
  }

  console.log(
    `\nBuilt ${written} registry item(s) across ${STYLES.length} style(s).`,
  );
  if (remainingCn > 0) {
    console.error(
      `\n❌ ${remainingCn} unresolved cn-* token(s) in the output — add the missing rule(s) to the style CSS.`,
    );
    process.exit(1);
  }
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
