/*
    (C) Brackenbit 2024
*/

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
    editWidget as editWidgetApi,
    editWidgetParams,
} from "../../services/apiWidgets";

export function useEditWidget() {
    const queryClient = useQueryClient();

    const { mutate: editWidget, isPending: isEditing } = useMutation({
        mutationFn: ({ newWidget, id }: editWidgetParams) =>
            editWidgetApi({ newWidget, id }),
        onSuccess: () => {
            toast.success("Widget successfully edited", {
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

    return { isEditing, editWidget };
}
