/*
    (C) Brackenbit 2024
*/

import { Button, Container } from "react-bootstrap";

export default function PageNotFound() {
    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <main>
                <Container>
                    <h1 className="mb-5">Page not found 😕</h1>
                    <Button onClick={() => window.location.replace("/")}>
                        Return home
                    </Button>
                </Container>
            </main>
        </div>
    );
}
