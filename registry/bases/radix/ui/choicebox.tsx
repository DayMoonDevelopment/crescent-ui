"use client";

import * as React from "react";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { IconPlaceholder } from "@/ui/icon-placeholder";

// Choicebox — a card-styled selection group: the management of a Toggle Group
// with the composable anatomy of a Card. Single- or multi-select via `type`;
// the indicator renders as a radio (single) or a checkbox (multiple).
//
// This is the Radix variant. The Base UI variant lives at base/ui/choicebox and
// is visually identical — only the primitive imports and group API differ
// (Radix `type="single" | "multiple"` vs Base UI `multiple`).
//
// STYLING MODEL (shadcn cn-* system):
//   The visual treatment of each part lives in `cn-choicebox-*` semantic classes,
//   defined per style under registry/styles/style-<name>.css via `@apply`. Only
//   structural layout (flex/grid/positioning/behavior) is inline here. The
//   registry build resolves each `cn-*` token into that style's utilities (see
//   scripts/build-registry.ts); the showcase resolves them live via a
//   `.style-<name>` wrapper class. Keep ALL color/border/radius/size/typography
//   in the style CSS — inline classes win twMerge conflicts and would override it.
//
// `orientation` sets how each item lays out its slots:
//   - "horizontal" (default): icon | content | indicator, in a row.
//   - "vertical": a card — icon over content, indicator pinned to the top-end
//     corner. Pair with a grid on the root (e.g. `grid grid-cols-2`).
//
// Anatomy (compound):
//   <Choicebox type value onValueChange orientation size>
//     <ChoiceboxItem value>
//       <ChoiceboxItemIcon><Icon /></ChoiceboxItemIcon>
//       <ChoiceboxItemContent>
//         <ChoiceboxItemTitle>…</ChoiceboxItemTitle>
//         <ChoiceboxItemDescription>…</ChoiceboxItemDescription>
//       </ChoiceboxItemContent>
//       <ChoiceboxItemIndicator />
//     </ChoiceboxItem>
//   </Choicebox>

type ChoiceboxOrientation = "horizontal" | "vertical";
type ChoiceboxSize = "default" | "sm";

type ChoiceboxContextValue = {
  multiple: boolean;
  orientation: ChoiceboxOrientation;
  size: ChoiceboxSize;
};

const ChoiceboxContext = React.createContext<ChoiceboxContextValue | null>(null);

function useChoicebox() {
  const context = React.useContext(ChoiceboxContext);
  if (!context) {
    throw new Error("Choicebox parts must be used within <Choicebox>.");
  }
  return context;
}

function Choicebox({
  orientation = "horizontal",
  size = "default",
  className,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> & {
  orientation?: ChoiceboxOrientation;
  size?: ChoiceboxSize;
}) {
  const multiple = props.type === "multiple";
  // Stable context identity so memoized items don't re-render on every
  // selection — these three values change rarely (only on prop change).
  const context = React.useMemo(
    () => ({ multiple, orientation, size }),
    [multiple, orientation, size],
  );
  return (
    <ChoiceboxContext.Provider value={context}>
      <ToggleGroupPrimitive.Root
        data-slot="choicebox"
        data-orientation={orientation}
        className={cn(
          "cn-choicebox flex flex-col",
          orientation === "vertical" && "flex-row flex-wrap",
          className,
        )}
        {...props}
      />
    </ChoiceboxContext.Provider>
  );
}

// Selected state is matched for BOTH primitives: Radix emits `data-[state=on]`,
// Base UI emits `data-pressed`. The cn-* tokens below are intentionally
// identical to the Base UI variant — keep them in sync. The base string carries
// only structural classes; the visual treatment is supplied by the style CSS.
const choiceboxItemVariants = cva(
  "cn-choicebox-item group/choicebox-item relative flex w-full text-start outline-none transition-[color,box-shadow,border-color,background-color] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      size: {
        default: "cn-choicebox-item-size-default",
        sm: "cn-choicebox-item-size-sm",
      },
    },
    defaultVariants: { size: "default" },
  },
);

function ChoiceboxItem({
  className,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  const { orientation, size } = useChoicebox();
  return (
    <ToggleGroupPrimitive.Item
      data-slot="choicebox-item"
      data-orientation={orientation}
      data-size={size}
      className={cn(
        choiceboxItemVariants({ size }),
        orientation === "vertical" ? "flex-col items-start" : "items-center",
        className,
      )}
      {...props}
    />
  );
}

function ChoiceboxItemIcon({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="choicebox-item-icon"
      className={cn(
        "cn-choicebox-item-icon flex shrink-0 items-center justify-center",
        className,
      )}
      {...props}
    />
  );
}

function ChoiceboxItemContent({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="choicebox-item-content"
      className={cn("flex flex-1 flex-col gap-0.5", className)}
      {...props}
    />
  );
}

function ChoiceboxItemTitle({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="choicebox-item-title"
      className={cn("cn-choicebox-item-title", className)}
      {...props}
    />
  );
}

function ChoiceboxItemDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="choicebox-item-description"
      className={cn("cn-choicebox-item-description", className)}
      {...props}
    />
  );
}

function ChoiceboxItemIndicator({
  className,
  ...props
}: React.ComponentProps<"span">) {
  const { multiple, orientation } = useChoicebox();
  return (
    <span
      data-slot="choicebox-item-indicator"
      aria-hidden
      // `data-multiple` lets the style CSS choose the indicator shape (radio vs
      // checkbox radius) via a data-[multiple]: variant — so radius is
      // style-tunable rather than hard-coded here.
      data-multiple={multiple ? "" : undefined}
      className={cn(
        "cn-choicebox-item-indicator pointer-events-none flex shrink-0 items-center justify-center",
        // In a card the indicator floats in the top-end corner.
        orientation === "vertical" && "absolute end-3 top-3",
        className,
      )}
      {...props}
    >
      {multiple ? (
        // The checkbox tick is drawn from the active icon library. As a registry
        // component this is an IconPlaceholder: the showcase resolves it live
        // against the selected library, and a consumer's `shadcn add` rewrites
        // it to their own iconLibrary's check.
        <IconPlaceholder
          lucide="Check"
          tabler="IconCheck"
          phosphor="Check"
          hugeicons="Tick02Icon"
          remixicon="RiCheckLine"
          className="size-3.5"
        />
      ) : (
        // The radio dot stays a geometric primitive — a "filled dot" isn't a
        // consistent glyph across icon libraries.
        <svg viewBox="0 0 16 16" fill="none" className="size-3.5" aria-hidden>
          <circle cx="8" cy="8" r="3" fill="currentColor" />
        </svg>
      )}
    </span>
  );
}

export {
  Choicebox,
  ChoiceboxItem,
  ChoiceboxItemIcon,
  ChoiceboxItemContent,
  ChoiceboxItemTitle,
  ChoiceboxItemDescription,
  ChoiceboxItemIndicator,
  choiceboxItemVariants,
  useChoicebox,
};
