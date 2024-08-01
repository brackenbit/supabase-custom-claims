/*
    (C) Brackenbit 2024
*/

import { Button, Container } from "react-bootstrap";

export default function Landing() {
    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <main>
                <Container>
                    <h1 className="display-1">Supabase Custom Claims</h1>
                    <p className="lead my-3">
                        Demo application built to experiment with adding custom
                        claims to Supabase authentication, to support e.g.
                        multi-tenancy and user roles.
                    </p>
                    <Button onClick={() => window.location.replace("/login")}>
                        Log in
                    </Button>
                </Container>
            </main>
        </div>
    );
}
