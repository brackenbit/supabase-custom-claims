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

    // Get locators for all cells at the column with the given heading
    async getLocatorsByHeading(heading: string) {
        // Find column index by heading
        const headingLocator = this.tableLocator.locator(
            `thead th:has-text("${heading}")`
        );
        const columnIndex = await headingLocator.evaluate((th) => {
            return Array.from(th.parentElement?.children || []).indexOf(th);
        });

        // Get locator for all these cells
        const cellsLocator = this.tableLocator.locator(
            `tbody td:nth-of-type(${columnIndex + 1})`
        );

        return cellsLocator;
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

    async getAllIDs() {
        const IDLocators = await this.getLocatorsByHeading("ID");
        const initialIDs: string[] = [];
        for (const id of await IDLocators.all()) {
            initialIDs.push(await id.innerText());
        }

        return initialIDs;
    }

    // NB: takes an array of IDs as an argument, and populates the map only with IDs in this array
    // In practice, this will be called after an array of IDs has been populated, so
    // it saves time to take it as an argument.
    async getMapForIDsAndHeading(idArray: string[], heading: string) {
        const valuesMap = new Map<string, string>();
        for (const id of idArray) {
            const value = await this.getCellByIDAndHeading(id, heading);
            valuesMap.set(id, value);
        }

        return valuesMap;
    }
}
