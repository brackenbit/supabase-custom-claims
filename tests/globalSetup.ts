/*
    (C) Brackenbit 2024
*/

import { FullConfig } from "@playwright/test";

export default async function globalSetup(_config: FullConfig) {
    console.warn(
        "Playwright tests run against vite preview - remember to build first!"
    );
}
