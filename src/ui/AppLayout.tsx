/*
    (C) Brackenbit 2024
*/

import { Outlet } from "react-router-dom";
import MainNavbar from "./MainNavbar";
import Footer from "./Footer";
import { Container } from "react-bootstrap";

export default function AppLayout() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <MainNavbar />
            <main className="flex-grow-1">
                <Container>
                    <Outlet />
                </Container>
            </main>
            <Footer />
        </div>
    );
}
