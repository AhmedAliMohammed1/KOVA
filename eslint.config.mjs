import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  { settings: { next: { rootDir: ["apps/storefront/", "apps/admin/"] } } },
  globalIgnores([
    "**/.next/**",
    ".*/**",
    "apps/**/next-env.d.ts",
    "coverage/**",
    "next-env.d.ts",
    ".agents/**",
    ".codex/**",
    ".github/skills/**",
  ]),
]);
