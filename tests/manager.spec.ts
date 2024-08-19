/*
    (C) Brackenbit 2024
*/

import test from "@playwright/test";
import { deleteWidgets, seedWidgets } from "../src/data/supabaseManagement";
import { testDataIsSegregated } from "./testDataIsSegregated";
import { testCanEditWidgets } from "./testCanEditWidgets";
import { testCanNotAddWidgets } from "./testCanNotAddWidgets";
import { testCanNotDeleteWidgets } from "./testCanNotDeleteWidgets";

// Use parameterised testing to test managers from both tenants
[
    {
        name: "Tenant 1 manager",
        email: "bob@example.com",
        userButtonText: "Bob (manager)",
        tenantStartsWith: "ACME",
    },
    {
        name: "Tenant 2 manager",
        email: "erika@example.com",
        userButtonText: "Erika (manager)",
        tenantStartsWith: "Widgets'R'Us",
    },
].forEach(({ name, email, userButtonText, tenantStartsWith }) => {
    test.describe(() => {
        test.beforeAll(async () => {});

        test.beforeEach(async ({ page }) => {
            // Clear database and seed with known data
            await deleteWidgets();
            await seedWidgets();

            // Log in, wait for dashboard
            await page.goto("/");

            await page.getByRole("button", { name: "Log in" }).click();

            await page
                .getByRole("textbox", { name: "Email address" })
                .fill(email);
            await page
                .getByRole("textbox", { name: "Password" })
                .fill("demopass123");

            await page.getByRole("button", { name: "Log in" }).click();

            await page.waitForURL("/dashboard");
        });

        test.describe(`E2E testing for ${name}`, () => {
            test("data is segregated", async ({ page }) => {
                await testDataIsSegregated(
                    page,
                    userButtonText,
                    tenantStartsWith
                );
            });

            test("can edit widgets", async ({ page }) => {
                await testCanEditWidgets(page);
            });

            test("can not add widgets", async ({ page }) => {
                await testCanNotAddWidgets(page);
            });

            test("can not delete widgets", async ({ page }) => {
                await testCanNotDeleteWidgets(page);
            });
        });
    });
});
