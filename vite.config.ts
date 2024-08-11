import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: "./src/testSetup.ts",
        globalSetup: "./src/globalTestSetup.ts",
        silent: false,
        coverage: {
            provider: "v8",
            reporter: ["text"],
            include: ["src/*"],
        },
    },
});
