/*
    (C) Brackenbit 2024
*/

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login as loginApi, LoginParams } from "../../services/apiAuth";
import { User } from "@supabase/supabase-js";
import toast from "react-hot-toast";

export function useLogin() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate: login, isPending: isLoggingIn } = useMutation({
        mutationFn: ({ email, password }: LoginParams) =>
            loginApi({ email, password }),
        onSuccess: (data) => {
            // Add user to cache and redirect
            queryClient.setQueriesData<User>(
                { queryKey: ["user"] },
                data.user as User // TS needs some help; null will never make it into the onSuccess block
            );

            navigate("/dashboard", { replace: true });
        },
        onError: (error) => {
            console.error("useLogin error: ", error);
            toast.error(error.message);
        },
    });

    return { login, isLoggingIn };
}
