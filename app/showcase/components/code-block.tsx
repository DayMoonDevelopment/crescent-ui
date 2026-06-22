import * as React from "react";

import { useHydrated } from "~/hooks/use-hydrated";

// A minimal command/code block with copy-to-clipboard. Uses semantic tokens so
// it re-skins with the rest of the app.
export function CodeBlock({
  children,
  onCopy,
}: {
  children: string;
  onCopy?: () => void;
}) {
  const hydrated = useHydrated();
  const [copied, setCopied] = React.useState(false);

  function copy() {
    void navigator.clipboard?.writeText(children);
    onCopy?.();
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="cn-card relative overflow-hidden border bg-muted/40">
      <pre className="overflow-x-auto p-4 pr-16 text-xs leading-relaxed">
        <code className="font-mono text-foreground">{children}</code>
      </pre>
      {hydrated ? (
        <button
          type="button"
          onClick={copy}
          className="absolute end-2 top-2 rounded-md border border-input bg-background px-2 py-1 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      ) : null}
    </div>
  );
}
