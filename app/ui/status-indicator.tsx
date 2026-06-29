import type { ComponentProps } from "react";

import { cn } from "~/lib/utils";

/**
 * A small round **status indicator** in a first-party semantic color. The single
 * primitive for "a colored status dot" — used inline (filter chips), as an avatar
 * accessory (positioned + sized by the parent via the avatar size tokens), in
 * lists, etc.
 *
 * Color comes from {@link StatusName}; pass a `bg-*` className for a one-off hue.
 * Size + any ring/position come from `className` so the dot adapts to its context.
 *
 * Color changes between statuses animate via a CSS color transition. Pass
 * `animation` for a pre-configured motion state:
 * - `"pulse"` — the dot fades in and out in place.
 * - `"radar"` — the dot emits an expanding ring (a CSS pseudo-element that
 *   inherits the dot's color), like a sonar ping.
 *
 * Both animations respect `prefers-reduced-motion` (defined in `app.css`).
 */
export type StatusName =
  | "default"
  | "success"
  | "warning"
  | "destructive"
  | "info";

export type StatusAnimation = "pulse" | "radar";

const STATUS_BG: Record<StatusName, string> = {
  default: "bg-muted-foreground",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
  info: "bg-info",
};

export function StatusIndicator({
  status = "default",
  animation,
  className,
  ...props
}: {
  status?: StatusName;
  animation?: StatusAnimation;
} & ComponentProps<"span">) {
  return (
    <span
      data-slot="status-indicator"
      data-animation={animation}
      className={cn(
        "inline-block size-2 shrink-0 rounded-full transition-colors",
        STATUS_BG[status],
        className,
      )}
      {...props}
    />
  );
}
