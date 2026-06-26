import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

// Fact — a labelled fact: a small uppercase label above its value. The compact,
// read-only label→value block for detail/summary surfaces (ids, dates, status,
// counts…). Lay several out in a flex/grid for a "facts strip" (e.g. an account
// detail page). The value is freeform: plain text, a badge, a copyable, etc.
//
// This is the vertical counterpart to a horizontal label→value row; reach for a
// settings-style two-column row when the label and value should sit side by side.
//
// STYLING MODEL (shadcn cn-* system):
//   The visual treatment of each part lives in `cn-fact-*` semantic classes,
//   defined per style under registry/styles/style-<name>.css via `@apply`. Only
//   structural layout (flex/min-width) is inline here. The registry build
//   resolves each `cn-*` token into that style's utilities (see
//   scripts/build-registry.ts); the showcase resolves them live via a
//   `.style-<name>` wrapper class. Keep ALL color/spacing/typography in the
//   style CSS — inline classes win twMerge conflicts and would override it.
//
// Fact is a pure display component (no interactive primitive), so this Radix
// variant is byte-for-byte identical to the Base UI variant at base/ui/fact.tsx.
//
// Anatomy:
//   <Fact label="Connected">May 15, 2026</Fact>

function Fact({
  label,
  className,
  children,
  ...props
}: ComponentProps<"div"> & {
  label: ReactNode;
}) {
  return (
    <div
      data-slot="fact"
      className={cn("cn-fact flex min-w-0 flex-col", className)}
      {...props}
    >
      <span data-slot="fact-label" className="cn-fact-label">
        {label}
      </span>
      <div data-slot="fact-value" className="cn-fact-value min-w-0">
        {children}
      </div>
    </div>
  );
}

export { Fact };
