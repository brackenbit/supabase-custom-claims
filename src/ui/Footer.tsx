/*
    (C) Brackenbit 2024
*/

import { Container } from "react-bootstrap";

export default function Footer() {
    return (
        // NB: Only 'bg-XXX-subtle' classnames correctly respond to dark mode in bootstrap v5
        <footer className="mt-auto py-3 bg-secondary-subtle">
            <Container
                fluid
                className="d-flex align-items-center justify-content-center"
            >
                <span className="d-flex align-items-center">
                    {/* Bootstrap defaults add 1rem bottom margin to <p>, must override here: */}
                    <p className="mb-0">© Brackenbit 2024</p>
                </span>
            </Container>
        </footer>
    );
}
