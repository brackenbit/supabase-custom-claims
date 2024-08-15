/*
    (C) Brackenbit 2024

    widgets-page
    Playwright Page Object Model for /widgets
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

    // Get (text) contents of the cell at:
    //   - the nth row (starting at 0)
    //   - the column with the given heading
    async getCellByRowAndHeading(row: number, heading: string) {
        // Find column index by heading
        const headingLocator = this.tableLocator.locator(
            `thead th:has-text("${heading}")`
        );
        const columnIndex = await headingLocator.evaluate((th) => {
            return Array.from(th.parentElement?.children || []).indexOf(th);
        });

        // Get locator for the intersection
        const cellLocator = this.tableLocator.locator(
            `tbody tr:nth-of-type(${row + 1}) td:nth-of-type(${
                columnIndex + 1
            })`
        );

        return await cellLocator.innerText();
    }

    // Get (text) contents of the cell at:
    //   - the row corresponding with the given widget ID
    //   - the column with the given heading
    async getCellByIDAndHeading(id: string, heading: string) {
        // Find column index by heading
        const headingLocator = this.tableLocator.locator(
            `thead th:has-text("${heading}")`
        );
        const columnIndex = await headingLocator.evaluate((th) => {
            return Array.from(th.parentElement?.children || []).indexOf(th);
        });

        // Get row locator corresponding with the ID
        const rowLocator = this.tableLocator.locator(
            `tbody tr:has(td:has-text("${id}"))`
        );

        // Get locator for the intersection
        const cellLocator = rowLocator.locator(
            `td:nth-child(${columnIndex + 1})`
        );

        return await cellLocator.innerText();
    }

    // Get the button corresponding to a particular button name and widget ID
    // e.g. getButtonByNameAndID("Edit", "12") returns a locator for the Edit button
    // associated with widget 12.
    getButtonByNameAndID(buttonName: string, id: string) {
        // Get row locator corresponding with the ID
        const rowLocator = this.tableLocator.locator(
            `tbody tr:has(td:has-text("${id}"))`
        );

        // Get locator for the matching button:
        const buttonLocator = rowLocator.locator(
            `button:has-text("${buttonName}")`
        );

        return buttonLocator;
    }
}
