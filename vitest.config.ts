import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@/features/admin": resolve(__dirname, "./apps/admin/src/features/admin"),
      "@/app/[locale]/admin": resolve(__dirname, "./apps/admin/src/app/[locale]/admin"),
      "@/app": resolve(__dirname, "./apps/storefront/src/app"),
      "@": resolve(__dirname, "./packages/shared/src"),
      "server-only": resolve(__dirname, "./tests/mocks/empty.ts"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
  },
});
