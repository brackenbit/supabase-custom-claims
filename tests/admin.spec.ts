/*
    (C) Brackenbit 2024

    Test spec for admin role
    Tests permissions are applied correctly for normal app actions.
    (Forbidden actions that shouldn't be accessible in the app are tested in forbidden.spec.ts)
*/

import test from "@playwright/test";
import { deleteWidgets, seedWidgets } from "../src/data/supabaseManagement";
import { testDataIsSegregated } from "./testDataIsSegregated";
import { testCanDeleteWidgets } from "./testCanDeleteWidgets";
import { testCanEditWidgets } from "./testCanEditWidgets";
import { testCanAddWidgets } from "./testCanAddWidgets";

// Use parameterised testing to test admins from both tenants
[
    {
        name: "Tenant 1 admin",
        email: "alice@example.com",
        userButtonText: "Alice (admin)",
        tenantStartsWith: "ACME",
    },
    {
        name: "Tenant 2 admin",
        email: "dave@example.com",
        userButtonText: "Dave (admin)",
        tenantStartsWith: "Widgets'R'Us",
    },
].forEach(({ name, email, userButtonText, tenantStartsWith }) => {
    test.describe("E2E testing for...", () => {
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

        test.describe(`${name}`, () => {
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

            test("can add widgets", async ({ page }) => {
                await testCanAddWidgets(page);
            });

            test("can delete widgets", async ({ page }) => {
                await testCanDeleteWidgets(page);
            });
        });
    });
});
