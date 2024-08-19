/*
    (C) Brackenbit 2024

    Reusable test, called in role-specific test specs.
*/

import { expect, Page } from "@playwright/test";
import { WidgetsPage } from "./widgets-page";

export async function testCanEditWidgets(page: Page) {
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
    const targetInitialName = initialNames.get(targetID);
    const targetInitialDescription = initialDescriptions.get(targetID);
    const unchangedIDs = initialIDs.slice(1, -1);

    const editButton = widgetsPage.getButtonByNameAndID("Edit", targetID);

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
    const initialNameLocator = page.locator(`text="${targetInitialName}"`);
    const initialDescriptionLocator = page.locator(
        `text="${targetInitialDescription}"`
    );
    await expect(
        initialNameLocator,
        "initial name should no longer appear"
    ).toHaveCount(0);
    await expect(
        initialDescriptionLocator,
        "initial description should no longer appear"
    ).toHaveCount(0);

    const newName = await widgetsPage.getCellByIDAndHeading(targetID, "Name");
    const newDescription = await widgetsPage.getCellByIDAndHeading(
        targetID,
        "Description"
    );
    expect(newName, "should have updated name").toEqual(newWidgetName);
    expect(newDescription, "should have updated description").toEqual(
        newWidgetDescription
    );

    // Confirm edit has not altered any other widgets
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
