/*
    (C) Brackenbit 2024
*/

import { Spinner } from "react-bootstrap";

export default function FullPageSpinner() {
    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <main>
                <Spinner style={{ width: "12rem", height: "12rem" }} />
            </main>
        </div>
    );
}
