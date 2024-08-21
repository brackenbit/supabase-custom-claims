/*
    (C) Brackenbit 2024

    Test spec for forbidden actions that should not be accessible to any user (authenticated or not).
    Includes:
      - queries on tables no one should be able to access (e.g. SELECT on public.tenants)
      - malicious forms of queries that are allowed (e.g. INSERT a widget with someone else's tenant_id)

    These API calls aren't supported by the app, so a temporary Supabase client is created, and calls are made directly
    in the test script.
*/

import test, { expect } from "@playwright/test";
import { AuthResponse, createClient } from "@supabase/supabase-js";
import { deleteWidgets, seedWidgets } from "../src/data/supabaseManagement";

const roles = [
    {
        name: "Tenant 1 admin",
        email: "alice@example.com",
        tenantStartsWith: "ACME",
        // Magic numbers, but impractical to automatically fetch actual IDs here.
        // In practice, if using included setup scripts, these will be the IDs:
        theirTenantID: 1,
        otherTenantID: 2,
        canUpdate: true,
        canInsert: true,
        canDelete: true,
    },
    {
        name: "Tenant 2 admin",
        email: "dave@example.com",
        tenantStartsWith: "Widgets",
        theirTenantID: 2,
        otherTenantID: 1,
        canUpdate: true,
        canInsert: true,
        canDelete: true,
    },
    {
        name: "Tenant 1 manager",
        email: "bob@example.com",
        tenantStartsWith: "ACME",
        theirTenantID: 1,
        otherTenantID: 2,
        canUpdate: true,
        canInsert: false,
        canDelete: false,
    },
    {
        name: "Tenant 2 manager",
        email: "erika@example.com",
        tenantStartsWith: "Widgets",
        theirTenantID: 2,
        otherTenantID: 1,
        canUpdate: true,
        canInsert: false,
        canDelete: false,
    },
    {
        name: "Tenant 1 user",
        email: "charlie@example.com",
        tenantStartsWith: "ACME",
        theirTenantID: 1,
        otherTenantID: 2,
        canInsert: false,
        canUpdate: false,
    },
    {
        name: "Tenant 2 user",
        email: "fulan@example.com",
        tenantStartsWith: "Widgets",
        theirTenantID: 2,
        otherTenantID: 1,
        canUpdate: false,
        canInsert: false,
        canDelete: false,
    },
    {
        name: "Unauthenticated user",
        email: "UNAUTHENTICATED",
        tenantStartsWith: "NONE",
        theirTenantID: null,
        otherTenantID: 1,
        canUpdate: false,
        canInsert: false,
        canDelete: false,
    },
];

const schemas = [
    {
        schema: "user_roles",
        updateData: { role: "hacker" },
        insertData: { user_id: "some_user", role: "hacker" },
    },
    {
        schema: "role_permissions",
        updateData: { permission: "widgets.update" },
        insertData: { role: "hacker", permission: "widgets.update" },
    },
    {
        schema: "tenants",
        updateData: { tenant_name: "Hacked Tenant!" },
        insertData: { tenant_name: "Hacked Tenant!" },
    },
    {
        schema: "user_tenants",
        updateData: { tenant_id: 1 },
        insertData: { user_id: "some_user", tenant_id: 1 },
    },
];

test.describe("Test forbidden actions", () => {
    // Global setup
    let supabaseTestClient;

    test.beforeAll(async () => {
        // Create a separate Supabase client for these tests
        try {
            // NB: these are taken from .env.test, not .env
            const supabaseUrl = process.env.VITE_SUPABASE_URL_TESTING;
            const supabaseKey = process.env.VITE_SUPABASE_PUBLIC_KEY_TESTING;
            supabaseTestClient = createClient(
                supabaseUrl as string,
                supabaseKey as string
            );
        } catch (err) {
            expect(
                err,
                "should be able to set up supabase test client"
            ).toBeUndefined();
        }
    });

    test.afterAll(() => {
        // Dereference the temporary Supabase client
        supabaseTestClient = null;
    });

    // Use parameterised testing to test all tenants/roles
    roles.forEach(
        ({
            name,
            email,
            tenantStartsWith,
            theirTenantID,
            otherTenantID,
            canUpdate,
            canInsert,
            canDelete,
        }) => {
            test.describe("for", () => {
                test.beforeAll(async () => {
                    // Clear database and seed with known data
                    await deleteWidgets();
                    await seedWidgets();

                    if (email === "UNAUTHENTICATED") {
                        // Do not log in
                    } else {
                        // Login directly with Supabase API
                        const { error }: AuthResponse =
                            await supabaseTestClient.auth.signInWithPassword({
                                email,
                                password: "demopass123",
                            });

                        if (error) {
                            throw new Error(error.message);
                        }
                    }
                });

                test.afterAll(async () => {
                    await supabaseTestClient.auth.signOut();
                });

                test.describe(`${name}`, () => {
                    test("can SELECT on widgets", async () => {
                        // Protect against false positives; confirm the user can SELECT widgets
                        const { data, error } = await supabaseTestClient
                            .from("widgets")
                            .select("*");

                        expect(error, "should not throw error").toBeFalsy();

                        expect(data, "should get allowed data").toBeTruthy();
                        // Unauth user will still get data, just a blank array

                        // Confirm data segregation
                        // (Actual test for data segregation lives elsewhere - this is included to
                        //  test the tests, i.e. confirm that manual sign in/out is done correctly.)
                        data.forEach((widget) => {
                            const name: string = widget.name;
                            if (!name.startsWith(tenantStartsWith)) {
                                throw new Error(
                                    "Data segregation violated - test sign in/out logic contains errors"
                                );
                            }
                        });
                    });
                    test.describe("for malicious actions on other tenants:", () => {
                        test("can not SELECT", async () => {
                            const { data } = await supabaseTestClient
                                .from("widgets")
                                .select("*")
                                .eq("tenant_id", otherTenantID);

                            // Should get an empty array
                            expect(
                                data.length,
                                "should get empty array"
                            ).toEqual(0);
                        });
                        test("can not UPDATE", async () => {
                            // Only relevant for those who have some update permissions.
                            // All inserts by other users will be rejected - tested elsewhere.
                            if (canUpdate) {
                                const { data, error } = await supabaseTestClient
                                    .from("widgets")
                                    .update({
                                        tenant_id: otherTenantID,
                                        name: "Dodgy Widget",
                                        description: "Do not buy!",
                                    })
                                    .neq("id", -1)
                                    // Supabase UPDATE requires a WHERE clause - this should match everything.
                                    .select();

                                expect(
                                    error.code,
                                    "should throw error: insufficient_privilege"
                                ).toEqual("42501");

                                expect(data, "should not get data").toBeFalsy();
                            }
                        });
                        test("can not INSERT", async () => {
                            // Only relevant for those who have some add permissions.
                            // All updates by other users will be rejected - tested elsewhere.
                            if (canInsert) {
                                const { data } = await supabaseTestClient
                                    .from("widgets")
                                    .insert({
                                        tenant_id: otherTenantID,
                                        name: "Invalid widget",
                                        description: "Should be blocked",
                                    })
                                    .select()
                                    .single();

                                // INSERT should succeed, but the actual tenant_id used will be
                                // their tenant_id, not the falsely claimed one.
                                expect(
                                    data.tenant_id,
                                    "should set tenant_id correctly regardless of INSERT"
                                ).toEqual(theirTenantID);
                            }
                        });
                        test("can not DELETE", async () => {
                            // NB: See limitations of this test below.
                            // Only relevant for those who have some delete permissions.
                            // All deletes by other users will be rejected - tested elsewhere.
                            if (canDelete) {
                                const { data } = await supabaseTestClient
                                    .from("widgets")
                                    .delete()
                                    .eq("tenant_id", otherTenantID)
                                    .select();

                                // Supabase returns status 200 and no error on a delete that fails due
                                // to permissions.
                                // All that can be practically done here is to confirm that it's returned blank data:
                                expect(
                                    data,
                                    "should get allowed data"
                                ).toBeTruthy();
                                expect(
                                    data.length,
                                    "should get empty array"
                                ).toEqual(0);
                            }
                        });
                    });
                    schemas.forEach(({ schema, updateData, insertData }) => {
                        test.describe(`on ${schema}:`, () => {
                            test(`can not SELECT`, async () => {
                                const { data, error } = await supabaseTestClient
                                    .from(schema)
                                    .select("*");

                                expect(
                                    error.code,
                                    "should throw error: insufficient_privilege"
                                ).toEqual("42501");

                                expect(data, "should not get data").toBeFalsy();
                            });
                            test(`can not UPDATE`, async () => {
                                const { data, error } = await supabaseTestClient
                                    .from(schema)
                                    .update(updateData)
                                    .neq("id", -1);
                                // Supabase UPDATE requires a WHERE clause - this should match everything.

                                expect(
                                    error.code,
                                    "should throw error: insufficient_privilege"
                                ).toEqual("42501");

                                expect(data, "should not get data").toBeFalsy();
                            });
                            test(`can not DELETE`, async () => {
                                const { data, error } = await supabaseTestClient
                                    .from(schema)
                                    .delete()
                                    .neq("id", -1);
                                // Supabase DELETE requires a WHERE clause - this should match everything.

                                expect(
                                    error.code,
                                    "should throw error: insufficient_privilege"
                                ).toEqual("42501");

                                expect(data, "should not get data").toBeFalsy();
                            });
                            test(`can not INSERT`, async () => {
                                const { data, error } = await supabaseTestClient
                                    .from(schema)
                                    .insert(insertData)
                                    .select()
                                    .single();

                                expect(
                                    error.code,
                                    "should throw error: insufficient_privilege"
                                ).toEqual("42501");

                                expect(data, "should not get data").toBeFalsy();
                            });
                        });
                    });
                });
            });
        }
    );
});
