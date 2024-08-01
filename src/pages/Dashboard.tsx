/*
    (C) Brackenbit 2024
*/

import { Container } from "react-bootstrap";
import { useUser } from "../features/authentication/useUser";

export default function Dashboard() {
    const { fullName, userRole, userTenantName } = useUser();

    const roleDescription = (
        <>
            {userRole === "admin" ? "an" : "a"}{" "}
            <span className="text-info fs-5">{userRole}</span>
        </>
    );
    const permissionsDescription =
        userRole === "admin" ? (
            <>
                <span className="text-info fs-5">add, update, and delete</span>{" "}
                widgets
            </>
        ) : userRole === "manager" ? (
            <>
                <span className="text-info fs-5">update</span> widgets, but not
                add or delete them
            </>
        ) : (
            <>
                only <span className="text-info fs-5">view</span> widgets
            </>
        );

    return (
        <Container fluid className="mt-4">
            <h2>Supabase Custom Claims Demo</h2>
            <p className="lead">Welcome, {fullName}.</p>
            <p>
                You are {roleDescription}, who can {permissionsDescription}.
            </p>
            <p>
                You are a member of{" "}
                <span className="text-info fs-5">{userTenantName}</span>, and
                can only access their data.
            </p>
        </Container>
    );
}
