/*
    (C) Brackenbit 2024
*/

import { Locator, Page } from "@playwright/test";

export class WidgetsPage {
    readonly page: Page;
    readonly tableLocator: Locator;
    readonly nameHeadingLocator: Locator;
    namesLocator: Locator;

    constructor(page: Page) {
        this.page = page;

        this.tableLocator = page.locator("table");

        this.nameHeadingLocator = this.tableLocator.locator(
            `thead th:has-text("Name")`
        );
    }

    // Some locators can only be defined using an async .evaluate call
    // (hence can't be included in the constructor)
    // await initAsyncLocators() in a test to make them available.
    async initAsyncLocators() {
        const nameIndex = await this.nameHeadingLocator.evaluate((th) => {
            return Array.from(th.parentElement?.children || []).indexOf(th);
        });

        this.namesLocator = this.tableLocator.locator(
            // Remember: CSS indices start at 1
            `tbody tr td:nth-of-type(${nameIndex + 1})`
        );
    }
}
