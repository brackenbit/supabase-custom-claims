/*
    (C) Brackenbit 2024

    Reusable test, called in role-specific test specs.
*/

import { expect, Page } from "@playwright/test";
import { WidgetsPage } from "./widgets-page";

export async function testCanNotAddWidgets(page: Page) {
    await page.getByRole("link", { name: "Widgets" }).click();

    const widgetsPage = new WidgetsPage(page);
    await widgetsPage.initAsyncLocators();

    // Save initial IDs, names, and descriptions
    const initialIDs = await widgetsPage.getAllIDs();
    const initialNames = await widgetsPage.getMapForIDsAndHeading(
        initialIDs,
        "Name"
    );
    const initialDescriptions = await widgetsPage.getMapForIDsAndHeading(
        initialIDs,
        "Description"
    );

    await page.getByRole("button", { name: "Add widget" }).click();

    const modalLocator = page.getByRole("dialog");
    await expect(
        modalLocator.getByRole("heading", { name: "Add Widget" }),
        "should open add modal"
    ).toBeVisible();

    const newWidgetName = "Brand-new widget";
    const newWidgetDescription =
        "This widget will widgetify, for less than the cost of a cup of coffee a day.";

    await page.getByRole("textbox", { name: "Name" }).fill(newWidgetName);
    await page
        .getByRole("textbox", { name: "Description" })
        .fill(newWidgetDescription);

    await modalLocator.getByRole("button", { name: "Add widget" }).click();

    // Detect toast showing failure
    const toastLocator = page.getByRole("alert");
    await expect(toastLocator, "should throw a toast").toBeVisible();
    // Confirm the success toast is relevant
    expect(
        toastLocator.getByText("You are not allowed to add widgets"),
        "toast should warn you don't have add permissions"
    ).toBeVisible();

    await page.waitForTimeout(500);
    // If following the happy path, nothing will happen, so there's nothing to wait for.
    // However, if there's a failure, a small wait (to allow query refresh) is required,
    // or you won't see it. Therefore just wait for a fixed timeout.

    const rowCount = await widgetsPage.tableLocator.locator("tbody tr").count();
    expect(rowCount, "should still find 4 widgets").toEqual(4);

    // Confirm add has not altered any existing widgets
    for (const id of initialIDs) {
        const name = await widgetsPage.getCellByIDAndHeading(id, "Name");
        const oldName = initialNames.get(id);
        expect(name, "should not have altered existing names").toEqual(oldName);
    }
    for (const id of initialIDs) {
        const description = await widgetsPage.getCellByIDAndHeading(
            id,
            "Description"
        );
        const oldDescription = initialDescriptions.get(id);
        expect(
            description,
            "should not have altered existing descriptions"
        ).toEqual(oldDescription);
    }
}
