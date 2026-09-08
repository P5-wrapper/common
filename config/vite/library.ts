import { posix, resolve } from "node:path";
import { UserConfig } from "vite";
import dts from "vite-plugin-dts";

export function library(root: string): UserConfig {
  const dist = resolve(root, "dist");

  return {
    plugins: [
      dts({
        bundleTypes: true,
        tsconfigPath: resolve(root, "tsconfig.json")
      })
    ],
    build: {
      emptyOutDir: true,
      lib: {
        entry: resolve(root, "src", "main.ts"),
        name: "P5WrapperCommon",
        fileName: format => (format === "es" ? "main.mjs" : "main.cjs"),
        formats: ["es", "cjs"]
      },
      rollupOptions: {
        external: ["p5", "microdiff"],
        output: {
          assetFileNames: "assets/[name][extname]",
          dir: dist,
          globals: {
            p5: "p5",
            microdiff: "microdiff"
          }
        }
      }
    },
    test: {
      globals: true,
      silent: true,
      environment: "happy-dom",
      coverage: {
        include: [posix.join("src", "**/*.{ts,js}")],
        reporter: ["text-summary", "html", "clover"]
      },
      setupFiles: resolve(root, "tests", "setup.ts"),
      deps: {
        optimizer: {
          web: {
            include: ["vitest-canvas-mock"]
          }
        }
      }
    }
  };
}
