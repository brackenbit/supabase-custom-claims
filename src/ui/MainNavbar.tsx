/*
    (C) Brackenbit 2024
*/

import { Container, Nav, Navbar, NavDropdown, Spinner } from "react-bootstrap";

import DarkModeToggle from "./DarkModeToggle";
import { useUser } from "../features/authentication/useUser";
import LogoutButton from "../features/authentication/LogoutButton";
import { Link } from "react-router-dom";

export default function MainNavbar() {
    const { isPending, fullName, userRole } = useUser();
    const displayName = userRole ? `${fullName} (${userRole})` : fullName;

    return (
        // NB: Only 'bg-XXX-subtle' classnames correctly respond to dark mode in bootstrap v5
        <Navbar expand="md" className="bg-secondary-subtle">
            <Container className="gap-1">
                <Navbar.Brand>Supabase Custom Claims</Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navbar" />
                <Navbar.Collapse id="main-navbar">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/dashboard">
                            Home
                        </Nav.Link>
                        <Nav.Link as={Link} to="/widgets">
                            Widgets
                        </Nav.Link>
                        <Nav.Link as={Link} to="/help">
                            Help
                        </Nav.Link>
                    </Nav>
                    <Nav className="ms-auto">
                        <DarkModeToggle />
                        <NavDropdown
                            className="ms-2"
                            title={
                                isPending ? <Spinner size="sm" /> : displayName
                            }
                            id="navbar-user-dropdown"
                        >
                            <NavDropdown.Item>
                                <LogoutButton />
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
