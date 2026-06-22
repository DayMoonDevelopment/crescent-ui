import * as React from "react";
import {
  Link,
  Outlet,
  useFetcher,
  useLoaderData,
  useParams,
} from "react-router";

import { cn } from "~/lib/utils";
import { Button } from "~/ui/button";
import {
  IconLibraryProvider,
  type IconLibraryName,
} from "~/ui/icon-placeholder";
import { Label } from "~/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/ui/select";
import { Separator } from "~/ui/separator";

import { demoOrder, demos } from "./components/demos";
import {
  AXES,
  DEFAULT_CFG,
  FONT_HEADING_OPTIONS,
  SHIPPED_STYLES,
  type Cfg,
  type PresetCssVars,
  type PresetFont,
} from "./presets";
import type { loader } from "./route.loader";

type PresetResponse = {
  name?: string;
  cssVars?: PresetCssVars;
  fonts?: PresetFont[];
  error?: string;
};

function titleize(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Flatten a preset's { theme, light|dark } token maps into a flat CSS custom
// property record. Emitted as a :root block (see below) it overrides the
// stylesheet defaults, so the entire app — chrome, preview, and portaled
// popups — re-skins together.
function toCssVars(
  cssVars: PresetCssVars | undefined,
  mode: "light" | "dark",
): Record<string, string> {
  const out: Record<string, string> = {};
  if (!cssVars) return out;
  const apply = (obj?: Record<string, string>) => {
    if (!obj) return;
    for (const [key, value] of Object.entries(obj)) {
      out[key.startsWith("--") ? key : `--${key}`] = value;
    }
  };
  apply(cssVars.theme);
  apply(cssVars[mode] ?? cssVars.light);
  return out;
}

const SWATCHES: Array<[label: string, token: string]> = [
  ["background", "--background"],
  ["foreground", "--foreground"],
  ["primary", "--primary"],
  ["secondary", "--secondary"],
  ["muted", "--muted"],
  ["accent", "--accent"],
  ["border", "--border"],
  ["ring", "--ring"],
  ["chart-1", "--chart-1"],
  ["chart-2", "--chart-2"],
  ["chart-3", "--chart-3"],
  ["chart-4", "--chart-4"],
];

// No props and tokens read via `var(--…)`, so it never needs to re-render — CSS
// reflects theme changes on its own.
const PresetSwatches = React.memo(function PresetSwatches() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {SWATCHES.map(([label, token]) => (
        <div key={token} className="space-y-1">
          <div
            className="h-7 w-full rounded-md border"
            style={{ backgroundColor: `var(${token})` }}
          />
          <p className="truncate text-[10px] text-muted-foreground">{label}</p>
        </div>
      ))}
    </div>
  );
});

// Component list. Depends only on the active route param, so memoize it — the
// configurator's cfg/mode/fetcher churn no longer re-renders the whole nav.
const ComponentNav = React.memo(function ComponentNav({
  active,
}: {
  active?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      {demoOrder.map((name) => (
        <Button
          key={name}
          variant="ghost"
          size="sm"
          nativeButton={false}
          className={cn(
            "w-full justify-start",
            name === active && "bg-accent text-accent-foreground",
          )}
          render={<Link to={`/${name}`} />}
        >
          {demos[name].title}
        </Button>
      ))}
    </div>
  );
});

function ControlSelect({
  label,
  value,
  onValueChange,
  options,
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: readonly string[];
}) {
  const items = options.map((option) => ({
    label: titleize(option),
    value: option,
  }));
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Select
        items={items}
        value={value}
        onValueChange={(next) => onValueChange(next as string)}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export function Component() {
  const { component } = useParams();
  // Default theme resolved server-side (loader) so the first paint is themed —
  // no post-hydration fetch. The fetcher below handles user-driven changes.
  const initial = useLoaderData<typeof loader>();
  const fetcher = useFetcher<PresetResponse>();

  const [cfg, setCfg] = React.useState<Cfg>(DEFAULT_CFG);
  const [mode, setMode] = React.useState<"light" | "dark">("light");
  const [applied, setApplied] = React.useState<PresetCssVars | null>(
    initial.cssVars ?? null,
  );
  const [fonts, setFonts] = React.useState<PresetFont[]>(initial.fonts ?? []);
  const [presetName, setPresetName] = React.useState<string | null>(
    initial.name ?? null,
  );

  function resolve(next: Cfg) {
    const qs = new URLSearchParams(next as Record<string, string>);
    fetcher.load(`/resources/preset?${qs.toString()}`);
  }

  // Promote a resolve into the applied theme + fonts.
  React.useEffect(() => {
    if (fetcher.data?.cssVars && Object.keys(fetcher.data.cssVars).length > 0) {
      setApplied(fetcher.data.cssVars);
      setFonts(fetcher.data.fonts ?? []);
      setPresetName(fetcher.data.name ?? null);
    }
  }, [fetcher.data]);

  // Load each preset webfont once.
  React.useEffect(() => {
    for (const font of fonts) {
      if (document.querySelector(`link[data-preset-font="${font.slug}"]`)) continue;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = font.stylesheet;
      link.dataset.presetFont = font.slug;
      document.head.appendChild(link);
    }
  }, [fonts]);

  const sansFamily = fonts[0]?.family;

  // Declarative theming: render the resolved tokens as a :root block. Seeded
  // from the loader, so it's server-rendered and the first paint is already
  // skinned. :root themes the whole app, including portaled popups.
  const themeCss = React.useMemo(() => {
    const vars = toCssVars(applied ?? undefined, mode);
    if (sansFamily) {
      vars["--font-sans"] =
        `"${sansFamily}", ui-sans-serif, system-ui, sans-serif`;
    }
    const decls = Object.entries(vars).map(([key, value]) => `${key}:${value}`);
    if (sansFamily) decls.push("font-family:var(--font-sans)");
    return decls.length ? `:root{${decls.join(";")}}` : "";
  }, [applied, mode, sansFamily]);

  // The .dark class (Tailwind dark: variants) and the style-* wrapper (cn-*
  // structural style) must be real classes on <html> so portaled popups inherit
  // them too. Tokens are handled declaratively above; only classes go here.
  React.useEffect(() => {
    const el = document.documentElement;
    el.classList.toggle("dark", mode === "dark");
    const styleClass = `style-${cfg.style}`;
    el.classList.add(styleClass);
    return () => el.classList.remove(styleClass);
  }, [mode, cfg.style]);

  function setAxis(key: keyof Cfg, value: string) {
    const next: Cfg = { ...cfg, [key]: value };
    // Theme tracks the base color (a monochrome primary) until an accent is
    // chosen; chart color tracks the theme the same way. Each stays put once
    // explicitly overridden — "default matches, override sticks".
    if (key === "baseColor") {
      if (cfg.theme === cfg.baseColor) next.theme = value;
      if (cfg.chartColor === cfg.theme) next.chartColor = next.theme;
    }
    if (key === "theme") {
      if (cfg.chartColor === cfg.theme) next.chartColor = value;
    }
    setCfg(next);
    resolve(next);
  }

  function shuffle() {
    const pick = (values: readonly string[]) =>
      values[Math.floor(Math.random() * values.length)];
    const theme = pick(AXES.theme);
    const next: Cfg = {
      base: pick(AXES.base),
      style: pick(SHIPPED_STYLES),
      baseColor: pick(AXES.baseColor),
      theme,
      chartColor: theme,
      radius: pick(AXES.radius),
      font: pick(AXES.font),
      fontHeading: "inherit",
      iconLibrary: pick(AXES.iconLibrary),
    };
    setCfg(next);
    resolve(next);
  }

  const colorOptions = [cfg.baseColor, ...AXES.theme];

  // Stable identity so the detail route doesn't re-render on unrelated changes
  // (mode/font) — only when base or style actually changes.
  const outletContext = React.useMemo(
    () => ({ base: cfg.base, style: cfg.style }),
    [cfg.base, cfg.style],
  );

  return (
    <IconLibraryProvider value={cfg.iconLibrary as IconLibraryName}>
      {themeCss ? (
        <style dangerouslySetInnerHTML={{ __html: themeCss }} />
      ) : null}
      <div
        className={cn(
          "min-h-screen bg-background text-foreground",
          `style-${cfg.style}`,
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur-sm">
          <div className="flex h-14 items-center justify-between gap-4 px-5">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold">crescent UI</span>
              <span className="hidden text-xs text-muted-foreground sm:inline">
                shadcn registry · Base UI
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={shuffle}>
                🎲 Shuffle
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Toggle dark mode"
                onClick={() =>
                  setMode((m) => (m === "light" ? "dark" : "light"))
                }
              >
                {mode === "light" ? "☀" : "☾"}
              </Button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[200px_minmax(0,1fr)_300px]">
          {/* Left — component list */}
          <nav className="border-b p-3 lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] lg:border-r lg:border-b-0">
            <p className="px-2 pb-2 text-xs font-medium text-muted-foreground">
              Components
            </p>
            <ComponentNav active={component} />
          </nav>

          {/* Center — component display. The child route renders the flat
              preview / installation / examples sections. */}
          <main className="min-w-0 px-6 py-10 lg:px-12">
            <Outlet context={outletContext} />
          </main>

          {/* Right — create options */}
          <aside className="border-t p-4 lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] lg:overflow-y-auto lg:border-t-0 lg:border-l">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Create options
                </p>
                {presetName ? (
                  <code className="truncate text-[10px] text-muted-foreground">
                    {presetName}
                  </code>
                ) : null}
              </div>

              {/* Live-skin axes — these now re-skin the whole app, not just the
                  preview: color/radius/font/icon flow through the tokens applied
                  to <html>; Style swaps the cn-* wrapper class. */}
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
                <ControlSelect label="Style" value={cfg.style} onValueChange={(v) => setAxis("style", v)} options={SHIPPED_STYLES} />
                <ControlSelect label="Base Color" value={cfg.baseColor} onValueChange={(v) => setAxis("baseColor", v)} options={AXES.baseColor} />
                <ControlSelect label="Theme" value={cfg.theme} onValueChange={(v) => setAxis("theme", v)} options={colorOptions} />
                <ControlSelect label="Chart Color" value={cfg.chartColor} onValueChange={(v) => setAxis("chartColor", v)} options={colorOptions} />
                <ControlSelect label="Radius" value={cfg.radius} onValueChange={(v) => setAxis("radius", v)} options={AXES.radius} />
                <ControlSelect label="Font" value={cfg.font} onValueChange={(v) => setAxis("font", v)} options={AXES.font} />
                <ControlSelect label="Heading" value={cfg.fontHeading} onValueChange={(v) => setAxis("fontHeading", v)} options={FONT_HEADING_OPTIONS} />
                <ControlSelect label="Icon Library" value={cfg.iconLibrary} onValueChange={(v) => setAxis("iconLibrary", v)} options={AXES.iconLibrary} />
              </div>

              <Separator />

              {/* Install-time axis: Base selects the primitive the consumer
                  installs. It changes the generated code, not the live app. */}
              <div className="space-y-2">
                <ControlSelect label="Base" value={cfg.base} onValueChange={(v) => setAxis("base", v)} options={AXES.base} />
                <p className="text-[10px] leading-relaxed text-muted-foreground">
                  Install option — changes the generated component code, not this
                  preview.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Palette
                </p>
                <PresetSwatches />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </IconLibraryProvider>
  );
}
