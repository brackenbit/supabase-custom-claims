/*
    (C) Brackenbit 2024
*/

import { Container } from "react-bootstrap";
import LoginForm from "../features/authentication/LoginForm";

export default function Login() {
    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <main>
                <Container>
                    <LoginForm />
                </Container>
            </main>
        </div>
    );
}
