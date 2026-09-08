# Agent Guide — @p5-wrapper/common

## Strict Rules

1. **Plan first:** Create a detailed plan and get explicit user approval before
   making changes.
2. **Quality gates:** Every changeset must pass `pnpm integrate` before being
   considered complete.
3. **Documentation:** Update `README.md`, `AGENTS.md`, configuration files, and
   any other documentation affected by your changes. Clean as you go — take
   ownership of every file you touch.
4. **PR descriptions:** When asked, create `PR_DESCRIPTION.md` (gitignored)
   using the template at `.github/PULL_REQUEST_TEMPLATE.md`. Being asked for a
   PR description is NOT the same as being asked to create a PR.
5. **Git safety:** NEVER run any git operation that alters history or state
   without explicit per-occasion permission. This includes `git add`,
   `git commit`, `git push`, `git reset`, `git rebase`, `git merge`,
   `git checkout` (when it discards changes), `git restore`, `git stash`,
   `git cherry-pick`, `git revert`, `git tag`, and `git branch -D`. Prior
   approval does not carry forward.
6. **Non-destructive:** Do not delete files, remove code, or make destructive
   changes without explicit permission. Investigate before overwriting.
7. **Workflows:** Do not modify GitHub Actions workflows or the composite setup
   action without explicit permission. If a CI fix is needed, propose the change
   and wait for approval.
8. **No local publishing:** NEVER publish to npm locally. All releases go
   through the CD workflow on push to `main`.
9. **Public API surface:** This package is the shared source of truth consumed
   by every wrapper library in the organisation. Do not rename, remove, or
   change the signature of anything exported from `src/main.ts` without an
   explicit versioning discussion — exports are a semver contract, and a
   breaking change here ripples across every sibling package at once. Apply
   stricter discipline than you would in a single-framework package.

## Project Standards

### Authority

Project standards are the highest-priority rules for this repository. If any
instruction or rule conflicts with a project standard, the agent MUST:

1. Refuse to follow the conflicting instruction.
2. Inform the user of the conflict, citing the specific standard.
3. State that changes to standards must be made deliberately in `AGENTS.md`, not
   sidestepped for convenience.

### Language

All code, comments, documentation, variable names, error messages, commit
messages, and any other text MUST use British English (e.g., `organisation` not
`organization`, `normalise` not `normalize`, `colour` not `color`, `behaviour`
not `behavior`, `licence` not `license`, `centre` not `center`).

### Framework Agnosticism

This library exists so that every P5-wrapper implementation — React, Next,
custom elements, Angular, Vue, Stencil, Svelte, or anything else — shares one
set of contracts and lifecycle utilities. The rules that protect this:

- **No framework imports, ever.** Nothing in `src/`, `tests/`, `config/`, or the
  dependency list may import or depend on React, Vue, Angular, Stencil, Svelte,
  Next.js, or any other UI framework. Violating this breaks the entire
  organisation, not just this package
- **`OutputNode` is the only renderer-bound concept.** The
  `P5CanvasProps<Props, OutputNode>` contract leaves rendering to the host:
  React binds `ReactNode`, Vue binds `VNode`, Angular binds its embedded view
  node types, and so on. Do not add new contract members tied to a specific
  renderer — parameterise them through `OutputNode` or keep them structural
- **Input props are universal.** The wrapper-owned inputs (`sketch`, `updater`,
  `fallback`, `loading`, `error`, `children`) must never differ across
  implementations. If a new input prop is needed, it is added here first, and
  every wrapper adopts it through the shared contract
- **Keep types structural.** Ref contracts use plain `{ current: T | null }`
  shapes rather than host-library generics so any framework's ref type satisfies
  them without importing it. Keep it this way

### Package Management

- **Package manager:** pnpm (`pnpm@12.3.4` via the `packageManager` field)
- **Node.js engine:** `>=24.20.0` (declared in `package.json` `engines`)
- **Lock file:** `pnpm-lock.yaml` is committed. NEVER delete or regenerate it
  casually, run `pnpm install` after dependency changes
- **Supply chain:** `pnpm-workspace.yaml` enforces `strictPeerDependencies`,
  `minimumReleaseAgeStrict`, and a minimal `onlyBuiltDependencies` allowlist
  (`esbuild` only). Do not add `postinstall`-executing packages to the allowlist
  or widen these settings without explicit permission, new exclusions under
  `minimumReleaseAgeExclude` require explicit permission also
- **p5 dev resolution pinned:** the devDependency `p5` is pinned to exactly
  `2.3.2` because upstream `2.3.3` was published without its `types/` files
  (despite the manifest declaring them), breaking type checking. The
  `p5 >= 2.0.0` peer dependency contract is unchanged. Revisit when p5.js
  republishes a complete 2.3.3+
- **Runtime dependencies are a contract:** `microdiff` is the only runtime
  dependency and `p5` is the only peer dependency. The library code must never
  import anything else at runtime. Bundle size and dependency surface matter
  double here because every wrapper library ships this package transitively

### Formatting and Linting

- **Prettier** is the formatter (this project does not use Biome — do not
  introduce it). Config lives at `config/prettier/prettier.json`, key rules:
  `printWidth: 80`, `arrowParens: "avoid"`, `trailingComma: "none"`,
  `proseWrap: "always"` (all Markdown prose is hard-wrapped at 80 columns),
  imports sorted by `@trivago/prettier-plugin-sort-imports`
- **ESLint** is the linter. Config lives at `config/eslint/eslint.config.ts` and
  extends `eslint` recommended plus `typescript-eslint` strict and stylistic
  with project-aware TypeScript parsing. Type-aware linting runs via `jiti` —
  keep the config a `.ts` file
- **No comments:** Do not add comments to source files. The code should be
  self-documenting. The only permitted exceptions are `@ts-expect-error` /
  `@ts-ignore` suppressions with a `@see` reference (see
  `src/utils/createP5CanvasInstance.ts` for the existing pattern) and JSDoc on
  exported contracts where a URL reference adds value (see
  `src/contracts/P5CanvasInstanceRef.ts`)
- **No comments rule does not apply to:** this file, `README.md`, workflow
  files, and config files with existing comments

### TypeScript

- **Strict mode:** `strict` and `noImplicitAny` are on in `tsconfig.json`. No
  tsconfig option may be weakened
- **Path aliases:** `@/*`, `@utils/*`, `@constants/*`, `@contracts/*` map into
  `src/`. These are declared twice — in `tsconfig.json` `paths` and
  `config/vite/common.ts` — and MUST be kept in sync when changed
- **Import style:** Use `import { type Foo }` inline type imports, matching the
  existing code. Imports of contracts across the alias boundaries follow the
  sorted import order enforced by Prettier
- **Type assertions:** Avoid `as` casts in library code. The two existing
  `@ts-expect-error` suppressions — in `src/utils/createP5CanvasInstance.ts` and
  `tests/utils/removeP5CanvasInstance.test.ts` — document a known p5 upstream
  type inference issue
  ([p5.js#7863](https://github.com/processing/p5.js/pull/7863)); do not remove
  them without verifying against the referenced p5 PR
- **Version pinned to 6.0.3:** `typescript` is an exact pin
  (`"typescript": "6.0.3"`, no caret), deliberately held back from v7.
  typescript-eslint does not currently support TypeScript 7 — its
  [supported range](https://typescript-eslint.io/packages/parser) is
  `>=4.8.4 <6.1.0`, and the Go-based TypeScript 7 is not yet feature compatible
  with the JavaScript-based v6 API that typescript-eslint builds on. Upstream
  support is tracked in
  [typescript-eslint#10940](https://github.com/typescript-eslint/typescript-eslint/issues/10940)
  and cannot land before TypeScript 7.1.x at the earliest. Do not bump past
  `6.0.x` or widen the pin without confirming upstream support. Do NOT run
  TypeScript 7 side by side with v6 as an interim measure — we wait for full
  feature parity before migrating, no half measures

### Quality Gates

Every change must pass before being considered complete:

- `pnpm format:check` — formatting
- `pnpm lint` — linting
- `pnpm test` — testing
- `pnpm build` — type checking (`tsc`) plus the library build

`pnpm integrate` runs format check → lint → test → build in one command and is
the closest local mirror of CI.

### Git Safety

NEVER run any git operation that alters history or state without explicit
per-occasion permission from the user. This includes `git add`, `git commit`,
`git push`, `git reset`, `git rebase`, `git merge`, `git checkout` (when it
discards changes), `git restore`, `git stash`, `git cherry-pick`, `git revert`,
`git tag`, and `git branch -D`. Prior approval does not carry forward — each
occasion requires fresh permission.

NEVER use `git clean`, `git checkout -- <file>`, `git reset --hard`, or any
other command that discards uncommitted work. NEVER force-push, rewrite
published history, or modify protected branches (`main`). Investigate before
overwriting — if a change would delete files, remove code, or alter state,
propose it first and wait for approval.

Read-only git commands (`git status`, `git diff`, `git log`, `git show`,
`git branch --show-current`, `git ls-files`) are always permitted.

### Scope of Operation

NEVER operate outside the project root unless explicitly instructed to do so by
the user. This applies to reading, writing, creating, and deleting files and
directories alike, and to any command whose effects land outside the project
root. Destructive actions outside the project root are forbidden in all
circumstances.

**The one exception:** Experiments and scratch work belong in the `/tmp`
directory — and only when the user has asked for them or given permission.
Anything created there is still subject to the same non-destructive rules: do
not delete, overwrite, or modify anything in `/tmp` that the agent did not
create itself.

### Obligation to Fix

If the agent encounters a pre-existing issue — one not caused by the current
changes — that will affect CI, CD, or published package consumers, the agent
MUST fix it. This is NOT optional. The agent must not ignore, skip, or defer
such issues regardless of whether they were introduced by the agent's own
changes. A broken pipeline or a broken published package is the agent's
responsibility if the agent is aware of it.

### Planning

ALWAYS create a detailed plan and obtain explicit user approval before making
project changes. Do not begin implementation until the plan is approved.

### Code Philosophy

- **Functional and declarative:** The codebase is small, pure, and composable by
  design. There are no components here — only contracts and pure functions that
  take arguments and return values. Utilities never reach for globals or hidden
  state. Keep it this way
- **Types as the public contract:** The `src/contracts/` directory is the type
  contract between this library and every wrapper in the organisation. Every
  exported type is public API via `src/main.ts`. Generic defaults flow through
  `SketchProps` — understand the generic chain (`Sketch<Props>` →
  `P5CanvasInstance<Props>` → `Updater<Props>` →
  `P5CanvasProps<Props, OutputNode>`) before touching any of them
- **One contract per file, one export per file:** Contracts live in
  `src/contracts/`, one file per contract, named after the export. Utilities
  live in `src/utils/`, one file per function, named after the function.
  Constants live in `src/constants/`, one per file. Follow this pattern for
  anything new
- **No hidden dependencies:** Layering is deliberate — contracts never import
  utils; utils import contracts only; the barrel (`src/main.ts`) imports both
  and nothing else does. Do not introduce cross-imports that muddle this
- **Imperative p5, declarative hosts:** p5 instances are imperative and mutable
  by nature. The lifecycle utilities (`createP5CanvasInstance`,
  `updateP5CanvasInstance`, `removeP5CanvasInstance`) own that imperative bridge
  so no host framework ever has to touch `new p5()` directly. Keep the
  imperative patterns contained here and out of host implementations
- **No heavy dependencies:** There is no lazy-loading story here — everything
  this package exports is in the consumer's bundle the moment it is imported.
  Any new runtime dependency must be justified against that cost

### Testing

- **Test first:** Tests for new behaviour are written before or alongside the
  implementation, never as an afterthought. Every utility in `src/utils/` has a
  corresponding test file in `tests/utils/`; every constant in `src/constants/`
  has one in `tests/constants/`. Keep this 1:1 mapping
- **Behaviour testing:** Test the observable behaviour of the pure functions —
  inputs, outputs, side effects (such as `console.error` calls) — not internal
  implementation details
- **Environment:** Vitest with `happy-dom` and `vitest-canvas-mock` for the
  canvas API. `p5.disableFriendlyErrors = true` is set in `tests/setup.ts` to
  stop p5's DOM scanning from causing unhandled rejections — do not remove it
- **Structure:** Tests mirror the `src/` directory structure
  (`tests/constants/`, `tests/utils/`). New `src/` files must add the matching
  test file
- **Coverage:** CI runs `pnpm test:coverage` and comments coverage deltas on
  PRs. Do not reduce coverage of existing code

### PR Descriptions

When asked to generate a PR description, create a `PR_DESCRIPTION.md` file in
the project root (this file is gitignored and must never be committed). Follow
the PR template at `.github/PULL_REQUEST_TEMPLATE.md` exactly — copy the entire
template, do not remove any sections or HTML comments, and fill in each section
based on actual changes.

**Important:** Being asked to generate a PR description is NOT the same as being
asked to create a PR. Only create an actual pull request when explicitly told to
do so.

**Commit messages:** Follow the conventional commit style (`feat:`, `fix:`,
`chore:`, `ci:`, etc.). Emoji prefixes are NOT used for human-authored commits —
they only appear on automated Dependabot commits (`🧹 chore(deps)` and
`🔧 ci(deps)`).

**No co-authored commits:** Agents MUST NOT add `Co-authored-by` trailers or any
other attribution that signs off a commit on the agent's behalf. Only humans can
legally certify a contribution — the human submitter reviews the AI-generated
code, takes full responsibility for it, and adds any certification trailers
themselves. Following the rules the Linux kernel team enforce for AI coding
assistants, an agent's role in a commit ends at the message body — no
`Signed-off-by`, no `Co-authored-by`, no other trailers or sign-offs. See [AI
Coding Assistants — The Linux Kernel documentation]
(https://docs.kernel.org/process/coding-assistants.html), integrated into this
ruleset on 2026-09-06.

**Assisted-by attribution:** Where attribution for AI assistance is wanted, use
an `Assisted-by: LLM` trailer in the commit message body rather than a co-author
or sign-off trailer. It records that the contribution was produced with AI
assistance without certifying or authoring it. This mirrors the kernel's
`Assisted-by: LLM [TOOL1] [TOOL2]` format — optionally list specialised analysis
tools after `LLM`, but never list basic development tools (git, compilers,
editors, linters). Only add the trailer when the user has asked for AI
attribution; the default is no trailer at all.

### Documentation Maintenance

Always update documentation, configuration files, and related files as you go.
Documentation must never be out of date. If a change affects `README.md`,
`AGENTS.md`, configuration files, or any other documentation, update them in the
same change. Clean as you go — take ownership of every file you touch.

If formatting, linting, or other tooling fixes issues in files you did not
originally author, do not revert those fixes. CI would break again. Accept
responsibility for the state of the codebase after your changes, not just the
lines you intended to change.

## Project Overview

**Purpose:** Shared contracts and utilities for the P5-wrapper organisation,
published to npm as `@p5-wrapper/common`. It is the framework-agnostic source of
truth from which all p5-wrapper libraries shall draw their p5 instance types,
props contracts, lifecycle utilities, and shared constants.

**Key characteristics:**

- **Library only:** No demo application, no dev server — the build produces the
  npm package alone. Host wrappers own their demos
- **p5 instance mode:** Everything here assumes p5 instance mode (not global
  mode). The lifecycle utilities own the imperative p5 instance lifecycle
- **Framework agnostic:** No UI framework imports anywhere; `OutputNode` is the
  only renderer-bound concept, bound per ecosystem by each wrapper
- **Version 0.1.0:** The public API is the full set of contracts, utilities, and
  the `CanvasContainerClassName` constant

## Architecture

### Layering

```
src/main.ts (public API barrel)
  ├── contracts/  — types, one per file, framework agnostic
  │     p5 → SketchProps → Sketch → P5CanvasInstance → Updater
  │       → P5CanvasProps<Props, OutputNode>
  │     CanvasContainer → CanvasContainerRef (structural refs)
  │     P5CanvasInstanceRef (structural ref)
  └── utils/      — pure functions, one per file
        createP5CanvasInstance → updateP5CanvasInstance
        → removeP5CanvasInstance, propsAreEqual, logErrorBoundaryError
```

Why the layers exist:

- **Contracts** are consumed by host wrappers at the type level — they compile
  away entirely and cost nothing at runtime
- **Utils** are the imperative p5 bridge — pure functions a host calls from its
  own lifecycle hooks (effects, `connectedCallback`, lifecycle events), keeping
  `new p5()` handling in one audited place
- **Constants** are shared values that host wrappers must keep in agreement
  (currently the canvas container CSS class)

### Public API

Everything exported from `src/main.ts` is public API and semver-protected:

- `CanvasContainerClassName` — CSS class of the container div
  (`"canvas-container"`)
- Types: `p5`, `CanvasContainer`, `CanvasContainerRef`, `P5CanvasInstance`,
  `P5CanvasInstanceRef`, `P5CanvasProps`, `Sketch`, `SketchProps`, `Updater`
- Utils: `createP5CanvasInstance`, `logErrorBoundaryError`, `propsAreEqual`,
  `removeP5CanvasInstance`, `updateP5CanvasInstance`

### File Organisation

```
.
├── CLAUDE.md                 # Symlink to AGENTS.md — agents edit AGENTS.md only
├── AGENTS.md                 # This document
├── package.json              # Scripts, engines, exports map, dependencies
├── pnpm-workspace.yaml       # Supply-chain settings (strict peers, release age)
├── pnpm-lock.yaml            # Committed lock file
├── tsconfig.json             # Strict TypeScript config + path aliases
├── src/
│   ├── main.ts               # Public API barrel — the library entry point
│   ├── constants/            # Exported constants (one per file)
│   ├── contracts/            # Public-facing types (one contract per file)
│   └── utils/                # Pure functions (one function per file)
├── tests/                    # Vitest tests mirroring src/ structure
│   ├── constants/
│   ├── utils/
│   └── setup.ts              # Test bootstrap (canvas mock)
├── config/
│   ├── eslint/eslint.config.ts
│   ├── prettier/prettier.json
│   └── vite/
│       ├── vite.config.ts    # Composes common + library configs
│       ├── common.ts         # Shared path aliases
│       └── library.ts        # Library build + Vitest config
├── dist/                     # Build output (gitignored)
└── .github/
    ├── actions/setup/        # Composite action: pnpm + Node + frozen install
    └── workflows/            # CI, CD, CodeQL
```

### Build Pipeline

- `pnpm build` = clean `dist` → `tsc` (type check) → library build (ESM + CJS
  via Vite library mode, types bundled by `vite-plugin-dts` with `bundleTypes`,
  which requires the `@microsoft/api-extractor` dev dependency — without it
  installed, `vite-plugin-dts` silently skips type bundling)
- `package.json` `exports` maps `types` → `main.d.ts`, `import` → `main.mjs`,
  `require` → `main.cjs`. The `files` field only ships `README.md` and `dist/*`
- The library entry filenames are pinned in `config/vite/library.ts` (`main.mjs`
  / `main.cjs`) to match the `package.json` `exports` map — the `.mjs`/`.cjs`
  extensions self-describe the module format, which is required because
  `"type": "module"` would otherwise treat a `.js` CJS entry as ESM and break
  `require()` for Node CJS consumers (this broke the published @p5-wrapper/react
  5.0.4).
- The library externals are `p5` and `microdiff` — keep Rollup externals,
  TypeScript expectations, and peer/runtime dependencies in agreement

## Commands

| Command              | Action                                                     |
| :------------------- | :--------------------------------------------------------- |
| `pnpm install`       | Install dependencies (updates lockfile — commit the diff). |
| `pnpm format`        | Format all files with Prettier.                            |
| `pnpm format:check`  | Check formatting without writing.                          |
| `pnpm lint`          | Run ESLint (type-aware).                                   |
| `pnpm lint:fix`      | Run ESLint with autofix.                                   |
| `pnpm test`          | Run the Vitest suite.                                      |
| `pnpm test:coverage` | Run tests with coverage (what CI runs).                    |
| `pnpm test:watch`    | Watch mode.                                                |
| `pnpm build:library` | Type check + build the npm library.                        |
| `pnpm build`         | Clean and build the library.                               |
| `pnpm integrate`     | format:check → lint → test → build (CI mirror).            |

## CI/CD

- **CI** (`continuous-integration.yml`): Runs on all PRs to `main` and
  `workflow_dispatch`. Jobs: `format`, `lint`, `test` (with coverage artifact
  and clover coverage delta comment), `build`, and `npm-dry-run` (validates the
  npm publish would succeed). CI concurrency cancels in-progress runs. Uses the
  `./.github/actions/setup` composite action with
  `pnpm install --frozen-lockfile`
- **CD** (`continuous-deployment.yml`): Runs on push to `main` and
  `workflow_dispatch`. One job: `npm` (builds, tests, and publishes the package
  with provenance, then creates the matching `vx.y.z` GitHub release with
  auto-generated notes anchored at the previous version tag). CD concurrency
  does NOT cancel in-progress runs — never interrupt an in-flight publish
- **CodeQL** (`CODEQL.yml`): Security analysis on PRs and pushes to `main`
- **Dependabot:** Monthly for npm (one grouped update across all dependencies)
  and GitHub Actions, each limited to a single open pull request. Semver-major
  updates are ignored by config — they are handled manually on dedicated
  branches
- **Permissions:** Workflows declare `permissions: {}` at the top and grant
  minimal per-job permissions. Keep it this way

## Guardrails

- **Never publish locally.** npm publishing requires the `NPM_TOKEN` secret and
  runs only in CD
- **Never weaken the build contract:** the `exports` map, `files` field, ESM +
  CJS dual output, and bundled types are what downstream wrapper packages depend
  on
- **Never introduce a framework import or a new runtime dependency** beyond
  `microdiff` without discussion — framework agnosticism and dependency surface
  are features of this library
- **Never break a contract silently:** because every wrapper in the organisation
  consumes these types and utilities, a signature change here is an
  organisation-wide migration. Discuss before changing
- **Never disable or skip tests, lint rules, or type checks** to make a change
  pass. Fix the code, not the gate
- **Vite native config loader warning:** Vite currently warns that
  `config/vite/vite.config.ts` uses `__dirname` and extension-less imports
  unsupported by `configLoader: 'native'`. This is known and can be suppressed
  with `VITE_CONFIG_NATIVE_IGNORE_WARNING=true`. Fixing the config is a valid
  separate task, not a drive-by change
- **API Extractor engine advisory:** The build logs an advisory that
  `@microsoft/api-extractor` bundles TypeScript 5.9.3 while this project pins
  6.0.3. This is harmless today and resolves upstream when the TypeScript 7
  migration lands (see the typescript-eslint#10940 note above)

## Future Topics

- **Host adoption:** `@p5-wrapper/react` still owns its local copies of these
  contracts and utilities; migrating it (and `@p5-wrapper/custom-element`) onto
  `@p5-wrapper/common` is a deliberate follow-up task per package
- **New wrappers:** Angular and Vue implementations should start from these
  contracts, binding `OutputNode` to their own render node types
- **Vite native config loader:** Migrate `vite.config.ts` off `__dirname` and
  extension-less imports to clear the `configLoader: 'native'` warning
- **Semver-major dependency bumps:** Dependabot ignores them; they are done
  deliberately on dedicated branches
