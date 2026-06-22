import { useOutletContext, useParams } from "react-router";

import { capture } from "~/lib/analytics";

import { CodeBlock } from "../components/code-block";
import { demos } from "../components/demos";

// Selected base + style flow down from the layout so the install command and
// source link track the configurator.
type ShowcaseContext = { base: string; style: string };

const REPO = "https://github.com/DayMoonDevelopment/crescent-ui";
const NAMESPACE = "@crescent-ui";
const REGISTRY_ORIGIN = "https://crescentui.com";

function titleize(slug: string) {
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

export function Component() {
  const { component } = useParams();
  const { base, style } = useOutletContext<ShowcaseContext>();
  const demo = component ? demos[component] : undefined;

  if (!demo || !component) {
    return (
      <p className="text-sm text-muted-foreground">
        No component named “{component}”.
      </p>
    );
  }

  const sourceUrl = `${REPO}/blob/main/registry/bases/${base}/${demo.sourceFile}`;
  // One-time setup: the @crescent-ui namespace + the variant slug in `style`.
  // The {style} placeholder resolves to the slug, so the install command stays
  // slug-free. See https://ui.shadcn.com/docs/registry/namespace.
  const variant = `${base}-${style}`;
  const registriesConfig = `{
  "style": "${variant}",
  "registries": {
    "${NAMESPACE}": "${REGISTRY_ORIGIN}/r/{style}/{name}.json"
  }
}`;
  const installCmd = `npx shadcn@latest add ${NAMESPACE}/${component}`;

  return (
    <article className="mx-auto max-w-2xl space-y-12 pb-16">
      {/* Title */}
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{demo.title}</h1>
        <p className="text-base text-muted-foreground">{demo.description}</p>
      </header>

      {/* Preview — the running component on a clean surface, with a link to the
          source rather than an inline code dump. */}
      <section className="space-y-3">
        <div className="cn-card flex min-h-64 items-center justify-center border bg-background p-10">
          {demo.preview}
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">
            Live preview · {titleize(style)} style
          </span>
          <a
            href={sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium underline-offset-4 hover:underline"
          >
            View code on GitHub →
          </a>
        </div>
      </section>

      {/* Installation */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">Installation</h2>
          <p className="text-sm text-muted-foreground">
            Add the{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
              {NAMESPACE}
            </code>{" "}
            registry to your{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
              components.json
            </code>{" "}
            once. The <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">style</code>{" "}
            field carries your selected base and style ({titleize(style)}), so
            the install command stays the same for every component.
          </p>
        </div>
        <CodeBlock>{registriesConfig}</CodeBlock>
        <p className="text-sm text-muted-foreground">
          Then add any component with the shadcn CLI:
        </p>
        <CodeBlock
          onCopy={() =>
            capture("install_command_copied", { component, base, style })
          }
        >
          {installCmd}
        </CodeBlock>
        <p className="text-sm text-muted-foreground">
          Prefer copy &amp; paste?{" "}
          <a
            href={sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-foreground underline underline-offset-4"
          >
            Grab the source from GitHub
          </a>
          .
        </p>
      </section>

      {/* Examples */}
      <section className="space-y-5">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">Examples</h2>
          <p className="text-sm text-muted-foreground">
            More ways to use the component.
          </p>
        </div>
        {demo.examples}
      </section>
    </article>
  );
}
