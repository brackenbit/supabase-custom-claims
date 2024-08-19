/*
    (C) Brackenbit 2024

    Reusable test, called in role-specific test specs.
*/

import { expect, Page } from "@playwright/test";
import { WidgetsPage } from "./widgets-page";

export async function testDataIsSegregated(
    page: Page,
    userButtonText: string,
    tenantStartsWith: string
) {
    // Sanity check:
    await expect(
        page.getByRole("button", { name: userButtonText }),
        "should be on /dashboard"
    ).toBeVisible();

    await page.getByRole("link", { name: "Widgets" }).click();

    // Use Page Object Model for widgets page
    const widgetsPage = new WidgetsPage(page);
    // Await creation of async locators
    await widgetsPage.initAsyncLocators();

    await expect(
        widgetsPage.tableLocator,
        "should have widgets table"
    ).toBeVisible();

    expect(widgetsPage.nameHeadingLocator, "should have Name heading").not.toBe(
        -1
    );

    const namesCount = await widgetsPage.namesLocator.count();

    for (let i = 0; i < namesCount; i++) {
        const name = await widgetsPage.namesLocator.nth(i).innerText();
        expect(name).toBeDefined();
        // Test data includes the tenant name at the start of widget name
        // (Client side is agnostic of actual widget tenant data.)
        expect(
            name.startsWith(tenantStartsWith),
            "should show only widgets from their tenant"
        ).toBe(true);
    }

    // (Check after checking names - don't obscure the more important failure!)
    const rowCount = await widgetsPage.tableLocator.locator("tbody tr").count();
    expect(rowCount, "should find 4 widgets").toEqual(4);
}
