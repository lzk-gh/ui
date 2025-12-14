<!-- .github/copilot-instructions.md -->

# AI Assistant Instructions for Lucky UI (uni-app + lucky-ui)

Keep guidance short and actionable — this file is read by automated coding agents (Copilot-style). Focus on project-specific patterns, commands, and examples an AI needs to be immediately productive.

## Quick project overview

- Monorepo-like layout: a **demo app** (root `src/`) that ships a local component library at `src/uni_modules/lucky-ui/`.
- The demo app is a Uni-app (Vue 3) project that runs with the `uni` CLI and uses Vite for H5 (`vite` is a dev dependency).
- Component source lives under `src/uni_modules/lucky-ui/components/<component>/` (props in `*.props.ts`, SFC in `*.vue`).
- Documentation lives in `docs/` (component docs under `docs/components/`) and demo blocks live in `src/components/demos/`.

## Important commands (use `pnpm`)

- Start H5 dev server: `pnpm run dev:h5` (local app; H5 served via `uni` CLI)
- Build H5: `pnpm run build:h5`
- Type-check: `pnpm run type-check` (uses `vue-tsc`)
- Lint & format: `pnpm run lint`, `pnpm run format` (eslint + stylelint + prettier)
- Docs: `pnpm run docs:dev` (vitepress dev on port 4173), `pnpm run docs:build`
- Icon tooling (important when adding icons): `pnpm run icons:prepare && pnpm run icons:build` and `pnpm run icons:base64`

## Key repository patterns and conventions

- Component layout: put Vue SFC in `lk-<name>/lk-<name>.vue` and props in `lk-<name>/<name>.props.ts`.
  - Props follow the `LkProp` / `baseProps` helpers from `components/common/props/index.ts`.
  - Example: `src/uni_modules/lucky-ui/components/lk-button/button.props.ts` shows usage of `LkProp.enum`, `LkProp.string`, `buttonEmits`, and documented `@value` comments.
- Library exports: central barrel at `src/uni_modules/lucky-ui/components/index.ts` — prefer adding new component exports there.
- Theme & tokens: global theme tokens and utilities are under `src/uni_modules/lucky-ui/theme/` and `src/uni_modules/lucky-ui/theme/src/tokens/`.
- Utilities & core code: shared helpers live in `src/uni_modules/lucky-ui/core/src/` (platform, request, validate, throttle, debounce, etc.).
- Units & sizing: code often uses `rpx` units and helpers to append `rpx` when numbers are passed (see `lk-icon`, `lk-rate`, etc.). Be mindful of platform-specific CSS/units when changing styles.
- Icons: icon font assets and generated code live under `components/lk-icon/fonts/` and are generated with scripts in `src/uni_modules/lucky-ui/scripts/`.

## Development notes & gotchas for automated edits

- There are no automated unit tests in the repo — changes should be verified by running the demo app (`pnpm run dev:h5`) and the docs (`pnpm run docs:dev`).
- When adding a component, update:
  1. `src/uni_modules/lucky-ui/components/<component>/` (SFC + props + styles)
  2. Export it in `components/index.ts`
  3. Add a demo under `src/components/demos/<component>-demo.vue`
  4. Add a docs file under `docs/components/<component>.md`
- Linting / formatting: run `pnpm run lint` and `pnpm run format` before committing. ESLint and Stylelint configs exist at repo root.

## Where to look for examples & references

- Component example: `src/uni_modules/lucky-ui/components/lk-button/` (props pattern, emits, documentation style)
- Demo example: `src/components/demos/button-demo.vue` and other `*-demo.vue` files
- Docs example: `docs/components/rate.md` (component docs style and sections)
- Icon tooling: `src/uni_modules/lucky-ui/scripts/*` and `components/lk-icon/fonts/*`

## Good brief prompts for the repo

- "Add a new `LkFoo` component: create SFC, props via `LkProp`, export in `components/index.ts`, add demo and doc entry."
- "Refactor `lk-button` to support a new `variant='ghost'` while preserving `LkProp.enum` validation and docs." (Include tests by running docs/demo and lint)

## What NOT to assume

- Do not assume automated tests exist — validate in the running dev environment.
- Do not change icon assets without running the icon build scripts and verifying font files (they are committed to `components/lk-icon/fonts`).

---

If anything in this file is unclear or you'd like more examples (e.g., a component skeleton template, or a checklist for PRs), tell me which part to expand. ✅
