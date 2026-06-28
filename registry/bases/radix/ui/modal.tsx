"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { IconPlaceholder } from "@/ui/icon-placeholder";
import { Button } from "@/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog";

// Modal — the composable modal-layout system: a namespaced compound family that
// sits ON TOP of the `Dialog` primitive (`@/ui/dialog`), which it consumes
// internally and never replaces. Where `Dialog` is the raw popup, `Modal` adds
// the cohesive *layout* every dialog should share: a pinned header, a single
// scrolling body, an optional muted-aside second column, replace-style inner
// navigation (ModalViews) — and a pinned footer, all combinable.
//
// This is the registry SOURCE: it is intentionally icon-library agnostic
// (IconPlaceholder, resolved on `shadcn add`) and structural-only — colors track
// the theme and the dialog's corner radius is the one style-tunable token
// (cn-dialog-content). The replace-style view transition rides the
// `[data-slot=modal-view]` animation shipped in this item's `css`.
//
// References (the resolved, app-level implementations this is generalized from):
//   - Post for Me  · post-for-me-dashboard  (app modal-layout system)
//   - DXLogic      · web/app/components/modal (Modal / ModalViews family)
//
// Anatomy (compound):
//   <Modal>
//     <ModalTrigger render={<Button>Open</Button>} />
//     <ModalContent layout="framed">
//       <ModalHeader>
//         <ModalTitle>…</ModalTitle>
//         <ModalDescription>…</ModalDescription>
//       </ModalHeader>
//       <ModalBody>…</ModalBody>
//       <ModalFooter>…</ModalFooter>
//     </ModalContent>
//   </Modal>

// `layout="framed"` (default) makes the popup a bounded flex column so the
// header/footer pin and the body owns the only scroll; `layout="simple"` keeps
// the plain dialog box. The layout rides ModalLayoutContext so the header/footer
// self-pad only when framed.
type ModalLayout = "simple" | "framed";

const ModalLayoutContext = React.createContext<ModalLayout>("framed");

function useModalLayout() {
  return React.useContext(ModalLayoutContext);
}

// Root + trigger + close + a11y title/description are the Dialog primitives,
// re-exported under the Modal namespace so a consumer assembles one family.
const Modal = Dialog;
const ModalTrigger = DialogTrigger;
const ModalClose = DialogClose;
const ModalTitle = DialogTitle;
const ModalDescription = DialogDescription;

function ModalContent({
  layout = "framed",
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogContent> & { layout?: ModalLayout }) {
  return (
    <ModalLayoutContext.Provider value={layout}>
      <DialogContent
        data-slot="modal-content"
        className={cn(
          // Framed: a bounded flex column. `overflow-hidden` makes the body the
          // single scroll region; `p-0`/`gap-0` hand padding to the parts.
          layout === "framed" && "max-h-[85vh] gap-0 overflow-hidden p-0",
          className
        )}
        {...props}
      >
        {children}
      </DialogContent>
    </ModalLayoutContext.Provider>
  );
}

function ModalHeader({ className, ...props }: React.ComponentProps<"div">) {
  const layout = useModalLayout();
  return (
    <div
      data-slot="modal-header"
      className={cn(
        "flex flex-col gap-1.5 text-center sm:text-start",
        // Framed: a pinned, solid bar (its own bg so a muted aside / scrolling
        // body never bleeds through). `pe-12` clears the absolute close button.
        layout === "framed" && "shrink-0 bg-popover px-6 pt-6 pb-4 sm:pe-12",
        className
      )}
      {...props}
    />
  );
}

function ModalBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="modal-body"
      className={cn("min-h-0 flex-1 overflow-y-auto px-6 py-4", className)}
      {...props}
    />
  );
}

// The body split into two columns: a primary ModalColumn and a distinguished
// ModalAside (muted panel). Container-query responsive — side-by-side when the
// modal is wide, stacked when narrow.
//
// Flex (not grid) so the columns stay bounded to the available height and scroll
// INTERNALLY. The whole chain uses `flex-1 min-h-0` rather than `h-full` so the
// height is definite via flexbox. `items-stretch` makes both columns full-height,
// so the aside's panel background fills the whole side.
function ModalColumns({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="modal-columns"
      className={cn("@container flex min-h-0 flex-1 flex-col", className)}
      {...props}
    >
      <div className="flex min-h-0 flex-1 flex-col @2xl:flex-row">
        {children}
      </div>
    </div>
  );
}

function ModalColumn({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="modal-column"
      className={cn("min-h-0 flex-1 overflow-y-auto px-6 py-4", className)}
      {...props}
    />
  );
}

function ModalAside({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="modal-aside"
      className={cn(
        "min-h-0 flex-1 overflow-y-auto border-t border-border bg-muted/50 px-6 py-4",
        // Side border instead of top border once the columns sit side-by-side.
        "@2xl:border-s @2xl:border-t-0",
        className
      )}
      {...props}
    />
  );
}

function ModalFooter({ className, ...props }: React.ComponentProps<"div">) {
  const layout = useModalLayout();
  return (
    <div
      data-slot="modal-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        // Framed: a pinned, solid bar — its own bg persists across the full
        // width (over a muted aside) and sits inline below the body.
        layout === "framed" &&
          "shrink-0 border-t border-border bg-popover px-6 py-4",
        className
      )}
      {...props}
    />
  );
}

// ModalViews — the replace-style inner navigation: a push/pop view stack that
// swaps the active view *in place* (a subtle transition, NOT a horizontal
// track). Use it when a dialog drills into sub-views and back (a settings panel,
// a branching wizard).
//
// `ModalViews defaultView="…"` owns the stack; each `ModalView value="…"` is a
// destination rendered only when active; `useModalViews` drives navigation
// (push/pop/replace/reset); `ModalViewsBack` is a back affordance that hides when
// there's nothing to pop.
type ModalViewsDirection = "forward" | "back" | "none";

type ModalViewsContextValue = {
  active: string;
  stack: string[];
  canGoBack: boolean;
  direction: ModalViewsDirection;
  push: (view: string) => void;
  pop: () => void;
  replace: (view: string) => void;
  reset: (view?: string) => void;
};

const ModalViewsContext = React.createContext<ModalViewsContextValue | null>(
  null
);

function useModalViews() {
  const ctx = React.useContext(ModalViewsContext);
  if (!ctx) {
    throw new Error("useModalViews must be used within <ModalViews>");
  }
  return ctx;
}

function ModalViews({
  defaultView,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { defaultView: string }) {
  const [stack, setStack] = React.useState<string[]>([defaultView]);
  const [direction, setDirection] = React.useState<ModalViewsDirection>("none");
  const active = stack[stack.length - 1];

  const push = React.useCallback((view: string) => {
    setDirection("forward");
    setStack((s) => [...s, view]);
  }, []);
  const pop = React.useCallback(() => {
    setDirection("back");
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  }, []);
  const replace = React.useCallback((view: string) => {
    setDirection("forward");
    setStack((s) => [...s.slice(0, -1), view]);
  }, []);
  const reset = React.useCallback(
    (view?: string) => {
      setDirection("back");
      setStack([view ?? defaultView]);
    },
    [defaultView]
  );

  return (
    <ModalViewsContext.Provider
      value={{
        active,
        stack,
        canGoBack: stack.length > 1,
        direction,
        push,
        pop,
        replace,
        reset,
      }}
    >
      <div
        data-slot="modal-views"
        className={cn("relative flex min-h-0 flex-1 flex-col", className)}
        {...props}
      >
        {children}
      </div>
    </ModalViewsContext.Provider>
  );
}

function ModalView({
  value,
  className,
  ...props
}: React.ComponentProps<"div"> & { value: string }) {
  const { active, direction } = useModalViews();
  if (active !== value) return null;
  return (
    // `key` remounts on view change so the enter animation replays; only the
    // active view is mounted (a true replace, not a track). `data-direction`
    // (see this item's css) gives push vs pop a slightly different in-place
    // motion.
    <div
      key={value}
      data-slot="modal-view"
      data-direction={direction}
      className={cn("flex min-h-0 flex-1 flex-col", className)}
      {...props}
    />
  );
}

function ModalViewsBack({
  className,
  label = "Back",
  ...props
}: React.ComponentProps<typeof Button> & { label?: string }) {
  const { canGoBack, pop } = useModalViews();
  if (!canGoBack) return null;
  return (
    <Button
      data-slot="modal-views-back"
      variant="ghost"
      size="icon-sm"
      onClick={pop}
      className={className}
      {...props}
    >
      <IconPlaceholder
        lucide="ChevronLeft"
        tabler="IconChevronLeft"
        phosphor="CaretLeft"
        hugeicons="ArrowLeft01Icon"
        remixicon="RiArrowLeftSLine"
        className="rtl:rotate-180"
      />
      <span className="sr-only">{label}</span>
    </Button>
  );
}

export {
  Modal,
  ModalTrigger,
  ModalClose,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalColumns,
  ModalColumn,
  ModalAside,
  ModalFooter,
  ModalViews,
  ModalView,
  ModalViewsBack,
  useModalLayout,
  useModalViews,
  type ModalLayout,
};
