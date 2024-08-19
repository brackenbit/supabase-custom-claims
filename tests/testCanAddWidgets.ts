/*
    (C) Brackenbit 2024

    Reusable test, called in role-specific test specs.
*/

import { expect, Page } from "@playwright/test";
import { WidgetsPage } from "./widgets-page";

export async function testCanAddWidgets(page: Page) {
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

    // Detect toast showing success
    const toastLocator = page.getByRole("status");
    await expect(toastLocator, "should throw a toast").toBeVisible();
    // Confirm the success toast is relevant
    expect(
        toastLocator.getByText("New widget added"),
        "toast should reflect successful add"
    ).toBeVisible();

    // Wait for the new widget name to appear
    // (Wait required for query refresh)
    await expect(page.locator(`text=${newWidgetName}`)).toBeVisible();

    const rowCount = await widgetsPage.tableLocator.locator("tbody tr").count();
    expect(rowCount, "should now find 5 widgets").toEqual(5);

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

    // Find the new ID
    let newID: string = "";
    const newIDs = await widgetsPage.getAllIDs();
    for (const id of newIDs) {
        if (!initialIDs.includes(id)) {
            newID = id;
        }
    }

    expect(newID, "should have a new ID").toBeTruthy();

    expect(
        await widgetsPage.getCellByIDAndHeading(newID, "Name"),
        "should have new name at new ID"
    ).toEqual(newWidgetName);

    expect(
        await widgetsPage.getCellByIDAndHeading(newID, "Description"),
        "should have new description at new ID"
    ).toEqual(newWidgetDescription);
}
