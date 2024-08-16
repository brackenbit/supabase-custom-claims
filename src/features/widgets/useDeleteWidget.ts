/*
    (C) Brackenbit 2024
*/

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteWidget as deleteWidgetApi } from "../../services/apiWidgets";

export function useDeleteWidget() {
    const queryClient = useQueryClient();

    const { mutate: deleteWidget, isPending: isDeleting } = useMutation({
        mutationFn: deleteWidgetApi,
        onSuccess: () => {
            toast.success("Widget deleted");
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

    return { isDeleting, deleteWidget };
}
