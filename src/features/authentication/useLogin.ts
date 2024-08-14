/*
    (C) Brackenbit 2024
*/

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
    CustomJwtPayload,
    login as loginApi,
    LoginParams,
} from "../../services/apiAuth";
import toast from "react-hot-toast";
import { Session, User } from "@supabase/supabase-js";
import { jwtDecode } from "jwt-decode";

export function useLogin() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate: login, isPending: isLoggingIn } = useMutation({
        mutationFn: ({ email, password }: LoginParams) =>
            loginApi({ email, password }),
        onSuccess: async (data) => {
            // Save data from successful login to query cache
            // The JWT contains additional information that must be extracted and saved
            const session = data.session as Session;
            const jwt = jwtDecode<CustomJwtPayload>(session.access_token);
            const userRole = jwt.user_role;
            const userTenantId = jwt.user_tenant;
            const userTenantName = jwt.user_tenant_name;

            const user = data.user as User;

            const queryData = { user, userRole, userTenantId, userTenantName };

            queryClient.setQueryData(["user"], queryData);

            navigate("/dashboard", { replace: true });
        },
        onError: (error) => {
            console.error("useLogin error: ", error.message);
            toast.error(error.message);
        },
    });

    return { login, isLoggingIn };
}
