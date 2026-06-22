import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

// The showcase IS the site: a pathless layout (tab nav + chrome) wrapping an
// index that redirects to the first component, and a `/:component` detail view.
// A marketing landing page can later take over "/" by swapping the index child.
export default [
  // Resource route (loader only): resolves a shadcn /create preset code to its
  // CSS variables server-side, so the Preset Lab can preview components under it.
  route("resources/preset", "showcase/preset-resource.ts"),
  // The published registry channel: serves /r/<base>-<style>/<name>.json that
  // `shadcn add` fetches, dynamically so each install can be counted.
  route("r/:variant/:name", "registry-serve/route.ts"),
  layout("showcase/route.ts", [
    index("showcase/_index/route.ts"),
    route(":component", "showcase/$component/route.ts"),
  ]),
] satisfies RouteConfig;
