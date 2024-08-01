/*
    (C) Brackenbit 2024
*/

import { useQuery } from "@tanstack/react-query";
import { getWidgets } from "../../services/apiWidgets";

export function useWidgets() {
    const {
        isPending,
        data: widgets,
        error,
    } = useQuery({
        queryKey: ["widgets"],
        queryFn: () => getWidgets(),
    });

    return { isPending, widgets, error };
}
