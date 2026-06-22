---
name: pull-request
description: >-
  Open a high-quality pull request for the crescent-ui repo. Use this skill
  whenever the user wants to open/create/raise a PR, "put this up for review",
  push a branch for review, or finalize a change for merge — even if they don't
  say the words "pull request". It covers branch naming (feat/fix/chore), the
  pre-PR checks, and the PR body template. Reach for it any time work is ready to
  become a PR.
---

# Opening a pull request

crescent-ui is a single-package repo. Run the checks below from the **repo root** before opening — never open a PR without a green typecheck and lint.

Work through these steps in order. The goal is a PR a reviewer can understand without opening the diff.

## 1. Branch

Branches are prefixed by change type. Only three prefixes — keep it simple:

- `feat/` — new functionality or user-facing capability (a new registry component, a showcase page)
- `fix/` — bug fix or correcting broken behavior
- `chore/` — everything else: deps, config, tooling, docs, refactors

Use a short kebab-case description: `feat/choicebox-component`, `fix/preset-resolver`, `chore/bump-react-router`.

If the current branch is `main` or doesn't carry one of these prefixes, create a correctly-prefixed branch off `main` before committing — never open a PR from `main`.

## 2. Pre-PR checks (from the repo root)

- `bun run typecheck` — `react-router typegen && tsc`. Must pass.
- `bun run lint` — `eslint app`. Must pass (`bun run lint:fix` for autofixable issues).
- **Touched `registry/`?** Run `bun run registry:build` and confirm the built items under `registry-dist/` are regenerated and committed — a registry change isn't done until the build output reflects it.

## 3. Commit

Follow conventional-commit style (`type(scope): summary`) and include the `Co-Authored-By` footer the harness requires. Commit and push only when the user has asked you to.

## 4. Write the PR body

The title should read like a conventional commit: `type(scope): concise summary` (e.g. `feat(registry): add choicebox component`).

Use this body template. Every section earns its place — a reviewer should grasp **what changed and why** without reading the diff, and know **how you verified it**.

```markdown
## Summary

1–3 sentences: what this PR does and why it's needed. Lead with the user reason,
not the implementation.

## Changes

- The notable changes, as bullets. Group by area if the PR is large.
- Call out anything a reviewer should pay special attention to.
- Note new dependencies or registry build-output changes explicitly.

## Testing

How you verified this works — commands run (typecheck/lint/registry:build),
manual steps in the showcase, what you observed. If something is untested or
deferred, say so plainly.

## Notes

(Optional) Known limitations, follow-ups, or decisions worth flagging.
Screenshots/recordings go here for any UI change.

🤖 Generated with AI
```

Guidance on the sections:

- **Summary** — the "why" matters more than the "what". A reviewer skims this first.
- **Changes** — bullets, not prose. Surface new deps and regenerated `registry-dist/` output because they're easy to miss in a diff.
- **Testing** — be honest. "Typecheck + lint pass; rebuilt the registry and viewed the component in the showcase" is far more useful than "tested locally". If a check failed or a step was skipped, report it.

## 5. Open the PR

Use the `gh` CLI:

```bash
gh pr create --title "type(scope): summary" --body "$(cat <<'EOF'
...body from the template...
EOF
)"
```

Confirm to the user with the returned PR URL.

## Quick checklist

- [ ] Branch prefixed `feat/` / `fix/` / `chore/`, off `main`
- [ ] `bun run typecheck` + `bun run lint` pass (from the repo root)
- [ ] If `registry/` changed: `bun run registry:build` run and `registry-dist/` output committed
- [ ] PR title in `type(scope): summary` form
- [ ] Body has Summary / Changes / Testing
- [ ] Co-Authored-By footer present
