---
name: central-icons
description: Use whenever adding, replacing, or referencing icons in this project. Central Icon System is the icon library of choice — Lucide is NOT installed. Central icon names differ significantly from Lucide/other libraries, so always verify names against the package exports before importing.
---

# Central Icon System

This project uses **Central Icon System** (https://centralicons.com) as its only icon library. `lucide-react` is **not installed** — any component that imports it will fail to compile.

## Packages

Two aliased packages are installed (see `package.json`):

```json
"@central-icons/filled": "npm:@central-icons-react/round-filled-radius-2-stroke-2",
"@central-icons/outlined": "npm:@central-icons-react/round-outlined-radius-2-stroke-2"
```

- `@central-icons/outlined` — the default for general UI (buttons, menus, empty states).
- `@central-icons/filled` — for emphasis, active/selected states, and solid badges.

```tsx
import { IconTrashCan, IconSettingsGear1 } from "@central-icons/outlined";
import { IconHeart } from "@central-icons/filled";
```

## Component API

Every icon is a React component rendering an `<svg>`. Props: `size?: string | number`, `ariaHidden?: boolean`, `ariaLabel?: string`, plus all standard `SVGProps<SVGSVGElement>` (`className`, `data-*`, etc.). They are drop-in compatible with shadcn/ReUI `[&_svg]` sizing selectors and `data-icon="inline-start" | "inline-end"` slot attributes.

## Naming conventions

- Every export is `Icon` + PascalCase: `IconTrashCan`, `IconArrowLeft`, `IconMagnifyingGlass` (~2000 icons per style).
- Names are **literal and descriptive**, not Lucide-style abbreviations. There is no `IconX`, `IconSettings`, or `IconTrash2`.
- Many icons come in **size variants**: `IconPlusSmall` / `IconPlusMedium` / `IconPlusLarge`, `IconCrossSmall` / `IconCrossMedium` / `IconCrossLarge`, `IconChevronDownSmall` / `IconChevronDownMedium`. Default to **Medium** inside buttons and inputs.
- Many icons come in **numbered design variants**: `IconSettingsGear1`–`IconSettingsGear4`, `IconCalendar1`–`IconCalendar4`, `IconPencil`/`IconPencil2`/`IconPencil3`. Pick one variant per concept and use it consistently app-wide.
- Directional naming uses `Top`/`Bottom` in some families (`IconChevronTop`, `IconChevronBottom`) and `Up`/`Down` in others (`IconArrowUp`, `IconArrowDown`). Do not assume — check.

## NEVER guess a name — verify first

Lucide instincts will produce wrong names. Before importing, confirm the export exists:

```bash
ls node_modules/@central-icons/outlined | grep -i <keyword>
```

If the obvious keyword misses, try synonyms (e.g. close → cross, search → magnifying-glass, settings → gear, x → cross, more → dots).

## Verified Lucide → Central mappings

| Lucide | Central |
|---|---|
| `Plus` | `IconPlusMedium` |
| `X` (close) | `IconCrossMedium` |
| `Check` | `IconCheckmark1Medium` |
| `Settings` | `IconSettingsGear1` |
| `SlidersHorizontal` | `IconSettingsSliderHor` |
| `Trash` / `Trash2` | `IconTrashCan` |
| `Search` | `IconMagnifyingGlass` |
| `Pencil` / `Edit` | `IconPencil` (small edits: `IconEditSmall1`) |
| `Eye` / `EyeOff` | `IconEyeOpen` / `IconEyeClosed` (or `IconEyeSlash`) |
| `ChevronDown` | `IconChevronDownMedium` |
| `ChevronUp` | `IconChevronTopMedium` |
| `ChevronLeft` / `ChevronRight` | `IconChevronLeftMedium` / `IconChevronRightMedium` |
| `ArrowLeft` / `ArrowRight` / `ArrowUp` / `ArrowDown` | `IconArrowLeft` / `IconArrowRight` / `IconArrowUp` / `IconArrowDown` |
| `Calendar` | `IconCalendar1` |
| `Clock` | `IconClock` |
| `User` | `IconUser` |
| `Users` | `IconUserGroup` (or `IconPeople`) |
| `Home` | `IconHome` |
| `Bell` | `IconBell` |
| `Mail` | `IconEmail1` |
| `Send` | `IconSend` |
| `Globe` | `IconGlobe` |
| `Lock` | `IconLock` |
| `Star` | `IconStar` |
| `Heart` | `IconHeart` |
| `Info` | `IconInfoSimple` |
| `AlertTriangle` | `IconExclamationTriangle` |
| `AlertCircle` | `IconExclamationCircle` |
| `HelpCircle` | `IconCircleQuestionmark` |
| `Loader` | `IconLoadingCircle` |

## Workflow: new components from shadcn/ReUI registries

`components.json` still declares `"iconLibrary": "lucide"` (shadcn has no Central option), so components installed via `shadcn add` arrive importing `lucide-react`. **Immediately after installing any registry component, replace its Lucide imports with Central equivalents.** Typecheck (`bun run typecheck`) will fail loudly until you do, since `lucide-react` is not installed.
