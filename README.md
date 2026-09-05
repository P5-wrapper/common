# @p5-wrapper/common

Common types and utilities for use across p5 wrapper libraries.

This package is the **source of truth** for the shared contracts and p5 instance
lifecycle utilities used by every wrapper library in the
[P5-wrapper](https://github.com/P5-wrapper) organisation.

The library is deliberately **framework agnostic**: it imports no framework, and
the only renderer-bound concept is the `OutputNode` type parameter on the props
contract. Each ecosystem binds `OutputNode` to its own render output
(`ReactNode` for React, `VNode` for Vue, embedded view nodes for Angular, and so
on), which keeps the input props identical across all implementations.

## Installation

```bash
pnpm add @p5-wrapper/common p5
```

`p5` is a peer dependency so that the consumer owns the `p5` version.

## Build contract

Published artefacts live in `dist/`:

- `types` → `main.d.ts` (bundled via `vite-plugin-dts`)
- `import` → `main.mjs` (ESM)
- `require` → `main.cjs` (CJS)

The `.mjs`/`.cjs` extensions are pinned (never derived from a Vite `[format]`
placeholder) so the module format self-describes under `"type": "module"`. If
you change the filenames, change the `exports` map in the `package.json` and the
Vite config in the same commit.

## Development

| Command              | Action                                          |
| :------------------- | :---------------------------------------------- |
| `pnpm install`       | Install dependencies (updates the lock file).   |
| `pnpm format`        | Format all files with Prettier.                 |
| `pnpm format:check`  | Check formatting without writing.               |
| `pnpm lint`          | Run ESLint (type-aware).                        |
| `pnpm lint:fix`      | Run ESLint with autofix.                        |
| `pnpm test`          | Run the Vitest suite.                           |
| `pnpm test:coverage` | Run tests with coverage (what CI runs).         |
| `pnpm test:watch`    | Watch mode.                                     |
| `pnpm build`         | Clean, type check, and build the npm library.   |
| `pnpm integrate`     | format:check → lint → test → build (CI mirror). |
