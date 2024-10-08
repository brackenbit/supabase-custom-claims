/*
    (C) Brackenbit 2024
*/

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addWidget as addWidgetApi } from "../../services/apiWidgets";

export function useAddWidget() {
    const queryClient = useQueryClient();

    const { mutate: addWidget, isPending: isAdding } = useMutation({
        mutationFn: addWidgetApi,
        onSuccess: () => {
            toast.success("New widget added", {
                ariaProps: { role: "status", "aria-live": "polite" },
            });
            queryClient.invalidateQueries({
                queryKey: ["widgets"],
            });
        },
        onError: (err) => {
            toast.error(err.message, {
                ariaProps: { role: "alert", "aria-live": "polite" },
            });
        },
    });

    return { isAdding, addWidget };
}
