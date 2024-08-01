/*
    (C) Brackenbit 2024
*/

import { Container } from "react-bootstrap";
import WidgetTable from "../features/widgets/WidgetTable";
import AddWidget from "../features/widgets/AddWidget";

export default function Widgets() {
    return (
        <Container fluid className="mt-4">
            <h1>Widgets</h1>
            <WidgetTable />
            <AddWidget />
        </Container>
    );
}
