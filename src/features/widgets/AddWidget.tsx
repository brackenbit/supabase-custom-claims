/*
    (C) Brackenbit 2024
*/

import { useState } from "react";
import { Button } from "react-bootstrap";
import AddWidgetModal from "./AddWidgetModal";

export default function AddWidget() {
    const [showAddModal, setShowAddModal] = useState(false);

    function openAddModal() {
        setShowAddModal(true);
    }

    function handleCloseAddModal() {
        setShowAddModal(false);
    }

    return (
        <>
            <Button onClick={openAddModal}>Add widget</Button>
            <AddWidgetModal show={showAddModal} onHide={handleCloseAddModal} />
        </>
    );
}
