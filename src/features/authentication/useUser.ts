/*
    (C) Brackenbit 2024
*/

import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiAuth";

export function useUser() {
    const { isPending, data, error } = useQuery({
        queryKey: ["user"],
        queryFn: getCurrentUser,
    });

    // NB: role and userRole are entirely unrelated
    // role is a supabase parameter: authenticated or anon
    // userRole is the custom claim: admin, manager, or user for this application

    const { user, userRole, userTenantId, userTenantName } = data ?? {};

    const { role = "" } = user ?? {};
    const { fullName = "" } = user?.user_metadata ?? {};

    const isAuthenticated = role === "authenticated";

    return {
        isPending,
        error,
        fullName,
        userRole,
        userTenantId,
        userTenantName,
        isAuthenticated,
    };
}
