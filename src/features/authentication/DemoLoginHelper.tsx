/*
    (C) Brackenbit 2024

    DemoLoginHelper
    Helper to quickly choose the (automatically created) demo users.
    (Doesn't set password, as all demo users share the same pass.)
*/

import { Card, Dropdown } from "react-bootstrap";

interface DemoLoginHelperParams {
    setEmail: (_email: string) => void;
}

export default function DemoLoginHelper({ setEmail }: DemoLoginHelperParams) {
    return (
        <Card className="mt-5">
            <Card.Header>
                <Card.Title>Demo Login Helper</Card.Title>
            </Card.Header>
            <Card.Body>
                <Dropdown>
                    <Dropdown.Toggle variant="secondary">
                        Choose a demo user
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.ItemText>
                            <strong>ACME Widgets</strong>
                        </Dropdown.ItemText>
                        <Dropdown.Item
                            as="button"
                            onClick={() => setEmail("alice@example.com")}
                        >
                            Alice (Admin)
                        </Dropdown.Item>
                        <Dropdown.Item
                            as="button"
                            onClick={() => setEmail("bob@example.com")}
                        >
                            Bob (Manager)
                        </Dropdown.Item>
                        <Dropdown.Item
                            as="button"
                            onClick={() => setEmail("charlie@example.com")}
                        >
                            Charlie (User)
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.ItemText>
                            <strong>Widgets&apos;R&apos;Us</strong>
                        </Dropdown.ItemText>
                        <Dropdown.Item
                            as="button"
                            onClick={() => setEmail("dave@example.com")}
                        >
                            Dave (Admin)
                        </Dropdown.Item>
                        <Dropdown.Item
                            as="button"
                            onClick={() => setEmail("erika@example.com")}
                        >
                            Erika (Manager)
                        </Dropdown.Item>
                        <Dropdown.Item
                            as="button"
                            onClick={() => setEmail("fulan@example.com")}
                        >
                            Fulan (User)
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Card.Body>
        </Card>
    );
}
