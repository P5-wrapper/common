import { resolve } from "node:path";
import { UserConfig } from "vite";

export function common(root: string): UserConfig {
  return {
    resolve: {
      alias: {
        "@": resolve(root, "src"),
        "@utils": resolve(root, "src", "utils"),
        "@constants": resolve(root, "src", "constants"),
        "@contracts": resolve(root, "src", "contracts")
      }
    }
  };
}
