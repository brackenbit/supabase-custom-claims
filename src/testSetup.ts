/*
    testSetup.ts
    Run by Vitest at start of each test file
*/

import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

afterEach(() => {
    cleanup(); // unmount React trees created with render()
});

// Mock window.matchMedia
// (used by darkmode, and not a function accessible to Vitest)
// See https://github.com/vitest-dev/vitest/issues/821#issuecomment-1046954558
Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) =>
        query === "(prefers-color-scheme: dark)"
            ? {
                  matches: true,
                  media: query,
                  onchange: null,
                  addEventListener: vi.fn(),
                  removeEventListener: vi.fn(),
                  dispatchEvent: vi.fn(),
              }
            : {
                  matches: false,
                  media: query,
                  onchange: null,
                  addEventListener: vi.fn(),
                  removeEventListener: vi.fn(),
                  dispatchEvent: vi.fn(),
              }
    ),
});
