/*
    (C) Brackenbit 2024

    LoginForm
    Autofills with demo password, shared by all demo users.
*/

import { useState } from "react";
import { Button, Card, FloatingLabel, Form, Spinner } from "react-bootstrap";
import { useLogin } from "./useLogin";
import DemoLoginHelper from "./DemoLoginHelper";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("demopass123");

    const { login, isLoggingIn } = useLogin();

    function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault();
        if (!email || !password) return;

        login(
            { email, password },
            {
                onSettled: () => {
                    setEmail("");
                    setPassword("");
                },
            }
        );
    }

    return (
        <>
            <Card>
                <Card.Body>
                    <Card.Title className="mb-4">
                        Log in to your account
                    </Card.Title>

                    <Form onSubmit={handleSubmit}>
                        <FloatingLabel
                            controlId="email"
                            label="Email address"
                            className="mb-3"
                        >
                            <Form.Control
                                type="email"
                                placeholder=""
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </FloatingLabel>
                        <FloatingLabel
                            controlId="password"
                            label="Password"
                            className="mb-3"
                        >
                            <Form.Control
                                type="password"
                                placeholder=""
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                // Shouldn't be required, but role defaults to the invalid "password text"
                                // Could be a react-bootstrap bug?
                                role="textbox"
                            />
                        </FloatingLabel>
                        <Button
                            disabled={false}
                            // react-bootstrap needs Button to have type="submit"
                            // (even if onClick is defined), in order to automatically
                            // handle Enter key.
                            type="submit"
                            onClick={handleSubmit}
                        >
                            {isLoggingIn ? (
                                <Spinner animation="grow" size="sm" />
                            ) : (
                                "Log in"
                            )}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
            <DemoLoginHelper setEmail={setEmail} />
        </>
    );
}
