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
    // Log in as Bob (tenant 1 manager),
    // wait for dashboard

    await page.goto("/");

    await page.getByRole("button", { name: "Log in" }).click();

    await page
        .getByRole("textbox", { name: "Email address" })
        .fill("bob@example.com");
    await page.getByRole("textbox", { name: "Password" }).fill("demopass123");

    await page.getByRole("button", { name: "Log in" }).click();

    await page.waitForURL("/dashboard");
});

test.describe("E2E testing for tenant 1 manager", () => {
    test("data is segregated", async ({ page }) => {
        // Sanity check:
        await expect(
            page.getByRole("button", { name: "Bob (manager)" }),
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
            expect(name.startsWith("ACME"), "should show ACME widgets").toBe(
                true
            );
        }

        // (Check after checking names - don't obscure the more important failure!)
        const rowCount = await widgetsPage.tableLocator
            .locator("tbody tr")
            .count();
        expect(rowCount, "should find 4 widgets").toEqual(4);
    });

    test("can edit widgets", async ({ page }) => {
        await page.getByRole("link", { name: "Widgets" }).click();

        const widgetsPage = new WidgetsPage(page);
        await widgetsPage.initAsyncLocators();

        const firstWidgetID = await widgetsPage.getCellByRowAndHeading(0, "ID");

        // Get name and description of this widget
        // (By ID, as the ordering will change after edit.)
        const initialName = await widgetsPage.getCellByIDAndHeading(
            firstWidgetID,
            "Name"
        );

        const initialDescription = await widgetsPage.getCellByIDAndHeading(
            firstWidgetID,
            "Description"
        );

        const editButton = widgetsPage.getButtonByNameAndID(
            "Edit",
            firstWidgetID
        );

        await editButton.click();

        await expect(
            page.getByRole("heading", { name: "Edit Widget" }),
            "should open edit modal"
        ).toBeVisible();

        const newWidgetName = "Widget v2";
        const newWidgetDescription = "Now with AI and blockchain!";

        await page.getByRole("textbox", { name: "Name" }).fill(newWidgetName);
        await page
            .getByRole("textbox", { name: "Description" })
            .fill(newWidgetDescription);

        await page.getByRole("button", { name: "Edit widget" }).click();

        // Wait for the initial name and description not to be there
        // (Not just for testing - this adds a necessary await so Tanstack query can refresh)
        const initialNameLocator = page.locator(`text="${initialName}"`);
        const initialDescriptionLocator = page.locator(
            `text="${initialDescription}"`
        );
        await expect(
            initialNameLocator,
            "initial name should no longer appear"
        ).toHaveCount(0);
        await expect(
            initialDescriptionLocator,
            "initial description should no longer appear"
        ).toHaveCount(0);

        const newName = await widgetsPage.getCellByIDAndHeading(
            firstWidgetID,
            "Name"
        );
        const newDescription = await widgetsPage.getCellByIDAndHeading(
            firstWidgetID,
            "Description"
        );
        expect(newName, "should have updated name").toEqual(newWidgetName);
        expect(newDescription, "should have updated description").toEqual(
            newWidgetDescription
        );
    });
});
