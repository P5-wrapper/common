import { resolve } from "node:path";
import { UserConfig } from "vite";
import { defineConfig } from "vitest/config";

import { common } from "./common";
import { library } from "./library";

const root = resolve(__dirname, "..", "..");

export default defineConfig((): UserConfig => {
  return {
    ...common(root),
    ...library(root)
  } satisfies UserConfig;
});
