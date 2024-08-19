/*
    (C) Brackenbit 2024

    Reusable test, called in role-specific test specs.
*/

import { expect, Page } from "@playwright/test";
import { WidgetsPage } from "./widgets-page";

export async function testCanNotEditWidgets(page: Page) {
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

    // Target the first ID for the edit
    const targetID = initialIDs[0];

    const editButton = widgetsPage.getButtonByNameAndID("Edit", targetID);

    await editButton.click();

    const modalLocator = page.getByRole("dialog");
    await expect(
        modalLocator.getByRole("heading", { name: "Edit Widget" }),
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
    const toastLocator = page.getByRole("alert");
    await expect(toastLocator, "should throw a toast").toBeVisible();
    // Confirm that alert is related to edit permissions - look for child element with text
    expect(
        toastLocator.getByText("You are not allowed to edit widgets."),
        "toast should warn you don't have edit permissions"
    ).toBeVisible();
    // Ideally all of the above would be a single assertion for
    // getByRole("alert", {name: "..."})
    // react-hot-toast does not appear to appropriately set name for the actual alert element.

    // Confirm failed edit has not altered any widgets
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
