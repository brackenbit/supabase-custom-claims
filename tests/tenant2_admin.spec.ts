/*
    (C) Brackenbit 2024
*/

import test, { expect } from "@playwright/test";
import { deleteWidgets, seedWidgets } from "../src/data/supabaseManagement";
import { WidgetsPage } from "./widgets-page";

test.beforeAll(async () => {
    // Clear database and seed with known data
    await deleteWidgets();
    await seedWidgets();
});

test.beforeEach(async ({ page }) => {
    // Log in as Dave (tenant 2 admin),
    // wait for dashboard

    await page.goto("/");

    await page.getByRole("button", { name: "Log in" }).click();

    await page
        .getByRole("textbox", { name: "Email address" })
        .fill("dave@example.com");
    await page.getByRole("textbox", { name: "Password" }).fill("demopass123");

    await page.getByRole("button", { name: "Log in" }).click();

    await page.waitForURL("/dashboard");
});

test.describe("E2E testing for tenant 2 admin", () => {
    test("data is segregated", async ({ page }) => {
        // Sanity check:
        await expect(
            page.getByRole("button", { name: "Dave (admin)" }),
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

        expect(
            widgetsPage.nameHeadingLocator,
            "should have Name heading"
        ).not.toBe(-1);

        const namesCount = await widgetsPage.namesLocator.count();

        for (let i = 0; i < namesCount; i++) {
            const name = await widgetsPage.namesLocator.nth(i).innerText();
            expect(name).toBeDefined();
            // Test data includes the tenant name at the start of widget name
            // (Client side is agnostic of actual widget tenant data.)
            expect(
                name.startsWith("Widgets'R'Us"),
                "should show Widgets'R'Us widgets"
            ).toBe(true);
        }

        // (Check after checking names - don't obscure the more important failure!)
        const rowCount = await widgetsPage.tableLocator
            .locator("tbody tr")
            .count();
        expect(rowCount, "should find 4 widgets").toEqual(4);
    });
});
