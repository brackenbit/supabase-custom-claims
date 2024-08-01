/*
    (C) Brackenbit 2024

    IndexRedirect - redirect "/" to "/dashboard" if authenticated,
    otherwise to "/landing"
*/

import { useUser } from "../features/authentication/useUser";
import { Navigate } from "react-router-dom";
import FullPageSpinner from "./FullPageSpinner";

export default function IndexRedirect() {
    const { isPending, error, isAuthenticated } = useUser();

    if (isPending) {
        return <FullPageSpinner />;
    }

    if (error) {
        throw new Error("Error fetching current user: " + error.message);
    }

    return (
        <>
            {isAuthenticated ? (
                <Navigate replace to="/dashboard" />
            ) : (
                <Navigate replace to="/landing" />
            )}
        </>
    );
}
