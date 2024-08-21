/*
    (C) Brackenbit 2024

    Test spec for unauthenticated user
    Mimics the role-specific specs (e.g. admin.spec.ts), confirming normal app actions are only accessible to authed users.
    (Forbidden actions that shouldn't be accessible in the app are tested in forbidden.spec.ts)
*/

import test, { expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

test.describe("E2E testing for...", () => {
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

    test.describe(`unauthenticated user`, () => {
        test("can not SELECT on widgets", async () => {
            const { data, error } = await supabaseTestClient
                .from("widgets")
                .select("*");

            // Unauth user will still get data, just a blank array
            expect(error, "should not throw error").toBeFalsy();
            expect(data, "should get allowed data").toBeTruthy();
            expect(data.length, "should get empty array").toEqual(0);
        });
        test("can not UPDATE on widgets", async () => {
            // NB: See limitations of this test below.
            const { data } = await supabaseTestClient
                .from("widgets")
                .update({
                    tenant_id: 1,
                    name: "Dodgy Widget",
                    description: "Do not buy!",
                })
                .neq("id", -1)
                // Supabase UPDATE requires a WHERE clause - this should match everything.
                .select();

            // Supabase returns status 200 and no error on an update that fails due
            // to permissions (when unauthenticated).
            // All that can be practically done here is to confirm that it's returned blank data:
            expect(data, "should get allowed data").toBeTruthy();
            expect(data.length, "should get empty array").toEqual(0);
        });
        test("can not INSERT on widgets", async () => {
            const { data, error } = await supabaseTestClient
                .from("widgets")
                .insert({
                    tenant_id: 1,
                    name: "Dodgy Widget",
                    description: "Do not buy!",
                })
                .select()
                .single();

            expect(
                error.code,
                "should throw error: insufficient_privilege"
            ).toEqual("42501");

            expect(data, "should not get data").toBeFalsy();
        });
        test("can not DELETE on widgets", async () => {
            // NB: See limitations of this test below.
            const { data } = await supabaseTestClient
                .from("widgets")
                .delete()
                .neq("id", -1)
                // Supabase DELETE requires a WHERE clause - this should match everything.
                .select();

            // Supabase returns status 200 and no error on a delete that fails due
            // to permissions.
            // All that can be practically done here is to confirm that it's returned blank data:
            expect(data, "should get allowed data").toBeTruthy();
            expect(data.length, "should get empty array").toEqual(0);
        });
    });
});
