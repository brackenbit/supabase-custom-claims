/*
    (C) Brackenbit 2024

    Reusable test, called in role-specific test specs.
*/

import { expect, Page } from "@playwright/test";
import { WidgetsPage } from "./widgets-page";

export async function testCanDeleteWidgets(page: Page) {
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

    // Target the first ID for delete
    const targetID = initialIDs[0];
    const unchangedIDs = initialIDs.slice(1, -1);

    const deleteButton = widgetsPage.getButtonByNameAndID("Delete", targetID);
    await deleteButton.click();

    // Detect toast showing success
    const toastLocator = page.getByRole("status");
    await expect(toastLocator, "should throw a toast").toBeVisible();
    // Confirm the success toast is relevant
    expect(
        toastLocator.getByText("Widget deleted"),
        "toast should reflect successful delete"
    ).toBeVisible();

    // _Wait_ for number of widgets to drop.
    // (Need to give time for query to refresh.)
    const rowsLocator = widgetsPage.tableLocator.locator("tbody tr");
    await expect(rowsLocator, "should now find 3 widgets").toHaveCount(3);

    const newIDs = await widgetsPage.getAllIDs();
    expect(!newIDs.includes(targetID), "should no longer have the deleted ID");

    // Confirm delete has not altered any other widgets
    for (const id of unchangedIDs) {
        const name = await widgetsPage.getCellByIDAndHeading(id, "Name");
        const oldName = initialNames.get(id);
        expect(name, "should not have altered existing names").toEqual(oldName);
    }
    for (const id of unchangedIDs) {
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
