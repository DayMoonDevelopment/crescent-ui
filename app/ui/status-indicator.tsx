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
 */
export type StatusName =
  | "default"
  | "success"
  | "warning"
  | "destructive"
  | "info";

const STATUS_BG: Record<StatusName, string> = {
  default: "bg-muted-foreground",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
  info: "bg-info",
};

export function StatusIndicator({
  status = "default",
  className,
  ...props
}: {
  status?: StatusName;
} & ComponentProps<"span">) {
  return (
    <span
      data-slot="status-indicator"
      className={cn(
        "inline-block size-2 shrink-0 rounded-full",
        STATUS_BG[status],
        className,
      )}
      {...props}
    />
  );
}
