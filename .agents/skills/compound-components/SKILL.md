---
name: compound-components
description: Build multi-part UI component systems as namespaced, shadcn/Radix-style compound component families — a set of parts the consumer assembles — instead of one component with a big prop-driven API. Use when creating OR refactoring any component that has distinct layers, slots, or swappable pieces (a modal with slides, a device frame around a screen, a header/content/footer, a trigger + panel), when you catch yourself adding a 4th+ config prop or threading data/render objects through props, or when reviewing a component API for composability. Canonical in-repo pattern: app/ui/sidebar.tsx. Not needed for genuinely atomic components (Badge, Avatar).
---

# Build multi-part component systems as namespaced compound components

When a component has **distinct layers, slots, or swappable pieces**, ship it as a
shadcn/Radix-style **compound component family** — a set of parts the consumer assembles —
not as one component with a big prop-driven API. The canonical reference in this repo is
`app/ui/sidebar.tsx`; the onboarding modal in
`app/routes/_protected/components/onboarding/` is a domain system built this way:
`onboarding.tsx` holds the generic parts (`Onboarding`, `OnboardingContent`,
`OnboardingSlide`, `OnboardingFooter`), and each concrete slide is its **own standalone
component file** under `slides/` (`segment-slide.tsx`, `value-slide.tsx`, …) that the
consumer drops into `<OnboardingContent>` in order.

Apply this when the thing has structure a consumer would want to vary independently (a
device frame around a screen around chrome; a header/content/footer; a trigger + panel; a
modal + slides + footer). A single component that's genuinely atomic (a `Badge`, an
`Avatar`) does **not** need this.

The conventions:

1. **Namespace every part under the system name.** If the system is `Onboarding`, every
   exported part is `Onboarding…` (`OnboardingContent`, `OnboardingSlide`,
   `OnboardingFooter`) and exported types too (`OnboardingProps`). No stray `StepDots`
   breaking the family. Same as `Sidebar*` in `app/ui/sidebar.tsx`.
2. **One `data-slot` per part**, matching the kebab-cased component name
   (`data-slot="onboarding-footer"`). It's the styling/query handle.
3. **Shared state rides a context provider**, read by a `use<System>()` hook that throws
   outside the provider (see `useSidebar`, `useOnboardingFlow`).
4. **Swappable kinds are `variant` props** on the part they belong to
   (`<MediaPreviewChrome variant="instagram">`, `<MediaPreviewDevice variant="default">`);
   use `cva` when the variant drives a lot of classes.
5. **Layout-/geometry-shaping choices live on the part that owns them**, not a detached
   sibling — `Sidebar` owns `collapsible`/`side`; `Onboarding` (root) owns the dialog
   geometry (`className`/`open`) and wraps the layers.
6. **Stay one degree more prop-driven than pure shadcn where the domain calls for it.**
   Genuinely per-instance data (a slide's title/body, an avatar URL, username, caption,
   counts) is fine as props on the relevant part — don't force it through `children`. The
   system can still own its *fixed* chrome internally (e.g. `OnboardingFooter` owns its
   nav labels; `SegmentSlide` owns the segmentation question). The rule is about
   *structure*, not banning props.

**Incorrect (one component, prop blob — hides the structure, can't swap a layer):**

```tsx
<PlatformPreview
  platform="instagram"
  media={{ type: "image", src: "…" }}
  data={{ avatar: {…}, username: "@jane", caption: "…", counts: {…} }}
  device={GENERIC_DEVICE}
/>
```

**Correct (compound, namespaced, each layer a slot with a variant):**

```tsx
<MediaPreview platform="instagram" className="w-40">
  <MediaPreviewDevice variant="default">
    <MediaPreviewThumbnail src="…" />            {/* or <MediaPreviewVideo src="…" /> */}
    <MediaPreviewChrome avatar={…} username="@jane" caption="…" counts={…} />
  </MediaPreviewDevice>
</MediaPreview>
```

The same refactor in this repo: a single `OnboardingDialog` taking
`open`/`onOpenChange`/`onComplete`/`onSkip`/`onSegmentSelect` and hardcoding a `slides[]`
data array became the `Onboarding` family — the consumer (the provider, the showcase) now
assembles `<OnboardingContent>` from explicit per-slide components
(`<SegmentSlide /><ConnectSlide />…`), and the carousel/step state rides
`useOnboardingFlow()`.

Reference: `app/ui/sidebar.tsx` (the canonical pattern),
`app/routes/_protected/components/onboarding/` (a domain system: `onboarding.tsx` for the
parts, `slides/` for one-file-per-slide components).
