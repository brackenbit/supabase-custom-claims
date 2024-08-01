/*
    (C) Brackenbit 2024
*/

import { Button, Spinner } from "react-bootstrap";
import { useLogout } from "./useLogout";

export default function LogoutButton() {
    const { logout, isPending } = useLogout();

    return (
        <Button disabled={isPending} onClick={() => logout()}>
            {isPending ? <Spinner size="sm" /> : "Log out"}
        </Button>
    );
}
