"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { IconPlaceholder } from "@/ui/icon-placeholder";

// Copyable — a card-styled "value + copy button" surface: a visualization of
// some text (an API key, an install command, a token) paired with a button that
// copies it to the clipboard and confirms with a check.
//
// Copyable has no Base UI / Radix primitive dependency — it's structural markup
// plus the Clipboard API — so the `base` and `radix` variants are byte-identical
// and kept in sync only so each project base can install it from its namespace.
//
// STYLING MODEL (shadcn cn-* system):
//   The visual treatment of each part lives in `cn-copyable-*` semantic classes,
//   defined per style under registry/styles/style-<name>.css via `@apply`. Only
//   structural layout (flex/positioning/behavior) is inline here. The registry
//   build resolves each `cn-*` token into that style's utilities (see
//   scripts/build-registry.ts); the showcase resolves them live via a
//   `.style-<name>` wrapper class. Keep ALL color/border/radius/size/typography
//   in the style CSS — inline classes win twMerge conflicts and would override it.
//
// Anatomy (compound):
//   <Copyable value="npm i crescent-ui">
//     <CopyableContent>npm i crescent-ui</CopyableContent>
//     <CopyableButton />
//   </Copyable>
//
// `value` is the string written to the clipboard; the displayed content is
// whatever you put in <CopyableContent> (usually the same text, but it can be a
// masked or prettier representation of the value).

type CopyableContextValue = {
  copied: boolean;
  copy: () => void;
};

const CopyableContext = React.createContext<CopyableContextValue | null>(null);

function useCopyable() {
  const context = React.useContext(CopyableContext);
  if (!context) {
    throw new Error("Copyable parts must be used within <Copyable>.");
  }
  return context;
}

function Copyable({
  value,
  timeout = 2000,
  onCopy,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  /** The string written to the clipboard when the button is pressed. */
  value: string;
  /** How long (ms) the "copied" confirmation stays before resetting. */
  timeout?: number;
  /** Called after a successful copy. */
  onCopy?: (value: string) => void;
}) {
  const [copied, setCopied] = React.useState(false);

  const copy = React.useCallback(() => {
    // Guard for non-secure contexts / older browsers where the async Clipboard
    // API is unavailable — fail silently rather than throwing in the handler.
    if (!navigator.clipboard?.writeText) return;
    void navigator.clipboard
      .writeText(value)
      .then(() => {
        setCopied(true);
        onCopy?.(value);
      })
      .catch(() => {});
  }, [value, onCopy]);

  // Reset the confirmation after `timeout`; re-copying restarts the timer.
  React.useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), timeout);
    return () => window.clearTimeout(id);
  }, [copied, timeout]);

  const context = React.useMemo(() => ({ copied, copy }), [copied, copy]);

  return (
    <CopyableContext.Provider value={context}>
      <div
        data-slot="copyable"
        data-copied={copied ? "" : undefined}
        className={cn("cn-copyable flex items-center", className)}
        {...props}
      />
    </CopyableContext.Provider>
  );
}

function CopyableContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="copyable-content"
      className={cn("cn-copyable-content min-w-0 flex-1", className)}
      {...props}
    />
  );
}

function CopyableButton({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  const { copied, copy } = useCopyable();
  return (
    <button
      type="button"
      data-slot="copyable-button"
      data-copied={copied ? "" : undefined}
      onClick={copy}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      className={cn(
        "cn-copyable-button group/copyable-button inline-flex shrink-0 items-center justify-center outline-none transition-[color,box-shadow,background-color] disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children ??
        (copied ? (
          // The confirmation tick is drawn from the active icon library. As a
          // registry component this is an IconPlaceholder: the showcase resolves
          // it live against the selected library, and a consumer's `shadcn add`
          // rewrites it to their own iconLibrary's check.
          <IconPlaceholder
            lucide="Check"
            tabler="IconCheck"
            phosphor="Check"
            hugeicons="Tick02Icon"
            remixicon="RiCheckLine"
            aria-hidden
          />
        ) : (
          <IconPlaceholder
            lucide="Copy"
            tabler="IconCopy"
            phosphor="Copy"
            hugeicons="Copy01Icon"
            remixicon="RiFileCopyLine"
            aria-hidden
          />
        ))}
    </button>
  );
}

export { Copyable, CopyableContent, CopyableButton, useCopyable };
