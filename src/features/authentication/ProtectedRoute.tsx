/*
    (C) Brackenbit 2024
*/

import { PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./useUser";
import FullPageSpinner from "../../ui/FullPageSpinner";

export default function ProtectedRoute(props: PropsWithChildren) {
    const navigate = useNavigate();
    const { isPending, error, isAuthenticated } = useUser();

    useEffect(() => {
        if (!isAuthenticated && !isPending) {
            navigate("/login");
        }
    }, [isAuthenticated, isPending, navigate]);

    if (isPending) {
        return <FullPageSpinner />;
    }

    if (error) {
        throw new Error("Error fetching current user: " + error.message);
    }

    if (isAuthenticated) return props.children;
}
