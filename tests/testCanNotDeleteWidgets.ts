/*
    (C) Brackenbit 2024

    Reusable test, called in role-specific test specs.
*/

import { expect, Page } from "@playwright/test";
import { WidgetsPage } from "./widgets-page";

export async function testCanNotDeleteWidgets(page: Page) {
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

    const deleteButton = widgetsPage.getButtonByNameAndID("Delete", targetID);
    await deleteButton.click();

    // Detect toast showing error
    const toastLocator = page.getByRole("alert");
    await expect(toastLocator, "should throw a toast").toBeVisible();
    expect(
        toastLocator.getByText("You are not allowed to delete widgets"),
        "toast should warn you don't have delete permissions"
    ).toBeVisible();

    const rowCount = await widgetsPage.tableLocator.locator("tbody tr").count();
    expect(rowCount, "should still find 4 widgets").toEqual(4);

    // Confirm delete has not altered any widgets
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
