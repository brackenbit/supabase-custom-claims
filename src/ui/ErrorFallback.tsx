/*
    (C) Brackenbit 2024
*/

import { Button, Card, ListGroup } from "react-bootstrap";

interface ErrorFallbackProps {
    error: Error;
    resetErrorBoundary: () => void;
}

export default function ErrorFallback({
    error,
    resetErrorBoundary,
}: ErrorFallbackProps) {
    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <main>
                <Card>
                    <Card.Body>
                        <Card.Title className="my-2">
                            Something went wrong 😥
                        </Card.Title>
                        <Card.Subtitle className="my-2">
                            Please share the following with support
                        </Card.Subtitle>
                        <Card.Text>
                            <ListGroup>
                                <ListGroup.Item>
                                    {error.name} - {error.message}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    {error?.stack?.split("\n")[0]}
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Text>
                        <Button
                            variant="secondary"
                            onClick={resetErrorBoundary}
                        >
                            Return home
                        </Button>
                    </Card.Body>
                </Card>
            </main>
        </div>
    );
}
