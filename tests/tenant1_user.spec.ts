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
    // Log in as Charlie (tenant 1 user),
    // wait for dashboard

    await page.goto("/");

    await page.getByRole("button", { name: "Log in" }).click();

    await page
        .getByRole("textbox", { name: "Email address" })
        .fill("charlie@example.com");
    await page.getByRole("textbox", { name: "Password" }).fill("demopass123");

    await page.getByRole("button", { name: "Log in" }).click();

    await page.waitForURL("/dashboard");
});

test.describe("E2E testing for tenant 1 user", () => {
    test("data is segregated", async ({ page }) => {
        // Sanity check:
        await expect(
            page.getByRole("button", { name: "Charlie (user)" }),
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

    test("cannot edit widgets", async ({ page }) => {
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

        // Detect toast showing error
        // Detect alert
        const alertLocator = page.getByRole("alert");
        await expect(
            page.getByRole("alert"),
            "should throw a toast"
        ).toBeVisible();
        // Confirm that alert is related to edit permissions - look for child element with text
        expect(
            alertLocator.getByText("You are not allowed to edit widgets."),
            "toast should warn you don't have edit permissions"
        ).toBeVisible();
        // Ideally all of the above would be a single assertion for
        // getByRole("alert", {name: "..."})
        // react-hot-toast does not appear to appropriately set name for the actual alert element.

        const newName = await widgetsPage.getCellByIDAndHeading(
            firstWidgetID,
            "Name"
        );
        const newDescription = await widgetsPage.getCellByIDAndHeading(
            firstWidgetID,
            "Description"
        );
        expect(newName, "should not have updated name").toEqual(initialName);
        expect(newDescription, "should not have updated description").toEqual(
            initialDescription
        );
    });
});
