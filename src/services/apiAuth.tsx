/*
    (C) Brackenbit 2024
*/

import { AuthResponse, UserResponse } from "@supabase/supabase-js";
import supabase from "./supabase";
import { jwtDecode, JwtPayload } from "jwt-decode";

export interface LoginParams {
    email: string;
    password: string;
}

export async function login({ email, password }: LoginParams) {
    const { data, error }: AuthResponse =
        await supabase.auth.signInWithPassword({
            email,
            password,
        });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        throw new Error(error.message);
    }
}

export interface CustomJwtPayload extends JwtPayload {
    user_role: string;
    user_tenant: number;
    user_tenant_name: string;
}

export async function getCurrentUser() {
    // Try and fetch session from local storage
    const { data: session } = await supabase.auth.getSession();

    // If no local session, there is no current user
    if (!session?.session) return null;

    // If there IS a local session, it can't be trusted - get trustworthy data from Supabase
    const { data: userData, error }: UserResponse =
        await supabase.auth.getUser();

    if (error) {
        throw new Error(error.message);
    }

    // If getUser succeeded, this validates the JWT from session, which can now be trusted.
    // Recover user roles and tenant info from the JWT:
    const jwt = jwtDecode<CustomJwtPayload>(session.session.access_token);
    const userRole = jwt.user_role;
    const userTenantId = jwt.user_tenant;
    const userTenantName = jwt.user_tenant_name;

    return { user: userData.user, userRole, userTenantId, userTenantName };
}
